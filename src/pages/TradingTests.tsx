import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Shield, 
  Activity,
  ChevronRight,
  Beaker
} from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';

interface Scenario {
  id: string;
  name: string;
  description: string;
  expected_decision: string;
  expected_reason: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "scenario_1_block_low_coherence",
    name: "BLOCK: Low Coherence",
    description: "Intent blocked due to low market coherence (high volatility)",
    expected_decision: "BLOCK",
    expected_reason: "x108_low_coherence"
  },
  {
    id: "scenario_2_hold_x108",
    name: "HOLD: X-108 Timer Active",
    description: "Intent held due to X-108 temporal lock (τ not elapsed)",
    expected_decision: "HOLD",
    expected_reason: "x108_hold"
  },
  {
    id: "scenario_3_execute_pass",
    name: "EXECUTE: All Gates Pass",
    description: "Intent executed successfully after all gates pass",
    expected_decision: "EXECUTE",
    expected_reason: "pass"
  },
  {
    id: "scenario_4_block_destructive_sim",
    name: "BLOCK: Destructive Simulation",
    description: "Intent blocked due to high risk projection (P(ruin) > threshold)",
    expected_decision: "BLOCK",
    expected_reason: "simulation_destructive"
  },
  {
    id: "scenario_5_execute_reversible",
    name: "EXECUTE: Reversible Intent (No X-108)",
    description: "Reversible intent executed immediately without X-108 delay",
    expected_decision: "EXECUTE",
    expected_reason: "pass"
  }
];

export function TradingTests() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState<string | null>(null);

  const runScenario = async (scenario: Scenario) => {
    setIsRunning(scenario.id);
    setResults(prev => ({ ...prev, [scenario.id]: { status: 'RUNNING' } }));

    try {
      const response = await fetch('/api/gates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id })
      });
      const gates = await response.json();
      
      const finalVerdict = gates.every((g: any) => g.status === 'PASS') ? 'EXECUTE' : 
                          gates.some((g: any) => g.status === 'BLOCK') ? 'BLOCK' : 'HOLD';
      
      const isSuccess = finalVerdict === scenario.expected_decision;

      setResults(prev => ({
        ...prev,
        [scenario.id]: {
          status: 'COMPLETED',
          verdict: finalVerdict,
          isSuccess,
          gates
        }
      }));
    } catch (error) {
      console.error('Scenario failed:', error);
      setResults(prev => ({ ...prev, [scenario.id]: { status: 'ERROR' } }));
    } finally {
      setIsRunning(null);
    }
  };

  const runAll = async () => {
    for (const s of SCENARIOS) {
      await runScenario(s);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="Automated Proof Tests" 
        progress={Object.keys(results).length * 20}
      />

      <div className="flex justify-between items-center bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Suite de Validation ERC-8004</h3>
          <p className="text-sm text-zinc-500">Exécutez les scénarios de preuve pour valider l'intégrité des protocoles Akaton.</p>
        </div>
        <button 
          onClick={runAll}
          disabled={!!isRunning}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          Run All Tests
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {SCENARIOS.map((scenario) => {
          const result = results[scenario.id];
          return (
            <div 
              key={scenario.id}
              className={`p-6 rounded-3xl border transition-all ${
                result?.status === 'COMPLETED' 
                  ? (result.isSuccess ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-red-500/5 border-red-500/30')
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    result?.status === 'COMPLETED'
                      ? (result.isSuccess ? 'bg-emerald-500 text-black' : 'bg-red-500 text-white')
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {result?.status === 'RUNNING' ? <Beaker className="animate-pulse" /> :
                     result?.status === 'COMPLETED' ? (result.isSuccess ? <CheckCircle2 /> : <XCircle />) :
                     <Shield />}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{scenario.name}</h4>
                    <p className="text-sm text-zinc-500">{scenario.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {result?.status === 'COMPLETED' && (
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verdict</div>
                      <div className={`text-xl font-black italic uppercase ${
                        result.verdict === 'EXECUTE' ? 'text-emerald-400' :
                        result.verdict === 'BLOCK' ? 'text-red-400' : 'text-amber-400'
                      }`}>
                        {result.verdict}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => runScenario(scenario)}
                    disabled={!!isRunning}
                    className={`p-3 rounded-xl transition-all ${
                      isRunning === scenario.id ? 'bg-zinc-800' : 'bg-zinc-800 hover:bg-zinc-700'
                    }`}
                  >
                    <Play className={`w-5 h-5 ${isRunning === scenario.id ? 'animate-pulse text-emerald-400' : 'text-zinc-400'}`} />
                  </button>
                </div>
              </div>

              {result?.status === 'COMPLETED' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-zinc-800/50 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {result.gates.map((gate: any) => (
                    <div key={gate.name} className="flex items-center gap-3 bg-black/30 p-3 rounded-xl border border-zinc-800/30">
                      <div className={`w-2 h-2 rounded-full ${gate.status === 'PASS' ? 'bg-emerald-500' : gate.status === 'BLOCK' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{gate.name}</div>
                        <div className="text-xs font-bold text-zinc-300">{gate.status}</div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
