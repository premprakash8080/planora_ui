import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DropdownPopoverComponent } from '../dropdown-popover/dropdown-popover.component';

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
  @Output() createClicked = new EventEmitter<void>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() profileSelected = new EventEmitter<void>();
  @Output() logoutSelected = new EventEmitter<void>();

  onSearchChange(value: string): void {
    this.searchChanged.emit(value);
  }

  handleProfile(menu: DropdownPopoverComponent | null): void {
    this.profileSelected.emit();
    menu?.close();
  }

  handleLogout(menu: DropdownPopoverComponent | null): void {
    this.logoutSelected.emit();
    menu?.close();
  }
}

