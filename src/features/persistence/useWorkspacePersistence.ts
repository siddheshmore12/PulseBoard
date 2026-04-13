import { useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../store/workspaceStore';

const STORAGE_KEY = 'pulseboard_workspace';
const DEBOUNCE_MS = 400;

export function useWorkspacePersistence() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const initialized = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // 1. Load on startup
  useEffect(() => {
    if (initialized.current) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setWorkspace(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load workspace from local storage", e);
    } finally {
      initialized.current = true;
    }
  }, [setWorkspace]);

  // 2. Save on changes (Debounced)
  useEffect(() => {
    // Only save after initial load has finished
    if (!initialized.current || !currentWorkspace) return;

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWorkspace));
        console.log("Workspace seamlessly auto-saved");
      } catch (e) {
        console.error("Failed to save workspace to local storage", e);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [currentWorkspace]);
}
