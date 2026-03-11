import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  ShieldAlert, 
  Clock, 
  Zap, 
  Activity, 
  Coins,
  ArrowLeft,
  History,
  Lock,
  Unlock,
  ExternalLink,
  RefreshCw,
  Play
} from 'lucide-react';
import { AgentAction, SafetyGateResult, TokenomicsModel } from '../types';
import { ModuleHeader } from '../components/ModuleHeader';

interface EcommerceModuleProps {
  setActiveTab: (tab: string) => void;
}

export function EcommerceModule({ setActiveTab }: EcommerceModuleProps) {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [lastAction, setLastAction] = useState<AgentAction | null>(null);
  const [currentResult, setCurrentResult] = useState<SafetyGateResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [tokenomics, setTokenomics] = useState({
    totalFee: 0,
    stakerReward: 0,
    treasuryAmount: 0,
    buybackAmount: 0
  });

  const model: TokenomicsModel = {
    fee_rate: 0.001, // 0.1%
    staker_share: 0.5,
    treasury_share: 0.3,
    buyback_share: 0.2
  };

  // Load scenarios from API
  const loadScenarios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ecommerce/scenarios');
      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      console.error('Failed to load ecommerce scenarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  const triggerAction = async (type: 'PURCHASE' | 'BID' | 'LIST', amount?: number, coherence?: number) => {
    setIsEvaluating(true);
    const newAction: AgentAction = {
      id: `ACT-${Math.floor(Math.random() * 10000)}`,
      agent_id: 'AGENT-X108-01',
      type,
      amount: amount || Math.floor(Math.random() * 5000) + 100,
      recipient: 'Marketplace V3',
      timestamp: Date.now(),
      coherence: coherence || Math.random() * 0.4 + 0.6 // 0.6 to 1.0
    };

    try {
      const response = await fetch('/api/ecommerce/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newAction, previousAction: lastAction, model })
      });
      const { result, fees } = await response.json();
      
      setCurrentResult(result);

      if (result.decision === 'ALLOW') {
        setLastAction(newAction);
        setActions(prev => [newAction, ...prev].slice(0, 5));
        
        if (fees) {
          setTokenomics(prev => ({
            totalFee: prev.totalFee + fees.totalFee,
            stakerReward: prev.stakerReward + fees.stakerReward,
            treasuryAmount: prev.treasuryAmount + fees.treasuryAmount,
            buybackAmount: prev.buybackAmount + fees.buybackAmount
          }));
        }
      }
    } catch (error) {
      console.error('Evaluation failed:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const runScenario = (scenario: any) => {
    triggerAction(scenario.type, scenario.amount, scenario.coherence);
  };

  return (
    <div className="space-y-8 pb-20">
      <ModuleHeader 
        moduleName="E-commerce" 
        moduleIcon="🛒" 
        currentPage="Safety Gate" 
        progress={actions.length * 20}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                Simulateur d'Action Agent
              </div>
              <RefreshCw 
                className={`w-4 h-4 text-zinc-700 cursor-pointer hover:text-zinc-500 ${isLoading ? 'animate-spin' : ''}`} 
                onClick={loadScenarios}
              />
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => triggerAction('PURCHASE')}
                  disabled={isEvaluating}
                  className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-between px-6 transition-all disabled:opacity-50"
                >
                  <span>Achat Direct</span>
                  <ShoppingCart className="w-5 h-5 opacity-50" />
                </button>
                <button 
                  onClick={() => triggerAction('BID')}
                  disabled={isEvaluating}
                  className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-between px-6 transition-all disabled:opacity-50"
                >
                  <span>Placer une Enchère</span>
                  <Activity className="w-5 h-5 opacity-50" />
                </button>
              </div>

              {/* Scenarios Section */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Scénarios de Test</h4>
                <div className="grid grid-cols-1 gap-2">
                  {scenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => runScenario(s)}
                      disabled={isEvaluating}
                      className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 transition-all group"
                    >
                      <div className="text-left">
                        <div className="text-xs font-bold text-zinc-300 group-hover:text-orange-400">{s.name}</div>
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider">{s.type} — {s.amount} $X108</div>
                      </div>
                      <Play className="w-3 h-3 text-zinc-700 group-hover:text-orange-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contrainte Temporelle</span>
              </div>
              <div className="text-sm text-zinc-400">
                Un délai de <span className="text-orange-400 font-bold">10 secondes</span> est requis entre chaque action pour prévenir les attaques de vélocité.
              </div>
            </div>
          </div>

          {/* Tokenomics Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              Tokenomics $X108
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-zinc-500">Frais Totaux Collectés</span>
                <span className="text-2xl font-black text-white">{tokenomics.totalFee.toFixed(4)} $X108</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="text-[8px] font-black uppercase text-zinc-600 mb-1">Stakers</div>
                  <div className="text-xs font-bold text-emerald-400">{tokenomics.stakerReward.toFixed(4)}</div>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="text-[8px] font-black uppercase text-zinc-600 mb-1">Treasury</div>
                  <div className="text-xs font-bold text-blue-400">{tokenomics.treasuryAmount.toFixed(4)}</div>
                </div>
                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="text-[8px] font-black uppercase text-zinc-600 mb-1">Buyback</div>
                  <div className="text-xs font-bold text-purple-400">{tokenomics.buybackAmount.toFixed(4)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Feed & Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Last Result */}
          <AnimatePresence mode="wait">
            {currentResult && (
              <motion.div
                key={Date.now()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl border-2 ${
                  currentResult.decision === 'ALLOW' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-red-500/10 border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {currentResult.decision === 'ALLOW' ? (
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                        <Unlock className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Verdict X-108</div>
                      <div className="text-xl font-black italic uppercase tracking-tighter">
                        {currentResult.decision === 'ALLOW' ? 'ACTION AUTORISÉE' : 'ACTION BLOQUÉE'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Cohérence</div>
                    <div className="text-xl font-black text-white">{(currentResult.coherence * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 italic">
                  "{currentResult.reason}" — Delta Temporel: {currentResult.temporal_delta.toFixed(1)}s
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feed */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <History className="w-4 h-4" />
                Moltbook Feed (X-108)
              </h3>
              <ExternalLink className="w-4 h-4 text-zinc-700 cursor-pointer hover:text-zinc-500" />
            </div>
            <div className="space-y-4">
              {actions.length === 0 ? (
                <div className="text-center py-12 text-zinc-700 italic text-sm">
                  Aucune action enregistrée dans le feed.
                </div>
              ) : (
                actions.map((action, i) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500">
                      {action.type === 'PURCHASE' ? <ShoppingCart className="w-5 h-5" /> : 
                       action.type === 'BID' ? <Activity className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-white">{action.type}</span>
                        <span className="text-[10px] font-mono text-zinc-600">{new Date(action.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        {action.amount} $X108 → {action.recipient}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
