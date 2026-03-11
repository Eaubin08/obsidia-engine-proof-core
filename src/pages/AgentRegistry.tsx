import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Shield, Fingerprint, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

export function AgentRegistry({ onNext }: { onNext: () => void }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [handle, setHandle] = useState('');

  const registrationData = {
    type: "ERC-8004_AGENT",
    name: handle || "pending",
    services: ["DEX_EXECUTION", "RISK_ROUTING"],
    x402Support: true,
    supportedTrust: ["TEE", "ZK_PROOF"],
    capabilities: ["DEX_TRADING", "RISK_ANALYSIS"],
    endpoints: {
      rpc: "https://api.akaton.io/v1/agent",
      status: `https://status.akaton.io/${handle || '...'}`
    },
    agentWallet: "0x742d...44e"
  };

  return (
    <div className="space-y-8">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Agent Registry" 
        progress={35}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <UserPlus className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Mint Agent Handle</h3>
                <p className="text-sm text-zinc-400">Unique ERC-721 identifier for your AI agent.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Agent Handle</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="e.g. akaton-alpha-01"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                    value={handle}
                    onChange={(e) => {
                      setHandle(e.target.value);
                      if (isRegistered) setIsRegistered(false);
                    }}
                  />
                  <button 
                    onClick={() => setIsRegistered(true)}
                    disabled={!handle || isRegistered}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all whitespace-nowrap"
                  >
                    {isRegistered ? 'Registered ✓' : 'Mint Handle'}
                  </button>
                </div>
              </div>

              {isRegistered && (
                <div className="space-y-4">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">Agent {handle} successfully minted on L2.</span>
                  </motion.div>
                  
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={onNext}
                    className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-700"
                  >
                    Proceed to Capital Vault
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Registration JSON</h3>
            <div className="bg-black rounded-xl p-4 font-mono text-[10px] sm:text-xs text-zinc-500 overflow-x-auto border border-zinc-800/50">
              <pre className="whitespace-pre">{JSON.stringify(registrationData, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Registry Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-300">ERC-8004 Identity</span>
                </div>
                <span className={isRegistered ? "text-emerald-400 text-xs font-bold" : "text-zinc-600 text-xs font-bold"}>
                  {isRegistered ? "ACTIVE" : "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-300">Neural Signature</span>
                </div>
                <span className={isRegistered ? "text-emerald-400 text-xs font-bold" : "text-zinc-600 text-xs font-bold"}>
                  {isRegistered ? "VERIFIED" : "WAITING"}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-300">On-chain Metadata</span>
                </div>
                <span className={isRegistered ? "text-emerald-400 text-xs font-bold" : "text-zinc-600 text-xs font-bold"}>
                  {isRegistered ? "SYNCED" : "OFFLINE"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
