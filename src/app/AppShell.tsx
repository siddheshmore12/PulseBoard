import { TopToolbar } from '../components/toolbar/TopToolbar';
import { BlockLibrarySidebar } from '../components/sidebar/BlockLibrarySidebar';
import { CanvasArea } from '../components/canvas/CanvasArea';
import { useWorkspacePersistence } from '../features/persistence/useWorkspacePersistence';

export function AppShell() {
  useWorkspacePersistence();

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 font-sans">
      <TopToolbar />
      <div className="flex-1 flex overflow-hidden">
        <BlockLibrarySidebar />
        <CanvasArea />
        
        {/* Right Inspector Panel */}
        <aside className="w-72 border-l border-[var(--border)] bg-[var(--background)] flex-col transition-colors duration-300 hidden xl:flex z-10">
          <div className="p-4 border-b border-[var(--border)] backdrop-blur-sm bg-[var(--background)]/80 sticky top-0">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Inspector</h2>
          </div>
          <div className="p-4 flex flex-col items-center justify-center h-full text-center pb-20">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No Selection</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[200px]">
              Select a block on the canvas to configure its layout and properties.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
