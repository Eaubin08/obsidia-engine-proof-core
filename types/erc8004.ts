// types/erc8004.ts
export interface Features {
  volatility: number;
  coherence: number;
  friction: number;
  regime: 'BULL' | 'BEAR' | 'RANGE';
}

export interface ERC8004Intent {
  agentId: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  asset: string;
  amount: number;
  limitPrice: number;
  timestamp: number;
  signature: string;
  governanceProof: {
    features: Features;
    simulation: any;
    gates: any[];
  };
}
