import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, ShieldAlert, Target } from 'lucide-react';
import { cn } from '../lib/utils';

const generateSimulationData = (isDestructive: boolean) => {
  return Array.from({ length: 50 }, (_, i) => ({
    step: i,
    path1: (isDestructive ? 100 - i * 1.5 : 100 + i * 0.5) + Math.random() * 20 - 10,
    path2: (isDestructive ? 100 - i * 2.0 : 100 + i * 0.2) + Math.random() * 25 - 15,
    path3: (isDestructive ? 100 - i * 2.5 : 100 - i * 0.8) + Math.random() * 30 - 20,
    path4: (isDestructive ? 100 - i * 1.8 : 100 + i * 0.9) + Math.random() * 15 - 5,
    path5: (isDestructive ? 100 - i * 2.2 : 100 - i * 0.1) + Math.random() * 35 - 25,
  }));
};

interface OS2Props {
  mode: 'FIX' | 'AUTO';
  selectedScenario: number;
}

export function OS2Simulation({ mode, selectedScenario }: OS2Props) {
  const isDestructive = selectedScenario === 4;
  const [currentData, setCurrentData] = useState(() => generateSimulationData(isDestructive));

  useEffect(() => {
    setCurrentData(generateSimulationData(isDestructive));
  }, [isDestructive]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentData(prev => prev.map(d => ({
        ...d,
        path1: d.path1 + (Math.random() - 0.5) * 2,
        path2: d.path2 + (Math.random() - 0.5) * 2,
        path3: d.path3 + (Math.random() - 0.5) * 2,
        path4: d.path4 + (Math.random() - 0.5) * 2,
        path5: d.path5 + (Math.random() - 0.5) * 2,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Max Drawdown Risk', value: isDestructive ? '42.8%' : '12.5%', icon: ShieldAlert, color: isDestructive ? 'text-red-400' : 'text-red-400', bg: 'bg-red-500/10', threshold: '20%', margin: isDestructive ? '120%' : '65%' },
    { label: 'Ruin Probability', value: isDestructive ? '18.4%' : '0.01%', icon: Target, color: isDestructive ? 'text-red-400' : 'text-emerald-400', bg: isDestructive ? 'bg-red-500/10' : 'bg-emerald-500/10', threshold: '1%', margin: isDestructive ? '150%' : '1%' },
    { label: 'Projected Return', value: isDestructive ? '-12.4%' : '+4.2%', icon: Activity, color: isDestructive ? 'text-red-400' : 'text-blue-400', bg: isDestructive ? 'bg-red-500/10' : 'bg-blue-500/10', threshold: '2%', margin: isDestructive ? '0%' : '85%' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            <Activity className="w-3 h-3" />
            Stress Testing Engine
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">OS2 - Simulation</h1>
          <p className="text-zinc-500 mt-3 text-lg max-w-2xl font-medium leading-relaxed">
            SIM-LITE Monte Carlo engine. Projecting 10,000+ paths to evaluate tail risks and ruin probability before any intent is authorized.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase">ENGINE_STATUS: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 hover:bg-zinc-900/60 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} border border-white/5`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
                <div className="text-3xl font-black text-white italic uppercase tracking-tight">{stat.value}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-zinc-600">Safety Margin</span>
                <span className="text-zinc-400">Limit: {stat.threshold}</span>
              </div>
              <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-1000", stat.color.replace('text', 'bg'))} style={{ width: stat.margin }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Monte Carlo Price Paths</h3>
            <p className="text-xs text-zinc-500 font-medium mt-1">Stochastic projections based on OS1 feature vectors.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", isDestructive ? "bg-red-500" : "bg-emerald-500")}></div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mean Path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Simulations</span>
            </div>
          </div>
        </div>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
              <XAxis dataKey="step" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                itemStyle={{ color: isDestructive ? '#ef4444' : '#10b981', fontWeight: 'bold' }}
                labelStyle={{ color: '#71717a', fontSize: '10px', fontWeight: 'bold' }}
              />
              <ReferenceLine y={isDestructive ? 90 : 80} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ position: 'insideBottomLeft', value: 'CRITICAL RUIN THRESHOLD', fill: '#ef4444', fontSize: 10, fontWeight: 'bold', letterSpacing: '0.1em' }} />
              <Line type="monotone" dataKey="path1" stroke="#27272a" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.5} />
              <Line type="monotone" dataKey="path2" stroke="#27272a" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.5} />
              <Line type="monotone" dataKey="path3" stroke="#27272a" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.5} />
              <Line type="monotone" dataKey="path4" stroke="#27272a" strokeWidth={1} dot={false} isAnimationActive={false} opacity={0.5} />
              <Line type="monotone" dataKey="path5" stroke={isDestructive ? "#ef4444" : "#10b981"} strokeWidth={3} dot={false} name="Mean Path" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
