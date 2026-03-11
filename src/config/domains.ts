export const DOMAINS = {
  trading: {
    id: 'trading',
    name: 'Trading',
    icon: '📈',
    tagline: 'ERC-8004 Governance',
    description: 'Agent de trading avec gouvernance ERC-8004 et validation on-chain.',
    features: ['Monte Carlo', 'Risk Gates', 'Capital Protection'],
    status: 'active' as const,
    route: '/trading',
    gradient: 'from-emerald-500/20 to-emerald-500/5'
  },
  banking: {
    id: 'banking',
    name: 'Banking',
    icon: '🏦',
    tagline: 'Ontological Decision Engine',
    description: 'Robot décisionnel bancaire autonome avec analyse de risque Gemini AI.',
    features: ['9 Tests Ontologiques', 'Gemini AI', 'ROI Real-time'],
    status: 'active' as const,
    route: '/banking',
    gradient: 'from-blue-500/20 to-blue-500/5'
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: '🛒',
    tagline: 'X-108 Safety Protocol',
    description: 'Sécurité structurelle X-108 et verrouillage temporel pour agents.',
    features: ['Temporal Lock', 'Coherence Scoring', '$X108 Token'],
    status: 'active' as const,
    route: '/ecommerce',
    gradient: 'from-orange-500/20 to-orange-500/5'
  }
} as const;

export type DomainId = keyof typeof DOMAINS;
