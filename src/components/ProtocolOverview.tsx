import React from 'react';
import { Shield, Target, Cpu, Scale, Info } from 'lucide-react';

interface ProtocolOverviewProps {
  mode: 'FIX' | 'AUTO';
  selectedScenario: number;
}

export function ProtocolOverview({ mode, selectedScenario }: ProtocolOverviewProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Shield className="w-64 h-64 text-emerald-500" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-4">
          <Info className="w-3 h-3" />
          Protocol Manifesto
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-6">The ERC-8004 Standard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-zinc-400 leading-relaxed">
              Obsidia is the first implementation of <span className="text-white font-bold italic">ERC-8004</span>, a standard for <span className="text-emerald-400 font-bold">Autonomous Agent Governance</span>. It ensures that AI agents operating in financial markets remain within human-defined safety boundaries.
            </p>
            <div className="flex items-start gap-4 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
              <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">Core Objective</div>
                <div className="text-xs text-zinc-500 leading-relaxed">
                  {mode === 'FIX' 
                    ? `Testing scenario ${selectedScenario}: Enforcing mathematical invariants (OS0) before any execution (OS3).`
                    : "Autonomous Mode: Continuous real-time monitoring and governance of agent intents."
                  }
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Cpu, label: 'Autonomous', desc: 'Self-executing logic' },
              { icon: Shield, label: 'Immutable', desc: 'On-chain invariants' },
              { icon: Scale, label: 'Compliant', desc: 'Audit-ready reports' },
              { icon: Target, label: 'Precise', desc: 'Real-time simulation' },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-zinc-800/30 rounded-2xl border border-white/5">
                <item.icon className="w-4 h-4 text-zinc-500 mb-2" />
                <div className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{item.label}</div>
                <div className="text-[10px] text-zinc-600 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
