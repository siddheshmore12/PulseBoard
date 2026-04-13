import React, { Suspense } from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { type Block } from '../../types/workspace';

// 1. PERFORMANCE NOTE: Lazy loading heavier components 
const LazyBlockContent = React.lazy(() => import('../ui/LazyBlockContent'));

// 2. PERFORMANCE NOTE: Memoize block rendering to prevent cascade re-renders
const DraggableBlock = React.memo(function DraggableBlock({ block }: { block: Block }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  // 3. PERFORMANCE NOTE: Select precise layout coordinates natively without subscribing to entire store object
  const layoutX = useWorkspaceStore(state => state.currentWorkspace?.layout.find(l => l.blockId === block.id)?.x || 0);
  const layoutY = useWorkspaceStore(state => state.currentWorkspace?.layout.find(l => l.blockId === block.id)?.y || 0);

  const style = {
    transform: `translate3d(${layoutX + (transform?.x || 0)}px, ${layoutY + (transform?.y || 0)}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className="col-span-6 md:col-span-3 lg:col-span-2 transition-colors touch-none"
    >
      <Card 
        className={`p-5 flex flex-col h-48 transition-all cursor-move border-[1.5px] ${isDragging ? 'shadow-xl border-indigo-400 dark:border-indigo-500 scale-[1.02] z-50' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'}`}
      >
        <div className="flex items-center justify-between mb-4 pointer-events-none">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight text-sm">
            {block.title || `Block (${block.type})`}
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md">
            {block.type}
          </span>
        </div>
        
        <Suspense fallback={<Skeleton className="w-full h-full opacity-60" />}>
          <LazyBlockContent />
        </Suspense>
      </Card>
    </motion.div>
  );
});

export function CanvasArea() {
  // 4. PERFORMANCE NOTE: Using specific primitive field selectors
  // Prevents CanvasArea from re-rendering just because a single layout item changes internally during drag
  const workspaceId = useWorkspaceStore((state) => state.currentWorkspace?.id);
  const workspaceName = useWorkspaceStore((state) => state.currentWorkspace?.name);
  const workspaceTheme = useWorkspaceStore((state) => state.currentWorkspace?.theme);
  const blocks = useWorkspaceStore((state) => state.currentWorkspace?.blocks);

  if (!workspaceId || !blocks) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-200 dark:border-slate-700/50">
             <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
             </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2 tracking-tight">No Workspace Loaded</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed">
            Create a new workspace or import an existing JSON configuration file to get started with Pulseboard.
          </p>
        </motion.div>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;
    if (delta.x !== 0 || delta.y !== 0) {
      // Pull state manually bypassing React subscription to avoid global cascading diffs
      const currentWorkspace = useWorkspaceStore.getState().currentWorkspace;
      if (!currentWorkspace) return;
      const layoutItem = currentWorkspace.layout.find((l) => l.blockId === active.id);
      if (layoutItem) {
        useWorkspaceStore.getState().updateBlockPosition(active.id as string, layoutItem.x + delta.x, layoutItem.y + delta.y);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex-1 bg-slate-50/50 dark:bg-[#0b1120] overflow-y-auto p-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{workspaceName}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                {blocks.length} block{blocks.length !== 1 && 's'}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{workspaceTheme} mode</span>
            </div>
          </motion.div>

          {blocks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white/50 dark:bg-slate-900/20">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your canvas is empty. Add a block from the sidebar to begin.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-6 gap-6">
              <AnimatePresence>
                {blocks.map((block) => {
                  return <DraggableBlock key={block.id} block={block} />;
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </DndContext>
  );
}
