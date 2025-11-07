import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap, takeUntil } from 'rxjs';
import { Task, TaskPriority, TaskSection, TaskStatus } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  readonly statuses: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  searchControl = new FormControl('', { nonNullable: true });
  sections: TaskSection[] = [];

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getSections()
      .pipe(takeUntil(this.destroy$))
      .subscribe(sections => this.sections = sections);

    this.searchControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(query => this.taskService.filterTasks(query)),
        takeUntil(this.destroy$)
      )
      .subscribe(filtered => this.sections = filtered);
  }

  toggleSection(section: TaskSection): void {
    this.taskService.toggleSection(section.id);
  }

  toggleCompleted(section: TaskSection, task: Task): void {
    this.taskService.updateTask(section.id, task.id, { completed: !task.completed });
  }

  statusChanged(section: TaskSection, task: Task, status: TaskStatus): void {
    this.taskService.updateTask(section.id, task.id, { status });
  }

  priorityChanged(section: TaskSection, task: Task, priority: TaskPriority): void {
    this.taskService.updateTask(section.id, task.id, { priority });
  }

  inlineNameChanged(section: TaskSection, task: Task, value: string): void {
    this.taskService.updateTask(section.id, task.id, { name: value });
  }

  addTask(section: TaskSection): void {
    this.taskService.addTask(section.id, {
      id: `task-${Date.now()}`,
      name: 'New Task',
      assignee: 'Unassigned',
      dueDate: new Date().toISOString(),
      priority: 'Medium',
      status: 'To Do',
      commentsCount: 0,
      completed: false
    });
  }

  addQuickTask(): void {
    const firstSection = this.sections[0];
    if (firstSection) {
      this.addTask(firstSection);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
