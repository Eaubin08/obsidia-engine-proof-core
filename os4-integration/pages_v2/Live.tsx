/**
 * Live — console du présent OS4 V2
 * Feed de Decision Envelope Cards en temps réel + top contributors + proof snapshot
 * Règle UX : jamais de données inventées — toujours indiquer le mode (DEMO/SIMU/LIVE)
 */
import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useWorld, DOMAIN_COLORS, type WorldDomain } from "@/contexts/WorldContext";
import DecisionEnvelopeCard, { type CanonicalEnvelope } from "@/components/canonical/DecisionEnvelopeCard";
import ProofChainView, { type ProofChain } from "@/components/canonical/ProofChainView";

// ─── Mock feed ────────────────────────────────────────────────────────────────

const MOCK_FEED: CanonicalEnvelope[] = [
  {
    domain: "trading",
    market_verdict: "BUY_SIGNAL_CONFIRMED",
    confidence: 0.87,
    contradictions: 1,
    unknowns: 0,
    risk_flags: [],
    x108_gate: "ALLOW",
    reason_code: "TREND_CONFIRMED_LOW_RISK",
    severity: "S2",
    decision_id: "DEC-T-2024-0891",
    trace_id: "TRC-2024-0891",
    ticket_required: false,
    attestation_ref: "ATT-2024-0891",
    source: "demo",
    metrics: { pnl_estimate: 0.023 },
    timestamp: Date.now() - 45000,
  },
  {
    domain: "bank",
    market_verdict: "CREDIT_RISK_ELEVATED",
    confidence: 0.71,
    contradictions: 2,
    unknowns: 1,
    risk_flags: ["CREDIT_RISK", "LIQUIDITY_PRESSURE"],
    x108_gate: "HOLD",
    reason_code: "RISK_THRESHOLD_EXCEEDED",
    severity: "S3",
    decision_id: "DEC-B-2024-0334",
    trace_id: "TRC-2024-0334",
    ticket_required: true,
    ticket_id: "TKT-2024-0334",
    attestation_ref: "ATT-2024-0334",
    source: "demo",
    metrics: { risk_score: 6.2 },
    timestamp: Date.now() - 120000,
  },
  {
    domain: "ecom",
    market_verdict: "CAMPAIGN_LAUNCH_APPROVED",
    confidence: 0.79,
    contradictions: 0,
    unknowns: 1,
    risk_flags: ["FRAUD_SIGNAL"],
    x108_gate: "ALLOW",
    reason_code: "CAMPAIGN_METRICS_POSITIVE",
    severity: "S2",
    decision_id: "DEC-E-2024-0127",
    trace_id: "TRC-2024-0127",
    ticket_required: false,
    attestation_ref: undefined,
    source: "demo",
    metrics: { conv_rate: 0.038 },
    timestamp: Date.now() - 300000,
  },
  {
    domain: "trading",
    market_verdict: "FLASH_CRASH_DETECTED",
    confidence: 0.95,
    contradictions: 0,
    unknowns: 0,
    risk_flags: ["EXTREME_VOLATILITY", "CIRCUIT_BREAKER"],
    x108_gate: "BLOCK",
    reason_code: "CIRCUIT_BREAKER_TRIGGERED",
    severity: "S4",
    decision_id: "DEC-T-2024-0890",
    trace_id: "TRC-2024-0890",
    ticket_required: true,
    ticket_id: "TKT-2024-0890",
    attestation_ref: "ATT-2024-0890",
    source: "demo",
    metrics: { price_drop: -0.15 },
    timestamp: Date.now() - 600000,
  },
];

const MOCK_PROOF_SNAPSHOT: ProofChain = {
  decision_id: "DEC-T-2024-0891",
  trace_id: "TRC-2024-0891",
  ticket_required: false,
  attestation_ref: "ATT-2024-0891",
  proof_complete: true,
  proof_partial: false,
};

// ─── Top Contributors ─────────────────────────────────────────────────────────

const TOP_CONTRIBUTORS = [
  { name: "TrendInterpreter",   domain: "trading", decisions: 234, accuracy: 0.91, color: "oklch(0.72 0.18 145)" },
  { name: "RiskInterpreter",    domain: "trading", decisions: 198, accuracy: 0.88, color: "oklch(0.72 0.18 145)" },
  { name: "CreditRiskAgent",    domain: "bank",    decisions: 156, accuracy: 0.85, color: "oklch(0.65 0.18 240)" },
  { name: "FraudDetector",      domain: "ecom",    decisions: 143, accuracy: 0.93, color: "oklch(0.72 0.18 45)" },
  { name: "MarketDataAgent",    domain: "trading", decisions: 312, accuracy: 0.96, color: "oklch(0.72 0.18 145)" },
];

// ─── Live ─────────────────────────────────────────────────────────────────────

export default function Live() {
  const { domain } = useWorld();
  const [selectedEnv, setSelectedEnv] = useState<CanonicalEnvelope | null>(MOCK_FEED[0]);
  const [filter, setFilter] = useState<"all" | WorldDomain>("all");
  const [tick, setTick] = useState(0);

  // Simuler un tick toutes les 5s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const filtered = filter === "all" ? MOCK_FEED : MOCK_FEED.filter(e => e.domain === filter);

  return (
    <div className="flex flex-col gap-0" style={{ minHeight: "calc(100vh - 120px)" }}>

      {/* ── Header Live ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: "oklch(0.105 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)" }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "oklch(0.72 0.18 145)" }} />
          <span className="text-[11px] font-mono font-bold" style={{ color: "oklch(0.72 0.18 145)" }}>LIVE</span>
          <span className="text-[9px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>
            Console du présent — mode DEMO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono" style={{ color: "oklch(0.40 0.01 240)" }}>
            {MOCK_FEED.length} décisions récentes
          </span>
          <Link href="/future">
            <button className="px-2 py-1 rounded text-[9px] font-mono"
              style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
              🔭 Simuler →
            </button>
          </Link>
          <Link href="/past">
            <button className="px-2 py-1 rounded text-[9px] font-mono"
              style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
              📚 Historique →
            </button>
          </Link>
        </div>
      </div>

      {/* ── Layout 3 colonnes ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: "calc(100vh - 170px)" }}>

        {/* ── Colonne gauche : Feed ────────────────────────────────────────── */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col"
          style={{ borderRight: "1px solid oklch(0.16 0.01 240)" }}>
          {/* Filtres */}
          <div className="flex items-center gap-1 px-3 py-2"
            style={{ borderBottom: "1px solid oklch(0.16 0.01 240)", background: "oklch(0.11 0.01 240)" }}>
            {(["all", "trading", "bank", "ecom"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2 py-0.5 rounded text-[9px] font-mono"
                style={{
                  background: filter === f ? "oklch(0.72 0.18 145 / 0.12)" : "transparent",
                  border: `1px solid ${filter === f ? "oklch(0.72 0.18 145 / 0.40)" : "transparent"}`,
                  color: filter === f ? "oklch(0.72 0.18 145)" : "oklch(0.50 0.01 240)",
                }}
              >
                {f === "all" ? "Tous" : DOMAIN_COLORS[f].icon + " " + DOMAIN_COLORS[f].label}
              </button>
            ))}
          </div>

          {/* Feed */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5">
            {filtered.map(env => (
              <DecisionEnvelopeCard
                key={env.decision_id}
                envelope={env}
                variant="compact"
                selected={selectedEnv?.decision_id === env.decision_id}
                onSelect={setSelectedEnv}
              />
            ))}
          </div>

          {/* Indicateur tick */}
          <div className="px-3 py-1.5 text-[8px] font-mono"
            style={{ borderTop: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.35 0.01 240)" }}>
            Tick #{tick} · Rafraîchi toutes les 5s
          </div>
        </div>

        {/* ── Colonne centre : Détail enveloppe ───────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {selectedEnv ? (
            <>
              <div className="text-[9px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>
                Décision sélectionnée
              </div>
              <DecisionEnvelopeCard
                envelope={selectedEnv}
                variant="expanded"
                pastLink={`/past`}
              />

              {/* Top contributors pour ce domaine */}
              <div className="rounded overflow-hidden" style={{ border: "1px solid oklch(0.18 0.01 240)" }}>
                <div className="px-3 py-2 text-[9px] font-mono font-bold"
                  style={{ background: "oklch(0.12 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.55 0.01 240)" }}>
                  Agents contributeurs — {selectedEnv.domain}
                </div>
                <div className="p-2 flex flex-col gap-1">
                  {TOP_CONTRIBUTORS
                    .filter(c => c.domain === selectedEnv.domain)
                    .map(c => (
                      <div key={c.name} className="flex items-center gap-2 px-2 py-1 rounded"
                        style={{ background: "oklch(0.115 0.01 240)" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                        <span className="text-[9px] font-mono font-bold flex-1" style={{ color: c.color }}>{c.name}</span>
                        <span className="text-[8px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>
                          {c.decisions} décisions
                        </span>
                        <span className="text-[8px] font-mono" style={{ color: c.accuracy >= 0.9 ? "oklch(0.72 0.18 145)" : "oklch(0.72 0.18 45)" }}>
                          {Math.round(c.accuracy * 100)}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-[10px] font-mono"
              style={{ color: "oklch(0.40 0.01 240)" }}>
              Sélectionner une décision dans le feed
            </div>
          )}
        </div>

        {/* ── Colonne droite : Proof snapshot + stats ──────────────────────── */}
        <div className="hidden xl:flex w-72 shrink-0 flex-col p-4 gap-4"
          style={{ borderLeft: "1px solid oklch(0.16 0.01 240)" }}>
          <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.45 0.01 240)" }}>
            PROOF SNAPSHOT
          </div>
          <ProofChainView chain={MOCK_PROOF_SNAPSHOT} variant="full" />

          {/* Stats globales */}
          <div className="rounded p-3" style={{ background: "oklch(0.12 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
            <div className="text-[9px] font-mono font-bold mb-2" style={{ color: "oklch(0.55 0.01 240)" }}>Stats 24h</div>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Décisions",     value: "1 352", color: "oklch(0.72 0.18 145)" },
                { label: "ALLOW",         value: "1 287", color: "oklch(0.72 0.18 145)" },
                { label: "HOLD",          value: "58",    color: "oklch(0.72 0.18 45)" },
                { label: "BLOCK",         value: "7",     color: "oklch(0.65 0.25 25)" },
                { label: "Proof complete",value: "94%",   color: "#a78bfa" },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-[9px] font-mono">
                  <span style={{ color: "oklch(0.45 0.01 240)" }}>{s.label}</span>
                  <span style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lien Control */}
          <Link href="/control">
            <button className="w-full py-2 rounded text-[9px] font-mono"
              style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
              🛡️ Voir Control →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
