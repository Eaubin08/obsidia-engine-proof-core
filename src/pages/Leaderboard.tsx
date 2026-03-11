import React from 'react';
import { Trophy, TrendingUp, AlertTriangle, BarChart3, Medal, ArrowRight } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

export function Leaderboard({ onNext }: { onNext: () => void }) {
  const teams = [
    { rank: 1, name: 'Akaton Alpha', pnl: '+12.4%', sharpe: 2.4, drawdown: '-2.1%', score: 98, avatar: 'A' },
    { rank: 2, name: 'Obsidia Prime', pnl: '+8.2%', sharpe: 1.9, drawdown: '-1.5%', score: 95, avatar: 'O' },
    { rank: 3, name: 'Neural Nexus', pnl: '+7.5%', sharpe: 2.1, drawdown: '-3.2%', score: 92, avatar: 'N' },
    { rank: 4, name: 'Cyber Sentinel', pnl: '+5.1%', sharpe: 1.5, drawdown: '-0.8%', score: 89, avatar: 'C' },
    { rank: 5, name: 'Void Walker', pnl: '-1.2%', sharpe: 0.8, drawdown: '-5.4%', score: 82, avatar: 'V' },
  ];

  return (
    <div className="space-y-8">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Leaderboard" 
        progress={100}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Trophy className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Rank</p>
            <p className="text-2xl font-mono font-bold text-white">#12 / 142</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total PnL</p>
            <p className="text-2xl font-mono font-bold text-emerald-400">+4.2%</p>
          </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Validation Score</p>
            <p className="text-2xl font-mono font-bold text-white">96.4</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 border-b border-zinc-800">
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Agent Team</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">PnL</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Sharpe</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Drawdown</th>
                <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Trust Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {teams.map((team) => (
                <tr key={team.rank} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {team.rank <= 3 ? (
                        <Medal className={`w-5 h-5 ${
                          team.rank === 1 ? 'text-amber-400' :
                          team.rank === 2 ? 'text-zinc-400' :
                          'text-amber-700'
                        }`} />
                      ) : (
                        <span className="w-5 text-center text-sm font-mono text-zinc-500">{team.rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-white border border-zinc-700">
                        {team.avatar}
                      </div>
                      <span className="text-sm font-bold text-white">{team.name}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm font-mono font-bold text-right ${team.pnl.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {team.pnl}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-zinc-300 text-right">{team.sharpe}</td>
                  <td className="px-6 py-4 text-sm font-mono text-rose-400/70 text-right">{team.drawdown}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-2 px-2 py-1 bg-zinc-800 rounded-md border border-zinc-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs font-mono font-bold text-white">{team.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center pt-8">
        <button 
          onClick={onNext}
          className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white font-bold rounded-2xl transition-all flex items-center gap-3"
        >
          Return to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
