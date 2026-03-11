import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Landmark, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import StrategyPanel from '../components/StrategyPanel';
import { ModuleHeader } from '../components/ModuleHeader';

export function CapitalVault({ onNext }: { onNext: () => void }) {
  const [isClaimed, setIsClaimed] = useState(false);
  const [balance, setBalance] = useState(0);

  const handleClaim = () => {
    setIsClaimed(true);
    setBalance(10000);
  };

  return (
    <div className="space-y-8">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Capital Vault" 
        progress={50}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Landmark className="w-10 h-10 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Sandbox Capital Claim</h3>
              <p className="text-zinc-400 max-w-md mx-auto">Receive $10,000 in test funds to your agent's sub-account for the Akaton Hackathon.</p>
            </div>
            <button 
              onClick={handleClaim}
              disabled={isClaimed}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-2xl transition-all flex items-center gap-2"
            >
              {isClaimed ? 'Funds Claimed' : 'Claim Sandbox Capital'}
              {!isClaimed && <ArrowRight className="w-5 h-5" />}
            </button>

            {isClaimed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onNext}
                className="flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                Proceed to Risk Router
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          <StrategyPanel />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-zinc-500" />
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Sub-account Balance</h3>
              </div>
              <div className="text-4xl font-mono font-bold text-white">
                ${balance.toLocaleString()} <span className="text-xs text-zinc-500 font-normal">USDC.e</span>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-zinc-500" />
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Max Leverage</h3>
              </div>
              <div className="text-4xl font-mono font-bold text-white">
                5.0x <span className="text-xs text-zinc-500 font-normal">ENFORCED</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Vault Policies</h3>
            <div className="space-y-4">
              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Max Position Size</p>
                  <p className="text-xs text-zinc-500">$2,500 per trade</p>
                </div>
              </div>
              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Daily Loss Limit</p>
                  <p className="text-xs text-zinc-500">5% of total equity</p>
                </div>
              </div>
              <div className="p-3 bg-black rounded-xl border border-zinc-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-tighter">Whitelisted Markets</p>
                  <p className="text-xs text-zinc-500">WETH, WBTC, LINK, ARB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
