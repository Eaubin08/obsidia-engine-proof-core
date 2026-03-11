// config/strategy.ts
export const STRATEGY_CONFIG = {
  name: 'Capital Protection Agent',
  capital: 10000,
  assets: ['ETH', 'WBTC', 'USDC'],
  
  rules: {
    maxDrawdown: 0.10,
    maxPositionSize: 0.20,
    stopLoss: 0.03,
    rebalanceInterval: 24 * 60 * 60 * 1000 // 24h en ms
  },
  
  signals: [
    { name: 'RSI', condition: 'RSI < 30', action: 'BUY' },
    { name: 'MA Cross', condition: 'MA(7) > MA(30)', action: 'TREND_UP' },
    { name: 'Volume Spike', condition: 'Volume > 2x avg', action: 'ALERT' }
  ]
} as const;
