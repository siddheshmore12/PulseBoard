import { create } from 'zustand';
import { type Collaborator, type ActivityEvent, type UserStatus, MOCK_USERS } from '../features/collaboration/types';

type CollaborationStore = {
  onlineUsers: Collaborator[];
  activities: ActivityEvent[];
  addActivity: (activity: Omit<ActivityEvent, 'id' | 'timestamp'>) => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
};

export const useCollaborationStore = create<CollaborationStore>((set) => ({
  onlineUsers: MOCK_USERS,
  activities: [],
  addActivity: (activity) => set((state) => {
    const newActivity: ActivityEvent = {
      ...activity,
      id: `act-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    return {
      activities: [newActivity, ...state.activities].slice(0, 8),
    };
  }),
  updateUserStatus: (userId, status) => set((state) => ({
    onlineUsers: state.onlineUsers.map((u) => u.id === userId ? { ...u, status } : u),
  })),
}));
