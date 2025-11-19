import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { InboxService, InboxUpdate } from '../service/inbox.service';
import { SnackBarService } from 'src/app/shared/services/snackbar.service';

/**
 * Inbox Component
 * 
 * Displays task-related updates similar to Asana's Inbox or activity feed.
 * Shows task updates with information like task name, project name, update type, and time.
 */
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, AfterViewInit {
  inboxUpdates: InboxUpdate[] = [];
  loading = false;

  constructor(
    private inboxService: InboxService,
    private snackBarService: SnackBarService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadInboxActivities();
  }

  ngAfterViewInit(): void {
    // Ensure change detection runs after view initialization
    this.cdr.detectChanges();
  }

  /**
   * Load inbox activities from API
   */
  loadInboxActivities(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.inboxService.getInboxActivities(50, 0).subscribe({
      next: (activities) => {
        this.ngZone.run(() => {
          this.inboxUpdates = activities.map(activity => 
            this.inboxService.convertToInboxUpdate(activity)
          );
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Error loading inbox activities:', error);
        this.ngZone.run(() => {
          this.snackBarService.showError('Failed to load inbox activities');
          this.loading = false;
          // Fallback to empty array
          this.inboxUpdates = [];
          this.cdr.detectChanges();
        });
      }
    });
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
      'comment': 'comment'
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
      'comment': 'text-indigo-500'
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
      'comment': '#3f51b5'
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
      'comment': '#e8eaf6'
    };
    return colorMap[updateType] || '#f5f5f5';
  }

  /**
   * Handle click on an inbox item
   */
  onUpdateClick(update: InboxUpdate): void {
    // TODO: Navigate to task detail page
    console.log('Clicked update:', update);
  }
}
