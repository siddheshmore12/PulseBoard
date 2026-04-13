import { Sparkles, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Block } from '../../types/workspace';
import type { AISummaryBlockData } from '../../features/ai/types';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { runAIAction } from '../../features/ai/aiService';

// ─── Component ───────────────────────────────────────────────────────────

interface AISummaryBlockProps {
  block: Block;
}

export function AISummaryBlock({ block }: AISummaryBlockProps) {
  /**
   * FIX: Subscribe DIRECTLY to workspaceStore for this block's data.
   *
   * Why this is necessary:
   * DraggableBlock is wrapped in React.memo. Even though updateBlockData
   * creates a new block object, dnd-kit's useDraggable spread
   * ({...listeners} {...attributes}) can interfere with how React.memo
   * propagates prop updates through the drag context. The stale prop
   * means block.data.status never changes from the initial render.
   *
   * By subscribing directly here, AISummaryBlock always reads live data
   * from the store regardless of whether its parent re-renders.
   */
  const liveData = useWorkspaceStore((state) => {
    const found = state.currentWorkspace?.blocks.find((b) => b.id === block.id);
    return found?.data as Partial<AISummaryBlockData> | undefined;
  });

  // Merge: prefer live store data, fall back to initial prop data
  const blockData: Partial<AISummaryBlockData> = liveData ?? (block.data as Partial<AISummaryBlockData>);

  const updateBlockData = useWorkspaceStore((s) => s.updateBlockData);

  // ── Derived state from explicit status field ──────────────────────────
  const hasPopulatedSummary = !!blockData.summary;
  const isGenerating = (!hasPopulatedSummary && !blockData.status) || blockData.status === 'loading';
  const hasError = blockData.status === 'error';
  const errorMessage = blockData.error ?? 'Generation failed.';

  // ── Retry handler ─────────────────────────────────────────────────────
  const handleRetry = async () => {
    if (!blockData.sourceText) return;

    // Reset to loading
    updateBlockData(block.id, { status: 'loading', error: undefined, summary: undefined });

    const result = await runAIAction({
      action: 'summarize',
      inputText: blockData.sourceText,
      blockTitle: block.title,
    });

    if (result.success && result.content) {
      updateBlockData(block.id, { summary: result.content, status: 'success' });
    } else {
      updateBlockData(block.id, {
        status: 'error',
        error: result.error ?? 'Generation failed.',
      });
    }
  };

  // ── Loading State ────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="flex flex-col h-full bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-800/50 p-2">
        {blockData.sourceBlockTitle && (
          <div className="mb-2 px-2 py-1.5 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">AI Insight</span>
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 border-2 border-indigo-200 dark:border-indigo-800 rounded-full animate-ping opacity-20"></div>
            <Loader2 size={24} className="animate-spin text-indigo-500 relative z-10" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-2 w-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse"></div>
            <div className="h-2 w-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full animate-pulse opacity-70"></div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────
  if (hasError) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
            <AlertCircle size={16} className="text-rose-500" />
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Generation failed</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[180px] leading-relaxed">
            {errorMessage}
          </p>
          {blockData.sourceText && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium
                         bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400
                         hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800
                         transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <RefreshCw size={10} />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Populated State ──────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full gap-2 overflow-hidden bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-900/20 dark:to-slate-900 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-none">
      <div className="flex items-center justify-between shrink-0 mb-1">
        <div className="flex items-center gap-1.5">
          <Sparkles size={13} className="text-indigo-500 shrink-0" />
          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">
            AI Insight
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 italic font-medium line-clamp-4">
          "{blockData.summary}"
        </p>
      </div>
      {blockData.sourceBlockTitle && (
        <div className="mt-auto pt-2 flex items-center gap-1.5 shrink-0 opacity-60">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
            Based on: {blockData.sourceBlockTitle}
          </span>
        </div>
      )}
    </div>
  );
}
