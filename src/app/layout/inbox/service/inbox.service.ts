import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/services/http.service';
import { ENDPOINTS } from './api.collection';

export interface ActivityLog {
  id: number;
  task_id: number;
  project_id: number;
  activity_type: string;
  description: string;
  old_value?: any;
  new_value?: any;
  updated_by: number;
  created_at: string;
  task?: {
    id: number;
    title: string;
    status?: string;
    priority?: string;
  };
  project?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    full_name: string;
    email: string;
    avatar_url?: string;
    avatar_color?: string;
    initials?: string;
  };
}

export interface InboxUpdate {
  id: string;
  taskName: string;
  projectName: string;
  updateType: 'created' | 'updated' | 'completed' | 'assigned' | 'comment';
  updateDescription: string;
  time: string;
  timeAgo: string;
  userAvatar?: string;
  userName: string;
  icon: string;
  iconColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  constructor(private httpService: HttpService) {}

  /**
   * Get inbox activities
   */
  getInboxActivities(limit: number = 50, offset: number = 0): Observable<ActivityLog[]> {
    const params = { limit: limit.toString(), offset: offset.toString() };
    return this.httpService.get(ENDPOINTS.getInboxActivities, params).pipe(
      map((response: any) => {
        // Handle unified response format
        if (response.success && response.data?.activities) {
          return response.data.activities;
        }
        // Fallback for direct array
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Get task activities
   */
  getTaskActivities(taskId: number): Observable<ActivityLog[]> {
    return this.httpService.get(ENDPOINTS.getTaskActivities.replace(':taskId', taskId.toString())).pipe(
      map((response: { success: boolean; data: { activities: ActivityLog[] } }) => {
        if (response.success && response.data) {
          return response.data.activities;
        }
        return [];
      }),
      catchError((error) => {
        return throwError(() => this.handleError(error));
      })
    );
  }

  /**
   * Convert activity log to inbox update format
   */
  convertToInboxUpdate(activity: ActivityLog): InboxUpdate {
    const updateType = this.mapActivityTypeToUpdateType(activity.activity_type);
    const timeAgo = this.getTimeAgo(activity.created_at);
    
    return {
      id: activity.id.toString(),
      taskName: activity.task?.title || 'Unknown Task',
      projectName: activity.project?.name || 'Unknown Project',
      updateType,
      updateDescription: activity.description,
      time: activity.created_at,
      timeAgo,
      userName: activity.user?.full_name || 'Unknown User',
      userAvatar: activity.user?.avatar_url,
      icon: this.getIconForActivityType(activity.activity_type),
      iconColor: this.getIconColorForActivityType(activity.activity_type)
    };
  }

  /**
   * Map activity type to update type
   */
  private mapActivityTypeToUpdateType(activityType: string): 'created' | 'updated' | 'completed' | 'assigned' | 'comment' {
    const typeMap: { [key: string]: 'created' | 'updated' | 'completed' | 'assigned' | 'comment' } = {
      'created': 'created',
      'completed': 'completed',
      'assigned': 'assigned',
      'comment': 'comment',
      'status_changed': 'updated',
      'priority_changed': 'updated',
      'due_date_changed': 'updated',
      'updated': 'updated'
    };
    return typeMap[activityType] || 'updated';
  }

  /**
   * Get icon for activity type
   */
  private getIconForActivityType(activityType: string): string {
    const iconMap: { [key: string]: string } = {
      'created': 'add_circle',
      'completed': 'check_circle',
      'assigned': 'person_add',
      'comment': 'comment',
      'status_changed': 'swap_horiz',
      'priority_changed': 'flag',
      'due_date_changed': 'calendar_today',
      'updated': 'edit'
    };
    return iconMap[activityType] || 'info';
  }

  /**
   * Get icon color for activity type
   */
  private getIconColorForActivityType(activityType: string): string {
    const colorMap: { [key: string]: string } = {
      'created': '#9c27b0',
      'completed': '#4caf50',
      'assigned': '#ff9800',
      'comment': '#3f51b5',
      'status_changed': '#2196f3',
      'priority_changed': '#f44336',
      'due_date_changed': '#00bcd4',
      'updated': '#2196f3'
    };
    return colorMap[activityType] || '#9e9e9e';
  }

  /**
   * Get time ago string
   */
  private getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
  }

  /**
   * Handle API errors
   */
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

