import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck, Clock, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface DomainCardProps {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  features: string[];
  status: 'active' | 'coming-soon';
  route: string;
  gradient: string;
  onClick: () => void;
  index: number;
}

export function DomainCard({
  id,
  name,
  icon,
  tagline,
  description,
  features,
  status,
  gradient,
  onClick,
  index
}: DomainCardProps) {
  const isActive = status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      whileHover={isActive ? { y: -10, transition: { duration: 0.2 } } : {}}
      onClick={isActive ? onClick : undefined}
      className={cn(
        "group relative flex flex-col h-full rounded-3xl overflow-hidden border transition-all duration-500",
        isActive 
          ? "cursor-pointer border-zinc-800 hover:border-zinc-600 bg-zinc-900/40 backdrop-blur-sm" 
          : "cursor-not-allowed border-zinc-900 bg-zinc-950/50 grayscale opacity-60"
      )}
    >
      {/* Background Gradient Glow */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700",
        gradient
      )} />

      {/* Card Content */}
      <div className="relative p-8 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
            isActive ? "bg-zinc-800 border border-zinc-700" : "bg-zinc-900 border border-zinc-800"
          )}>
            {icon}
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
            isActive 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500"
          )}>
            {isActive ? 'ACTIF' : 'BIENTÔT'}
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-8">
          <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase italic">
            {name}
          </h3>
          <p className="text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-4">
            {tagline}
          </p>
          <p className="text-zinc-400 leading-relaxed text-sm font-light">
            {description}
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-10 flex-grow">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
              <Zap className="w-3.5 h-3.5 text-zinc-700 group-hover:text-emerald-500/50 transition-colors shrink-0 mt-0.5" />
              <span className="leading-tight">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="pt-6 border-t border-zinc-800/50 flex items-center justify-between">
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest transition-colors",
            isActive ? "text-zinc-500 group-hover:text-white" : "text-zinc-700"
          )}>
            {isActive ? 'ACCÉDER AU MODULE' : 'EN DÉVELOPPEMENT'}
          </span>
          <ArrowRight className={cn(
            "w-5 h-5 transition-all",
            isActive ? "text-zinc-600 group-hover:text-white group-hover:translate-x-1" : "text-zinc-800"
          )} />
        </div>
      </div>
    </motion.div>
  );
}
