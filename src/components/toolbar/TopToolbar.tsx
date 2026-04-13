import { useWorkspaceStore } from '../../store/workspaceStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Layout } from 'lucide-react';

export function TopToolbar() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-4 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
          <Layout size={18} />
        </div>
        <h1 className="font-semibold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-500">Pulseboard</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {currentWorkspace && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
            {currentWorkspace.name}
          </span>
        )}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
        <ThemeToggle />
      </div>
    </header>
  );
}
