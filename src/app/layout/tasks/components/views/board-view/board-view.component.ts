import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

export interface Task {
  id: string;
  name: string;
  assigneeInitials?: string;
  assigneeColor?: string;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'On track' | 'At risk' | 'Off track';
  completed: boolean;
}

export interface Column {
  id: string;
  title: string;
  taskCount: number;
  tasks: Task[];
}

@Component({
  selector: 'app-tasks-board-view',
  templateUrl: './board-view.component.html',
  styleUrls: ['./board-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardViewComponent implements OnInit {
  columns: Column[] = [];

  ngOnInit(): void {
    this.columns = [
      {
        id: 'todo',
        title: 'To do',
        taskCount: 2,
        tasks: [
          {
            id: '1',
            name: 'Schedule kickoff meeting',
            assigneeInitials: 'TT',
            assigneeColor: '#8b5cf6',
            dueDate: '10 – 12 Nov',
            priority: 'Medium',
            status: 'At risk',
            completed: false
          },
          {
            id: '2',
            name: 'Share timeline with teammates',
            assigneeInitials: undefined,
            dueDate: '11 – 13 Nov',
            priority: 'High',
            status: 'Off track',
            completed: true
          }
        ]
      },
      {
        id: 'doing',
        title: 'Doing',
        taskCount: 1,
        tasks: [
          {
            id: '3',
            name: 'Draft project brief',
            assigneeInitials: 'TT',
            assigneeColor: '#8b5cf6',
            dueDate: '9 – 11 Nov',
            priority: 'Low',
            status: 'On track',
            completed: false
          }
        ]
      },
      {
        id: 'done',
        title: 'Done',
        taskCount: 0,
        tasks: []
      },
      {
        id: 'untitled',
        title: 'Untitled section',
        taskCount: 0,
        tasks: []
      }
    ];
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateTaskCounts();
  }

  private updateTaskCounts() {
    this.columns.forEach(col => col.taskCount = col.tasks.length);
  }

  trackByTaskId = (_: number, task: Task) => task.id;
}