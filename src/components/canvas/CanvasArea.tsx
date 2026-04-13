import { useWorkspaceStore } from '../../store/workspaceStore';
import { Card } from '../ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { type Block, type LayoutItem } from '../../types/workspace';
import React from 'react';

// Block content type-router (renders per block.type)
import { BlockContent } from './BlockContent';
import { ActivityFeed } from './ActivityFeed';


// PERFORMANCE NOTE: Memoize block rendering. 
// Unaffected blocks seamlessly bypass re-renders because Zustand preserves strict untouched object properties.
const DraggableBlock = React.memo(function DraggableBlock({ block, layoutItem }: { block: Block, layoutItem: LayoutItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  const style = {
    // Inject hardware-accelerated transform matrix locally protecting parent layout frames
    transform: `translate3d(${layoutItem.x + (transform?.x || 0)}px, ${layoutItem.y + (transform?.y || 0)}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className="col-span-6 md:col-span-3 lg:col-span-2 transition-colors touch-none"
    >
      <Card 
        className={`p-5 flex flex-col min-h-48 transition-all cursor-move border-[1.5px] ${isDragging ? 'shadow-xl border-indigo-400 dark:border-indigo-500 scale-[1.02] z-50' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'}`}
      >
        <div className="flex items-center justify-between mb-4 pointer-events-none">
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 tracking-tight text-sm truncate max-w-[160px]">
            {block.title || `Block (${block.type})`}
          </h3>
          <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-md">
            {block.type}
          </span>
        </div>
        
        {/* pointer-events-auto ensures AI action buttons remain clickable */}
        <div className="flex-1 pointer-events-auto">
          <BlockContent block={block} />
        </div>
      </Card>
    </div>
  );
});


export function CanvasArea() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const updateBlockPosition = useWorkspaceStore((state) => state.updateBlockPosition);

  if (!currentWorkspace) {
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
      const layoutItem = currentWorkspace.layout.find((l) => l.blockId === active.id);
      if (layoutItem) {
        // Sync new drag position accurately mapped to original Zustand store
        updateBlockPosition(active.id as string, layoutItem.x + delta.x, layoutItem.y + delta.y);
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
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{currentWorkspace.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                {currentWorkspace.blocks.length} block{currentWorkspace.blocks.length !== 1 && 's'}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize">{currentWorkspace.theme} mode</span>
            </div>
          </motion.div>

          {currentWorkspace.blocks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white/50 dark:bg-slate-900/20">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Your canvas is empty. Add a block from the sidebar to begin.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-6 gap-6">
              <AnimatePresence>
                {currentWorkspace.blocks.map((block) => {
                  // Fallback ensures no blocks crash natively if layout bindings split unexpectedly
                  const layoutItem = currentWorkspace.layout.find(l => l.blockId === block.id) || { blockId: block.id, x: 0, y: 0, w: 3, h: 3 };
                  return <DraggableBlock key={block.id} block={block} layoutItem={layoutItem} />;
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      <ActivityFeed />
    </DndContext>
  );
}
