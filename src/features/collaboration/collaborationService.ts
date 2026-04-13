import { socket } from './mockSocket';
import { type CollabEventType, type CollabEventPayloads, MOCK_USERS } from './types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useCollaborationStore } from '../../store/collaborationStore';

export const MY_USER_ID = 'me';

class CollaborationService {
  private baseInterval: number | null = null;

  // Local event emission
  emit<T extends CollabEventType>(event: T, payload: CollabEventPayloads[T]) {
    socket.emit(event, payload);
  }

  // Subscribe
  subscribe<T extends CollabEventType>(event: T, callback: (payload: CollabEventPayloads[T]) => void) {
    socket.on(event, callback);
    return () => socket.off(event, callback);
  }

  // Simulating random events from others
  startSimulation() {
    if (this.baseInterval) return;

    this.baseInterval = window.setInterval(() => {
      const state = useWorkspaceStore.getState();
      const workspace = state.currentWorkspace;
      if (!workspace || workspace.blocks.length === 0) return;

      const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
      const block = workspace.blocks[Math.floor(Math.random() * workspace.blocks.length)];

      const actions: CollabEventType[] = ['block_moved', 'block_updated'];
      const action = actions[Math.floor(Math.random() * actions.length)];

      if (action === 'block_moved') {
        const layoutItem = workspace.layout.find((l) => l.blockId === block.id);
        if (layoutItem) {
          useCollaborationStore.getState().updateUserStatus(user.id, 'editing');
          // Move slightly
          const dx = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 10);
          socket.emit('block_moved', {
            blockId: block.id,
            x: layoutItem.x + dx,
            y: layoutItem.y,
            userId: user.id,
          });
          setTimeout(() => useCollaborationStore.getState().updateUserStatus(user.id, 'idle'), 2000);
        }
      } else if (action === 'block_updated') {
        if (block.type === 'text') {
          useCollaborationStore.getState().updateUserStatus(user.id, 'editing');
          socket.emit('block_updated', {
            blockId: block.id,
            data: { content: `${block.data.content}\n\n(Edited by ${user.name})` },
            userId: user.id,
          });
          setTimeout(() => useCollaborationStore.getState().updateUserStatus(user.id, 'idle'), 2000);
        }
      }
    }, 15000); // 15 seconds to ensure low frequency and non-destructive
  }

  stopSimulation() {
    if (this.baseInterval) {
      clearInterval(this.baseInterval);
      this.baseInterval = null;
    }
  }
}

export const collaborationService = new CollaborationService();
