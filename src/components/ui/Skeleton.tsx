import { motion } from 'framer-motion';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1.2,
        ease: "easeInOut"
      }}
      className={`bg-slate-200 dark:bg-slate-800 rounded-md ${className}`}
    />
  );
}
