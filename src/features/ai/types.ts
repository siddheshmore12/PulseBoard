// ─── Core Request/Response Types ───────────────────────────────────────────

export type AIActionType = 'summarize' | 'generate_title' | 'rewrite';

/** Kept for backward compat with the existing stub */
export type AIRequestType = AIActionType;

export interface AIRequest {
  action: AIActionType;
  /** The source text to operate on */
  inputText: string;
  /** Optional block title for context */
  blockTitle?: string;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// ─── AI Summary Block Data ────────────────────────────────────────────────
// This is stored inside Block.data for ai-summary blocks

export interface AISummaryBlockData {
  /** Original text that was summarized */
  sourceText: string;
  /** The generated summary (undefined while loading) */
  summary?: string;
  /** Title of the source block for context display */
  sourceBlockTitle?: string;
}

// ─── Per-block AI operation state ────────────────────────────────────────
// Stored in aiStore, keyed by blockId. Never persisted.

export type AIOperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AIBlockState {
  status: AIOperationStatus;
  activeAction?: AIActionType;
  error?: string;
}

// ─── Provider Interface ──────────────────────────────────────────────────
// Implementing this interface lets any provider (mock or real) be dropped in.

export interface AIProvider {
  run(request: AIRequest): Promise<AIResponse>;
}
