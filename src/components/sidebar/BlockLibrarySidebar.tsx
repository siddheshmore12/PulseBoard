import { motion } from 'framer-motion';
import { Type, BarChart, PieChart, Table, Sparkles } from 'lucide-react';

const availableBlocks = [
  { type: "text", label: "Text Block", icon: <Type size={18} /> },
  { type: "chart", label: "Chart", icon: <BarChart size={18} /> },
  { type: "kpi", label: "KPI Metric", icon: <PieChart size={18} /> },
  { type: "table", label: "Data Table", icon: <Table size={18} /> },
  { type: "ai-summary", label: "AI Summary", icon: <Sparkles size={18} className="text-indigo-500" /> },
];

export function BlockLibrarySidebar() {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--background)] flex flex-col overflow-y-auto transition-colors duration-300">
      <div className="p-4 border-b border-[var(--border)]">
        <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Block Library</h2>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {availableBlocks.map((block) => (
          <motion.div
            key={block.type}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 cursor-pointer shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 group"
          >
            <div className="text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {block.icon}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">{block.label}</span>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
