import { Sparkles, BarChart2, Table2, PieChart, Type } from 'lucide-react';
import type { Block } from '../../types/workspace';
import { AISummaryBlock } from '../canvas/AISummaryBlock';
import { AIActions } from '../canvas/AIActions';

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
  const content =
    typeof block.data.content === 'string'
      ? block.data.content
      : 'Click AI actions below to generate or rewrite content.';

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-1.5 mb-2">
          <Type size={12} className="text-slate-400" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Text</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-4">
          {content}
        </p>
      </div>
      {/* AI Actions toolbar — only on text blocks */}
      <AIActions block={block} />
    </div>
  );
}

// ─── KPI Block ────────────────────────────────────────────────────────────

function KPIBlockContent({ block }: { block: Block }) {
  const value = typeof block.data.value === 'string' ? block.data.value : '—';
  const change = typeof block.data.change === 'string' ? block.data.change : null;
  const isPositive = change ? !change.startsWith('-') : true;

  return (
    <div className="flex flex-col h-full justify-center gap-1">
      <div className="flex items-center gap-1.5">
        <PieChart size={13} className="text-indigo-500" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">KPI</span>
      </div>
      <span className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-none mt-1">
        {value}
      </span>
      {change && (
        <span className={`text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '↑' : '↓'} {change}
        </span>
      )}
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
