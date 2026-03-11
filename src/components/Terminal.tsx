import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface TerminalProps {
  isOpen: boolean;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onClose: () => void;
  onRunTest: () => void;
  onAddLog: (msg: string) => void;
  logs: string[];
  testStatus: 'IDLE' | 'RUNNING' | 'COMPLETED';
}

export function Terminal({ isOpen, isMaximized, onToggleMaximize, onClose, onRunTest, onAddLog, logs, testStatus }: TerminalProps) {
  const [command, setCommand] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    // Add command to logs via parent callback
    onAddLog(`$ ${cmd}`);
    
    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd === 'npm test' || lowerCmd === 'vitest') {
      onRunTest();
    } else if (lowerCmd === 'clear') {
      onAddLog('Terminal cleared.');
    } else if (lowerCmd === 'help') {
      onAddLog('Available commands: npm test, clear, help');
    } else {
      onAddLog(`Command not found: ${cmd}`);
    }
    
    setCommand('');
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] bg-black border-t border-zinc-800 transition-all duration-300 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)]",
      isMaximized ? "h-[90vh] sm:h-[85vh]" : "h-[350px]"
    )}>
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-emerald-500">
            <TerminalIcon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Akaton Validation Shell</span>
          </div>
          <div className="hidden sm:flex gap-4">
            {['Output', 'Debug Console', 'Terminal', 'Problems'].map((tab) => (
              <button 
                key={tab}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest pb-1 border-b-2 transition-all",
                  tab === 'Terminal' ? "text-white border-emerald-500" : "text-zinc-600 border-transparent hover:text-zinc-400"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={onToggleMaximize}
            className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-white transition-all"
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-md text-red-500 transition-all border border-red-500/20"
            title="Close Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar bg-black/50"
      >
        {logs.length === 0 ? (
          <div className="text-zinc-700">
            <p>Obsidia Governance Shell v1.0.5</p>
            <p className="mt-1">Type 'npm test' to start the governance validation suite.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, i) => (
              <div key={i} className={cn(
                "flex gap-4",
                log.includes('PASS') || log.includes('✓') ? "text-emerald-400" :
                log.includes('FAIL') || log.includes('BLOCK') ? "text-red-400" :
                log.includes('HOLD') || log.includes('WARNING') ? "text-amber-400" :
                log.startsWith('$') ? "text-zinc-200 font-bold" :
                "text-zinc-500"
              )}>
                {log && log.startsWith('$') ? (
                  <span className="text-emerald-500 shrink-0">user@obsidia:~/gov$</span>
                ) : (
                  <span className="opacity-30 select-none shrink-0 w-4 text-right">{i + 1}</span>
                )}
                <span className="whitespace-pre-wrap">{log ? log.replace(/^\$ /, '') : ''}</span>
              </div>
            ))}
            {testStatus === 'RUNNING' && (
              <div className="flex gap-4 text-emerald-400 animate-pulse">
                <span className="opacity-30 select-none w-4 text-right">{logs.length + 1}</span>
                <span>_</span>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleCommand} className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
        <button type="submit" className="p-1 hover:bg-zinc-800 rounded transition-colors group">
          <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
        </button>
        <input 
          type="text" 
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="npm test"
          className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-800 text-xs font-mono"
          autoFocus
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </div>
  );
}
