import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Zap, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

const initialData = [
  { time: '00:00', price: 42000, volatility: 1.2 },
  { time: '04:00', price: 42500, volatility: 1.5 },
  { time: '08:00', price: 41800, volatility: 2.1 },
  { time: '12:00', price: 41200, volatility: 3.5 },
  { time: '16:00', price: 40500, volatility: 4.2 },
  { time: '20:00', price: 41100, volatility: 2.8 },
  { time: '24:00', price: 41900, volatility: 1.9 },
];

interface OS1Props {
  mode: 'FIX' | 'AUTO';
  selectedScenario: number;
}

export function OS1Observation({ mode, selectedScenario }: OS1Props) {
  const [chartData, setChartData] = useState(initialData);
  const isLowCoherence = selectedScenario === 1;
  const isHighVolatility = selectedScenario === 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1];
        const nextPrice = last.price + (Math.random() - 0.5) * 200;
        const nextVolatility = Math.max(0.5, last.volatility + (Math.random() - 0.5) * 0.5);
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const newData = [...prev.slice(1), { time: nextTime, price: nextPrice, volatility: nextVolatility }];
        return newData;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Market Regime', value: isHighVolatility ? 'Extreme Volatility' : 'High Volatility', icon: Activity, color: isHighVolatility ? 'text-red-400' : 'text-amber-400', bg: isHighVolatility ? 'bg-red-500/10' : 'bg-amber-500/10', trend: isHighVolatility ? '+42%' : '+12%' },
    { label: 'Coherence Score', value: isLowCoherence ? '0.42' : '0.84', icon: Zap, color: isLowCoherence ? 'text-red-400' : 'text-emerald-400', bg: isLowCoherence ? 'bg-red-500/10' : 'bg-emerald-500/10', trend: isLowCoherence ? 'UNSTABLE' : 'STABLE' },
    { label: 'Friction Index', value: isHighVolatility ? '5.4%' : '2.1%', icon: TrendingDown, color: isHighVolatility ? 'text-red-400' : 'text-amber-400', bg: isHighVolatility ? 'bg-red-500/10' : 'bg-amber-500/10', trend: '+0.4%' },
    { label: 'Trend Strength', value: 'Strong Bear', icon: TrendingUp, color: 'text-zinc-400', bg: 'bg-zinc-800', trend: '-5.2%' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            <Eye className="w-3 h-3" />
            Real-time Monitoring
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">OS1 - Observation</h1>
          <p className="text-zinc-500 mt-3 text-lg max-w-2xl font-medium leading-relaxed">
            Feature extraction pipeline. Raw market data is transformed into governance-ready features using proprietary signal processing.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-bold text-zinc-300 tracking-widest uppercase">LIVE_FEED: BTC/USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 hover:bg-zinc-900/60 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} border border-white/5`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-zinc-600 tracking-wider uppercase">{stat.trend}</span>
            </div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-white tracking-tight italic uppercase">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Price Action Analysis</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700">1H</button>
              <button className="px-3 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-lg shadow-blue-500/20">4H</button>
              <button className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700">1D</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.3} />
                <XAxis dataKey="time" stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm flex flex-col">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-8">Feature Vectors</h3>
          <div className="flex-1 space-y-6">
            {[
              { label: 'Volatility Index', value: isHighVolatility ? 92 : 68, color: isHighVolatility ? 'bg-red-500' : 'bg-amber-500' },
              { label: 'Coherence Score', value: isLowCoherence ? 42 : 84, color: isLowCoherence ? 'bg-red-500' : 'bg-emerald-500' },
              { label: 'Friction Index', value: isHighVolatility ? 54 : 21, color: isHighVolatility ? 'bg-red-500' : 'bg-red-500' },
              { label: 'Regime Stability', value: isHighVolatility ? 15 : 45, color: isHighVolatility ? 'bg-red-500' : 'bg-blue-500' },
            ].map((feature, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-500">{feature.label}</span>
                  <span className="text-white">{feature.value}%</span>
                </div>
                <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-1000", feature.color)} style={{ width: `${feature.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-2">Signal Confidence</div>
            <div className={cn(
              "text-2xl font-black italic uppercase tracking-tight",
              isLowCoherence || isHighVolatility ? "text-red-400" : "text-emerald-400"
            )}>
              {isLowCoherence || isHighVolatility ? 'Low (0.34)' : 'High (0.92)'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
