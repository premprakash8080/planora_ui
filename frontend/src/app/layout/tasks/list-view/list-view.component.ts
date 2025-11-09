import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Task, TaskPriority, TaskSection, TaskStatus } from '../task.model';
import { TaskService } from '../task.service';

const PROJECT_NAME_LOOKUP: Record<string, string> = {
  '1': 'Website Redesign',
  '2': 'Mobile App Launch',
  '3': 'Growth Experiments',
  '4': 'Customer Success Ops'
};

@Component({
  selector: 'app-tasks-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit, OnDestroy {
  readonly statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  searchControl = new FormControl('', { nonNullable: true });
  sections: TaskSection[] = [];

  private readonly destroy$ = new Subject<void>();
  private currentProjectId: string | null = null;
  private selectedSectionId: string | null = null;
  private selectedTaskId: string | null = null;
  readonly nameDrafts = new Map<string, string>();
  readonly teamMembers = [
    { id: 'john-doe', name: 'John Doe', initials: 'JD' },
    { id: 'sarah-johnson', name: 'Sarah Johnson', initials: 'SJ' },
    { id: 'priya-patel', name: 'Priya Patel', initials: 'PP' },
    { id: 'lucas-nguyen', name: 'Lucas Nguyen', initials: 'LN' },
    { id: 'aisha-khan', name: 'Aisha Khan', initials: 'AK' }
  ];
  readonly statusOptions: Array<{ value: TaskStatus | string; label: string; color: string }> = [
    { value: 'On Track', label: 'On Track', color: '#22c55e' },
    { value: 'At Risk', label: 'At Risk', color: '#f97316' },
    { value: 'Off Track', label: 'Off Track', color: '#ef4444' },
    { value: 'Done', label: 'Completed', color: '#6366f1' },
    { value: 'In Progress', label: 'In Progress', color: '#0ea5e9' },
    { value: 'To Do', label: 'To Do', color: '#94a3b8' }
  ];

  selectedTask: Task | null = null;
  selectedSection: TaskSection | null = null;

  constructor(
    private readonly taskService: TaskService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const projectRoute = this.route.parent ?? this.route;

    const projectId$ = projectRoute.paramMap.pipe(
      map(params => params.get('projectId')),
      filter((projectId): projectId is string => Boolean(projectId)),
      distinctUntilChanged(),
      tap(projectId => {
        if (this.currentProjectId !== projectId) {
          this.searchControl.setValue('', { emitEvent: false });
          if (this.currentProjectId) {
            this.closeDetail();
          }
        }
        this.currentProjectId = projectId;
      })
    );

    combineLatest([
      projectId$,
      this.searchControl.valueChanges.pipe(
        startWith(this.searchControl.value),
        debounceTime(200),
        distinctUntilChanged()
      )
    ])
      .pipe(
        switchMap(([projectId, query]) => this.taskService.filterTasks(projectId, query)),
        takeUntil(this.destroy$)
      )
      .subscribe(sections => {
        this.sections = sections;

        if (this.selectedSectionId && this.selectedTaskId) {
          const nextSection = sections.find(section => section.id === this.selectedSectionId);
          const nextTask = nextSection?.tasks.find(task => task.id === this.selectedTaskId);

          if (nextSection && nextTask) {
            this.selectedSection = nextSection;
            this.selectedTask = nextTask;
          } else {
            this.closeDetail();
          }
        }
      });
  }

  toggleSection(section: TaskSection): void {
    if (!this.currentProjectId) {
      return;
    }
    this.taskService.toggleSection(this.currentProjectId, section.id);
  }

  toggleCompleted(section: TaskSection, task: Task): void {
    if (!this.currentProjectId) {
      return;
    }
    this.taskService.updateTask(this.currentProjectId, section.id, task.id, { completed: !task.completed });
  }

  statusChanged(section: TaskSection, task: Task, status: TaskStatus): void {
    if (!this.currentProjectId) {
      return;
    }
    this.taskService.updateTask(this.currentProjectId, section.id, task.id, { status });
  }

  priorityChanged(section: TaskSection, task: Task, priority: TaskPriority): void {
    if (!this.currentProjectId) {
      return;
    }
    this.taskService.updateTask(this.currentProjectId, section.id, task.id, { priority });
  }

  inlineNameChanged(section: TaskSection, task: Task, value: string): void {
    if (!this.currentProjectId) {
      return;
    }
    this.taskService.updateTask(this.currentProjectId, section.id, task.id, { name: value });
  }

  onNameInput(task: Task, value: string): void {
    this.nameDrafts.set(task.id, value);
  }

  handleNameFocus(task: Task): void {
    if (!this.nameDrafts.has(task.id)) {
      this.nameDrafts.set(task.id, task.name ?? '');
    }
  }

  handleNameBlur(section: TaskSection, task: Task, input: HTMLInputElement): void {
    const draft = (this.nameDrafts.get(task.id) ?? input.value ?? '').trim();

    if (!draft) {
      input.value = task.name ?? '';
      this.nameDrafts.delete(task.id);
      return;
    }

    if (draft !== (task.name ?? '')) {
      this.inlineNameChanged(section, task, draft);
    }

    this.nameDrafts.delete(task.id);
  }

  handleNameEnter(event: Event, section: TaskSection, task: Task, input: HTMLInputElement): void {
    event.preventDefault();
    this.handleNameBlur(section, task, input);
    input.blur();
  }

  handleNameEscape(task: Task, input: HTMLInputElement): void {
    input.value = task.name ?? '';
    this.nameDrafts.delete(task.id);
    input.blur();
  }

  getTaskNameWidth(task: Task): number {
    const draft = this.nameDrafts.get(task.id);
    const text = (draft ?? task.name ?? '').trim() || 'New Task';
    const baseLength = Math.max(text.length, 1);
    const padding = 28;
    const minWidth = 80;
    const maxWidth = 420;
    const approximateCharWidth = 8.2;

    return Math.min(Math.max(baseLength * approximateCharWidth + padding, minWidth), maxWidth);
  }

  selectAssignee(section: TaskSection, task: Task, member: { id: string; name: string; initials: string }, event: Event): void {
    event.stopPropagation();

    if (!this.currentProjectId) {
      return;
    }

    this.taskService.updateTask(this.currentProjectId, section.id, task.id, {
      assignee: member.name,
      assigneeAvatar: member.initials
    });
  }

  handleDueDateChange(section: TaskSection, task: Task, date: Date | null, trigger: MatMenuTrigger): void {
    if (!this.currentProjectId || !date) {
      trigger?.closeMenu();
      return;
    }

    const normalized = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    this.taskService.updateTask(this.currentProjectId, section.id, task.id, { dueDate: normalized });
    trigger?.closeMenu();
  }

  selectStatus(section: TaskSection, task: Task, option: { value: string }, event: Event): void {
    event.stopPropagation();

    if (!this.currentProjectId) {
      return;
    }
    this.statusChanged(section, task, option.value as TaskStatus);
  }

  getDueDate(task: Task): Date | null {
    if (!task.dueDate) {
      return null;
    }
    const parsed = new Date(task.dueDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  getAvatarInitials(assignee: string | undefined): string {
    if (!assignee) {
      return 'NA';
    }

    const parts = assignee.split(' ').filter(Boolean);
    if (!parts.length) {
      return assignee.substring(0, 2).toUpperCase();
    }
    return parts.map(part => part.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  getStatusColor(status: string | undefined): string {
    if (!status) {
      return '#94a3b8';
    }
    return this.statusOptions.find(option => option.value === status)?.color ?? '#94a3b8';
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) {
      return 'Set status';
    }
    return this.statusOptions.find(option => option.value === status)?.label ?? status;
  }

  formatDueDate(value: string | undefined): string {
    if (!value) {
      return 'No due date';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'No due date';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 0) {
      return `Today – ${formatDate(target, 'dd MMM', 'en-US')}`;
    }
    if (diff === 1) {
      return `Tomorrow – ${formatDate(target, 'dd MMM', 'en-US')}`;
    }
    if (diff === -1) {
      return `Yesterday – ${formatDate(target, 'dd MMM', 'en-US')}`;
    }

    return formatDate(target, 'dd MMM yyyy', 'en-US');
  }

  addTask(section: TaskSection): void {
    if (!this.currentProjectId) {
      return;
    }
    this.taskService.addTask(this.currentProjectId, section.id, {
      id: `task-${Date.now()}`,
      name: 'New Task',
      assignee: 'Unassigned',
      dueDate: new Date().toISOString(),
      priority: 'Medium',
      status: 'To Do',
      description: '',
      comments: [],
      subtasks: [],
      commentsCount: 0,
      completed: false
    });
  }

  addQuickTask(): void {
    if (!this.currentProjectId) {
      return;
    }
    const firstSection = this.sections[0];
    if (firstSection) {
      this.addTask(firstSection);
    }
  }

  openTaskDetail(section: TaskSection, task: Task): void {
    this.selectedSectionId = section.id;
    this.selectedTaskId = task.id;
    this.selectedSection = section;
    this.selectedTask = task;
  }

  closeDetail(): void {
    this.selectedSectionId = null;
    this.selectedTaskId = null;
    this.selectedSection = null;
    this.selectedTask = null;
  }

  handleTaskUpdated(changes: Partial<Task>): void {
    if (!this.currentProjectId || !this.selectedSectionId || !this.selectedTaskId) {
      return;
    }
    this.taskService.updateTask(this.currentProjectId, this.selectedSectionId, this.selectedTaskId, changes);
  }

  get currentProjectName(): string {
    if (!this.currentProjectId) {
      return 'Project';
    }
    return PROJECT_NAME_LOOKUP[this.currentProjectId] ?? 'Project';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

