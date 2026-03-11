import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Activity, Award, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

export function TrustSignals({ onNext }: { onNext: () => void }) {
  const signals = [
    { id: 1, type: 'TRADE', status: 'VERIFIED', score: 98, time: '2m ago', desc: 'WETH/USDC Long Execution', hash: '0x7a2...f4e' },
    { id: 2, type: 'AUDIT', status: 'VERIFIED', score: 100, time: '15m ago', desc: 'ERC-8004 Invariant Check', hash: '0x1b4...c9d' },
    { id: 3, type: 'RISK', status: 'VERIFIED', score: 92, time: '1h ago', desc: 'Leverage Limit Validation', hash: '0x9d2...a1b' },
    { id: 4, type: 'IDENTITY', status: 'VERIFIED', score: 100, time: '3h ago', desc: 'Agent Handle Minting', hash: '0x4c3...e8f' },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Trust Signals" 
        progress={85}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Validation Registry Log</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Live Syncing</span>
              </div>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {signals.map((signal) => (
                <div key={signal.id} className="p-6 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      signal.type === 'TRADE' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                      signal.type === 'AUDIT' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                      signal.type === 'RISK' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                      'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    }`}>
                      {signal.type === 'TRADE' ? <Activity className="w-5 h-5" /> :
                       signal.type === 'AUDIT' ? <ShieldCheck className="w-5 h-5" /> :
                       signal.type === 'RISK' ? <AlertCircle className="w-5 h-5" /> :
                       <Award className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tighter">{signal.desc}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{signal.time} • {signal.type} EVENT</span>
                        <span className="text-[10px] font-mono text-zinc-600">[{signal.hash}]</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-sm font-mono font-bold text-white">{signal.score}</span>
                        <span className="text-[8px] font-bold text-zinc-600 uppercase">/ 100</span>
                      </div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Validation Score</div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">VERIFIED</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Reputation Score</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 * (1 - 0.96)}
                    className="text-amber-400"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-mono font-bold text-white">96</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">RANK A+</span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center leading-relaxed">
                Your reputation is calculated based on PnL signals and validator scores.
              </p>
              <button 
                onClick={onNext}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                View Leaderboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
