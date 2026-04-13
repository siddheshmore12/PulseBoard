import { useCollaborationStore } from '../../store/collaborationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

export function ActivityFeed() {
  const activities = useCollaborationStore((state) => state.activities);

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 w-64 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3 z-50 pointer-events-none transition-colors">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <Activity size={11} className="text-indigo-500" />
        <span className="text-[9px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 opacity-80">Activity</span>
      </div>
      <div className="flex flex-col gap-1.5 relative">
        <AnimatePresence initial={false}>
          {activities.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-xs leading-tight text-slate-600 dark:text-slate-300 pointer-events-auto bg-white/60 dark:bg-slate-800/60 px-2.5 py-2 rounded-lg border border-slate-100/80 dark:border-slate-700/50 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{act.userName}</span>{' '}
                  <span className="opacity-90">
                    {act.action === 'block_added' && 'added a block'}
                    {act.action === 'block_moved' && 'moved a block'}
                    {act.action === 'block_updated' && 'updated content'}
                    {act.action === 'theme_changed' && 'toggled the theme'}
                  </span>
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[9px] font-medium shrink-0">
                  {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
