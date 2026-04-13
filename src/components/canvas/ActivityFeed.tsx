import { useCollaborationStore } from '../../store/collaborationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

export function ActivityFeed() {
  const activities = useCollaborationStore((state) => state.activities);

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-50 pointer-events-none">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <Activity size={12} className="text-indigo-500" />
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Activity</span>
      </div>
      <div className="flex flex-col gap-2 relative">
        <AnimatePresence initial={false}>
          {activities.map((act) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] leading-tight text-slate-600 dark:text-slate-300 pointer-events-auto"
            >
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{act.userName}</span>{' '}
              {act.action === 'block_added' && 'added a block'}
              {act.action === 'block_moved' && 'moved a block'}
              {act.action === 'block_updated' && 'updated content'}
              {act.action === 'theme_changed' && 'toggled the theme'}
              <span className="text-slate-400 dark:text-slate-500 text-[9px] block mt-0.5">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
