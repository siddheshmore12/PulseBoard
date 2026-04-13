import { create } from 'zustand';
import type { AIBlockState, AIActionType } from '../features/ai/types';

// ─── Store shape ─────────────────────────────────────────────────────────

type AIStore = {
  /** Per-block AI state keyed by blockId. Ephemeral — not persisted. */
  blockStates: Record<string, AIBlockState>;

  setBlockAILoading: (blockId: string, action: AIActionType) => void;
  setBlockAISuccess: (blockId: string) => void;
  setBlockAIError: (blockId: string, error: string) => void;
  clearBlockAIState: (blockId: string) => void;
  getBlockAIState: (blockId: string) => AIBlockState;
};

// ─── Default per-block state ─────────────────────────────────────────────

const IDLE_STATE: AIBlockState = { status: 'idle' };

// ─── Store ───────────────────────────────────────────────────────────────

export const useAIStore = create<AIStore>((set, get) => ({
  blockStates: {},

  setBlockAILoading: (blockId, action) =>
    set((state) => ({
      blockStates: {
        ...state.blockStates,
        [blockId]: { status: 'loading', activeAction: action },
      },
    })),

  setBlockAISuccess: (blockId) =>
    set((state) => ({
      blockStates: {
        ...state.blockStates,
        [blockId]: { status: 'success' },
      },
    })),

  setBlockAIError: (blockId, error) =>
    set((state) => ({
      blockStates: {
        ...state.blockStates,
        [blockId]: { status: 'error', error },
      },
    })),

  clearBlockAIState: (blockId) =>
    set((state) => {
      const { [blockId]: _, ...rest } = state.blockStates;
      return { blockStates: rest };
    }),

  getBlockAIState: (blockId) => get().blockStates[blockId] ?? IDLE_STATE,
}));
