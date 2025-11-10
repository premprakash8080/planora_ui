export type ChatStatus = 'online' | 'offline' | 'away';

export interface ChatMember {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  avatarColor?: string;
  status?: ChatStatus;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
  avatarUrl?: string;
  avatarColor?: string;
}
