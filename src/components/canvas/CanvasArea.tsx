import { useWorkspaceStore } from '../../store/workspaceStore';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';
import { DndContext, useDraggable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { type Block, type LayoutItem } from '../../types/workspace';

function DraggableBlock({ block, layoutItem }: { block: Block, layoutItem: LayoutItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: block.id,
  });

  const style = {
    // Native coordinate system shifts for free dragging
    transform: `translate3d(${layoutItem.x + (transform?.x || 0)}px, ${layoutItem.y + (transform?.y || 0)}px, 0)`,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes} 
      className="col-span-6 md:col-span-3 transition-colors touch-none"
    >
      <Card 
        className={`p-6 flex flex-col h-48 transition-shadow cursor-move ${isDragging ? 'shadow-xl ring-2 ring-indigo-500/50' : 'hover:shadow-md'}`}
      >
        <div className="flex items-center justify-between mb-3 pointer-events-none">
          <h3 className="font-medium text-slate-800 dark:text-slate-200">
            {block.title || `Block (${block.type})`}
          </h3>
          <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {block.type}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800/80 rounded-lg bg-slate-50/50 dark:bg-slate-900/20 pointer-events-none">
          <span className="text-sm text-slate-400 font-medium">Content Placeholder</span>
        </div>
      </Card>
    </div>
  );
}

export function CanvasArea() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const updateBlockPosition = useWorkspaceStore((state) => state.updateBlockPosition);

  if (!currentWorkspace) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300">
        <p className="text-slate-400">No workspace loaded.</p>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;
    if (delta.x !== 0 || delta.y !== 0) {
      const layoutItem = currentWorkspace.layout.find((l) => l.blockId === active.id);
      if (layoutItem) {
        // Commits final drop coordinates back to local Zustand layout state
        updateBlockPosition(active.id as string, layoutItem.x + delta.x, layoutItem.y + delta.y);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="flex-1 bg-slate-50 dark:bg-[#0b1120] overflow-y-auto p-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{currentWorkspace.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30">
                {currentWorkspace.blocks.length} blocks
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">Theme: {currentWorkspace.theme}</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-6 gap-6">
            {currentWorkspace.blocks.map((block) => {
              const layoutItem = currentWorkspace.layout.find(l => l.blockId === block.id) || { blockId: block.id, x: 0, y: 0, w: 3, h: 3 };
              return <DraggableBlock key={block.id} block={block} layoutItem={layoutItem} />;
            })}
          </div>
        </div>
      </main>
    </DndContext>
  );
}
