export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  name: string;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  description?: string;
  commentsCount?: number;
  completed?: boolean;
}

export interface TaskSection {
  id: string;
  title: string;
  tasks: Task[];
  expanded: boolean;
}
