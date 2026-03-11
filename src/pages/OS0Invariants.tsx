import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface OS0Props {
  mode: 'FIX' | 'AUTO';
  selectedScenario: number;
}

export function OS0Invariants({ mode, selectedScenario }: OS0Props) {
  const scenarioLabels = [
    'BLOCK: Low Coherence',
    'HOLD: X-108 Timer',
    'EXECUTE: All Pass',
    'BLOCK: Destructive Sim',
    'EXECUTE: Reversible'
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            <Shield className="w-3 h-3" />
            Governance Foundation
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">OS0 - Invariants</h1>
          <p className="text-zinc-500 mt-3 text-lg max-w-2xl font-medium leading-relaxed">
            The non-negotiable laws of the Obsidia ecosystem. These rules are hardcoded into the execution environment and cannot be bypassed by any agent.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase">CONSTITUTIONAL_INTEGRITY: 100%</span>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/50 px-4 py-2 rounded-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">UPTIME: 99.99%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 hover:bg-zinc-900/60 hover:border-red-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-24 h-24 text-red-500" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase italic">BLOCK &gt; HOLD &gt; ALLOW</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            The fundamental hierarchy of governance. A BLOCK signal from any gate immediately terminates the process. A HOLD signal pauses it. ALLOW is only granted if all gates pass.
          </p>
        </div>

        <div className="group bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 hover:bg-zinc-900/60 hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-amber-500" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
            <Clock className="w-7 h-7 text-amber-400" />
          </div>
          <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase italic">X-108 Temporal Lock</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Mandatory cooling-off period for high-impact decisions. Prevents impulsive actions during high market volatility or anomalous system states.
          </p>
        </div>

        <div className="group bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-xl font-black text-white mb-4 tracking-tight uppercase italic">Absolute Traceability</h3>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium">
            Every observation, simulation, and gate decision must be cryptographically logged before an ERC-8004 intent can be generated.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="border-b border-zinc-800/50 p-8 flex items-center justify-between bg-zinc-900/20">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Annexes Constitutionnelles</h2>
            <div className="text-[10px] font-mono text-zinc-500">REF: ART-8004-A</div>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              {[
                { art: 'Art. 1', title: 'Non-Irreversibility', desc: 'No action shall be taken if the projected state is irreversible and lacks sufficient collateral.' },
                { art: 'Art. 2', title: 'Human Oversight', desc: 'Agents must provide Human Algebra scores for all qualitative risk assessments.' },
                { art: 'Art. 3', title: 'Temporal Consistency', desc: 'Decisions must remain valid across the entire X-108 window to be executed.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-4 rounded-2xl hover:bg-zinc-800/30 transition-colors">
                  <div className="text-emerald-500 font-mono text-xs font-bold pt-1">{item.art}</div>
                  <div>
                    <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                    <div className="text-xs text-zinc-500 leading-relaxed font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="border-b border-zinc-800/50 p-8 bg-zinc-900/20">
            <h2 className="text-xl font-black text-white uppercase italic tracking-tight">System State Snapshot</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Operation Mode', value: `${mode}_MODE`, status: 'neutral' },
                { label: 'Active Scenario', value: mode === 'FIX' ? scenarioLabels[selectedScenario - 1] : 'RANDOM_WALK', status: 'success' },
                { label: 'Temporal Lock', value: selectedScenario === 2 ? 'ACTIVE' : 'INACTIVE', status: selectedScenario === 2 ? 'warning' : 'success' },
                { label: 'Governance Hash', value: '0x8F3A...9C2B', status: 'neutral', mono: true },
                { label: 'ERC-8004 Status', value: 'COMPLIANT', status: 'success' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 group hover:border-zinc-700 transition-all">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.label}</span>
                  <span className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-bold tracking-tight",
                    item.mono ? "font-mono" : "",
                    item.status === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                    item.status === 'warning' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-zinc-800 text-zinc-300 border border-zinc-700"
                  )}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="border-b border-zinc-800/50 p-8 bg-zinc-900/20">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Recent System Actions</h2>
        </div>
        <div className="p-8">
          <div className="space-y-4">
            {[
              { time: '02:45:12', action: 'INVARIANT_CHECK_PASSED', details: 'All OS0 laws verified for current epoch.', status: 'success' },
              { time: '02:30:05', action: 'TEMPORAL_LOCK_ENGAGED', details: 'X-108 active due to volatility spike.', status: 'warning' },
              { time: '02:15:44', action: 'ERC_8004_INTENT_SIGNED', details: 'Intent int_8f3a9c2b authorized.', status: 'success' },
              { time: '01:55:20', action: 'SIM_LITE_STRESS_TEST', details: 'Monte Carlo run completed: 10k paths.', status: 'neutral' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-4 bg-zinc-950/30 rounded-2xl border border-zinc-800/50">
                <div className="text-[10px] font-mono text-zinc-600">{item.time}</div>
                <div className={cn(
                  "px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase",
                  item.status === 'success' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  item.status === 'warning' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-zinc-800 text-zinc-400 border border-zinc-700"
                )}>
                  {item.action}
                </div>
                <div className="text-xs text-zinc-500 font-medium">{item.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
