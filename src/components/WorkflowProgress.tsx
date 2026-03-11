import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface WorkflowProgressProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function WorkflowProgress({ activeTab, setActiveTab }: WorkflowProgressProps) {
  const steps = [
    { id: 'step1', label: 'Identity' },
    { id: 'step2', label: 'Capital' },
    { id: 'step3', label: 'Execution' },
    { id: 'step4', label: 'Validation' },
    { id: 'step5', label: 'Ranking' },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeTab);
  
  if (currentStepIndex === -1 && activeTab !== 'dashboard') return null;
  if (activeTab === 'dashboard') return null;

  return (
    <div className="mb-12 overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
      <div className="flex items-center justify-center gap-2 min-w-[450px] max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          
          return (
            <React.Fragment key={step.id}>
              <button 
                onClick={() => setActiveTab(step.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 group outline-none",
                  isActive 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                    : isCompleted 
                      ? "bg-zinc-900/50 border-emerald-500/20 text-zinc-400 hover:border-emerald-500/40" 
                      : "bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg flex items-center justify-center border transition-all duration-500",
                  isActive ? "bg-emerald-500 border-emerald-400 text-black" :
                  isCompleted ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                  "bg-zinc-900 border-zinc-800 text-zinc-700"
                )}>
                  {isCompleted ? <Check className="w-3.5 h-3.5 font-bold" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {step.label}
                </span>
              </button>
              
              {index < steps.length - 1 && (
                <ChevronRight className={cn(
                  "w-4 h-4 shrink-0 transition-colors duration-500",
                  isCompleted ? "text-emerald-500/50" : "text-zinc-800"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
