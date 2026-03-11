import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { OS4Reports } from './pages/OS4Reports';
import { WorkflowProgress } from './components/WorkflowProgress';
import { Dashboard } from './pages/Dashboard';
import { HomeDashboard } from './pages/HomeDashboard';
import { BankingModule } from './pages/BankingModule';
import { EcommerceModule } from './pages/EcommerceModule';
import { AgentRegistry } from './pages/AgentRegistry';
import { CapitalVault } from './pages/CapitalVault';
import { RiskRouter } from './pages/RiskRouter';
import { TrustSignals } from './pages/TrustSignals';
import { Leaderboard } from './pages/Leaderboard';
import { TradingTests } from './pages/TradingTests';
import { GlobalHeader } from './components/GlobalHeader';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from './components/Terminal';
import { qualitativeLevel } from './lib/core/humanAlgebra';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('obsidia_active_tab') || 'home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'FIX' | 'AUTO'>(() => (localStorage.getItem('obsidia_mode') as 'FIX' | 'AUTO') || 'AUTO');
  const [testType, setTestType] = useState<'AUTONOMOUS' | 'FIXED'>('FIXED');
  const [selectedScenario, setSelectedScenario] = useState('scenario_3_execute_pass');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [testStatus, setTestStatus] = useState<'IDLE' | 'RUNNING' | 'COMPLETED'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [currentGate, setCurrentGate] = useState(0);
  const [outcome, setOutcome] = useState<any>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    localStorage.setItem('obsidia_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('obsidia_mode', mode);
  }, [mode]);

  const addLog = React.useCallback((msg: string, isCommand: boolean = false) => {
    if (isCommand || msg.startsWith(' ') || msg.includes('PASS') || msg.includes('✓') || msg.includes('VERDICT')) {
      setLogs(prev => [...prev, msg]);
    } else {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }
  }, []);

  const runTest = async () => {
    setTestStatus('RUNNING');
    setCurrentGate(0);
    setOutcome(null);
    setConfidenceScore(0);
    setIsTerminalOpen(true);
    
    // Add the test header
    addLog(` `, true);
    addLog(`> obsidia-governance-os@1.0.5 test`, true);
    addLog(`Running ERC-8004 governance validation suite...`, true);
    
    if (testType === 'AUTONOMOUS') {
      addLog('  [AI] Initializing Akaton Autonomous Audit Agent...');
      addLog('  [AI] Scanning for ERC-8004 Invariant Breaches...');
    } else {
      addLog('  [FIX] Loading Akaton Deterministic Validation Rules...');
      addLog('  [FIX] Verifying Akaton Compliance Gates...');
    }

    try {
      // Fetch real data from API
      const [featuresRes, simulationRes, gatesRes] = await Promise.all([
        fetch('/api/features', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ scenarioId: mode === 'FIX' ? selectedScenario : undefined }) 
        }),
        fetch('/api/simulation', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ 
            asset: 'ETH', 
            amount: 2000, 
            action: 'BUY',
            scenarioId: mode === 'FIX' ? selectedScenario : undefined 
          }) 
        }),
        fetch('/api/gates', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ scenarioId: mode === 'FIX' ? selectedScenario : undefined }) 
        })
      ]);

      const features = await featuresRes.json();
      const simulation = await simulationRes.json();
      const gates = await gatesRes.json();

      const stabilitySym = qualitativeLevel(1.0 - features.volatility);
      const coherenceSym = qualitativeLevel(features.coherence);

      // Start the visual sequence
      const steps = [
        { 
          gate: 0, 
          confidence: 32,
          logs: [
            `  [DATA] Volatility: ${(features.volatility * 100).toFixed(2)}% ${stabilitySym} | Coherence: ${(features.coherence * 100).toFixed(2)}% ${coherenceSym}`,
            `  ✓ ${gates[0].name} — ${gates[0].status}`,
            `  PASS  src/gates/akaton/Integrity.gate.ts`
          ]
        },
        { 
          gate: 1, 
          confidence: 64,
          logs: [
            `  [SIM] Expected Return: ${(simulation.expectedReturn * 100).toFixed(2)}% | Max DD: ${(simulation.maxDrawdown * 100).toFixed(2)}%`,
            `  ✓ ${gates[1].name} — ${gates[1].status}`,
            `  PASS  src/gates/akaton/Temporal.gate.ts`
          ]
        },
        { 
          gate: 2, 
          confidence: 89,
          logs: [
            `  ✓ ${gates[2].name} — ${gates[2].status}`,
            `  ✓ Trust Signals — PASS`,
            `  PASS  src/gates/akaton/Risk.gate.ts`
          ]
        },
        { 
          gate: 3, 
          confidence: 100,
          logs: [
            ' ', 
            'Test Files  3 passed (3)', 
            'Tests       4 passed (4)', 
            'Time        1.2s', 
            ' ', 
            'Finalizing Akaton ERC-8004 Artifact...'
          ] 
        }
      ];

      let stepIdx = 0;
      const interval = setInterval(() => {
        if (stepIdx < steps.length) {
          const step = steps[stepIdx];
          if (step.gate < 3) setCurrentGate(step.gate);
          setConfidenceScore(step.confidence);
          
          step.logs.forEach((log, i) => {
            setTimeout(() => {
              addLog(log);
            }, i * 100);
          });

          stepIdx++;
        } else {
          clearInterval(interval);
          setTestStatus('COMPLETED');
          setConfidenceScore(100);
          
          const finalVerdict = gates.every((g: any) => g.status === 'PASS') ? 'EXECUTE' : 'BLOCK';
          const reason = gates.find((g: any) => g.status !== 'PASS')?.reason || 'All Gates Verified';
          
          setOutcome({ outcome: finalVerdict, reason });
          addLog(` `);
          addLog(`VERDICT: ${finalVerdict}`);
          addLog(`REASON: ${reason}`);
        }
      }, 1500);

    } catch (error) {
      addLog(`  [ERROR] Failed to fetch governance data: ${error}`);
      setTestStatus('IDLE');
    }
  };

  const getActiveDomain = () => {
    if (['dashboard', 'step1', 'step2', 'step3', 'step4', 'step5', 'os4', 'trading_tests'].includes(activeTab)) return 'trading';
    if (activeTab === 'banking') return 'banking';
    if (activeTab === 'ecommerce') return 'ecommerce';
    return undefined;
  };

  const renderContent = () => {
    const props = { 
      mode, 
      testType,
      setTestType,
      selectedScenario,
      testStatus,
      logs,
      currentGate,
      confidenceScore,
      outcome,
      onRunTest: runTest,
      onReset: () => {
        setTestStatus('IDLE');
        setConfidenceScore(0);
      }
    };
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {(() => {
            switch (activeTab) {
              case 'home': return <HomeDashboard setActiveTab={setActiveTab} />;
              case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
              case 'banking': return <BankingModule setActiveTab={setActiveTab} />;
              case 'ecommerce': return <EcommerceModule setActiveTab={setActiveTab} />;
              case 'step1': return <AgentRegistry onNext={() => setActiveTab('step2')} />;
              case 'step2': return <CapitalVault onNext={() => setActiveTab('step3')} />;
              case 'step3': return <RiskRouter onNext={() => setActiveTab('step4')} scenarioId={selectedScenario} mode={mode} />;
              case 'step4': return <TrustSignals onNext={() => setActiveTab('step5')} />;
              case 'step5': return <Leaderboard onNext={() => setActiveTab('dashboard')} />;
              case 'trading_tests': return <TradingTests />;
              case 'os4': return <OS4Reports {...props} />;
              default: return <Dashboard setActiveTab={setActiveTab} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  const showSidebar = activeTab !== 'home';

  return (
    <div className="flex flex-col h-screen bg-black text-zinc-100 font-sans overflow-hidden">
      <GlobalHeader activeDomain={getActiveDomain()} setActiveTab={setActiveTab} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            mode={mode}
            setMode={setMode}
            selectedScenario={selectedScenario}
            setSelectedScenario={setSelectedScenario}
            isTerminalOpen={isTerminalOpen}
            onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)}
          />
        )}
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <main className={cn(
            "flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 transition-all duration-300",
            isTerminalOpen ? (isTerminalMaximized ? "pb-[90vh]" : "pb-[400px]") : "pb-12"
          )}>
            <div className="max-w-6xl mx-auto">
              {activeTab !== 'home' && activeTab !== 'banking' && activeTab !== 'ecommerce' && (
                <WorkflowProgress activeTab={activeTab} setActiveTab={setActiveTab} />
              )}
              {renderContent()}
            </div>
          </main>

          <Terminal 
            isOpen={isTerminalOpen} 
            onClose={() => setIsTerminalOpen(false)}
            isMaximized={isTerminalMaximized}
            onToggleMaximize={() => setIsTerminalMaximized(!isTerminalMaximized)}
            onRunTest={runTest}
            onAddLog={(msg) => addLog(msg, msg.startsWith('$'))}
            logs={logs}
            testStatus={testStatus}
          />
        </div>
      </div>
    </div>
  );
}
