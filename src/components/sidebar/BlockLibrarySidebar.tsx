import { useRef } from 'react';
import { Type, BarChart, PieChart, Table, Sparkles } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { type BlockType } from '../../types/workspace';
import { useVirtualizer } from '@tanstack/react-virtual';

const baseBlocks: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: "text", label: "Text Block", icon: <Type size={18} /> },
  { type: "chart", label: "Chart", icon: <BarChart size={18} /> },
  { type: "kpi", label: "KPI Metric", icon: <PieChart size={18} /> },
  { type: "table", label: "Data Table", icon: <Table size={18} /> },
  { type: "ai-summary", label: "AI Summary", icon: <Sparkles size={18} className="text-indigo-500" /> },
];

/** 
 * PERFORMANCE NOTE:
 * Simulating a massive block catalog (400 items) to prove rendering scalability. 
 * Traditional rendering would cause massive DOM bloat here. We use Virtualization. 
 */
const availableBlocks = Array.from({ length: 400 }).map((_, i) => {
  const base = baseBlocks[i % baseBlocks.length];
  return {
    ...base,
    id: `lib-block-${i}`,
    label: `${base.label} ${Math.floor(i / baseBlocks.length) > 0 ? `#${Math.floor(i / baseBlocks.length) + 1}` : ''}`.trim()
  };
});

export function BlockLibrarySidebar() {
  const addBlock = useWorkspaceStore((state) => state.addBlock);

  // Parent DOM ref for measuring scroll offset
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer config
  const virtualizer = useVirtualizer({
    count: availableBlocks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64, // Approximate height of each block row (56px content + 8px gap)
    overscan: 5,            // Pre-render a few items outside view to prevent flicker
  });

  const handleAddBlock = (type: BlockType, label: string) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title: label,
      data: { content: "New Block content placeholder" }
    };
    addBlock(newBlock);
  };

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--background)] flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Block Library ({availableBlocks.length})</h2>
      </div>
      <div 
        ref={parentRef} 
        className="flex-1 overflow-y-auto p-4 custom-scrollbar"
      >
        <div 
          style={{ 
            height: `${virtualizer.getTotalSize()}px`, 
            width: '100%', 
            position: 'relative' 
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const block = availableBlocks[virtualItem.index];
            return (
              <div
                key={block.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  paddingBottom: '8px'
                }}
              >
                <button
                  onClick={() => handleAddBlock(block.type as BlockType, block.label)}
                  className="flex w-full h-full items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 cursor-pointer shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md active:scale-95 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  <div className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {block.icon}
                  </div>
                  <span className="text-sm font-medium tracking-tight text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors text-left truncate">
                    {block.label}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
