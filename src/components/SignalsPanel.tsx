'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Target, Zap, TrendingUp, BarChart3 } from 'lucide-react';

export default function SignalsPanel({ scenarioId, mode }: { scenarioId?: string, mode?: 'FIX' | 'AUTO' }) {
  const [signals, setSignals] = useState<{
    volatility: number;
    coherence: number;
    rsi: number;
    ma7: number;
    ma30: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/features', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ scenarioId: mode === 'FIX' ? scenarioId : undefined }) 
    })
      .then(res => res.json())
      .then(data => {
        setSignals({
          volatility: data.volatility,
          coherence: data.coherence,
          rsi: 28.5,
          ma7: 62450,
          ma30: 61800,
          status: 'READY'
        });
      })
      .catch(err => console.error('Error fetching features:', err));
  }, [scenarioId, mode]);

  if (!signals) return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex items-center justify-center">
      <div className="flex items-center gap-3 text-zinc-500 animate-pulse">
        <Activity className="w-5 h-5" />
        <span className="text-xs font-black uppercase tracking-widest">Extraction des signaux...</span>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" />
          Intention de Trade (OS1)
        </h3>
        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400">
          Signal Detected
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 text-center">
          <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Action</div>
          <div className="text-lg font-black italic uppercase tracking-tighter text-emerald-400">ACHETER ETH</div>
        </div>
        <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 text-center">
          <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Montant</div>
          <div className="text-lg font-black italic uppercase tracking-tighter text-white">2 000 $ (20%)</div>
        </div>
        <div className="bg-black/40 p-4 rounded-2xl border border-zinc-800/50 text-center">
          <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Raison</div>
          <div className="text-lg font-black italic uppercase tracking-tighter text-blue-400">RSI &lt; 30</div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Features Extraites
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Volatilité', value: `${(signals.volatility * 100).toFixed(2)}%`, color: 'text-white' },
            { label: 'Cohérence', value: `${(signals.coherence * 100).toFixed(2)}%`, color: 'text-white' },
            { label: 'RSI (14)', value: signals.rsi.toFixed(1), color: 'text-emerald-400' },
            { label: 'MA (7)', value: signals.ma7.toLocaleString(), color: 'text-white' },
            { label: 'MA (30)', value: signals.ma30.toLocaleString(), color: 'text-white' },
          ].map((f) => (
            <div key={f.label} className="bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
              <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">{f.label}</div>
              <div className={`text-xs font-mono font-bold ${f.color}`}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
