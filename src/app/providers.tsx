import { type ReactNode, useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';

export function Providers({ children }: { children: ReactNode }) {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);

  useEffect(() => {
    if (currentWorkspace?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentWorkspace?.theme]);

  return <>{children}</>;
}
