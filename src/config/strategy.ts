/**
 * Configuration de la stratégie de trading pour l'agent Obsidia.
 * Utilisé par le StrategyPanel pour afficher les règles de gestion du capital.
 */

export const STRATEGY_CONFIG = {
  name: "Akaton Alpha-1",
  description: "Stratégie de suivi de tendance agressive avec barrières de sécurité ERC-8004.",
  capital: 10000,
  assets: ["ETH", "BTC", "LINK", "ARB"],
  rules: {
    maxDrawdown: 0.10, // 10%
    maxPositionSize: 0.20, // 20% du capital par trade
    stopLoss: 0.03, // 3% par trade
    takeProfit: 0.09, // 9% par trade
  },
  signals: [
    {
      name: "RSI Oversold",
      condition: "RSI < 30",
      action: "BUY"
    },
    {
      name: "Trend Follow",
      condition: "Price > MA(30)",
      action: "HOLD/BUY"
    },
    {
      name: "Volatility Filter",
      condition: "Vol < 0.40",
      action: "ENABLE"
    }
  ]
};
