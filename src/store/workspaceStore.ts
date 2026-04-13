import { create } from 'zustand';
import { type Workspace, type Block } from '../types/workspace';

type WorkspaceStore = {
  currentWorkspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  toggleTheme: () => void;
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
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
    { blockId: "b2", x: 2, y: 0, w: 4, h: 3 }
  ],
  theme: "light",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspace: initialWorkspace,
  setWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  toggleTheme: () => set((state) => {
    if (!state.currentWorkspace) return state;
    const newTheme = state.currentWorkspace.theme === 'light' ? 'dark' : 'light';
    
    // Theme will be applied visually by the provider/toggles via classList
    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        theme: newTheme
      }
    };
  }),
  addBlock: (block) => set((state) => {
    if (!state.currentWorkspace) return state;
    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        blocks: [...state.currentWorkspace.blocks, block]
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
  })
}));
