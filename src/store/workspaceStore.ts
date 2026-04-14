import { create } from 'zustand';
import { type Workspace, type Block } from '../types/workspace';
import { collaborationService, MY_USER_ID } from '../features/collaboration/collaborationService';

type WorkspaceStore = {
  currentWorkspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  toggleTheme: (isRemote?: boolean) => void;
  addBlock: (block: Block, isRemote?: boolean) => void;
  removeBlock: (blockId: string, isRemote?: boolean) => void;
  updateBlockPosition: (blockId: string, x: number, y: number, isRemote?: boolean) => void;
  updateBlockData: (blockId: string, data: Partial<Record<string, unknown>>, isRemote?: boolean, skipEmit?: boolean) => void;
  updateBlockTitle: (blockId: string, title: string, isRemote?: boolean) => void;
  resetWorkspace: () => void;
};

const initialWorkspace: Workspace = {
  id: "ws-1",
  name: "Sample Pulseboard",
  blocks: [
    { id: "b1", type: "kpi", title: "Monthly Revenue", data: { value: "$45,000" } },
    { id: "b2", type: "chart", title: "User Growth", data: { type: "line" } }
  ],
  layout: [
    { blockId: "b1", x: 0, y: 0, w: 2, h: 2 },
    { blockId: "b2", x: 0, y: 0, w: 4, h: 3 }
  ],
  theme: "light",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspace: initialWorkspace,
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  toggleTheme: (isRemote = false) => set((state) => {
    if (!state.currentWorkspace) return state;
    const newTheme = state.currentWorkspace.theme === 'light' ? 'dark' : 'light';
    
    if (!isRemote) {
      collaborationService.emit('theme_changed', { theme: newTheme, userId: MY_USER_ID });
    }

    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        theme: newTheme
      }
    };
  }),
  addBlock: (block, isRemote = false) => set((state) => {
    if (!state.currentWorkspace) return state;

    if (!isRemote) {
      collaborationService.emit('block_added', { block, userId: MY_USER_ID });
    }

    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        blocks: [...state.currentWorkspace.blocks, block],
        layout: [...state.currentWorkspace.layout, { blockId: block.id, x: 0, y: 0, w: 3, h: 3 }]
      }
    };
  }),
  removeBlock: (blockId) => set((state) => {
    if (!state.currentWorkspace) return state;
    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        blocks: state.currentWorkspace.blocks.filter(b => b.id !== blockId),
        layout: state.currentWorkspace.layout.filter(l => l.blockId !== blockId)
      }
    };
  }),
  updateBlockPosition: (blockId, x, y, isRemote = false) => set((state) => {
    if (!state.currentWorkspace) return state;

    if (!isRemote) {
      collaborationService.emit('block_moved', { blockId, x, y, userId: MY_USER_ID });
    }

    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        layout: state.currentWorkspace.layout.map((l) => 
          l.blockId === blockId ? { ...l, x, y } : l
        )
      }
    };
  }),
  updateBlockData: (blockId, data, isRemote = false, skipEmit = false) => set((state) => {
    if (!state.currentWorkspace) return state;

    if (!isRemote && !skipEmit) {
      collaborationService.emit('block_updated', { blockId, data, userId: MY_USER_ID });
    }

    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        blocks: state.currentWorkspace.blocks.map((b) =>
          b.id === blockId ? { ...b, data: { ...b.data, ...data } } : b
        ),
        updatedAt: new Date().toISOString(),
      },
    };
  }),
  updateBlockTitle: (blockId, title, isRemote = false) => set((state) => {
    if (!state.currentWorkspace) return state;
    
    // We can emit a block_updated for title changes too since they act as data updates visually
    if (!isRemote) {
      collaborationService.emit('block_updated', { blockId, data: { _title_change: title }, userId: MY_USER_ID });
    }

    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        blocks: state.currentWorkspace.blocks.map((b) =>
          b.id === blockId ? { ...b, title } : b
        ),
        updatedAt: new Date().toISOString(),
      },
    };
  }),
  resetWorkspace: () => set({ currentWorkspace: initialWorkspace })
}));
