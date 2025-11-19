import { Component, Input } from '@angular/core';
import { Task } from '../board-view.component';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss']
})
export class TaskCardComponent {
  @Input() task!: Task & { attachmentCount?: number };

  getStatusClass(): string {
    return this.task.status.toLowerCase().replace(' ', '-');
  }
}