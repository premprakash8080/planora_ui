import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatMember, ChatMessage } from '../chat.types';

interface ChatMessageGroup {
  label: string;
  items: ChatMessage[];
}

@Component({
  selector: 'vex-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindowComponent implements AfterViewInit, OnChanges {
  private static readonly DEFAULT_COLOR = '#ff7300';

  @Input() member: ChatMember | null = null;
  @Input() messages: ChatMessage[] = [];
  @Input() currentUserId = '';

  @Output() send = new EventEmitter<string>();

  @ViewChild('scrollContainer') private readonly scrollContainer?: ElementRef<HTMLDivElement>;

  readonly composerControl = new FormControl<string>('', { nonNullable: true });

  groupedMessages: ChatMessageGroup[] = [];

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.buildGroups();
      this.scrollToBottomSoon();
    }
    if (changes['member']) {
      this.scrollToBottomSoon();
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitMessage();
    }
  }

  submitMessage(): void {
    const value = (this.composerControl.value ?? '').trim();
    if (!value) {
      return;
    }
    this.send.emit(value);
    this.composerControl.setValue('');
  }

  trackGroup(index: number, group: ChatMessageGroup): string {
    return group.label;
  }

  trackMessage(index: number, message: ChatMessage): string {
    return message.id;
  }

  isSelf(message: ChatMessage): boolean {
    return message.senderId === this.currentUserId;
  }

  getInitials(senderName: string): string {
    const parts = senderName.split(' ').filter(Boolean);
    if (!parts.length) {
      return 'NA';
    }
    return parts
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getAvatarColor(message: ChatMessage): string {
    return message.avatarColor ?? ChatWindowComponent.DEFAULT_COLOR;
  }

  formatTimestamp(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return iso;
    }
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  renderMessage(message: ChatMessage): SafeHtml {
    const escaped = this.escapeHtml(message.message);
    const withLinks = escaped.replace(/\[(.+?)\]\((https?:\/\/[^\s]+)\)/g, (_match, text, url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
    );
    const withBold = withLinks.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const withItalic = withBold.replace(/\*(.+?)\*/g, '<em>$1</em>');
    const withBreaks = withItalic.replace(/\n/g, '<br />');
    return this.sanitizer.bypassSecurityTrustHtml(withBreaks);
  }

  private buildGroups(): void {
    const groups: ChatMessageGroup[] = [];
    let current: ChatMessageGroup | null = null;

    for (const message of this.messages) {
      const label = this.getDayLabel(message.createdAt);
      if (!current || current.label !== label) {
        current = { label, items: [] };
        groups.push(current);
      }
      current.items.push(message);
    }

    this.groupedMessages = groups;
  }

  private getDayLabel(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
      return 'Unknown';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diff = (target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000);

    if (diff === 0) {
      return 'Today';
    }
    if (diff === -1) {
      return 'Yesterday';
    }

    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  private scrollToBottomSoon(): void {
    setTimeout(() => this.scrollToBottom(), 80);
  }

  private scrollToBottom(): void {
    const container = this.scrollContainer?.nativeElement;
    if (!container) {
      return;
    }
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
