/**
 * Human Algebra for qualitative representation of governance metrics.
 * Ported from src/score/human_algebra.py in MVP-obsidia-
 */

export function qualitativeLevel(value: number): string {
  /** Convert a value [0,1] into a qualitative symbol. */
  if (value >= 0.75) {
    return "↑↑";
  } else if (value >= 0.55) {
    return "↑";
  } else if (value >= 0.45) {
    return "≈";
  } else if (value >= 0.25) {
    return "↓";
  } else {
    return "↓↓";
  }
}

export function getFeaturesSummary(features: {
  volatility: number;
  coherence: number;
  friction: number;
  regime: string;
}): string {
  /** Algebraic summary of features. */
  const stability = 1.0 - features.volatility;
  
  return `S${qualitativeLevel(stability)}  C${qualitativeLevel(features.coherence)}  F${qualitativeLevel(features.friction)}  | regime=${features.regime}`;
}

export function getGatesExplainer(gatesResult: {
  decision: string;
  reason: string;
  laws?: string[];
}): string {
  /** Textual explanation of gates. */
  const lawsText = gatesResult.laws?.length 
    ? gatesResult.laws.map(law => `- ${law}`).join("\n")
    : "—";
    
  return `Décision: ${gatesResult.decision}
Raison: ${gatesResult.reason}
Lois activées:
${lawsText}`;
}
