import React from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  Wallet, 
  Zap, 
  Award, 
  Trophy, 
  ArrowRight, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Cpu,
  Database,
  Lock,
  Globe,
  BarChart3,
  Scale
} from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const steps = [
    { 
      id: 'step1', 
      title: 'Agent Registry', 
      desc: 'Mint ERC-721 Agent Identity', 
      icon: UserPlus, 
      status: 'COMPLETED',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    { 
      id: 'step2', 
      title: 'Capital Vault', 
      desc: 'Claim $10k Sandbox Funds', 
      icon: Wallet, 
      status: 'READY',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    { 
      id: 'step3', 
      title: 'Risk Router', 
      desc: 'Execute EIP-712 Trade Intents', 
      icon: Zap, 
      status: 'LOCKED',
      color: 'text-zinc-500',
      bg: 'bg-zinc-900'
    },
    { 
      id: 'step4', 
      title: 'Trust Signals', 
      desc: 'Validation Registry Logs', 
      icon: Award, 
      status: 'LOCKED',
      color: 'text-zinc-500',
      bg: 'bg-zinc-900'
    },
    { 
      id: 'step5', 
      title: 'Leaderboard', 
      desc: 'Live PnL & Trust Rankings', 
      icon: Trophy, 
      status: 'LOCKED',
      color: 'text-zinc-500',
      bg: 'bg-zinc-900'
    },
  ];

  return (
    <div className="space-y-10 pb-20">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Dashboard" 
        progress={20}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900/40 border border-zinc-800/50 p-8 md:p-12">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <ShieldCheck className="w-64 h-64 text-emerald-500" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Activity className="w-3 h-3" />
            Akaton Hackathon Live
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic mb-6 leading-none">
            Obsidia <span className="text-emerald-500">Governance</span> OS
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Welcome to the Akaton Validation Suite. Follow the 5-step workflow to register your agent, claim capital, and execute trades under ERC-8004 governance.
          </p>
          <button 
            onClick={() => setActiveTab('step1')}
            className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-emerald-400 transition-all"
          >
            Start Registration
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.button
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveTab(step.id)}
            className="group relative flex flex-col items-start p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all text-left"
          >
            <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform`}>
              <step.icon className={`w-6 h-6 ${step.color}`} />
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white tracking-tight">{step.title}</h3>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">{step.desc}</p>
            </div>

            <div className="w-full pt-4 border-t border-zinc-800/50 flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-widest uppercase ${
                step.status === 'COMPLETED' ? 'text-emerald-400' : 
                step.status === 'READY' ? 'text-blue-400' : 'text-zinc-600'
              }`}>
                {step.status}
              </span>
              {step.status === 'LOCKED' && (
                <span className="text-[8px] text-zinc-700 uppercase font-bold">Complete Prev Step</span>
              )}
              <div className="flex gap-1">
                {[1, 2, 3].map((dot) => (
                  <div key={dot} className={`w-1 h-1 rounded-full ${i >= dot - 1 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                ))}
              </div>
            </div>
          </motion.button>
        ))}

        {/* Akaton Audit Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => setActiveTab('os4')}
          className="group relative flex flex-col items-start p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl hover:border-blue-500/40 transition-all text-left lg:col-span-1"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white tracking-tight">AI Audit Engine</h3>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-sm text-blue-400/60 leading-relaxed mb-4">Run real-time Akaton validation tests and generate compliance reports.</p>
          </div>
          <div className="w-full pt-4 border-t border-blue-500/10 flex items-center justify-between">
            <span className="text-[10px] font-black tracking-widest uppercase text-blue-400">System Ready</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
            </div>
          </div>
        </motion.button>
      </div>
      {/* Tech Stack Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase px-2">
          <Cpu className="w-3 h-3" />
          Core Technology Stack
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Database, label: 'ERC-8004', desc: 'Registry Standard' },
            { icon: Lock, label: 'EIP-712', desc: 'Typed Signatures' },
            { icon: Globe, label: 'L2/Testnet', desc: 'Arbitrum/Sepolia' },
            { icon: Scale, label: 'EIP-1271', desc: 'Smart Wallets' },
            { icon: Zap, label: 'Risk Router', desc: 'Limit Enforcer' },
            { icon: ShieldCheck, label: 'TEE/zkML', desc: 'Proofs (Optional)' },
            { icon: BarChart3, label: 'Subgraphs', desc: 'Indexers (Optional)' },
            { icon: Activity, label: 'EIP-155', desc: 'Chain-ID Binding' },
          ].map((tech, i) => (
            <div key={i} className="p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl flex flex-col items-center text-center group hover:bg-zinc-800/50 transition-colors">
              <tech.icon className="w-5 h-5 text-zinc-600 mb-3 group-hover:text-emerald-400 transition-colors" />
              <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{tech.label}</div>
              <div className="text-[9px] text-zinc-600 uppercase font-bold">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Manifesto Section */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-emerald-500" />
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-tight italic">The ERC-8004 Standard</h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">
            Obsidia is the first implementation of <span className="text-white font-bold italic">ERC-8004</span>, a standard for <span className="text-emerald-400 font-bold">Autonomous Agent Governance</span>. It ensures that AI agents operating in financial markets remain within human-defined safety boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}
