import React from 'react';
import { 
  Shield, 
  Eye, 
  Activity, 
  Gavel, 
  FileText, 
  Menu,
  X,
  Settings,
  Database,
  Lock,
  Terminal as TerminalIcon,
  UserPlus,
  Wallet,
  Zap,
  Award,
  Trophy,
  LayoutDashboard,
  Landmark,
  ShoppingCart,
  BarChart3,
  Search,
  History,
  Coins,
  BookOpen,
  Beaker
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: 'FIX' | 'AUTO';
  setMode: (mode: 'FIX' | 'AUTO') => void;
  selectedScenario: string;
  setSelectedScenario: (id: string) => void;
  isTerminalOpen: boolean;
  onToggleTerminal: () => void;
}

const scenarios = [
  { id: 'scenario_1_block_low_coherence', label: 'BLOCK: Low Coherence', outcome: 'BLOCK' },
  { id: 'scenario_2_hold_x108', label: 'HOLD: X-108 Timer', outcome: 'HOLD' },
  { id: 'scenario_3_execute_pass', label: 'EXECUTE: All Pass', outcome: 'EXECUTE' },
  { id: 'scenario_4_block_destructive_sim', label: 'BLOCK: Destructive Sim', outcome: 'BLOCK' },
  { id: 'scenario_5_execute_reversible', label: 'EXECUTE: Reversible', outcome: 'EXECUTE' },
];

const tradingSteps = [
  { id: 'dashboard', label: 'Trading Dashboard', icon: LayoutDashboard },
  { id: 'step1', label: '1. Agent Registry', icon: UserPlus },
  { id: 'step2', label: '2. Capital Vault', icon: Wallet },
  { id: 'step3', label: '3. Risk Router', icon: Zap },
  { id: 'step4', label: '4. Trust Signals', icon: Award },
  { id: 'step5', label: '5. Leaderboard', icon: Trophy },
  { id: 'trading_tests', label: 'Automated Tests', icon: Beaker },
  { id: 'os4', label: 'AI Audit Reports', icon: FileText },
];

const bankingSteps = [
  { id: 'banking', label: 'Banking Dashboard', icon: Landmark },
  { id: 'banking_transactions', label: 'Transactions', icon: History },
  { id: 'banking_metrics', label: 'Risk Metrics', icon: BarChart3 },
  { id: 'banking_tests', label: 'Ontological Tests', icon: Search },
];

const ecommerceSteps = [
  { id: 'ecommerce', label: 'E-commerce Monitor', icon: ShoppingCart },
  { id: 'ecommerce_temporal', label: 'Temporal Lock', icon: Lock },
  { id: 'ecommerce_tokenomics', label: '$X108 Tokenomics', icon: Coins },
  { id: 'ecommerce_moltbook', label: 'Moltbook Feed', icon: BookOpen },
];

export function Sidebar({ 
  isOpen, 
  setIsOpen, 
  activeTab, 
  setActiveTab,
  mode,
  setMode,
  selectedScenario,
  setSelectedScenario,
  isTerminalOpen,
  onToggleTerminal
}: SidebarProps) {
  const getActiveDomain = () => {
    if (['dashboard', 'step1', 'step2', 'step3', 'step4', 'step5', 'os4', 'trading_tests'].includes(activeTab)) return 'trading';
    if (activeTab.startsWith('banking')) return 'banking';
    if (activeTab.startsWith('ecommerce')) return 'ecommerce';
    return 'trading';
  };

  const domain = getActiveDomain();

  const navItems = domain === 'trading' ? tradingSteps : domain === 'banking' ? bankingSteps : ecommerceSteps;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800/50 text-zinc-300 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] lg:translate-x-0 lg:static lg:h-full flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              {domain === 'trading' ? <Database className="w-5 h-5 text-emerald-400" /> : domain === 'banking' ? <Landmark className="w-5 h-5 text-blue-400" /> : <ShoppingCart className="w-5 h-5 text-purple-400" />}
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tighter uppercase italic tracking-widest">
                {domain.toUpperCase()}
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {/* Mode Switcher (Only for Trading) */}
          {domain === 'trading' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-3">
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Operation Mode</div>
                <div className="group relative">
                  <Shield className="w-3 h-3 text-zinc-600 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-48 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] text-zinc-400 invisible group-hover:visible z-50 shadow-xl">
                    <p className="font-bold text-white mb-1">FIX: Manual Scenarios</p>
                    <p className="mb-2">Test specific governance outcomes manually.</p>
                    <p className="font-bold text-white mb-1">AUTO: Guided Workflow</p>
                    <p>Follow the official Akaton Hackathon progression.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                <button 
                  onClick={() => setMode('FIX')}
                  className={cn(
                    "py-1.5 text-[10px] font-bold rounded-md transition-all duration-300",
                    mode === 'FIX' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  FIX
                </button>
                <button 
                  onClick={() => setMode('AUTO')}
                  className={cn(
                    "py-1.5 text-[10px] font-bold rounded-md transition-all duration-300",
                    mode === 'AUTO' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  AUTO
                </button>
              </div>
            </div>
          )}

          {/* Scenarios (Only in FIX mode for Trading) */}
          {domain === 'trading' && mode === 'FIX' && (
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-3">Proof Scenarios</div>
              <div className="space-y-1.5">
                {scenarios.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenario(s.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-300 border",
                      selectedScenario === s.id 
                        ? "bg-zinc-800/50 border-zinc-700 text-white" 
                        : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30"
                    )}
                  >
                    <span className="text-xs font-medium">{s.label}</span>
                    <span className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 rounded border",
                      s.outcome === 'BLOCK' ? "text-red-400 border-red-500/20 bg-red-500/5" :
                      s.outcome === 'HOLD' ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                      "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                    )}>
                      {s.outcome}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] px-3">Navigation</div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left group border",
                      isActive 
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                        : "hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 border-transparent"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 transition-transform duration-300 group-hover:scale-110", isActive ? "text-emerald-400" : "text-zinc-600 group-hover:text-zinc-400")} />
                    <div className={cn("text-xs font-bold tracking-tight", isActive ? "text-emerald-400" : "text-zinc-300")}>
                      {item.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-800/30 space-y-4">
          <button 
            onClick={onToggleTerminal}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border",
              isTerminalOpen ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700"
            )}
          >
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </button>
          <div className="bg-zinc-900/50 rounded-2xl p-5 border border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-[10px] font-bold text-white mb-4 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              Node Status
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 tracking-wider">
                <span>REPUTATION SCORE</span>
                <span className="text-emerald-400">96.4</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[96%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
