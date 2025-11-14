import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DropdownPopoverItem } from '../dropdown-popover/dropdown-popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {
  @Input() appTitle = 'Planora';
  @Input() showSearch = true;
  @Input() searchPlaceholder = 'Search tasks, projects, people...';
  @Input() notifications = 3;
  @Input() userInitials = 'JD';
  @Input() userRole = 'Product Manager';
  @Input() userAvatarUrl?: string;

  @Output() menuToggle = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();

  notificationItems: DropdownPopoverItem[] = [
    {
      id: 'notif-1',
      label: 'New task assigned',
      description: 'You have been assigned to a new task',
      avatarColor: '#2563eb'
    },
    {
      id: 'notif-2',
      label: 'Project update',
      description: 'Website Redesign project has been updated',
      avatarColor: '#10b981'
    },
    {
      id: 'notif-3',
      label: 'Team member joined',
      description: 'Sarah Johnson joined your team',
      avatarColor: '#8b5cf6'
    }
  ];

  profileItems: DropdownPopoverItem[] = [
    {
      id: 'view-profile',
      label: 'View Profile',
      // description: 'View your profile details',
      avatarText: 'VP',
      avatarColor: '#2563eb'
    },
    {
      id: 'settings',
      label: 'Settings',
      // description: 'Manage your account settings',
      avatarText: 'ST',
      avatarColor: '#64748b'
    },
    {
      id: 'logout',
      label: 'Logout',
      // description: 'Sign out of your account',
      avatarText: 'LO',
      avatarColor: '#ef4444'
    }
  ];

  constructor(private router: Router) {}

  onSearchChange(value: string): void {
    this.searchChanged.emit(value);
  }

  onNotificationSelect(item: DropdownPopoverItem): void {
    // Handle notification click
    console.log('Notification selected:', item);
    // TODO: Navigate to notification detail or mark as read
  }

  onProfileSelect(item: DropdownPopoverItem): void {
    switch (item.id) {
      case 'view-profile':
        this.router.navigate(['/profile']);
        break;
      case 'settings':
        this.router.navigate(['/settings']);
        break;
      case 'logout':
        // TODO: Implement logout logic
        console.log('Logout clicked');
        // this.router.navigate(['/auth/login']);
        break;
    }
  }
}

