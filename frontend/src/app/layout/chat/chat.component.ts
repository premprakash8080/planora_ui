import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ChatMember, ChatMessage } from './chat.types';

@Component({
  selector: 'vex-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  readonly currentUser: ChatMember = {
    id: 'me',
    name: 'You',
    avatarColor: '#ff7300'
  };

  readonly members: ChatMember[] = [
    {
      id: 'sarah',
      name: 'Sarah Chen',
      title: 'Product Manager',
      avatarColor: '#2563eb',
      status: 'online'
    },
    {
      id: 'jacob',
      name: 'Jacob Lee',
      title: 'Engineering Lead',
      avatarColor: '#1d4ed8',
      status: 'online'
    },
    {
      id: 'maria',
      name: 'Maria Gomez',
      title: 'UX Researcher',
      avatarColor: '#f97316',
      status: 'away'
    },
    {
      id: 'derek',
      name: 'Derek Nolan',
      title: 'QA Analyst',
      avatarColor: '#9333ea',
      status: 'offline'
    }
  ];

  activeMemberId: string | null = this.members[0]?.id ?? null;

  private readonly threads = new Map<string, ChatMessage[]>();

  constructor(private readonly cdr: ChangeDetectorRef) {
    this.members.forEach(member => {
      this.threads.set(member.id, this.seedThread(member));
    });
  }

  get activeMember(): ChatMember | null {
    return this.members.find(member => member.id === this.activeMemberId) ?? null;
  }

  get activeMessages(): ChatMessage[] {
    if (!this.activeMemberId) {
      return [];
    }
    return this.threads.get(this.activeMemberId) ?? [];
  }

  handleMemberSelect(memberId: string): void {
    this.activeMemberId = memberId;
  }

  handleMessageSend(rawMessage: string): void {
    if (!this.activeMemberId) {
      return;
    }

    const thread = [...(this.threads.get(this.activeMemberId) ?? [])];
    const trimmed = rawMessage.trim();

    if (!trimmed) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: this.currentUser.id,
      senderName: 'You',
      message: trimmed,
      createdAt: new Date().toISOString(),
      avatarColor: this.currentUser.avatarColor
    };

    thread.push(userMessage);

    this.threads.set(this.activeMemberId, thread);
    this.cdr.markForCheck();

    this.enqueueAutoReply(this.activeMemberId, thread);
  }

  private enqueueAutoReply(memberId: string, thread: ChatMessage[]): void {
    const member = this.members.find(item => item.id === memberId);
    if (!member) {
      return;
    }

    const response: ChatMessage = {
      id: `auto-${Date.now()}`,
      senderId: member.id,
      senderName: member.name,
      message: this.pickAutoReply(member.name),
      createdAt: new Date(Date.now() + 1_000).toISOString(),
      avatarColor: member.avatarColor
    };

    setTimeout(() => {
      const existing = this.threads.get(memberId) ?? [];
      this.threads.set(memberId, [...existing, response]);
      this.cdr.markForCheck();
    }, 900);
  }

  private seedThread(member: ChatMember): ChatMessage[] {
    return [
      {
        id: `${member.id}-1`,
        senderId: member.id,
        senderName: member.name,
        message: 'Hi! Wanted to sync on the latest sprint progress and see if you need anything from me.',
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        avatarColor: member.avatarColor
      },
      {
        id: `${member.id}-2`,
        senderId: this.currentUser.id,
        senderName: 'You',
        message: 'Thanks! I will share the status update by noon today. Anything else you need?',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        avatarColor: this.currentUser.avatarColor
      }
    ];
  }

  private pickAutoReply(_name: string): string {
    const responses = [
      'Sounds good—thanks for the update!',
      'Perfect. If you need extra context, check the [project brief](https://planora.app/docs).',
      'Appreciate the progress! Let me know if you hit any blockers.',
      'Great! I will review the notes and loop back with comments.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
