import type { Block } from '../../types/workspace';

export type UserStatus = 'idle' | 'editing';

export interface Collaborator {
  id: string;
  name: string;
  color: string;
  status: UserStatus;
  avatarUrl?: string;
}

export type CollabEventPayloads = {
  'block_added': { block: Block; userId: string };
  'block_moved': { blockId: string; x: number; y: number; userId: string };
  'block_updated': { blockId: string; data: Partial<Record<string, unknown>>; userId: string };
  'theme_changed': { theme: 'light' | 'dark'; userId: string };
};

export type CollabEventType = keyof CollabEventPayloads;

export interface ActivityEvent {
  id: string;
  userId: string;
  userName: string;
  action: CollabEventType;
  blockId?: string;
  timestamp: number;
}

export const MOCK_USERS: Collaborator[] = [
  { id: 'u1', name: 'Ava', color: 'bg-emerald-500', status: 'idle' },
  { id: 'u2', name: 'Jordan', color: 'bg-amber-500', status: 'idle' },
];
