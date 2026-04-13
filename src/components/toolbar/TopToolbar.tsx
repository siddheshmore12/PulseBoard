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
    <header className="h-[60px] border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0 transition-colors duration-300 shadow-sm">
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
        
        <div className="flex items-center gap-2 ml-2">
          <PresenceUI />
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
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
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-lg transition-all duration-200"
          >
            <Download size={14} /> <span className="hidden sm:inline">Export</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

          <button 
            onClick={handleReset}
            title="Reset Workspace"
            className="flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-lg transition-all duration-200"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
        <ThemeToggle />
      </div>
    </header>
  );
}
