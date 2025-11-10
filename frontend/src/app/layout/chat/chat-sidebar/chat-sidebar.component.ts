import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMember } from '../chat.types';

@Component({
  selector: 'vex-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatSidebarComponent {
  @Input() members: ChatMember[] = [];
  @Input() activeMemberId: string | null = null;

  @Output() selectMember = new EventEmitter<string>();

  trackByMember(index: number, member: ChatMember): string {
    return member.id;
  }

  handleSelect(memberId: string): void {
    if (memberId === this.activeMemberId) {
      return;
    }
    this.selectMember.emit(memberId);
  }

  getInitials(member: ChatMember): string {
    const parts = member.name.split(' ').filter(Boolean);
    if (!parts.length) {
      return 'NA';
    }
    return parts
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getAvatarColor(member: ChatMember): string {
    return member.avatarColor ?? '#ff7300';
  }
}
