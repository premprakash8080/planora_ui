import { Component, OnInit } from '@angular/core';

/**
 * Inbox Component
 * 
 * Displays task-related updates similar to Asana's Inbox or activity feed.
 * Shows task updates with information like task name, project name, update type, and time.
 */
export interface InboxUpdate {
  id: string;
  taskName: string;
  projectName: string;
  updateType: 'created' | 'updated' | 'completed' | 'assigned' | 'commented';
  updateDescription: string;
  time: string;
  timeAgo: string;
  userAvatar?: string;
  userName: string;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  /**
   * Dummy data for inbox updates
   * In a real application, this would come from a service/API
   */
  inboxUpdates: InboxUpdate[] = [
    {
      id: '1',
      taskName: 'Design Landing Page',
      projectName: 'Website Redesign',
      updateType: 'completed',
      updateDescription: 'marked as completed',
      time: '2024-01-15T10:30:00',
      timeAgo: '2 hours ago',
      userName: 'Sarah Johnson',
      icon: 'check_circle',
      iconColor: 'text-green-500'
    },
    {
      id: '2',
      taskName: 'Implement User Authentication',
      projectName: 'Mobile App',
      updateType: 'updated',
      updateDescription: 'updated the task',
      time: '2024-01-15T09:15:00',
      timeAgo: '3 hours ago',
      userName: 'Michael Chen',
      icon: 'edit',
      iconColor: 'text-blue-500'
    },
    {
      id: '3',
      taskName: 'Write API Documentation',
      projectName: 'Backend Services',
      updateType: 'created',
      updateDescription: 'created a new task',
      time: '2024-01-15T08:00:00',
      timeAgo: '4 hours ago',
      userName: 'Emily Rodriguez',
      icon: 'add_circle',
      iconColor: 'text-purple-500'
    },
    {
      id: '4',
      taskName: 'Review Code Changes',
      projectName: 'Frontend Development',
      updateType: 'assigned',
      updateDescription: 'assigned to you',
      time: '2024-01-15T07:45:00',
      timeAgo: '5 hours ago',
      userName: 'David Kim',
      icon: 'person_add',
      iconColor: 'text-orange-500'
    },
    {
      id: '5',
      taskName: 'Fix Bug in Payment Flow',
      projectName: 'E-commerce Platform',
      updateType: 'commented',
      updateDescription: 'added a comment',
      time: '2024-01-15T06:30:00',
      timeAgo: '6 hours ago',
      userName: 'Lisa Anderson',
      icon: 'comment',
      iconColor: 'text-indigo-500'
    },
    {
      id: '6',
      taskName: 'Update User Dashboard',
      projectName: 'Admin Panel',
      updateType: 'completed',
      updateDescription: 'marked as completed',
      time: '2024-01-14T18:00:00',
      timeAgo: 'Yesterday',
      userName: 'James Wilson',
      icon: 'check_circle',
      iconColor: 'text-green-500'
    },
    {
      id: '7',
      taskName: 'Create Marketing Campaign',
      projectName: 'Marketing Strategy',
      updateType: 'updated',
      updateDescription: 'updated the task',
      time: '2024-01-14T16:30:00',
      timeAgo: 'Yesterday',
      userName: 'Maria Garcia',
      icon: 'edit',
      iconColor: 'text-blue-500'
    },
    {
      id: '8',
      taskName: 'Setup CI/CD Pipeline',
      projectName: 'DevOps Infrastructure',
      updateType: 'created',
      updateDescription: 'created a new task',
      time: '2024-01-14T14:00:00',
      timeAgo: 'Yesterday',
      userName: 'Robert Taylor',
      icon: 'add_circle',
      iconColor: 'text-purple-500'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Component initialization
    // In a real app, you would fetch data from a service here
  }

  /**
   * Get the appropriate icon based on update type
   */
  getUpdateIcon(updateType: string): string {
    const iconMap: { [key: string]: string } = {
      'created': 'add_circle',
      'updated': 'edit',
      'completed': 'check_circle',
      'assigned': 'person_add',
      'commented': 'comment'
    };
    return iconMap[updateType] || 'info';
  }

  /**
   * Get the appropriate color class based on update type
   */
  getUpdateColor(updateType: string): string {
    const colorMap: { [key: string]: string } = {
      'created': 'text-purple-500',
      'updated': 'text-blue-500',
      'completed': 'text-green-500',
      'assigned': 'text-orange-500',
      'commented': 'text-indigo-500'
    };
    return colorMap[updateType] || 'text-gray-500';
  }

  /**
   * Get icon color based on update type
   */
  getIconColor(updateType: string): string {
    const colorMap: { [key: string]: string } = {
      'created': '#9c27b0',
      'updated': '#2196f3',
      'completed': '#4caf50',
      'assigned': '#ff9800',
      'commented': '#3f51b5'
    };
    return colorMap[updateType] || '#9e9e9e';
  }

  /**
   * Get icon background color based on update type
   */
  getIconBackgroundColor(updateType: string): string {
    const colorMap: { [key: string]: string } = {
      'created': '#f3e5f5',
      'updated': '#e3f2fd',
      'completed': '#e8f5e9',
      'assigned': '#fff3e0',
      'commented': '#e8eaf6'
    };
    return colorMap[updateType] || '#f5f5f5';
  }

  /**
   * Handle click on an inbox item
   */
  onUpdateClick(update: InboxUpdate): void {
    // In a real app, this would navigate to the task detail page
    console.log('Clicked update:', update);
  }
}

