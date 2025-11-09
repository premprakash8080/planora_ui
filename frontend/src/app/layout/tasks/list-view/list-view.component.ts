import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

