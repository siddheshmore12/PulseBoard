import { Sparkles, BarChart2, Table2, PieChart, Type } from 'lucide-react';
import type { Block } from '../../types/workspace';
import { AISummaryBlock } from '../canvas/AISummaryBlock';
import { AIActions } from '../canvas/AIActions';
import { useWorkspaceStore } from '../../store/workspaceStore';

// ─── Props ────────────────────────────────────────────────────────────────

interface BlockContentProps {
  block: Block;
}

// ─── Block Content Router ─────────────────────────────────────────────────

/**
 * Renders the appropriate inner UI based on block.type.
 * Add new block type cases here as the project grows.
 */
export function BlockContent({ block }: BlockContentProps) {
  switch (block.type) {
    case 'text':
      return <TextBlockContent block={block} />;
    case 'kpi':
      return <KPIBlockContent block={block} />;
    case 'chart':
      return <ChartBlockContent block={block} />;
    case 'table':
      return <TableBlockContent block={block} />;
    case 'ai-summary':
      return <AISummaryBlock block={block} />;
    default:
      return <PlaceholderContent />;
  }
}

// ─── Text Block ───────────────────────────────────────────────────────────

function TextBlockContent({ block }: { block: Block }) {
  const updateBlockData = useWorkspaceStore((state) => state.updateBlockData);

  const content = typeof block.data.content === 'string' ? block.data.content : '';

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // update locally, debounce/suppress network noise
    updateBlockData(block.id, { content: e.target.value }, false, true);
  };

  const handleTextBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // on blur, fire network synchronization gracefully
    updateBlockData(block.id, { content: e.target.value }, false, false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col overflow-hidden mb-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 mb-2">
          <Type size={12} className="text-slate-400" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Text</span>
        </div>
        <textarea
          value={content}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          placeholder="Start typing your content here..."
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag conflict
          className="flex-1 w-full resize-none text-sm leading-relaxed font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500/20 rounded-xl p-3 -ml-1 transition-all outline-none placeholder:text-slate-400 placeholder:font-normal"
        />
      </div>
      {/* AI Actions toolbar — only on text blocks */}
      <AIActions block={block} />
    </div>
  );
}

// ─── KPI Block ────────────────────────────────────────────────────────────

function KPIBlockContent({ block }: { block: Block }) {
  const updateBlockData = useWorkspaceStore((state) => state.updateBlockData);

  const label = typeof block.data.label === 'string' ? block.data.label : 'KPI';
  const value = typeof block.data.value === 'string' ? block.data.value : '';
  const change = typeof block.data.change === 'string' ? block.data.change : '';

  const isPositive = change ? !change.startsWith('-') && !change.startsWith('↓') : true;

  const handleChange = (field: string, val: string) => {
    updateBlockData(block.id, { [field]: val }, false, true);
  };

  const handleBlur = (field: string, val: string) => {
    updateBlockData(block.id, { [field]: val }, false, false);
  };

  return (
    <div className="flex flex-col h-full justify-center space-y-2 pointer-events-auto p-1">
      <div className="flex items-center gap-1.5">
        <PieChart size={14} className="text-indigo-500 shrink-0" />
        <input
          value={label}
          onChange={(e) => handleChange('label', e.target.value)}
          onBlur={(e) => handleBlur('label', e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-xs uppercase tracking-wider font-semibold text-slate-500 bg-transparent border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded flex-1 min-w-0 outline-none px-1.5 py-0.5 -ml-1.5 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
          placeholder="LABEL"
        />
      </div>
      <input
        value={value}
        onChange={(e) => handleChange('value', e.target.value)}
        onBlur={(e) => handleBlur('value', e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none bg-transparent border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded px-1.5 py-1 -ml-1.5 w-full min-w-0 outline-none transition-all placeholder:text-slate-200 dark:placeholder:text-slate-800"
        placeholder="0.00"
      />
      <input
        value={change}
        onChange={(e) => handleChange('change', e.target.value)}
        onBlur={(e) => handleBlur('change', e.target.value)}
        onPointerDown={(e) => e.stopPropagation()}
        className={`text-sm font-medium bg-transparent border border-transparent focus:border-indigo-100 dark:focus:border-indigo-900 focus:bg-slate-50 dark:focus:bg-slate-800/50 rounded px-1.5 py-0.5 -ml-1.5 w-full min-w-0 outline-none transition-all ${
          change 
            ? isPositive ? 'text-green-500' : 'text-red-500' 
            : 'text-slate-400 dark:text-slate-500 italic'
        }`}
        placeholder="Trend (e.g. +12% or -5%)"
      />
    </div>
  );
}

// ─── Chart Block ──────────────────────────────────────────────────────────

function ChartBlockContent({ block }: { block: Block }) {
  const type = typeof block.data.type === 'string' ? block.data.type : 'bar';
  // Mock sparkline bars
  const bars = [40, 65, 50, 80, 55, 90, 70, 85, 60, 95];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart2 size={12} className="text-indigo-500" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          {type} chart
        </span>
      </div>
      <div className="flex-1 flex items-end gap-1 pb-1">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm bg-indigo-400/60 dark:bg-indigo-500/50 transition-all"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Table Block ──────────────────────────────────────────────────────────

function TableBlockContent({ block: _block }: { block: Block }) {
  const rows = [
    ['Product A', '1,234', '↑ 12%'],
    ['Product B', '856', '↓ 3%'],
    ['Product C', '2,100', '↑ 8%'],
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1.5 mb-2">
        <Table2 size={12} className="text-slate-400" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Table</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <table className="w-full text-[11px]">
          <tbody>
            {rows.map(([name, val, chg], i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="py-1 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[70px]">{name}</td>
                <td className="py-1 text-slate-500 dark:text-slate-400 text-right">{val}</td>
                <td className={`py-1 text-right font-semibold ${chg.startsWith('↑') ? 'text-emerald-500' : 'text-rose-500'}`}>{chg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Fallback ─────────────────────────────────────────────────────────────

function PlaceholderContent() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-1">
      <Sparkles size={18} className="text-slate-300 dark:text-slate-600" />
      <p className="text-[11px] text-slate-400 dark:text-slate-500">No preview available</p>
    </div>
  );
}
