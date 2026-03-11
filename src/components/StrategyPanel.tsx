'use client';

import React from 'react';
import { motion } from 'motion/react';
import { STRATEGY_CONFIG } from '../config/strategy';
import { BarChart3, Shield, Target, Zap, ArrowRight } from 'lucide-react';

export default function StrategyPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          Stratégie : {STRATEGY_CONFIG.name}
        </h3>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400">
          Active Policy
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800/50">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Allocation
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Capital sandbox</span>
              <span className="text-sm font-mono font-bold text-white">{STRATEGY_CONFIG.capital.toLocaleString()} $</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Actifs autorisés</span>
              <span className="text-sm font-mono font-bold text-white">{STRATEGY_CONFIG.assets.join(', ')}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800/50">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Gouvernance
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Max drawdown</span>
              <span className="text-sm font-mono font-bold text-white">{STRATEGY_CONFIG.rules.maxDrawdown * 100}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Position max</span>
              <span className="text-sm font-mono font-bold text-white">{STRATEGY_CONFIG.rules.maxPositionSize * 100}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">Stop-loss</span>
              <span className="text-sm font-mono font-bold text-white">{STRATEGY_CONFIG.rules.stopLoss * 100}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-black/40 p-6 rounded-2xl border border-zinc-800/50">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-400" />
          Signaux de Trading
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STRATEGY_CONFIG.signals.map((signal, idx) => (
            <div key={idx} className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
              <div className="text-xs font-bold text-white mb-1">{signal.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono mb-2">{signal.condition}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                {signal.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
