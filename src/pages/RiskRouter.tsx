import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Zap, FileJson, CheckCircle2, AlertTriangle, Send, ArrowRight } from 'lucide-react';
import SignalsPanel from '../components/SignalsPanel';
import { ModuleHeader } from '../components/ModuleHeader';

export function RiskRouter({ onNext, scenarioId, mode }: { onNext: () => void, scenarioId?: string, mode?: 'FIX' | 'AUTO' }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [tradeIntent, setTradeIntent] = useState({
    market: 'WETH/USDC',
    side: 'LONG',
    size: 1000,
    leverage: 2.0
  });

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setIsExecuted(true);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Risk Router" 
        progress={65}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SignalsPanel scenarioId={scenarioId} mode={mode} />

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Trade Intent Builder</h3>
                  <p className="text-sm text-zinc-400">Construct and sign your EIP-712 trade payload.</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">EIP-712 Ready</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Market</label>
                <select 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                  value={tradeIntent.market}
                  onChange={(e) => setTradeIntent({...tradeIntent, market: e.target.value})}
                >
                  <option>WETH/USDC</option>
                  <option>WBTC/USDC</option>
                  <option>LINK/USDC</option>
                  <option>ARB/USDC</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Side</label>
                <div className="flex bg-black border border-zinc-800 rounded-xl p-1">
                  <button 
                    onClick={() => setTradeIntent({...tradeIntent, side: 'LONG'})}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tradeIntent.side === 'LONG' ? 'bg-emerald-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    LONG
                  </button>
                  <button 
                    onClick={() => setTradeIntent({...tradeIntent, side: 'SHORT'})}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tradeIntent.side === 'SHORT' ? 'bg-rose-500 text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    SHORT
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Size (USDC)</label>
                <input 
                  type="number" 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  value={tradeIntent.size}
                  onChange={(e) => setTradeIntent({...tradeIntent, size: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">Leverage</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                  value={tradeIntent.leverage}
                  onChange={(e) => setTradeIntent({...tradeIntent, leverage: Number(e.target.value)})}
                />
              </div>
            </div>

            <button 
              onClick={handleExecute}
              disabled={isExecuting || isExecuted}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isExecuting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Executing...
                </>
              ) : isExecuted ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Trade Executed
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Sign & Submit Trade Intent
                </>
              )}
            </button>

            {isExecuted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">Trade Executed Successfully</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-emerald-500/10">
                    <span>REQUEST_HASH</span>
                    <span className="text-zinc-300">0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                  </div>
                </div>
                
                <button
                  onClick={onNext}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700"
                >
                  View Trust Signals
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <FileJson className="w-5 h-5 text-zinc-500" />
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">EIP-712 Typed Data</h3>
            </div>
            <div className="bg-black rounded-xl p-4 font-mono text-xs text-zinc-500 overflow-x-auto">
              <pre>{`{
  "domain": {
    "name": "AkatonRiskRouter",
    "version": "1",
    "chainId": 42161,
    "verifyingContract": "0xRiskRouter..."
  },
  "message": {
    "market": "${tradeIntent.market}",
    "side": "${tradeIntent.side}",
    "size": "${tradeIntent.size}",
    "leverage": "${tradeIntent.leverage}",
    "nonce": "12",
    "deadline": "1710000000"
  },
  "primaryType": "TradeIntent"
}`}</pre>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Risk Checks</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-300">Max Position Size</span>
                <span className="text-emerald-400 text-[10px] font-bold tracking-widest">PASS</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-300">Max Leverage (5x)</span>
                <span className="text-emerald-400 text-[10px] font-bold tracking-widest">PASS</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <span className="text-sm text-zinc-300">Market Whitelist</span>
                <span className="text-emerald-400 text-[10px] font-bold tracking-widest">PASS</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-300">Daily Loss Limit</span>
                <span className="text-emerald-400 text-[10px] font-bold tracking-widest">PASS</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest">Circuit Breaker</h3>
            </div>
            <p className="text-xs text-rose-400/70 leading-relaxed">
              The Risk Router will automatically revert any transaction that violates the Hackathon's safety parameters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
