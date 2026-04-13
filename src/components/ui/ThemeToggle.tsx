import { useWorkspaceStore } from '../../store/workspaceStore';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export function ThemeToggle() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const toggleTheme = useWorkspaceStore((state) => state.toggleTheme);
  
  const isDark = currentWorkspace?.theme === 'dark';

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-slate-600" />}
    </button>
  );
}
