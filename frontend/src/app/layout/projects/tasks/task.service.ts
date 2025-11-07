import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskPriority, TaskSection, TaskStatus } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly sectionsSubject = new BehaviorSubject<TaskSection[]>([
    {
      id: 'section-1',
      title: 'Client Query',
      expanded: true,
      tasks: [
        {
          id: 't1',
          name: 'Design Login Page',
          assignee: 'John Doe',
          dueDate: '2025-11-12',
          priority: 'High',
          status: 'In Progress',
          description: 'Finalize responsive login screens and states.',
          commentsCount: 5,
          completed: false
        },
        {
          id: 't2',
          name: 'Set up Database Backups',
          assignee: 'Priya Patel',
          dueDate: '2025-11-05',
          priority: 'Medium',
          status: 'To Do',
          commentsCount: 2,
          completed: false
        }
      ]
    },
    {
      id: 'section-2',
      title: 'UI Loading',
      expanded: true,
      tasks: [
        {
          id: 't3',
          name: 'Customer Interviews',
          assignee: 'Lucas Nguyen',
          dueDate: '2025-12-01',
          priority: 'Low',
          status: 'Done',
          commentsCount: 0,
          completed: true
        },
        {
          id: 't4',
          name: 'Build Analytics Dashboard',
          assignee: 'Sarah Johnson',
          dueDate: '2025-11-25',
          priority: 'High',
          status: 'In Progress',
          commentsCount: 3,
          completed: false
        }
      ]
    },
    {
      id: 'section-3',
      title: 'Client Issues (6th August 2024)',
      expanded: false,
      tasks: [
        {
          id: 't5',
          name: 'Update API Documentation',
          assignee: 'Michael Chen',
          dueDate: '2025-11-18',
          priority: 'Medium',
          status: 'To Do',
          commentsCount: 1,
          completed: false
        },
        {
          id: 't6',
          name: 'Implement Feature Flags',
          assignee: 'Aisha Khan',
          dueDate: '2025-11-22',
          priority: 'High',
          status: 'In Progress',
          commentsCount: 6,
          completed: false
        },
        {
          id: 't7',
          name: 'QA Regression Suite',
          assignee: 'Emily Rodriguez',
          dueDate: '2025-11-15',
          priority: 'Medium',
          status: 'To Do',
          commentsCount: 4,
          completed: false
        },
        {
          id: 't8',
          name: 'Marketing Launch Plan',
          assignee: 'Oliver Brown',
          dueDate: '2025-11-30',
          priority: 'High',
          status: 'To Do',
          commentsCount: 2,
          completed: false
        }
      ]
    }
  ]);

  sections$: Observable<TaskSection[]> = this.sectionsSubject.asObservable();

  getSections(): Observable<TaskSection[]> {
    return this.sections$;
  }

  toggleSection(sectionId: string): void {
    this.sectionsSubject.next(
      this.sectionsSubject.value.map(section =>
        section.id === sectionId ? { ...section, expanded: !section.expanded } : section
      )
    );
  }

  updateTask(sectionId: string, taskId: string, changes: Partial<Task>): void {
    this.sectionsSubject.next(
      this.sectionsSubject.value.map(section => {
        if (section.id !== sectionId) {
          return section;
        }
        return {
          ...section,
          tasks: section.tasks.map(task =>
            task.id === taskId ? { ...task, ...changes } : task
          )
        };
      })
    );
  }

  addTask(sectionId: string, task: Task): void {
    this.sectionsSubject.next(
      this.sectionsSubject.value.map(section =>
        section.id === sectionId
          ? { ...section, tasks: [...section.tasks, task] }
          : section
      )
    );
  }

  deleteTask(sectionId: string, taskId: string): void {
    this.sectionsSubject.next(
      this.sectionsSubject.value.map(section =>
        section.id === sectionId
          ? { ...section, tasks: section.tasks.filter(task => task.id !== taskId) }
          : section
      )
    );
  }

  filterTasks(query: string): Observable<TaskSection[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return this.sections$;
    }

    return this.sections$.pipe(
      map(sections =>
        sections.map(section => ({
          ...section,
          tasks: section.tasks.filter(task =>
            task.name.toLowerCase().includes(normalized) ||
            task.assignee.toLowerCase().includes(normalized)
          )
        }))
      )
    );
  }
}
