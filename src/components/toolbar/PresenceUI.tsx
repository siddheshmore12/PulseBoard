import { useCollaborationStore } from '../../store/collaborationStore';
import { motion, AnimatePresence } from 'framer-motion';

export function PresenceUI() {
  const onlineUsers = useCollaborationStore((state) => state.onlineUsers);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2.5 hover:space-x-0.5 transition-all duration-300">
      <AnimatePresence>
        {onlineUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white dark:ring-[#0b1120] shadow-sm relative transition-all duration-200 z-0 hover:z-10 cursor-default ${user.color}`}
            title={`${user.name} (${user.status})`}
          >
            {user.name.charAt(0).toUpperCase()}
            {user.status === 'editing' ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 ring-2 ring-white dark:ring-[#0b1120] rounded-full animate-pulse" />
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 ring-2 ring-white dark:ring-[#0b1120] rounded-full" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
