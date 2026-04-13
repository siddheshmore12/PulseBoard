import { create } from 'zustand';
import { type Workspace, type Block } from '../types/workspace';

type WorkspaceStore = {
  currentWorkspace: Workspace | null;
  setWorkspace: (workspace: Workspace) => void;
  toggleTheme: () => void;
  addBlock: (block: Block) => void;
  removeBlock: (blockId: string) => void;
  updateBlockPosition: (blockId: string, x: number, y: number) => void;
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
  toggleTheme: () => set((state) => {
    if (!state.currentWorkspace) return state;
    const newTheme = state.currentWorkspace.theme === 'light' ? 'dark' : 'light';
    
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
  updateBlockPosition: (blockId, x, y) => set((state) => {
    if (!state.currentWorkspace) return state;
    return {
      currentWorkspace: {
        ...state.currentWorkspace,
        layout: state.currentWorkspace.layout.map((l) => 
          l.blockId === blockId ? { ...l, x, y } : l
        )
      }
    };
  })
}));
