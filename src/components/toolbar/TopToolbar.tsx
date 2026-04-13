import { useWorkspaceStore } from '../../store/workspaceStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Layout, Download, Upload, RotateCcw } from 'lucide-react';
import { useRef } from 'react';

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
      resetWorkspace();
      localStorage.removeItem('pulseboard_workspace');
    }
  };

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--background)] flex items-center justify-between px-4 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-sm">
          <Layout size={18} />
        </div>
        <h1 className="font-semibold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-indigo-700 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-500">Pulseboard</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {currentWorkspace && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-md hidden md:inline-block">
            {currentWorkspace.name}
          </span>
        )}
        
        <div className="flex items-center gap-1.5 ml-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
          >
            <Download size={14} /> <span className="hidden sm:inline">Export</span>
          </button>

          <button 
            onClick={handleReset}
            title="Reset Workspace"
            className="flex items-center justify-center p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-md transition-colors ml-1"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        <ThemeToggle />
      </div>
    </header>
  );
}
