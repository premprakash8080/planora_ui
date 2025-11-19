import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Task, TaskPriority, TaskStatus, TaskComment } from '../../../task.model';
import { TaskService } from '../../../task.service';
import { TaskApiService } from '../../../services/task-api.service';
import { DropdownPopoverItem } from '../../../../../shared/ui/dropdown-popover/dropdown-popover.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent implements OnChanges {
  @Input() task: Task | null = null;
  @Input() projectName = '';
  @Input() sectionTitle = '';
  @Input() open = false;
  @Input() statuses: TaskStatus[] = [];
  @Input() priorities: TaskPriority[] = [];
  @Input() assigneeItems: DropdownPopoverItem[] = [];
  @Input() getAssigneeAvatar: (assignee: string | undefined) => string | null = () => null;
  @Input() getAssigneeInitials: (assignee: string | undefined) => string = () => 'NA';
  @Input() getAssigneeColor: (assignee: string | undefined) => string | undefined = () => undefined;
  @Input() getAssigneeId: (assignee: string | undefined) => number | undefined = () => undefined;

  @Output() close = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<{ changes: Partial<Task>; assigneeId?: number }>();
  @Output() subtaskOpen = new EventEmitter<{ parentTaskId: string; subtask: Task }>();
  @Output() taskDeleted = new EventEmitter<string>();

  readonly titleControl = new FormControl<string>('', { nonNullable: true });
  readonly descriptionControl = new FormControl<string>('', { nonNullable: true });
  readonly commentControl = new FormControl<string>('', { nonNullable: true });
  loading = false;
  deleting = false;

  // Task action menu items
  taskActionItems: DropdownPopoverItem[] = [
    {
      id: 'delete',
      label: 'Delete task',
      // description: 'Permanently delete this task',
      color: '#ef4444'
    }
  ];

  constructor(
    private taskService: TaskService,
    private taskApiService: TaskApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.titleControl.setValue(this.task.name ?? '', { emitEvent: false });
      this.descriptionControl.setValue(this.task.description ?? '', { emitEvent: false });
      this.commentControl.setValue('', { emitEvent: false });
      
      // Load full task details including comments if not already loaded
      if (this.task.id && (!this.task.comments || this.task.comments.length === 0)) {
        this.loadTaskComments();
      }
    }
  }

  /**
   * Load task comments from API
   */
  private loadTaskComments(): void {
    if (!this.task?.id) return;
    
    this.loading = true;
    this.taskService.getTaskComments(this.task.id).subscribe({
      next: (comments) => {
        if (this.task) {
          this.task = {
            ...this.task,
            comments,
            commentsCount: comments.length
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.loading = false;
      }
    });
  }

  onTitleBlur(): void {
    if (!this.task) {
      return;
    }
    const value = this.titleControl.value.trim();
    if (value && value !== this.task.name) {
      this.taskUpdated.emit({ changes: { name: value } });
    } else {
      this.titleControl.setValue(this.task.name, { emitEvent: false });
    }
  }

  updateDueDate(rawValue: string): void {
    if (!this.task || !rawValue) {
      return;
    }

    const formatted = this.normalizeDate(rawValue);
    if (!formatted) {
      return;
    }

    const current = this.normalizeDate(this.task.dueDate);
    if (formatted === current) {
      return;
    }

    const iso = this.toIsoDate(formatted);
    this.taskUpdated.emit({ changes: { dueDate: iso } });
  }

  updatePriority(priority: TaskPriority | string): void {
    if (!this.task) {
      return;
    }
    const next = priority as TaskPriority;
    if (next === this.task.priority) {
      return;
    }
    this.taskUpdated.emit({ changes: { priority: next } });
  }

  updateStatus(status: TaskStatus | string): void {
    if (!this.task) {
      return;
    }
    const next = status as TaskStatus;
    if (next === this.task.status) {
      return;
    }
    this.taskUpdated.emit({ changes: { status: next } });
  }

  handleAssigneeSelect(item: DropdownPopoverItem): void {
    if (!this.task) {
      return;
    }
    const assignee = item.label;
    if (assignee === this.task.assignee) {
      return;
    }

    // Extract assigneeId from item data or use getAssigneeId function
    let assigneeId: number | undefined = undefined;
    if (item.data && typeof item.data === 'object' && 'id' in item.data) {
      assigneeId = (item.data as any).id;
    } else if (item.id) {
      // Try to parse ID from item.id (could be email or ID)
      const parsedId = parseInt(item.id);
      if (!isNaN(parsedId)) {
        assigneeId = parsedId;
      }
    }
    
    // Fallback to getAssigneeId function if available
    if (assigneeId === undefined && this.getAssigneeId) {
      assigneeId = this.getAssigneeId(assignee);
    }

    const update: Partial<Task> = {
      assignee
    };

    const initials = item.avatarText ?? this.getAssigneeInitials(assignee);
    if (initials) {
      (update as any).assigneeAvatar = initials;
    }

    this.taskUpdated.emit({ changes: update, assigneeId });
    this.task = {
      ...this.task,
      ...update
    };
  }

  handleSubtaskToggle(id: string): void {
    if (!this.task) {
      return;
    }
    const subtasks = (this.task.subtasks ?? []).map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    this.taskUpdated.emit({ changes: { subtasks } });
  }

  handleSubtaskNameChange(change: { id: string; name: string }): void {
    if (!this.task) {
      return;
    }
    const subtasks = (this.task.subtasks ?? []).map(item =>
      item.id === change.id ? { ...item, name: change.name } : item
    );
    this.taskUpdated.emit({ changes: { subtasks } });
  }

  handleSubtaskRemove(id: string): void {
    if (!this.task) {
      return;
    }
    const next = (this.task.subtasks ?? []).filter(item => item.id !== id);
    this.taskUpdated.emit({ changes: { subtasks: next } });
  }

  handleSubtaskCreate(name: string): void {
    if (!this.task) {
      return;
    }
    const next: Task[] = [
      ...(this.task.subtasks ?? []),
      {
        id: `subtask-${Date.now()}`,
        name,
        assignee: '',
        dueDate: undefined,
        priority: 'Medium' as TaskPriority,
        status: 'To Do' as TaskStatus,
        completed: false,
        subtasks: [],
        parentId: this.task.id
      }
    ];
    this.taskUpdated.emit({ changes: { subtasks: next } });
  }

  handleSubtaskOpen(subtask: Task): void {
    if (!this.task) {
      return;
    }
    this.subtaskOpen.emit({ parentTaskId: this.task.id, subtask });
  }

  handleDescriptionSave(value: string): void {
    if (!this.task) {
      return;
    }
    const normalized = (value ?? '').trim();
    const current = (this.task.description ?? '').trim();
    if (normalized === current) {
      return;
    }
    this.descriptionControl.setValue(normalized, { emitEvent: false });
    this.taskUpdated.emit({ changes: { description: normalized } });
  }

  get descriptionMeta(): string | null {
    if (!this.task) {
      return null;
    }
    return this.task.description ? 'Edited just now' : 'No description yet';
  }

  addComment(): void {
    if (!this.task) {
      return;
    }
    const value = this.commentControl.value.trim();
    if (!value) {
      return;
    }

    this.loading = true;
    this.taskService.createTaskComment(this.task.id, value).subscribe({
      next: (newComment) => {
        const nextComments = [
          ...(this.task?.comments ?? []),
          newComment
        ];

        if (this.task) {
          this.task = {
            ...this.task,
            comments: nextComments,
            commentsCount: nextComments.length
          };
        }

        this.taskUpdated.emit({ changes: { comments: nextComments } });
        this.commentControl.setValue('', { emitEvent: false });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error adding comment:', error);
        this.loading = false;
      }
    });
  }

  toDateInputValue(dateString: string | undefined): string {
    if (!dateString) {
      return '';
    }
    const normalized = this.normalizeDate(dateString);
    return normalized ?? '';
  }

  private normalizeDate(value: string): string | null {
    if (!value) {
      return null;
    }
    if (value.length >= 10) {
      return value.substring(0, 10);
    }
    return null;
  }

  private toIsoDate(normalized: string): string {
    return `${normalized}T00:00:00.000Z`;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.open) {
      this.close.emit();
    }
  }

  getAssigneeDescription(assignee: string | undefined): string | undefined {
    if (!assignee) {
      return undefined;
    }
    const match = this.assigneeItems.find(item => item.label === assignee || item.id === assignee);
    return match?.description;
  }

  /**
   * Handle task action selection from dropdown menu
   */
  handleTaskAction(item: DropdownPopoverItem): void {
    if (!this.task) {
      return;
    }

    switch (item.id) {
      case 'delete':
        this.deleteTask();
        break;
      // Add more actions here in the future
      default:
        console.warn('Unknown task action:', item.id);
    }
  }

  /**
   * Delete task
   */
  deleteTask(): void {
    if (!this.task) {
      return;
    }

    // Confirm deletion
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return;
    }

    this.deleting = true;
    this.cdr.markForCheck();
    
    this.taskApiService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.taskDeleted.emit(this.task!.id);
        this.close.emit();
        this.deleting = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
        this.deleting = false;
        this.cdr.markForCheck();
      }
    });
  }
}

