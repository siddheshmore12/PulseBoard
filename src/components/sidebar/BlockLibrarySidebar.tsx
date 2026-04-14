import { useRef } from 'react';
import { Type, BarChart, PieChart, Table, Sparkles } from 'lucide-react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { type BlockType } from '../../types/workspace';
import { useVirtualizer } from '@tanstack/react-virtual';

type LibraryItem = 
  | { type: 'header'; id: string; label: string }
  | { type: 'block'; id: string; blockType: BlockType; label: string; icon: React.ReactNode };

/** 
 * PERFORMANCE NOTE:
 * Even though this specific realistic catalog is small, we maintain the virtualization pattern
 * (react-virtual) from Phase 5. This proves the architecture can cleanly scale to hundreds of 
 * block definitions across many categories (like a real enterprise SaaS tool) without DOM bloat.
 */
const libraryCatalog: LibraryItem[] = [
  { type: 'header', id: 'h-basic', label: 'Basic' },
  { type: 'block', id: 'b-text', blockType: 'text', label: 'Text', icon: <Type size={18} /> },
  { type: 'block', id: 'b-kpi', blockType: 'kpi', label: 'KPI Metric', icon: <PieChart size={18} /> },
  
  { type: 'header', id: 'h-data', label: 'Data & Analytics' },
  { type: 'block', id: 'b-chart', blockType: 'chart', label: 'Bar Chart', icon: <BarChart size={18} /> },
  { type: 'block', id: 'b-table', blockType: 'table', label: 'Data Table', icon: <Table size={18} /> },
  
  { type: 'header', id: 'h-ai', label: 'Intelligence' },
  { type: 'block', id: 'b-ai-summary', blockType: 'ai-summary', label: 'AI Summary', icon: <Sparkles size={18} className="text-indigo-500" /> },
];

export function BlockLibrarySidebar() {
  const addBlock = useWorkspaceStore((state) => state.addBlock);

  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer dynamically calculates layout heights based on element type
  const virtualizer = useVirtualizer({
    count: libraryCatalog.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => libraryCatalog[index].type === 'header' ? 44 : 64, 
    overscan: 5,
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

  const blockCount = libraryCatalog.filter(i => i.type === 'block').length;

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--background)] flex flex-col transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Block Library ({blockCount})</h2>
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
            const item = libraryCatalog[virtualItem.index];
            return (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                  paddingBottom: item.type === 'header' ? '4px' : '8px'
                }}
              >
                {item.type === 'header' ? (
                  <div className="flex items-end px-1 pt-4 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.label}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddBlock(item.blockType, item.label)}
                    className="flex w-full h-full items-center gap-3 px-2 py-2 rounded-lg bg-transparent cursor-pointer active:scale-[0.98] transition-all duration-75 group hover:bg-[var(--foreground)] hover:text-[var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <div className="text-slate-400 group-hover:text-[var(--background)] transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium tracking-tight text-[var(--foreground)] group-hover:text-[var(--background)] transition-colors text-left truncate">
                      {item.label}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
