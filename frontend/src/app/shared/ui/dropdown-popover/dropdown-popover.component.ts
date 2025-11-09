import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { ConnectedPosition } from '@angular/cdk/overlay';

export interface DropdownPopoverItem<T = unknown> {
  id: string;
  label: string;
  description?: string;
  avatarText?: string;
  avatarUrl?: string;
  color?: string;
  data?: T;
}

@Component({
  selector: 'app-dropdown-popover',
  templateUrl: './dropdown-popover.component.html',
  styleUrls: ['./dropdown-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownPopoverComponent<T = unknown> {
  @Input() items: DropdownPopoverItem<T>[] = [];
  @Input() selectedId: string | null = null;
  @Input() width = 320;
  @Input() maxHeight = 320;
  @Input() hasSearch = false;
  @Input() searchPlaceholder = 'Search…';

  @Output() select = new EventEmitter<DropdownPopoverItem<T>>();

  readonly overlayPositions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8
    }
  ];

  open = false;
  searchTerm = '';
  get filteredItems(): DropdownPopoverItem<T>[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.items;
    }
    return this.items.filter(item =>
      item.label.toLowerCase().includes(term) ||
      (item.description?.toLowerCase().includes(term) ?? false)
    );
  }

  toggle(): void {
    this.open ? this.close() : this.openPopover();
  }

  handleTriggerClick(event: Event): void {
    event.stopPropagation();
    this.toggle();
  }

  close(): void {
    if (!this.open) {
      return;
    }
    this.open = false;
    this.searchTerm = '';
  }

  onSelect(item: DropdownPopoverItem<T>): void {
    this.select.emit(item);
    this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  private openPopover(): void {
    this.open = true;
  }
}

