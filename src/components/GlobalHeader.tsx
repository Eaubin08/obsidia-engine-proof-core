import React from 'react';
import { LayoutDashboard, ChevronDown, User, Settings, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface GlobalHeaderProps {
  activeDomain?: string;
  setActiveTab: (tab: string) => void;
}

export function GlobalHeader({ activeDomain, setActiveTab }: GlobalHeaderProps) {
  return (
    <header className="border-b border-zinc-800/50 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-blue-400 to-purple-400 flex items-center justify-center font-bold text-xl text-black transition-transform group-hover:scale-105">
              O
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">OBSIDIENNE</h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Multi-Domain Governance</p>
            </div>
          </div>

          {/* Domain Selector & Stats */}
          <div className="hidden md:flex items-center gap-8">
            {/* Domain Selector Dropdown Placeholder */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>{activeDomain ? activeDomain.charAt(0).toUpperCase() + activeDomain.slice(1) : 'Select Domain'}</span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <div className="p-2">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className="text-lg">📈</span> Trading
                  </button>
                  <button 
                    onClick={() => setActiveTab('banking')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className="text-lg">🏦</span> Banking
                  </button>
                  <button 
                    onClick={() => setActiveTab('ecommerce')}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    <span className="text-lg">🛒</span> E-commerce
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 border-l border-zinc-800 pl-8">
              <div className="text-right">
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Global Score</div>
                <div className="text-lg font-bold text-white">96.4</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
                  <User className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer">
                  <Settings className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
