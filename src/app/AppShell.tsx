import { TopToolbar } from '../components/toolbar/TopToolbar';
import { BlockLibrarySidebar } from '../components/sidebar/BlockLibrarySidebar';
import { CanvasArea } from '../components/canvas/CanvasArea';

export function AppShell() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 font-sans">
      <TopToolbar />
      <div className="flex-1 flex overflow-hidden">
        <BlockLibrarySidebar />
        <CanvasArea />
        
        {/* Right Inspector Panel */}
        <aside className="w-72 border-l border-[var(--border)] bg-[var(--background)] flex flex-col transition-colors duration-300 hidden lg:flex">
          <div className="p-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Inspector</h2>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 p-6 border border-dashed border-slate-300 dark:border-slate-700/80 rounded-lg bg-slate-50 dark:bg-slate-900/30 text-center leading-relaxed">
              Select a block on the canvas to inspect and edit its properties.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
