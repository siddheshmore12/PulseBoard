import { useEffect } from 'react';
import { collaborationService } from './collaborationService';
import { MOCK_USERS } from './types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useCollaborationStore } from '../../store/collaborationStore';

function getUserName(userId: string) {
  if (userId === 'me') return 'You';
  const found = MOCK_USERS.find(u => u.id === userId);
  return found ? found.name : 'Someone';
}

export function useCollaborationProvider() {
  useEffect(() => {
    // Start simulating remote users
    collaborationService.startSimulation();

    // Subscribe to remote events
    const unsubAdded = collaborationService.subscribe('block_added', (payload) => {
      useWorkspaceStore.getState().addBlock(payload.block, true);
      useCollaborationStore.getState().addActivity({
        userId: payload.userId,
        userName: getUserName(payload.userId),
        action: 'block_added',
        blockId: payload.block.id,
      });
    });

    const unsubMoved = collaborationService.subscribe('block_moved', (payload) => {
      useWorkspaceStore.getState().updateBlockPosition(payload.blockId, payload.x, payload.y, true);
      useCollaborationStore.getState().addActivity({
        userId: payload.userId,
        userName: getUserName(payload.userId),
        action: 'block_moved',
        blockId: payload.blockId,
      });
    });

    const unsubUpdated = collaborationService.subscribe('block_updated', (payload) => {
      if (payload.data._title_change) {
        useWorkspaceStore.getState().updateBlockTitle(payload.blockId, payload.data._title_change as string, true);
      } else {
        useWorkspaceStore.getState().updateBlockData(payload.blockId, payload.data, true);
      }
      useCollaborationStore.getState().addActivity({
        userId: payload.userId,
        userName: getUserName(payload.userId),
        action: 'block_updated',
        blockId: payload.blockId,
      });
    });

    const unsubTheme = collaborationService.subscribe('theme_changed', (payload) => {
      useWorkspaceStore.getState().toggleTheme(true);
      useCollaborationStore.getState().addActivity({
        userId: payload.userId,
        userName: getUserName(payload.userId),
        action: 'theme_changed',
      });
    });

    return () => {
      collaborationService.stopSimulation();
      unsubAdded();
      unsubMoved();
      unsubUpdated();
      unsubTheme();
    };
  }, []);
}
