import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Users, 
  Globe,
  Lock,
  BarChart3,
  Rocket
} from 'lucide-react';
import { DOMAINS } from '../config/domains';
import { DomainCard } from '../components/DomainCard';

interface HomeDashboardProps {
  setActiveTab: (tab: string) => void;
}

export function HomeDashboard({ setActiveTab }: HomeDashboardProps) {
  const stats = [
    { label: 'Domains', value: '3', icon: Globe, color: 'text-blue-400' },
    { label: 'Agents', value: '142', icon: Users, color: 'text-emerald-400' },
    { label: 'Transactions', value: '8.4K', icon: Activity, color: 'text-purple-400' },
    { label: 'Global Score', value: '96.4', icon: Shield, color: 'text-amber-400' },
  ];

  const handleDomainClick = (id: string) => {
    if (id === 'trading') {
      setActiveTab('dashboard');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
            <Rocket className="w-3.5 h-3.5" />
            Platform v1.0 — Akaton, Launch Fund & Arc+Circle Hackathons
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase italic">
            <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Gouvernance IA
            </span>
            <br />
            <span className="text-white">Multi-Domaines</span>
          </h2>
          
          <p className="text-xl text-zinc-400 leading-relaxed font-light max-w-2xl mx-auto">
            Sélectionnez un domaine pour accéder aux outils de gouvernance autonome
            avec <strong className="text-white font-medium">validation on-chain</strong>, <strong className="text-white font-medium">audit complet</strong> et <strong className="text-white font-medium">traçabilité immuable</strong>.
          </p>
        </motion.div>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {(Object.keys(DOMAINS) as Array<keyof typeof DOMAINS>).map((id, index) => {
          const domain = DOMAINS[id];
          return (
            <div key={id}>
              <DomainCard
                id={domain.id}
                name={domain.name}
                icon={domain.icon}
                tagline={domain.tagline}
                description={domain.description}
                features={domain.features as unknown as string[]}
                status={domain.status}
                route={domain.route}
                gradient={domain.gradient}
                onClick={() => handleDomainClick(id)}
                index={index}
              />
            </div>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 border-y border-zinc-800/50 py-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="text-4xl font-black text-white tracking-tighter italic">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-800/30 pt-12">
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-xl">
            <Lock className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-white font-black mb-1 text-xs uppercase tracking-widest italic">Sécurité Structurelle</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Protocoles de protection multi-couches pour chaque domaine d'intervention.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-xl">
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-black mb-1 text-xs uppercase tracking-widest italic">Analyse Temps Réel</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Surveillance continue des métriques de risque et de performance.</p>
          </div>
        </div>
        <div className="flex gap-5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 shadow-xl">
            <Shield className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-white font-black mb-1 text-xs uppercase tracking-widest italic">Conformité ERC-8004</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">Standardisation de la gouvernance pour les agents autonomes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
