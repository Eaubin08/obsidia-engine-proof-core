import { Transaction, BankingMetrics, OntologicalTests, BankingDecision } from '../../types';

export function calculateIrreversibility(tx: Transaction): number {
  // Higher for larger amounts and specific types like TRANSFER
  const base = tx.amount > 50000 ? 0.6 : 0.2;
  const typeMod = tx.type === 'TRANSFER' ? 0.3 : 0.1;
  return Math.min(base + typeMod, 1.0);
}

export function calculateConflictZone(tx: Transaction): number {
  // Higher if recipient is unknown or offshore
  const isSuspicious = tx.recipient.toLowerCase().includes('unknown') || 
                      tx.recipient.toLowerCase().includes('offshore');
  return isSuspicious ? 0.85 : 0.15;
}

export function calculateTimeSensitivity(tx: Transaction): number {
  // Higher for rapid successions or large amounts
  return tx.amount > 100000 ? 0.75 : 0.25;
}

export function calculateTotalGuard(tx: Transaction): number {
  // Global risk score
  const ir = calculateIrreversibility(tx);
  const ciz = calculateConflictZone(tx);
  const dts = calculateTimeSensitivity(tx);
  return (ir * 0.4 + ciz * 0.4 + dts * 0.2);
}

export function calculateMetrics(transaction: Transaction): BankingMetrics {
  return {
    IR: calculateIrreversibility(transaction),
    CIZ: calculateConflictZone(transaction),
    DTS: calculateTimeSensitivity(transaction),
    TSG: calculateTotalGuard(transaction),
  };
}

export function runOntologicalTests(tx: Transaction, metrics: BankingMetrics): OntologicalTests {
  return {
    identityVerified: !tx.sender.toLowerCase().includes('unknown'),
    intentClear: tx.amount < 500000,
    sourceLegit: tx.sender.toLowerCase().includes('vault') || tx.sender.toLowerCase().includes('ops'),
    destinationSafe: !tx.recipient.toLowerCase().includes('offshore'),
    velocityNormal: true, // Simplified for now
    patternMatch: tx.amount % 1000 !== 0, // Round numbers are suspicious
    complianceCheck: true,
    riskThreshold: metrics.TSG < 0.7,
    liquidityCheck: true,
  };
}

export function makeDecision(
  metrics: BankingMetrics,
  tests: OntologicalTests
): { decision: BankingDecision; confidence: number } {
  const passedTests = Object.values(tests).filter(Boolean).length;
  const precision = (passedTests / 9) * 100;

  if (precision >= 90 && metrics.TSG < 0.3) {
    return { decision: 'AUTHORIZE', confidence: precision };
  }
  if (precision >= 70 || metrics.TSG < 0.6) {
    return { decision: 'ANALYZE', confidence: precision };
  }
  return { decision: 'BLOCK', confidence: precision };
}
