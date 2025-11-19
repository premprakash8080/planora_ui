import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/services/http.service';
import { ENDPOINTS } from './api.collection';
import { Task, TaskSection, TaskComment } from '../task.model';

export interface BackendTask {
  id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  assignee?: {
    id: number;
    full_name: string;
    email: string;
    avatar_url?: string;
    avatar_color?: string;
    initials?: string;
  };
  due_date?: string;
  priority?: string;
  status?: string;
  completed?: boolean;
  comments_count?: number;
  section_id?: number;
  project_id?: number;
  position?: number;
  subtasks?: BackendTask[];
  comments?: BackendComment[];
  created_at?: string;
  updated_at?: string;
}

export interface BackendSection {
  id: number;
  title?: string;
  name?: string; // Backend uses 'name' field
  project_id: number;
  position?: number;
  tasks?: BackendTask[];
  created_at?: string;
  updated_at?: string;
}

export interface BackendComment {
  id: number;
  message: string;
  user?: {
    id: number;
    full_name: string;
    email: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  constructor(private httpService: HttpService) {}

  /**
   * Convert backend task to frontend task
   */
  private mapBackendTaskToTask(backendTask: BackendTask): Task {
    const comments: TaskComment[] = (backendTask.comments || []).map(comment => ({
      id: comment.id.toString(),
      author: comment.user?.full_name || 'Unknown',
      message: comment.message,
      createdAt: comment.created_at,
      avatar: comment.user?.avatar_url
    }));

    // Handle subtasks - check both subtasks array, childTasks, and parent_id
    let subtasks: Task[] = [];
    if (backendTask.subtasks && Array.isArray(backendTask.subtasks)) {
      subtasks = backendTask.subtasks.map(subtask => this.mapBackendTaskToTask(subtask));
    } else if ((backendTask as any).childTasks && Array.isArray((backendTask as any).childTasks)) {
      // Subtasks stored as tasks with parent_id
      subtasks = (backendTask as any).childTasks.map((subtask: BackendTask) => this.mapBackendTaskToTask(subtask));
    }

    return {
      id: backendTask.id.toString(),
      name: backendTask.title,
      assignee: backendTask.assignee?.full_name,
      assigneeAvatar: backendTask.assignee?.initials,
      dueDate: backendTask.due_date,
      priority: (backendTask.priority as any) || 'Medium',
      status: (backendTask.status as any) || 'To Do',
      description: backendTask.description,
      commentsCount: backendTask.comments_count || comments.length,
      completed: backendTask.completed || false,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
      comments: comments.length > 0 ? comments : undefined
    };
  }

  /**
   * Convert frontend task to backend task
   */
  private mapTaskToBackendTask(task: Partial<Task>, projectId: string, sectionId?: string, assigneeId?: number): any {
    const payload: any = {};
    
    // Only include fields that are explicitly provided (not undefined)
    if (task.name !== undefined && task.name !== null) payload.title = task.name;
    if (task.description !== undefined) payload.description = task.description; // Allow empty string
    if (task.dueDate !== undefined) {
      // Allow null to unset due date
      payload.due_date = task.dueDate === null || task.dueDate === '' ? null : task.dueDate;
    }
    if (task.priority !== undefined && task.priority !== null) payload.priority = task.priority;
    if (task.status !== undefined && task.status !== null) payload.status = task.status;
    if (task.completed !== undefined) payload.completed = task.completed;
    if (sectionId) payload.section_id = parseInt(sectionId);
    if (projectId) payload.project_id = parseInt(projectId);
    // Allow null to unset assignee
    if (assigneeId !== undefined) {
      payload.assigned_to = assigneeId === null || assigneeId === 0 ? null : assigneeId;
    }
    
    return payload;
  }

  /**
   * Get sections with tasks for a project
   */
  getSectionsByProject(projectId: string): Observable<TaskSection[]> {
    const url = ENDPOINTS.getSectionsByProject;
    return this.httpService.post(url, { project_id: parseInt(projectId) }).pipe(
      map((response: any) => {
        // Handle unified response format: { success: true, data: { sections: [...] } }
        let sections: BackendSection[] = [];
        
        if (response.success && response.data && response.data.sections) {
          sections = response.data.sections;
        } else if (Array.isArray(response)) {
          // Fallback for direct array response
          sections = response;
        } else if (response.data && Array.isArray(response.data)) {
          sections = response.data;
        }

        return sections.map((section: BackendSection) => ({
          id: section.id.toString(),
          title: (section as any).title || (section as any).name || 'Untitled Section',
          expanded: true,
          tasks: (section.tasks || []).map((task: BackendTask) => this.mapBackendTaskToTask(task))
        }));
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Get task by ID
   */
  getTaskById(taskId: string): Observable<Task> {
    // Use POST with body to support the new route structure
    const url = ENDPOINTS.getTaskById.replace(':taskId', taskId);
    // Try GET first, fallback to POST if needed
    return this.httpService.get(url).pipe(
      map((response: any) => {
        // Handle unified response format
        const task = response.success && response.data?.task ? response.data.task : response;
        return this.mapBackendTaskToTask(task);
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Create a new section
   */
  createSection(projectId: string, title: string, position?: number): Observable<TaskSection> {
    return this.httpService.post(ENDPOINTS.createSection, {
      project_id: parseInt(projectId),
      name: title, // Backend uses 'name' field
      position: position || 0
    }).pipe(
      map((response: any) => {
        // Handle unified response format
        const section = response.success && response.data?.section ? response.data.section : response;
        return {
          id: section.id.toString(),
          title: section.name || section.title || title,
          expanded: true,
          tasks: []
        };
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Update section title
   */
  updateSectionTitle(sectionId: string, title: string): Observable<void> {
    const url = ENDPOINTS.updateSectionTitle;
    return this.httpService.patch(url, { section_id: sectionId, name: title }).pipe( // Backend uses 'name' field
      map(() => {}),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Create a new task
   */
  createTask(projectId: string, sectionId: string, task: Partial<Task>, assigneeId?: number, parentId?: string): Observable<Task> {
    const payload = this.mapTaskToBackendTask(task, projectId, sectionId, assigneeId);
    if (parentId) {
      payload.parent_id = parseInt(parentId);
    }
    return this.httpService.post(ENDPOINTS.createTask, payload).pipe(
      map((response: any) => {
        // Handle unified response format
        const backendTask = response.success && response.data?.task ? response.data.task : response;
        return this.mapBackendTaskToTask(backendTask);
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Update task
   */
  updateTask(taskId: string, updates: Partial<Task>, projectId?: string, sectionId?: string, assigneeId?: number): Observable<Task> {
    const url = ENDPOINTS.updateTask; // No need to replace :taskId anymore
    const payload = this.mapTaskToBackendTask(updates, projectId || '', sectionId, assigneeId);
    // Add task_id to body
    payload.task_id = parseInt(taskId);
    
    return this.httpService.put(url, payload).pipe(
      map((response: any) => {
        // Handle unified response format
        const backendTask = response.success && response.data?.task ? response.data.task : response;
        return this.mapBackendTaskToTask(backendTask);
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Delete task
   */
  deleteTask(taskId: string): Observable<void> {
    // Use DELETE with taskId in URL, but controller supports body too
    const url = ENDPOINTS.deleteTask.replace(':taskId', taskId);
    return this.httpService.delete(url).pipe(
      map(() => {}),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Toggle task completion
   */
  toggleTaskCompletion(taskId: string): Observable<Task> {
    const url = ENDPOINTS.toggleTaskCompletion.replace(':taskId', taskId);
    return this.httpService.patch(url, {}).pipe(
      map((response: any) => {
        // Handle unified response format
        const backendTask = response.success && response.data?.task ? response.data.task : response;
        return this.mapBackendTaskToTask(backendTask);
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Create a task comment
   */
  createTaskComment(taskId: string, message: string): Observable<TaskComment> {
    return this.httpService.post(ENDPOINTS.createTaskComment, {
      task_id: parseInt(taskId),
      message
    }).pipe(
      map((response: any) => {
        const comment = response.data?.comment || response;
        return {
          id: comment.id.toString(),
          author: comment.user?.full_name || 'Unknown',
          message: comment.message,
          createdAt: comment.created_at,
          avatar: comment.user?.avatar_url
        };
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Get task comments
   */
  getTaskComments(taskId: string): Observable<TaskComment[]> {
    const url = ENDPOINTS.getTaskComments.replace(':taskId', taskId);
    return this.httpService.get(url).pipe(
      map((response: any) => {
        const comments = response.data?.comments || response || [];
        return comments.map((comment: BackendComment) => ({
          id: comment.id.toString(),
          author: comment.user?.full_name || 'Unknown',
          message: comment.message,
          createdAt: comment.created_at,
          avatar: comment.user?.avatar_url
        }));
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Delete task comment
   */
  deleteTaskComment(commentId: string): Observable<void> {
    const url = ENDPOINTS.deleteTaskComment.replace(':commentId', commentId);
    return this.httpService.delete(url).pipe(
      map(() => {}),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  private handleError(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }
}

