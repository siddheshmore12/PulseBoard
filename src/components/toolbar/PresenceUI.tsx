import { useCollaborationStore } from '../../store/collaborationStore';
import { motion, AnimatePresence } from 'framer-motion';

export function PresenceUI() {
  const onlineUsers = useCollaborationStore((state) => state.onlineUsers);

  if (onlineUsers.length === 0) return null;

  return (
    <div className="flex items-center space-x-[-8px]">
      <AnimatePresence>
        {onlineUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-[var(--background)] shadow-sm relative ${user.color}`}
            title={`${user.name} (${user.status})`}
          >
            {user.name.charAt(0).toUpperCase()}
            {user.status === 'editing' && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[var(--background)] rounded-full animate-pulse" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
