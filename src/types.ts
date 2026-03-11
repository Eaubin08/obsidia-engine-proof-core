// Banking Types
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  sender: string;
  timestamp: number;
  type: 'TRANSFER' | 'PAYMENT' | 'WITHDRAWAL';
  metadata?: Record<string, any>;
}

export interface BankingMetrics {
  IR: number; // Irreversibility
  CIZ: number; // Conflict Zone
  DTS: number; // Time Sensitivity
  TSG: number; // Total Guard
}

export interface OntologicalTests {
  identityVerified: boolean;
  intentClear: boolean;
  sourceLegit: boolean;
  destinationSafe: boolean;
  velocityNormal: boolean;
  patternMatch: boolean;
  complianceCheck: boolean;
  riskThreshold: boolean;
  liquidityCheck: boolean;
}

export type BankingDecision = 'AUTHORIZE' | 'ANALYZE' | 'BLOCK';

export interface BankingResult {
  decision: BankingDecision;
  confidence: number;
  metrics: BankingMetrics;
  justification?: string;
}

// E-commerce Types
export interface AgentAction {
  id: string;
  agent_id: string;
  type: 'PURCHASE' | 'BID' | 'LIST';
  amount: number;
  recipient: string;
  timestamp: number;
  coherence: number;
}

export interface SafetyGateResult {
  decision: 'ALLOW' | 'BLOCK';
  reason: string;
  coherence: number;
  temporal_delta: number;
}

export interface TokenomicsModel {
  fee_rate: number;
  staker_share: number;
  treasury_share: number;
  buyback_share: number;
}
