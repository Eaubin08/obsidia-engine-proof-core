import React, { useState, useEffect } from 'react';
import { CheckCircle2, Gavel, ShieldCheck, ShieldAlert, Shield, Play, RotateCcw, AlertCircle, Clock, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface OS3Props {
  mode: 'FIX' | 'AUTO';
  selectedScenario: number;
  testStatus: 'IDLE' | 'RUNNING' | 'COMPLETED';
  logs: string[];
  currentGate: number;
  outcome: any;
  onRunTest: () => void;
  onReset: () => void;
}

const scenarios = [
  { id: 1, label: 'BLOCK: Low Coherence', outcome: 'BLOCK', reason: 'G1 Integrity Failure' },
  { id: 2, label: 'HOLD: X-108 Timer', outcome: 'HOLD', reason: 'G2 Temporal Lock Active' },
  { id: 3, label: 'EXECUTE: All Pass', outcome: 'EXECUTE', reason: 'All Gates Verified' },
  { id: 4, label: 'BLOCK: Destructive Sim', outcome: 'BLOCK', reason: 'G3 Risk Threshold Exceeded' },
  { id: 5, label: 'EXECUTE: Reversible', outcome: 'EXECUTE', reason: 'All Gates Verified' },
];

export function OS3Governance({ 
  mode, 
  selectedScenario, 
  testStatus, 
  logs, 
  currentGate, 
  outcome, 
  onRunTest, 
  onReset 
}: OS3Props) {
  const [telemetry, setTelemetry] = useState({ cpu: 12, mem: 24, latency: 45 });
  const [showArtifact, setShowArtifact] = useState(false);
  const [command, setCommand] = useState('');
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'CODE'>('TERMINAL');
  const [selectedFile, setSelectedFile] = useState('ERC8004.test.ts');

  const fileContents: Record<string, string> = {
    'Integrity.gate.ts': `export class IntegrityGate {
  static async validate(intent: Intent) {
    const coherence = await HumanAlgebra.calculate(intent);
    if (coherence < 0.8) {
      return { status: 'BLOCK', reason: 'LOW_COHERENCE' };
    }
    return { status: 'PASS' };
  }
}`,
    'Temporal.gate.ts': `export class TemporalGate {
  static async validate(intent: Intent) {
    const lock = await OS0.getTemporalLock('X-108');
    if (lock.active) {
      return { status: 'HOLD', reason: 'TEMPORAL_LOCK_ACTIVE' };
    }
    return { status: 'PASS' };
  }
}`,
    'Risk.gate.ts': `export class RiskGate {
  static async validate(intent: Intent) {
    const sim = await SIM_LITE.run(intent, 10000);
    if (sim.ruinProbability > 0.01) {
      return { status: 'BLOCK', reason: 'EXCESSIVE_RISK' };
    }
    return { status: 'PASS' };
  }
}`,
    'ERC8004.test.ts': `import { describe, it, expect } from 'vitest';
import { IntegrityGate } from '../src/gates/Integrity';

describe('ERC-8004 Governance Protocol', () => {
  it('should pass G1 Integrity check', async () => {
    const intent = await loadIntent('INT_8F3A9C2B');
    const result = await IntegrityGate.validate(intent);
    expect(result.status).toBe('PASS');
  });

  it('should respect X-108 Temporal Lock', async () => {
    const lock = await getTemporalLock();
    if (lock.active) {
      expect(governance.outcome).toBe('HOLD');
    }
  });
});`
  };

  const testFiles = [
    { name: 'Integrity.gate.ts', path: 'src/gates/Integrity.gate.ts' },
    { name: 'Temporal.gate.ts', path: 'src/gates/Temporal.gate.ts' },
    { name: 'Risk.gate.ts', path: 'src/gates/Risk.gate.ts' },
    { name: 'ERC8004.test.ts', path: 'tests/ERC8004.test.ts' },
  ];

  const testSuite = [
    { id: 'T1', name: 'Schema Validation', status: 'IDLE' },
    { id: 'T2', name: 'Signature Verification', status: 'IDLE' },
    { id: 'T3', name: 'X-108 Lock Check', status: 'IDLE' },
    { id: 'T4', name: 'Volatility Analysis', status: 'IDLE' },
    { id: 'T5', name: 'SIM-LITE Stress Test', status: 'IDLE' },
    { id: 'T6', name: 'Ruin Probability Check', status: 'IDLE' },
  ];

  const getTestStatus = (id: string) => {
    if (testStatus === 'IDLE') return 'IDLE';
    if (testStatus === 'RUNNING') {
      const idx = testSuite.findIndex(t => t.id === id);
      const currentStep = Math.floor((currentGate / 3) * testSuite.length);
      if (idx < currentStep) return 'PASS';
      if (idx === currentStep) return 'RUNNING';
      return 'IDLE';
    }
    // COMPLETED
    const idx = testSuite.findIndex(t => t.id === id);
    if (outcome?.outcome === 'BLOCK') {
      if (outcome.reason.includes('G1') && idx < 2) return 'FAIL';
      if (outcome.reason.includes('G2') && idx < 4) return 'FAIL';
      if (outcome.reason.includes('G3') && idx < 6) return 'FAIL';
    }
    return 'PASS';
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim().toLowerCase();
    
    if (cmd === 'npm test' || cmd === 'obsidia run test' || cmd === 'vitest') {
      onRunTest();
    } else if (cmd === 'help') {
      // Help is handled by global terminal or we can add local feedback if needed
    }
    setCommand('');
  };

  useEffect(() => {
    let telemetryInterval: any;
    if (testStatus === 'RUNNING') {
      telemetryInterval = setInterval(() => {
        setTelemetry({
          cpu: Math.floor(Math.random() * 40) + 40,
          mem: Math.floor(Math.random() * 20) + 60,
          latency: Math.floor(Math.random() * 100) + 150
        });
      }, 200);
    } else {
      setTelemetry({ cpu: 12, mem: 24, latency: 45 });
    }
    return () => clearInterval(telemetryInterval);
  }, [testStatus]);

  const gates = [
    { 
      id: 'G1', 
      title: 'Integrity', 
      desc: 'Data Coherence & Source Verification', 
      icon: ShieldCheck,
      details: ['Schema Validated', 'Signatures Verified', 'Source: BTC_1h.csv'],
      failReason: 'Low Coherence Score (0.42 < 0.80)'
    },
    { 
      id: 'G2', 
      title: 'Temporal', 
      desc: 'X-108 Lock & Time Constraints', 
      icon: ShieldAlert,
      details: ['Lock: INACTIVE', 'Window: 3600s', 'Art. 3 Compliant'],
      failReason: 'X-108 Temporal Lock Active'
    },
    { 
      id: 'G3', 
      title: 'Risk', 
      desc: 'SIM-LITE Stress Test Validation', 
      icon: Shield,
      details: ['DD: 12.5% < 20%', 'Ruin: 0.01% < 1%', 'Art. 1 Compliant'],
      failReason: 'Ruin Probability > 1%'
    },
  ];

  const getGateStatus = (index: number) => {
    if (testStatus === 'IDLE') return 'PENDING';
    if (testStatus === 'RUNNING') {
      if (currentGate > index) return 'PASS';
      if (currentGate === index) return 'PROCESSING';
      return 'PENDING';
    }
    
    // COMPLETED
    if (outcome?.outcome === 'BLOCK') {
      if (outcome.reason.includes(gates[index].id)) return 'FAIL';
      if (gates.findIndex(g => outcome.reason.includes(g.id)) > index) return 'PASS';
      return 'SKIPPED';
    }
    if (outcome?.outcome === 'HOLD') {
      if (outcome.reason.includes(gates[index].id)) return 'HOLD';
      if (gates.findIndex(g => outcome.reason.includes(g.id)) > index) return 'PASS';
      return 'SKIPPED';
    }
    return 'PASS';
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            <Gavel className="w-3 h-3" />
            Decision Authorization
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">OS3 - Governance</h1>
          <p className="text-zinc-500 mt-3 text-lg max-w-2xl font-medium leading-relaxed">
            Multi-stage gate system. Every intent must pass through three distinct validation layers before an ERC-8004 artifact is signed.
          </p>
        </div>
        <div className="flex gap-3">
          {testStatus === 'COMPLETED' && outcome?.outcome === 'EXECUTE' && (
            <button 
              onClick={() => setShowArtifact(true)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-black px-8 py-3 rounded-2xl flex items-center gap-3 transition-all border border-zinc-700"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase">View Artifact</span>
            </button>
          )}
          {testStatus === 'IDLE' ? (
            <button 
              onClick={onRunTest}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-3 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span className="text-sm tracking-widest uppercase">Run Live Test</span>
            </button>
          ) : (
            <button 
              onClick={onReset}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-black px-8 py-3 rounded-2xl flex items-center gap-3 transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="text-sm tracking-widest uppercase">Reset Pipeline</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-10 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 relative z-10">
          {gates.map((gate, i) => {
            const status = getGateStatus(i);
            return (
              <div key={i} className={cn("flex flex-col transition-opacity duration-500", status === 'SKIPPED' ? "opacity-30" : "opacity-100")}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl bg-zinc-950 border flex items-center justify-center shadow-inner transition-colors duration-500",
                    status === 'PASS' ? "border-emerald-500/50 text-emerald-400" :
                    status === 'FAIL' ? "border-red-500/50 text-red-400" :
                    status === 'HOLD' ? "border-amber-500/50 text-amber-400" :
                    status === 'PROCESSING' ? "border-blue-500/50 text-blue-400 animate-pulse" :
                    "border-zinc-800 text-zinc-600"
                  )}>
                    <gate.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">{gate.id} GATE</div>
                    <div className="text-lg font-black text-white uppercase italic tracking-tight">{gate.title}</div>
                  </div>
                </div>
                <div className="flex-1 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 p-6 mb-4">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">{gate.desc}</div>
                  <div className="space-y-2">
                    {status === 'FAIL' ? (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 bg-red-500/5 p-2 rounded border border-red-500/20">
                        <AlertCircle className="w-3 h-3" />
                        {gate.failReason}
                      </div>
                    ) : status === 'HOLD' ? (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-amber-500/5 p-2 rounded border border-amber-500/20">
                        <Clock className="w-3 h-3" />
                        {gate.failReason}
                      </div>
                    ) : (
                      gate.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                          <div className={cn("w-1 h-1 rounded-full", status === 'PASS' ? "bg-emerald-500" : "bg-zinc-700")}></div>
                          {detail}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className={cn(
                  "border rounded-xl py-3 text-center transition-all duration-500",
                  status === 'PASS' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                  status === 'FAIL' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                  status === 'HOLD' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                  status === 'PROCESSING' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                  "bg-zinc-900/50 border-zinc-800 text-zinc-600"
                )}>
                  <span className="text-xs font-black tracking-[0.3em] uppercase">{status}</span>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col justify-center">
            {testStatus === 'COMPLETED' ? (
              <div className={cn(
                "rounded-[2rem] p-8 text-center shadow-2xl border-4 relative group overflow-hidden transition-all duration-700",
                outcome?.outcome === 'EXECUTE' ? "bg-emerald-500 border-emerald-400/20 shadow-emerald-500/30" :
                outcome?.outcome === 'BLOCK' ? "bg-red-500 border-red-400/20 shadow-red-500/30" :
                "bg-amber-500 border-amber-400/20 shadow-amber-500/30"
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {outcome?.outcome === 'EXECUTE' ? <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-6 drop-shadow-lg" /> :
                 outcome?.outcome === 'BLOCK' ? <ShieldAlert className="w-16 h-16 text-white mx-auto mb-6 drop-shadow-lg" /> :
                 <Clock className="w-16 h-16 text-white mx-auto mb-6 drop-shadow-lg" />}
                <div className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase mb-1">FINAL VERDICT</div>
                <div className="text-4xl font-black text-white italic uppercase tracking-tighter">{outcome?.outcome}</div>
              </div>
            ) : (
              <div className="bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-[2rem] p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                <div className={cn("w-12 h-12 rounded-full border-2 border-zinc-800 border-t-zinc-400 mb-4", testStatus === 'RUNNING' && "animate-spin")}></div>
                <div className="text-[10px] font-black text-zinc-600 tracking-[0.2em] uppercase">
                  {testStatus === 'IDLE' ? 'Awaiting Input' : 'Processing Intent'}
                </div>
              </div>
            )}
            <p className="text-[10px] text-center text-zinc-500 font-bold mt-6 uppercase tracking-widest leading-loose">
              {testStatus === 'COMPLETED' ? (
                outcome?.outcome === 'EXECUTE' ? 'INTENT AUTHORIZED\nSIGNING ERC-8004...' :
                outcome?.outcome === 'BLOCK' ? 'INTENT REJECTED\nINVARIANT BREACH DETECTED' :
                'INTENT HELD\nTEMPORAL LOCK ENGAGED'
              ) : 'PIPELINE READY'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 backdrop-blur-sm flex flex-col">
          <h3 className="text-sm font-black text-white uppercase italic tracking-tight mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-500" />
            Explorer
          </h3>
          <div className="space-y-1 flex-1">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2 px-2">src/gates</div>
            {testFiles.slice(0, 3).map((file) => (
              <div 
                key={file.name} 
                onClick={() => { setSelectedFile(file.name); setActiveTab('CODE'); }}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                  selectedFile === file.name ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-zinc-800/50 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <FileText className={cn("w-3 h-3", selectedFile === file.name ? "text-emerald-400" : "text-zinc-500")} />
                  <span className={cn("text-[10px] font-mono", selectedFile === file.name ? "text-emerald-200" : "text-zinc-400 group-hover:text-zinc-200")}>{file.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRunTest(); }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-emerald-500/20 rounded transition-all"
                >
                  <Play className="w-2.5 h-2.5 text-emerald-500 fill-current" />
                </button>
              </div>
            ))}
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-6 mb-2 px-2">tests/</div>
            <div 
              onClick={() => { setSelectedFile('ERC8004.test.ts'); setActiveTab('CODE'); }}
              className={cn(
                "group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                selectedFile === 'ERC8004.test.ts' ? "bg-emerald-500/10 border border-emerald-500/20" : "hover:bg-zinc-800/50 border border-transparent"
              )}
            >
              <div className="flex items-center gap-2">
                <FileText className={cn("w-3 h-3", selectedFile === 'ERC8004.test.ts' ? "text-emerald-400" : "text-zinc-500")} />
                <span className={cn("text-[10px] font-mono", selectedFile === 'ERC8004.test.ts' ? "text-emerald-200" : "text-zinc-400 group-hover:text-zinc-200")}>ERC8004.test.ts</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onRunTest(); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-emerald-500/20 rounded transition-all"
              >
                <Play className="w-2.5 h-2.5 text-emerald-500 fill-current" />
              </button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-zinc-800/50">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Test Suite Status</div>
            <div className="space-y-2">
              {testSuite.map((test) => {
                const status = getTestStatus(test.id);
                return (
                  <div key={test.id} className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-600">{test.name}</span>
                    <span className={cn(
                      status === 'PASS' ? "text-emerald-500" :
                      status === 'FAIL' ? "text-red-500" :
                      status === 'RUNNING' ? "text-blue-500" :
                      "text-zinc-800"
                    )}>{status}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-black border border-zinc-800 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-2xl relative">
          <div className="flex items-center bg-zinc-900/50 border-b border-zinc-800 px-4">
            <button 
              onClick={() => setActiveTab('TERMINAL')}
              className={cn(
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                activeTab === 'TERMINAL' ? "text-white border-emerald-500 bg-zinc-800/30" : "text-zinc-500 border-transparent hover:text-zinc-300"
              )}
            >
              Terminal
            </button>
            <button 
              onClick={() => setActiveTab('CODE')}
              className={cn(
                "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2",
                activeTab === 'CODE' ? "text-white border-emerald-500 bg-zinc-800/30" : "text-zinc-500 border-transparent hover:text-zinc-300"
              )}
            >
              {selectedFile}
            </button>
          </div>

          <div className="flex-1 p-6 font-mono text-xs overflow-hidden flex flex-col">
            {activeTab === 'TERMINAL' ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                  {logs.length === 0 ? (
                    <div className="text-zinc-700">
                      <p>Obsidia Governance Shell v1.0.4</p>
                      <p className="mt-2 italic">Type 'npm test' or click a 'Play' icon in the explorer to begin...</p>
                    </div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className={cn(
                        "flex gap-4",
                        log.includes('PASS') || log.includes('✓') ? "text-emerald-400" :
                        log.includes('FAIL') || log.includes('BLOCK') ? "text-red-400" :
                        log.includes('HOLD') || log.includes('WARNING') ? "text-amber-400" :
                        log.startsWith('$') ? "text-zinc-200 font-bold" :
                        "text-zinc-500"
                      )}>
                        {log.startsWith('$') ? (
                          <span className="text-emerald-500 shrink-0">user@obsidia:~/gov$</span>
                        ) : (
                          <span className="opacity-30 select-none shrink-0 w-4">{i + 1}</span>
                        )}
                        <span className="whitespace-pre-wrap">{log.replace(/^\$ /, '')}</span>
                      </div>
                    ))
                  )}
                  {testStatus === 'RUNNING' && (
                    <div className="flex gap-4 text-emerald-400 animate-pulse">
                      <span className="opacity-30 select-none w-4">{logs.length + 1}</span>
                      <span>_</span>
                    </div>
                  )}
                </div>
                <form onSubmit={handleCommand} className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-3">
                  <span className="text-emerald-500 font-bold shrink-0">user@obsidia:~/gov$</span>
                  <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="npm test"
                    className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-800"
                    autoFocus
                  />
                </form>
              </>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar text-zinc-400">
                <pre className="leading-relaxed">
                  {fileContents[selectedFile]}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-6">Human Algebra Score</h3>
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-full border-8 border-zinc-800 flex items-center justify-center relative">
                <div className={cn(
                  "absolute inset-0 rounded-full border-8 border-t-transparent -rotate-45 transition-all duration-1000",
                  testStatus === 'COMPLETED' && outcome?.outcome === 'BLOCK' && outcome.reason.includes('G1') ? "border-red-500" : "border-emerald-500"
                )}></div>
                <span className="text-3xl font-black text-white italic">
                  {testStatus === 'COMPLETED' && outcome?.outcome === 'BLOCK' && outcome.reason.includes('G1') ? '0.42' : '0.92'}
                </span>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                  Qualitative assessment of market coherence. A score above 0.80 is required.
                </p>
                <div className="flex flex-wrap gap-2">
                  {testStatus === 'COMPLETED' && outcome?.outcome === 'BLOCK' && outcome.reason.includes('G1') ? (
                    <>
                      <span className="px-3 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-lg border border-red-500/20 uppercase tracking-widest">UNSTABLE_REGIME</span>
                    </>
                  ) : (
                    <>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 uppercase tracking-widest">STABLE_REGIME</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-6">Test Coverage</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Invariants Covered</span>
              <span className="text-lg font-black text-white italic">94.2%</span>
            </div>
            <div className="w-full bg-zinc-800/50 rounded-full h-3 overflow-hidden mb-8">
              <div className="h-full bg-emerald-500 w-[94.2%] transition-all duration-1000"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
                <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Passed</div>
                <div className="text-xl font-black text-emerald-500 italic">{testStatus === 'COMPLETED' ? (outcome?.outcome === 'EXECUTE' ? '6/6' : '4/6') : '0/6'}</div>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
                <div className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Failed</div>
                <div className="text-xl font-black text-red-500 italic">{testStatus === 'COMPLETED' && outcome?.outcome === 'BLOCK' ? '1/6' : '0/6'}</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-6">Live Telemetry</h3>
            <div className="space-y-6">
              {[
                { label: 'CPU LOAD', value: `${telemetry.cpu}%`, color: 'bg-emerald-500' },
                { label: 'MEMORY USAGE', value: `${telemetry.mem}%`, color: 'bg-blue-500' },
                { label: 'NETWORK LATENCY', value: `${telemetry.latency}ms`, color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={cn("h-full transition-all duration-300", item.color)} 
                      style={{ width: item.label.includes('LATENCY') ? `${(telemetry.latency / 300) * 100}%` : item.value }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-8 border-b border-zinc-800/50">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Gate Definitions & Authorization Logic</h3>
          <p className="text-zinc-500 text-xs mt-2 font-medium uppercase tracking-widest">The OS3 Governance Pipeline</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50">
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">Gate</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">Validation Logic</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {[
                { 
                  name: 'G1: Integrity', 
                  logic: 'Schema validation and cryptographic signature check.', 
                  purpose: 'Ensures the intent is correctly formatted and comes from a trusted agent.' 
                },
                { 
                  name: 'G2: Temporal', 
                  logic: 'Checks against the X-108 lock and current market volatility.', 
                  purpose: 'Prevents execution during periods of extreme uncertainty or system stress.' 
                },
                { 
                  name: 'G3: Risk', 
                  logic: 'Validates SIM-LITE results against constitutional risk thresholds.', 
                  purpose: 'Final safety check to ensure the intent doesn\'t violate ruin probability limits.' 
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="p-6">
                    <div className="text-sm font-bold text-white uppercase italic tracking-tight">{row.name}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs text-zinc-400 font-medium leading-relaxed">{row.logic}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs text-zinc-500 font-medium italic">{row.purpose}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">ERC-8004 Artifact</h2>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Signed Intent Payload</p>
              </div>
              <button 
                onClick={() => setShowArtifact(false)}
                className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all"
              >
                ×
              </button>
            </div>
            <div className="p-8 font-mono text-xs text-emerald-400 bg-black h-[500px] overflow-y-auto custom-scrollbar">
              <pre>{JSON.stringify({
                version: "1.0.0",
                intent_id: `int_${Math.random().toString(16).slice(2, 10)}`,
                timestamp: new Date().toISOString(),
                protocol: "ERC-8004",
                governance_layer: "OS3",
                gates: [
                  { id: "G1", status: "PASSED", hash: "0x8f3a...2b" },
                  { id: "G2", status: "PASSED", hash: "0x1c9e...4a" },
                  { id: "G3", status: "PASSED", hash: "0x5d2f...8c" }
                ],
                payload: {
                  action: "REBALANCE_PORTFOLIO",
                  params: {
                    target: "BTC/USDT",
                    leverage: "2.5x",
                    risk_limit: "0.05"
                  }
                },
                signatures: [
                  { signer: "G1_VALIDATOR", sig: "0x..." },
                  { signer: "G2_VALIDATOR", sig: "0x..." },
                  { signer: "G3_VALIDATOR", sig: "0x..." }
                ]
              }, null, 2)}</pre>
            </div>
            <div className="p-6 bg-zinc-900/50 border-t border-zinc-800 flex justify-end">
              <button 
                onClick={() => setShowArtifact(false)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-3 rounded-2xl text-sm uppercase tracking-widest transition-all"
              >
                Close Artifact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
