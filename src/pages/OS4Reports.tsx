import React from 'react';
import { Download, FileText, RotateCcw, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { ModuleHeader } from '../components/ModuleHeader';

interface OS4Props {
  mode: 'FIX' | 'AUTO';
  testType: 'AUTONOMOUS' | 'FIXED';
  setTestType: (type: 'AUTONOMOUS' | 'FIXED') => void;
  selectedScenario: number;
  testStatus: 'IDLE' | 'RUNNING' | 'COMPLETED';
  logs: string[];
  currentGate: number;
  confidenceScore: number;
  outcome: any;
  onRunTest: () => void;
  onReset: () => void;
}

export function OS4Reports({ 
  mode, 
  testType, 
  setTestType, 
  selectedScenario, 
  testStatus, 
  logs, 
  currentGate, 
  confidenceScore,
  outcome, 
  onRunTest, 
  onReset 
}: OS4Props) {
  const scenarioOutcomes = [
    'BLOCK: Low Coherence',
    'HOLD: X-108 Timer',
    'EXECUTE: All Pass',
    'BLOCK: Destructive Sim',
    'EXECUTE: Reversible'
  ];

  const currentOutcome = mode === 'FIX' ? scenarioOutcomes[selectedScenario - 1] : 'RANDOM_WALK';
  const isAuthorized = selectedScenario === 3 || selectedScenario === 5;

  const runValidation = (type: 'AUTONOMOUS' | 'FIXED') => {
    setTestType(type);
    onRunTest();
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/artifacts');
      const data = await res.json();
      
      // Create a blob and download it as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `obsidia-artifact-${data.artifactId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Artifact exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export artifact.');
    }
  };

  return (
    <div className="space-y-10">
      <ModuleHeader 
        moduleName="Trading" 
        moduleIcon="📈" 
        currentPage="AI Audit Reports" 
        progress={testStatus === 'COMPLETED' ? 100 : testStatus === 'RUNNING' ? 50 : 0}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">
            <FileText className="w-3 h-3" />
            Compliance Artifacts
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">OS4 - Reports</h1>
          <p className="text-zinc-500 mt-3 text-lg max-w-2xl font-medium leading-relaxed">
            Immutable audit trails. Download signed ERC-8004 intents and comprehensive governance reports for regulatory compliance.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="bg-white text-black px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-xl shadow-white/10"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Akaton Validation Suite */}
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div>
              <div className="text-[10px] font-black text-emerald-500 tracking-[0.3em] uppercase mb-2">Akaton Test Center</div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Validation Suite</h2>
              <p className="text-zinc-500 text-sm mt-2 font-medium leading-relaxed">
                Launch specialized validation routines for the Akaton report. Select between autonomous AI-driven audits or fixed deterministic tests.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => runValidation('AUTONOMOUS')}
                disabled={testStatus === 'RUNNING'}
                className={cn(
                  "p-6 rounded-3xl border transition-all text-left flex flex-col gap-4 group",
                  testType === 'AUTONOMOUS' && testStatus !== 'IDLE' ? "bg-emerald-500 border-emerald-400" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  testType === 'AUTONOMOUS' && testStatus !== 'IDLE' ? "bg-white/20 text-white" : "bg-zinc-900 text-emerald-500 group-hover:bg-emerald-500/10"
                )}>
                  <RotateCcw className={cn("w-5 h-5", testType === 'AUTONOMOUS' && testStatus === 'RUNNING' && "animate-spin")} />
                </div>
                <div>
                  <div className={cn("text-xs font-black uppercase tracking-widest", testType === 'AUTONOMOUS' && testStatus !== 'IDLE' ? "text-white" : "text-white")}>Autonomous</div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest", testType === 'AUTONOMOUS' && testStatus !== 'IDLE' ? "text-white/60" : "text-zinc-500")}>AI-Driven Audit</div>
                </div>
              </button>

              <button 
                onClick={() => runValidation('FIXED')}
                disabled={testStatus === 'RUNNING'}
                className={cn(
                  "p-6 rounded-3xl border transition-all text-left flex flex-col gap-4 group",
                  testType === 'FIXED' && testStatus !== 'IDLE' ? "bg-blue-500 border-blue-400" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  testType === 'FIXED' && testStatus !== 'IDLE' ? "bg-white/20 text-white" : "bg-zinc-900 text-blue-500 group-hover:bg-blue-500/10"
                )}>
                  <Download className={cn("w-5 h-5", testType === 'FIXED' && testStatus === 'RUNNING' && "animate-pulse")} />
                </div>
                <div>
                  <div className={cn("text-xs font-black uppercase tracking-widest", testType === 'FIXED' && testStatus !== 'IDLE' ? "text-white" : "text-white")}>Fixed</div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest", testType === 'FIXED' && testStatus !== 'IDLE' ? "text-white/60" : "text-zinc-500")}>Deterministic Test</div>
                </div>
              </button>
            </div>

            {testStatus === 'COMPLETED' && (
              <div className="space-y-4">
                <button 
                  onClick={onReset}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-zinc-700"
                >
                  Reset Validation Suite
                </button>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Akaton Certification</div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                    This report has been certified by the Akaton Autonomous Audit Agent. ERC-8004 compliance is guaranteed for the current epoch.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-black rounded-3xl border border-zinc-800 p-8 h-[320px] flex flex-col relative overflow-hidden">
              {testStatus === 'IDLE' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center">
                    <Play className="w-6 h-6 text-zinc-700" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Awaiting Launch</div>
                    <div className="text-xs text-zinc-700 font-medium mt-1 uppercase tracking-widest italic">Select test type above</div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full animate-pulse",
                        testStatus === 'RUNNING' ? "bg-blue-500" : "bg-emerald-500"
                      )}></div>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        {testType} VALIDATION {testStatus === 'RUNNING' ? 'IN PROGRESS' : 'COMPLETED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={cn(
                                "h-full transition-all duration-500",
                                confidenceScore > 80 ? "bg-emerald-500" : confidenceScore > 50 ? "bg-blue-500" : "bg-zinc-500"
                              )} 
                              style={{ width: `${confidenceScore}%` }}
                            ></div>
                          </div>
                          <span className={cn(
                            "text-[10px] font-mono font-bold",
                            confidenceScore > 80 ? "text-emerald-500" : confidenceScore > 50 ? "text-blue-500" : "text-zinc-500"
                          )}>
                            {confidenceScore}%
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {testStatus === 'RUNNING' ? `${Math.floor((currentGate / 3) * 100)}%` : '100%'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
                    {logs.slice(-12).map((log, i) => {
                      const isAI = log.includes('[AI]');
                      const isPass = log.includes('PASS') || log.includes('✓');
                      const isAkaton = log.includes('Akaton');
                      return (
                        <div key={i} className="flex gap-3 text-[10px] font-mono">
                          <span className="text-zinc-800 shrink-0">{i + 1}</span>
                          <span className={cn(
                            isPass ? "text-emerald-400" :
                            isAI ? "text-blue-400 italic" :
                            isAkaton ? "text-zinc-200 font-bold" :
                            log.includes('FAIL') || log.includes('BLOCK') ? "text-red-400" :
                            "text-zinc-500"
                          )}>{log.replace(/\x1b\[[0-9;]*m/g, '')}</span>
                        </div>
                      );
                    })}
                    {testStatus === 'RUNNING' && <div className="text-blue-500 animate-pulse">_</div>}
                  </div>

                  {testStatus === 'COMPLETED' && (
                    <div className={cn(
                      "mt-6 p-4 rounded-2xl border text-center",
                      outcome?.outcome === 'EXECUTE' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                      <div className="text-[10px] font-black uppercase tracking-widest mb-1">Validation Result</div>
                      <div className="text-xl font-black italic uppercase tracking-tight">{outcome?.outcome}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
            <div className="border-b border-zinc-800/50 p-8 bg-zinc-900/20 flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Recent Artifacts</h3>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Showing 5 of 128</span>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {[
                { id: `AKATON-COMPLIANCE-2026`, type: 'HACKATHON_SPEC', time: 'Just now', status: 'READY', size: '4.2MB', confidence: testStatus === 'COMPLETED' ? confidenceScore : null },
                { id: `ERC-8004-${Math.random().toString(16).slice(2, 6)}`, type: 'SIGNED_INTENT', time: '2 mins ago', status: isAuthorized ? 'VERIFIED' : 'REJECTED', size: '12KB' },
                { id: `GOV-REPORT-${Math.random().toString(16).slice(2, 6)}`, type: 'AUDIT_LOG', time: '15 mins ago', status: 'SIGNED', size: '2.4MB' },
                { id: `SIM-DATA-${Math.random().toString(16).slice(2, 6)}`, type: 'MC_RESULTS', time: '1 hour ago', status: 'ARCHIVED', size: '156MB' },
                { id: `ERC-8004-${Math.random().toString(16).slice(2, 6)}`, type: 'SIGNED_INTENT', time: '3 hours ago', status: 'VERIFIED', size: '12KB' },
              ].map((report, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-zinc-800/20 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                      <FileText className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="text-sm font-black text-white uppercase italic tracking-tight">{report.id}</div>
                        {report.confidence && (
                          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                            {report.confidence}% Confidence
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{report.type}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{report.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <div className={cn(
                        "text-[10px] font-black tracking-widest uppercase mb-1",
                        report.status === 'REJECTED' ? "text-red-400" : "text-emerald-400"
                      )}>{report.status}</div>
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{report.size}</div>
                    </div>
                    <button className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-8">ERC-8004 Preview</h3>
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 font-mono text-[10px] text-zinc-400 leading-relaxed overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <div className={cn(
                  "w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]",
                  isAuthorized ? "bg-emerald-500" : "bg-red-500"
                )}></div>
              </div>
              <pre className="whitespace-pre-wrap">
{`{
  "protocol": "ERC-8004",
  "intent_id": "int_${Math.random().toString(16).slice(2, 10)}",
  "timestamp": ${Math.floor(Date.now() / 1000)},
  "governance": {
    "os0": "COMPLIANT",
    "os1": "${selectedScenario === 1 ? 'UNSTABLE' : 'STABLE'}",
    "os2": "${selectedScenario === 4 ? 'RISKY' : 'SAFE'}",
    "os3": "${isAuthorized ? 'AUTHORIZED' : 'REJECTED'}"
  },
  "outcome": "${currentOutcome}",
  "signature": "0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6).toUpperCase()}"
}`}
              </pre>
            </div>
            <button className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-zinc-700">
              Copy JSON
            </button>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-8">System Health</h3>
            <div className="space-y-6">
              {[
                { label: 'Storage Usage', value: '42%', color: 'bg-blue-500' },
                { label: 'Audit Integrity', value: '100%', color: 'bg-emerald-500' },
                { label: 'Sync Status', value: '98%', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="text-white">{item.value}</span>
                  </div>
                  <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: item.value }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-8 border-b border-zinc-800/50">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Artifact Definitions & Compliance Purpose</h3>
          <p className="text-zinc-500 text-xs mt-2 font-medium uppercase tracking-widest">The OS4 Reporting Layer</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950/50">
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">Artifact Type</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">Content</th>
                <th className="p-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {[
                { 
                  name: 'SIGNED_INTENT', 
                  content: 'ERC-8004 JSON payload with cryptographic signatures.', 
                  purpose: 'The final authorized trade instruction for execution.' 
                },
                { 
                  name: 'AUDIT_LOG', 
                  content: 'Detailed trace of all OS0-OS3 gate decisions.', 
                  purpose: 'Provides full transparency for regulatory review and internal audits.' 
                },
                { 
                  name: 'MC_RESULTS', 
                  content: 'Raw data from the SIM-LITE Monte Carlo simulations.', 
                  purpose: 'Evidence of risk assessment and stress testing compliance.' 
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-800/20 transition-colors group">
                  <td className="p-6">
                    <div className="text-sm font-bold text-white uppercase italic tracking-tight">{row.name}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-xs text-zinc-400 font-medium leading-relaxed">{row.content}</div>
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
    </div>
  );
}
