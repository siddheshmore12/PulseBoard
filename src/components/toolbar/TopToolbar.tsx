import { useWorkspaceStore } from '../../store/workspaceStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Layout, Download, Upload, RotateCcw } from 'lucide-react';
import { useRef } from 'react';
import { PresenceUI } from './PresenceUI';

export function TopToolbar() {
  const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
  const resetWorkspace = useWorkspaceStore((state) => state.resetWorkspace);
  const setWorkspace = useWorkspaceStore((state) => state.setWorkspace);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (!currentWorkspace) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentWorkspace, null, 2));
    const domNode = document.createElement('a');
    domNode.setAttribute("href", dataStr);
    domNode.setAttribute("download", `pulseboard_${currentWorkspace.id}.json`);
    document.body.appendChild(domNode);
    domNode.click();
    domNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.id && parsed.blocks && parsed.layout) {
          setWorkspace(parsed);
        } else {
          alert('Invalid workspace JSON file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the workspace? This will delete all custom blocks.')) {
      localStorage.removeItem('pulseboard_workspace');
      resetWorkspace();
      window.location.reload();
    }
  };

  return (
    <header className="h-[56px] border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-6 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
        <div className="bg-[var(--foreground)] text-[var(--background)] p-1.5 rounded-lg shadow-sm">
          <Layout size={16} />
        </div>
        <h1 className="font-semibold text-lg tracking-tight text-[var(--foreground)]">Pulseboard</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {currentWorkspace && (
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2.5 py-1 hidden md:inline-block">
            {currentWorkspace.name}
          </span>
        )}
        
        <div className="flex items-center gap-2 ml-2">
          <PresenceUI />
          <div className="h-4 w-px bg-[var(--border)] mx-2 hidden sm:block"></div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-[#111] rounded-lg transition-all duration-200"
          >
            <Upload size={14} /> <span className="hidden sm:inline">Import</span>
          </button>
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport} 
          />
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-[#111] rounded-lg transition-all duration-200"
          >
            <Download size={14} /> <span className="hidden sm:inline">Export</span>
          </button>

          <div className="h-4 w-px bg-[var(--border)] mx-1 hidden sm:block"></div>

          <button 
            onClick={handleReset}
            title="Reset Workspace"
            className="flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        <div className="h-4 w-px bg-[var(--border)] mx-2"></div>
        <ThemeToggle />
      </div>
    </header>
  );
}
