import React from 'react';
import { ChevronRight, Share2, Download, Settings, Play } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModuleHeaderProps {
  moduleName: string;
  moduleIcon: string;
  currentPage: string;
  progress?: number;
  onRun?: () => void;
  showRunButton?: boolean;
}

export function ModuleHeader({ 
  moduleName, 
  moduleIcon, 
  currentPage, 
  progress,
  onRun,
  showRunButton = false
}: ModuleHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800/50">
      <div>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
          <span className="hover:text-white cursor-pointer transition-colors">Dashboard</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400">{moduleName}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{currentPage}</span>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shadow-2xl">
            {moduleIcon}
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
              {moduleName} <span className="text-zinc-500">—</span> {currentPage}
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1 tracking-wider uppercase">
              ERC-8004 Governance Pipeline v1.0.5
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {progress !== undefined && (
          <div className="hidden lg:flex items-center gap-4 mr-6 px-6 py-2 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="text-right">
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Pipeline Progress</div>
              <div className="text-sm font-black text-white italic">{progress}%</div>
            </div>
            <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {showRunButton && (
          <button 
            onClick={onRun}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            Run Validation
          </button>
        )}
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
