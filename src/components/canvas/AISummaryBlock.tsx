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
      <div className="flex flex-col h-full">
        {blockData.sourceBlockTitle && (
          <div className="mb-3 px-2 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-medium mb-0.5">Source</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {blockData.sourceBlockTitle}
            </p>
          </div>
        )}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <Loader2 size={20} className="animate-spin text-indigo-500" />
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Generating summary…</p>
          <div className="flex gap-1 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
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
    <div className="flex flex-col h-full gap-2 overflow-hidden">
      {blockData.sourceBlockTitle && (
        <div className="flex items-center gap-1.5 shrink-0">
          <Sparkles size={11} className="text-indigo-500 shrink-0" />
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
            From: {blockData.sourceBlockTitle}
          </span>
        </div>
      )}
      <div className="h-px bg-indigo-100 dark:bg-indigo-900/30 shrink-0" />
      <div className="flex-1 overflow-hidden">
        <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-5">
          {blockData.summary}
        </p>
      </div>
    </div>
  );
}
