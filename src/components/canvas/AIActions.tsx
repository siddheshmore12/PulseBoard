import { Sparkles, Heading, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { runAIAction } from '../../features/ai/aiService';
import type { Block } from '../../types/workspace';

// ─── Types ────────────────────────────────────────────────────────────────

interface AIActionsProps {
  block: Block;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function getSourceText(block: Block): string {
  if (typeof block.data.content === 'string' && block.data.content.trim()) {
    return block.data.content;
  }
  return block.title ?? `Block of type ${block.type}`;
}

// ─── Component ───────────────────────────────────────────────────────────

export function AIActions({ block }: AIActionsProps) {
  const aiState = useAIStore((s) => s.getBlockAIState(block.id));
  const setLoading = useAIStore((s) => s.setBlockAILoading);
  const setSuccess = useAIStore((s) => s.setBlockAISuccess);
  const setError = useAIStore((s) => s.setBlockAIError);

  const addBlock = useWorkspaceStore((s) => s.addBlock);
  const updateBlockTitle = useWorkspaceStore((s) => s.updateBlockTitle);
  const updateBlockData = useWorkspaceStore((s) => s.updateBlockData);

  const isLoading = aiState.status === 'loading';

  const handleSummarize = async () => {
    if (isLoading) return;

    const summaryBlockId = `ai-summary-${Date.now()}`;
    addBlock({
      id: summaryBlockId,
      type: 'ai-summary',
      title: `Summary of "${block.title ?? 'Block'}"`,
      data: {
        sourceText: getSourceText(block),
        sourceBlockTitle: block.title,
        status: 'loading',
      },
    });

    // Mark source block as loading in aiStore
    setLoading(block.id, 'summarize');

    const result = await runAIAction({
      action: 'summarize',
      inputText: getSourceText(block),
      blockTitle: block.title,
    });

    if (result.success && result.content) {
      updateBlockData(summaryBlockId, { summary: result.content, status: 'success' });
      setSuccess(block.id);
    } else {
      updateBlockData(summaryBlockId, {
        status: 'error',
        error: result.error ?? 'Generation failed.',
      });
      setError(block.id, result.error ?? 'Generation failed.');
    }
  };


  const handleGenerateTitle = async () => {
    if (isLoading) return;
    setLoading(block.id, 'generate_title');

    const result = await runAIAction({
      action: 'generate_title',
      inputText: getSourceText(block),
      blockTitle: block.title,
    });

    if (result.success && result.content) {
      updateBlockTitle(block.id, result.content);
      setSuccess(block.id);
    } else {
      setError(block.id, result.error ?? 'Generation failed.');
    }
  };

  const handleRewrite = async () => {
    if (isLoading) return;
    setLoading(block.id, 'rewrite');

    const result = await runAIAction({
      action: 'rewrite',
      inputText: getSourceText(block),
      blockTitle: block.title,
    });

    if (result.success && result.content) {
      updateBlockData(block.id, { content: result.content });
      setSuccess(block.id);
    } else {
      setError(block.id, result.error ?? 'Generation failed.');
    }
  };

  return (
    <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
      {aiState.status === 'error' && (
        <div className="flex items-center gap-1.5 mb-2 text-[11px] text-rose-500 dark:text-rose-400">
          <AlertCircle size={11} className="shrink-0" />
          <span className="truncate">{aiState.error}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Loading spinner badge */}
        {isLoading && (
          <span className="inline-flex items-center gap-1 text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">
            <Loader2 size={11} className="animate-spin" />
            {aiState.activeAction === 'summarize' && 'Summarizing…'}
            {aiState.activeAction === 'generate_title' && 'Generating title…'}
            {aiState.activeAction === 'rewrite' && 'Rewriting…'}
          </span>
        )}

        {!isLoading && (
          <>
            <AIActionButton
              icon={<Sparkles size={11} />}
              label="Summarize"
              onClick={handleSummarize}
            />
            <AIActionButton
              icon={<Heading size={11} />}
              label="Title"
              onClick={handleGenerateTitle}
            />
            <AIActionButton
              icon={<RefreshCw size={11} />}
              label="Rewrite"
              onClick={handleRewrite}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── Reusable micro-button ────────────────────────────────────────────────

function AIActionButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onPointerDown={(e) => {
        e.stopPropagation(); // crucial for dnd-kit
      }}
      onClick={(e) => {
        console.log('[AI] button click event fired for', label);
        e.stopPropagation(); // prevent block drag from capturing the click
        onClick();
      }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold
                 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300
                 hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                 hover:text-indigo-600 dark:hover:text-indigo-400
                 border border-slate-200 dark:border-slate-700
                 hover:border-indigo-200 dark:hover:border-indigo-500/30
                 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
    >
      {icon}
      {label}
    </button>
  );
}
