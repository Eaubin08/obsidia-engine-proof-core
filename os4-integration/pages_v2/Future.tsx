/**
 * Future — cockpit de simulation OS4 V2
 * Layout 3 colonnes : Command (gauche) | World+Flow (centre) | Decision+Proof (droite)
 * Zone basse : constellation agentique 6 couches + deep detail
 */
import React, { useState } from "react";
import { Link } from "wouter";
import { useWorld, DOMAIN_COLORS, type WorldDomain } from "@/contexts/WorldContext";
import DecisionEnvelopeCard, { type CanonicalEnvelope } from "@/components/canonical/DecisionEnvelopeCard";
import AgentConstellationPanel, { type AgentData, type AggregationData } from "@/components/canonical/AgentConstellationPanel";
import ProofChainView, { type ProofChain } from "@/components/canonical/ProofChainView";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_AGENTS: AgentData[] = [
  // Observation
  { name: "MarketDataAgent",     layer: "Observation",    confidence: 0.92, claim: "Prix BTC +3.2% en 4h", status: "active" },
  { name: "OrderFlowAgent",      layer: "Observation",    confidence: 0.88, claim: "Flux acheteurs dominant", status: "active" },
  { name: "SentimentAgent",      layer: "Observation",    confidence: 0.74, claim: "Sentiment neutre-positif", status: "active" },
  // Interpretation
  { name: "TrendInterpreter",    layer: "Interpretation", confidence: 0.85, proposed_verdict: "BULLISH_TREND", severity_hint: "S2", status: "active" },
  { name: "RiskInterpreter",     layer: "Interpretation", confidence: 0.79, proposed_verdict: "RISK_MODERATE", severity_hint: "S2", status: "active" },
  { name: "VolatilityAnalyst",   layer: "Interpretation", confidence: 0.68, proposed_verdict: "VOL_STABLE",    severity_hint: "S1", status: "active" },
  // Contradiction
  { name: "ContradictionAgent",  layer: "Contradiction",  confidence: 0.91, contradictions: 1, claim: "Divergence sentiment vs flux", status: "active" },
  { name: "ConsistencyChecker",  layer: "Contradiction",  confidence: 0.88, contradictions: 0, claim: "Données cohérentes", status: "active" },
  // Aggregation — géré par AggregationSummaryBlock
  // Governance
  { name: "GuardX108",           layer: "Governance",     confidence: 0.95, proposed_verdict: "ALLOW", claim: "Seuils respectés", status: "active" },
  // Proof
  { name: "ProofAgent",          layer: "Proof",          confidence: 0.99, evidence_count: 7, trace_covered: true, status: "active" },
];

const MOCK_AGGREGATION: AggregationData = {
  market_verdict: "BUY_SIGNAL_CONFIRMED",
  confidence: 0.87,
  contradictions_count: 1,
  unknowns_count: 0,
  risk_flags: [],
  evidence_refs: 7,
  dominant_contributors: ["TrendInterpreter", "RiskInterpreter", "MarketDataAgent"],
};

const MOCK_ENVELOPE: CanonicalEnvelope = {
  domain: "trading",
  market_verdict: "BUY_SIGNAL_CONFIRMED",
  confidence: 0.87,
  contradictions: 1,
  unknowns: 0,
  risk_flags: [],
  x108_gate: "ALLOW",
  reason_code: "TREND_CONFIRMED_LOW_RISK",
  severity: "S2",
  decision_id: "DEC-T-2024-0891-a3f2",
  trace_id: "TRC-2024-0891-b7c1",
  ticket_required: false,
  attestation_ref: "ATT-2024-0891-lean4",
  source: "simulation",
  metrics: { pnl_estimate: 0.023, volatility: 0.42, exposure: 0.68 },
  timestamp: Date.now() - 45000,
};

const MOCK_PROOF: ProofChain = {
  decision_id: "DEC-T-2024-0891-a3f2",
  trace_id: "TRC-2024-0891-b7c1",
  ticket_required: false,
  attestation_ref: "ATT-2024-0891-lean4",
  proof_complete: true,
  proof_partial: false,
};

// ─── Scénarios disponibles ────────────────────────────────────────────────────

const SCENARIOS = {
  trading: [
    { id: "bull_run",      label: "Bull Run",        desc: "Tendance haussière forte" },
    { id: "flash_crash",   label: "Flash Crash",     desc: "Chute soudaine -15%" },
    { id: "range_bound",   label: "Range Bound",     desc: "Marché latéral" },
    { id: "high_vol",      label: "High Volatility", desc: "Volatilité extrême" },
  ],
  bank: [
    { id: "credit_stress", label: "Credit Stress",   desc: "Hausse défauts de paiement" },
    { id: "liquidity_crunch", label: "Liquidity Crunch", desc: "Pression liquidité" },
    { id: "normal_ops",    label: "Normal Ops",      desc: "Opérations standard" },
  ],
  ecom: [
    { id: "flash_sale",    label: "Flash Sale",      desc: "Pic trafic x10" },
    { id: "fraud_wave",    label: "Fraud Wave",      desc: "Vague de fraude" },
    { id: "campaign",      label: "Campaign Launch", desc: "Lancement campagne" },
  ],
};

// ─── Composants internes ──────────────────────────────────────────────────────

function CommandColumn({ domain, scenario, setScenario, onRun, running }: {
  domain: WorldDomain;
  scenario: string;
  setScenario: (s: string) => void;
  onRun: () => void;
  running: boolean;
}) {
  const colors = DOMAIN_COLORS[domain];
  const scenarios = SCENARIOS[domain];

  return (
    <div className="flex flex-col gap-3">
      {/* Titre */}
      <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.45 0.01 240)" }}>
        COMMAND
      </div>

      {/* Monde actif */}
      <div className="rounded p-3" style={{ background: "oklch(0.12 0.01 240)", border: `1px solid ${colors.border}` }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">{colors.icon}</span>
          <span className="text-[11px] font-mono font-bold" style={{ color: colors.accent }}>{colors.label}</span>
        </div>
        <div className="text-[8px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>
          Monde actif — modifiable dans StatusRail
        </div>
      </div>

      {/* Scénarios */}
      <div className="rounded overflow-hidden" style={{ border: "1px solid oklch(0.18 0.01 240)" }}>
        <div className="px-3 py-2 text-[9px] font-mono font-bold"
          style={{ background: "oklch(0.12 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.55 0.01 240)" }}>
          Scénario
        </div>
        <div className="flex flex-col gap-0.5 p-1.5">
          {scenarios.map(s => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className="text-left px-2 py-1.5 rounded transition-all"
              style={{
                background: scenario === s.id ? colors.bg : "transparent",
                border: `1px solid ${scenario === s.id ? colors.border : "transparent"}`,
              }}
            >
              <div className="text-[9px] font-mono font-bold" style={{ color: scenario === s.id ? colors.accent : "oklch(0.60 0.01 240)" }}>
                {s.label}
              </div>
              <div className="text-[8px] font-mono" style={{ color: "oklch(0.40 0.01 240)" }}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Paramètres rapides */}
      <div className="rounded p-3 flex flex-col gap-2" style={{ background: "oklch(0.12 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
        <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.50 0.01 240)" }}>Paramètres</div>
        {[
          { label: "Mode",    value: "SIMU" },
          { label: "Agents",  value: "41" },
          { label: "Horizon", value: "24h" },
          { label: "Capital", value: "125 000 €" },
        ].map(p => (
          <div key={p.label} className="flex items-center justify-between text-[9px] font-mono">
            <span style={{ color: "oklch(0.45 0.01 240)" }}>{p.label}</span>
            <span style={{ color: "oklch(0.70 0.01 240)" }}>{p.value}</span>
          </div>
        ))}
      </div>

      {/* Bouton Run */}
      <button
        onClick={onRun}
        disabled={running}
        className="w-full py-3 rounded font-mono text-[11px] font-bold transition-all"
        style={{
          background: running ? "oklch(0.14 0.01 240)" : colors.bg,
          border: `1px solid ${running ? "oklch(0.22 0.01 240)" : colors.border}`,
          color: running ? "oklch(0.45 0.01 240)" : colors.accent,
          cursor: running ? "not-allowed" : "pointer",
        }}
      >
        {running ? "⟳ Simulation en cours…" : "▶ Lancer la simulation"}
      </button>

      {/* Liens rapides */}
      <div className="flex flex-col gap-1">
        <Link href="/past">
          <button className="w-full text-left px-2 py-1.5 rounded text-[9px] font-mono"
            style={{ background: "oklch(0.115 0.01 240)", border: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.55 0.01 240)" }}>
            📚 Voir les runs passés →
          </button>
        </Link>
        <Link href="/live">
          <button className="w-full text-left px-2 py-1.5 rounded text-[9px] font-mono"
            style={{ background: "oklch(0.115 0.01 240)", border: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.55 0.01 240)" }}>
            ⚡ Voir le live →
          </button>
        </Link>
      </div>
    </div>
  );
}

function WorldFlowColumn({ domain, running }: { domain: WorldDomain; running: boolean }) {
  const colors = DOMAIN_COLORS[domain];

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.45 0.01 240)" }}>
        WORLD + FLOW
      </div>

      {/* Flow pipeline */}
      <div className="rounded p-3" style={{ background: "oklch(0.12 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
        <div className="text-[9px] font-mono font-bold mb-3" style={{ color: "oklch(0.55 0.01 240)" }}>Pipeline agentique</div>
        <div className="flex flex-col gap-2">
          {[
            { layer: "Observation",    agents: 3, status: running ? "active" : "idle",    color: "oklch(0.65 0.18 240)" },
            { layer: "Interpretation", agents: 3, status: running ? "active" : "idle",    color: "oklch(0.72 0.18 145)" },
            { layer: "Contradiction",  agents: 2, status: running ? "active" : "idle",    color: "oklch(0.72 0.18 45)" },
            { layer: "Aggregation",    agents: 1, status: running ? "running" : "idle",   color: "#a78bfa" },
            { layer: "Governance",     agents: 1, status: running ? "pending" : "idle",   color: "oklch(0.72 0.18 145)" },
            { layer: "Proof",          agents: 1, status: running ? "pending" : "idle",   color: "oklch(0.60 0.15 290)" },
          ].map((row, i, arr) => {
            const statusColor = row.status === "active" ? "oklch(0.72 0.18 145)" : row.status === "running" ? "#a78bfa" : row.status === "pending" ? "oklch(0.72 0.18 45)" : "oklch(0.30 0.01 240)";
            return (
              <React.Fragment key={row.layer}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColor }} />
                  <span className="text-[9px] font-mono font-bold flex-1" style={{ color: row.color }}>{row.layer}</span>
                  <span className="text-[8px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>{row.agents} ag.</span>
                  <span className="text-[8px] font-mono" style={{ color: statusColor }}>{row.status}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="ml-1 w-px h-2" style={{ background: "oklch(0.20 0.01 240)" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Métriques monde */}
      <div className="rounded p-3" style={{ background: "oklch(0.12 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
        <div className="text-[9px] font-mono font-bold mb-2" style={{ color: "oklch(0.55 0.01 240)" }}>
          {colors.icon} Métriques {colors.label}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {domain === "trading" && [
            { k: "Prix BTC",    v: "43 250 €", trend: "up" },
            { k: "Volume 24h",  v: "2.1B €",   trend: "up" },
            { k: "Volatilité",  v: "0.42",      trend: "stable" },
            { k: "Spread",      v: "0.08%",     trend: "down" },
          ].map(m => (
            <div key={m.k} className="text-[9px] font-mono">
              <div style={{ color: "oklch(0.45 0.01 240)" }}>{m.k}</div>
              <div style={{ color: "oklch(0.75 0.01 240)" }}>{m.v}
                <span className="ml-1 text-[8px]" style={{ color: m.trend === "up" ? "oklch(0.72 0.18 145)" : m.trend === "down" ? "oklch(0.65 0.25 25)" : "oklch(0.45 0.01 240)" }}>
                  {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}
                </span>
              </div>
            </div>
          ))}
          {domain === "bank" && [
            { k: "Risk Score",  v: "6.2/10",  trend: "up" },
            { k: "Liquidité",   v: "94.1%",   trend: "stable" },
            { k: "Défauts",     v: "0.8%",    trend: "up" },
            { k: "Compliance",  v: "✓",       trend: "stable" },
          ].map(m => (
            <div key={m.k} className="text-[9px] font-mono">
              <div style={{ color: "oklch(0.45 0.01 240)" }}>{m.k}</div>
              <div style={{ color: "oklch(0.75 0.01 240)" }}>{m.v}</div>
            </div>
          ))}
          {domain === "ecom" && [
            { k: "Conv. Rate",  v: "3.8%",    trend: "up" },
            { k: "Fraud Score", v: "0.12",    trend: "down" },
            { k: "Revenue",     v: "+12%",    trend: "up" },
            { k: "Cart Abandon",v: "68%",     trend: "stable" },
          ].map(m => (
            <div key={m.k} className="text-[9px] font-mono">
              <div style={{ color: "oklch(0.45 0.01 240)" }}>{m.k}</div>
              <div style={{ color: "oklch(0.75 0.01 240)" }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs simulation */}
      <div className="rounded overflow-hidden" style={{ border: "1px solid oklch(0.18 0.01 240)" }}>
        <div className="px-3 py-1.5 text-[9px] font-mono font-bold"
          style={{ background: "oklch(0.12 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.50 0.01 240)" }}>
          Logs
        </div>
        <div className="p-2 flex flex-col gap-0.5 font-mono text-[8px]" style={{ background: "oklch(0.09 0.01 240)" }}>
          {(running ? [
            { t: "20:45:01", msg: "MarketDataAgent → signal reçu", c: "oklch(0.65 0.18 240)" },
            { t: "20:45:02", msg: "TrendInterpreter → BULLISH_TREND", c: "oklch(0.72 0.18 145)" },
            { t: "20:45:02", msg: "ContradictionAgent → 1 divergence", c: "oklch(0.72 0.18 45)" },
            { t: "20:45:03", msg: "Aggregation → BUY_SIGNAL_CONFIRMED", c: "#a78bfa" },
            { t: "20:45:03", msg: "GuardX108 → ALLOW", c: "oklch(0.72 0.18 145)" },
          ] : [
            { t: "—", msg: "En attente de simulation…", c: "oklch(0.35 0.01 240)" },
          ]).map((log, i) => (
            <div key={i} className="flex gap-2">
              <span style={{ color: "oklch(0.35 0.01 240)" }}>{log.t}</span>
              <span style={{ color: log.c }}>{log.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DecisionProofColumn({ envelope, proof }: { envelope: CanonicalEnvelope; proof: ProofChain }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.45 0.01 240)" }}>
        DÉCISION + PREUVE
      </div>

      {/* Envelope card */}
      <DecisionEnvelopeCard envelope={envelope} variant="expanded" pastLink="/past" />

      {/* Proof chain */}
      <ProofChainView chain={proof} variant="full" />
    </div>
  );
}

// ─── Future ───────────────────────────────────────────────────────────────────

export default function Future() {
  const { domain } = useWorld();
  const [scenario, setScenario] = useState("bull_run");
  const [running, setRunning] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);
  const [activeTab, setActiveTab] = useState<"constellation" | "detail">("constellation");

  const handleRun = () => {
    setRunning(true);
    setShowConstellation(true);
    setTimeout(() => setRunning(false), 3000);
  };

  // Adapter l'envelope au domaine actif
  const envelope: CanonicalEnvelope = {
    ...MOCK_ENVELOPE,
    domain,
    market_verdict: domain === "bank" ? "CREDIT_RISK_ELEVATED" : domain === "ecom" ? "CAMPAIGN_LAUNCH_APPROVED" : "BUY_SIGNAL_CONFIRMED",
    x108_gate: domain === "bank" ? "HOLD" : "ALLOW",
  };

  return (
    <div className="flex flex-col gap-0" style={{ minHeight: "calc(100vh - 120px)" }}>

      {/* ── Zone haute : 3 colonnes ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-4">
        <CommandColumn
          domain={domain}
          scenario={scenario}
          setScenario={setScenario}
          onRun={handleRun}
          running={running}
        />
        <WorldFlowColumn domain={domain} running={running} />
        <DecisionProofColumn envelope={envelope} proof={MOCK_PROOF} />
      </div>

      {/* ── Zone basse : constellation + deep detail ─────────────────────────── */}
      <div style={{ borderTop: "1px solid oklch(0.16 0.01 240)" }}>
        {/* Toggle */}
        <button
          onClick={() => setShowConstellation(v => !v)}
          className="w-full flex items-center justify-between px-4 py-2 text-[9px] font-mono"
          style={{ background: "oklch(0.105 0.01 240)", color: "oklch(0.50 0.01 240)" }}
        >
          <span>🔭 Constellation agentique — {MOCK_AGENTS.length} agents</span>
          <span>{showConstellation ? "▲ Réduire" : "▼ Développer"}</span>
        </button>

        {showConstellation && (
          <div className="p-4" style={{ background: "oklch(0.095 0.01 240)" }}>
            {/* Tabs */}
            <div className="flex gap-1 mb-3">
              {(["constellation", "detail"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3 py-1 rounded text-[9px] font-mono font-bold"
                  style={{
                    background: activeTab === tab ? "oklch(0.72 0.18 145 / 0.12)" : "oklch(0.12 0.01 240)",
                    border: `1px solid ${activeTab === tab ? "oklch(0.72 0.18 145 / 0.40)" : "oklch(0.18 0.01 240)"}`,
                    color: activeTab === tab ? "oklch(0.72 0.18 145)" : "oklch(0.50 0.01 240)",
                  }}
                >
                  {tab === "constellation" ? "Constellation" : "Deep Detail"}
                </button>
              ))}
            </div>

            {activeTab === "constellation" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AgentConstellationPanel
                  agents={MOCK_AGENTS}
                  aggregation={MOCK_AGGREGATION}
                  domain={domain}
                  defaultExpanded={false}
                />
                {/* Résumé agrégation */}
                <div className="rounded p-3" style={{ background: "oklch(0.115 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
                  <div className="text-[9px] font-mono font-bold mb-2" style={{ color: "#a78bfa" }}>Résumé agrégation</div>
                  <div className="flex flex-col gap-1.5 text-[9px] font-mono">
                    {[
                      { k: "Verdict",        v: MOCK_AGGREGATION.market_verdict },
                      { k: "Confidence",     v: `${Math.round(MOCK_AGGREGATION.confidence * 100)}%` },
                      { k: "Contradictions", v: String(MOCK_AGGREGATION.contradictions_count) },
                      { k: "Unknowns",       v: String(MOCK_AGGREGATION.unknowns_count) },
                      { k: "Evidence refs",  v: String(MOCK_AGGREGATION.evidence_refs) },
                    ].map(({ k, v }) => (
                      <div key={k} className="flex justify-between">
                        <span style={{ color: "oklch(0.45 0.01 240)" }}>{k}</span>
                        <span style={{ color: "oklch(0.70 0.01 240)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <div className="text-[8px] font-mono mb-1" style={{ color: "oklch(0.40 0.01 240)" }}>Top contributors</div>
                    {MOCK_AGGREGATION.dominant_contributors.map(c => (
                      <div key={c} className="text-[9px] font-mono" style={{ color: "oklch(0.60 0.01 240)" }}>· {c}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "detail" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <DecisionEnvelopeCard envelope={envelope} variant="expanded" pastLink="/past" />
                <ProofChainView chain={MOCK_PROOF} variant="full" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
