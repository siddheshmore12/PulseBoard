import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${className}`}
    >
      {children}
    </motion.div>
  );
}
