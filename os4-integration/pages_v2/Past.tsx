/**
 * Past — registre prouvé OS4 V2
 * Timeline + run list + proof chain view + replay panel + compare runs
 * Règle UX : jamais mentir sur l'état de la preuve
 */
import React, { useState } from "react";
import { Link } from "wouter";
import { useWorld, DOMAIN_COLORS, type WorldDomain } from "@/contexts/WorldContext";
import DecisionEnvelopeCard, { type CanonicalEnvelope } from "@/components/canonical/DecisionEnvelopeCard";
import ProofChainView, { type ProofChain } from "@/components/canonical/ProofChainView";
import ReplayPanel, { type RunRecord } from "@/components/canonical/ReplayPanel";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_RUNS: RunRecord[] = [
  {
    run_id: "RUN-T-2024-0891-a3f2",
    domain: "trading",
    scenario_name: "Bull Run — BTC +3.2%",
    timestamp: Date.now() - 45000,
    duration_ms: 1240,
    agent_count: 17,
    proof_complete: true,
    tags: ["bull", "btc", "confirmed"],
    envelope: {
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
      timestamp: Date.now() - 45000,
    },
  },
  {
    run_id: "RUN-T-2024-0890-b7c1",
    domain: "trading",
    scenario_name: "Flash Crash — -15%",
    timestamp: Date.now() - 600000,
    duration_ms: 890,
    agent_count: 17,
    proof_complete: true,
    tags: ["crash", "circuit-breaker", "blocked"],
    envelope: {
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
      timestamp: Date.now() - 600000,
    },
  },
  {
    run_id: "RUN-B-2024-0334-c2d4",
    domain: "bank",
    scenario_name: "Credit Stress — Risk 6.2",
    timestamp: Date.now() - 3600000,
    duration_ms: 1560,
    agent_count: 12,
    proof_complete: true,
    tags: ["credit", "hold", "risk-elevated"],
    envelope: {
      domain: "bank",
      market_verdict: "CREDIT_RISK_ELEVATED",
      confidence: 0.71,
      contradictions: 2,
      unknowns: 1,
      risk_flags: ["CREDIT_RISK"],
      x108_gate: "HOLD",
      reason_code: "RISK_THRESHOLD_EXCEEDED",
      severity: "S3",
      decision_id: "DEC-B-2024-0334",
      trace_id: "TRC-2024-0334",
      ticket_required: true,
      ticket_id: "TKT-2024-0334",
      attestation_ref: "ATT-2024-0334",
      source: "demo",
      timestamp: Date.now() - 3600000,
    },
  },
  {
    run_id: "RUN-E-2024-0127-e5f6",
    domain: "ecom",
    scenario_name: "Campaign Launch — Conv 3.8%",
    timestamp: Date.now() - 7200000,
    duration_ms: 1120,
    agent_count: 12,
    proof_complete: false,
    tags: ["campaign", "allow", "fraud-signal"],
    envelope: {
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
      source: "demo",
      timestamp: Date.now() - 7200000,
    },
  },
];

// ─── Composants internes ──────────────────────────────────────────────────────

function TimelineBar({ runs, selected, onSelect }: {
  runs: RunRecord[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5 p-2">
      {runs.map((run, i) => {
        const dom = DOMAIN_COLORS[run.domain];
        const gate = run.envelope?.x108_gate;
        const gateColor = gate === "ALLOW" ? "oklch(0.72 0.18 145)" : gate === "HOLD" ? "oklch(0.72 0.18 45)" : gate === "BLOCK" ? "oklch(0.65 0.25 25)" : "oklch(0.40 0.01 240)";
        const isSelected = selected === run.run_id;
        const elapsed = Date.now() - run.timestamp;
        const elapsedStr = elapsed < 60000 ? `${Math.round(elapsed / 1000)}s` : elapsed < 3600000 ? `${Math.round(elapsed / 60000)}m` : `${Math.round(elapsed / 3600000)}h`;

        return (
          <button
            key={run.run_id}
            onClick={() => onSelect(run.run_id)}
            className="flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all"
            style={{
              background: isSelected ? dom.bg : "transparent",
              border: `1px solid ${isSelected ? dom.border : "transparent"}`,
            }}
          >
            {/* Timeline dot */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-2 h-2 rounded-full" style={{ background: gateColor }} />
              {i < runs.length - 1 && <div className="w-px h-4 mt-0.5" style={{ background: "oklch(0.20 0.01 240)" }} />}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[9px]">{dom.icon}</span>
                <span className="text-[9px] font-mono font-bold truncate" style={{ color: isSelected ? dom.accent : "oklch(0.70 0.01 240)" }}>
                  {run.scenario_name}
                </span>
              </div>
              <div className="text-[8px] font-mono" style={{ color: "oklch(0.40 0.01 240)" }}>
                {elapsedStr} · {run.duration_ms}ms
                {run.proof_complete ? " · ✓" : " · ⚠"}
              </div>
            </div>
            {gate && (
              <span className="text-[8px] font-mono font-bold shrink-0" style={{ color: gateColor }}>{gate}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Past ─────────────────────────────────────────────────────────────────────

export default function Past() {
  const { domain } = useWorld();
  const [filter, setFilter] = useState<"all" | WorldDomain>("all");
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_RUNS[0].run_id);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"detail" | "proof" | "replay">("detail");

  const filtered = filter === "all" ? MOCK_RUNS : MOCK_RUNS.filter(r => r.domain === filter);
  const selected = MOCK_RUNS.find(r => r.run_id === selectedId) ?? null;
  const compare = compareId ? MOCK_RUNS.find(r => r.run_id === compareId) ?? null : null;

  const proofChain: ProofChain | null = selected?.envelope ? {
    decision_id: selected.envelope.decision_id ?? selected.run_id,
    trace_id: selected.envelope.trace_id,
    ticket_required: selected.envelope.ticket_required,
    ticket_id: selected.envelope.ticket_id,
    attestation_ref: selected.envelope.attestation_ref,
    proof_complete: selected.proof_complete,
    proof_partial: !selected.proof_complete && !!selected.envelope.trace_id,
  } : null;

  const handleReplay = (run: RunRecord) => {
    // Navigation vers Future avec le run en paramètre (mock)
    window.location.href = "/future";
  };

  const handleCompare = (run: RunRecord) => {
    setCompareId(prev => prev === run.run_id ? null : run.run_id);
  };

  return (
    <div className="flex flex-col gap-0" style={{ minHeight: "calc(100vh - 120px)" }}>

      {/* ── Header Past ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: "oklch(0.105 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold" style={{ color: "#a78bfa" }}>PAST</span>
          <span className="text-[9px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>
            Registre prouvé — {MOCK_RUNS.length} runs
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/future">
            <button className="px-2 py-1 rounded text-[9px] font-mono"
              style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
              🔭 Simuler →
            </button>
          </Link>
          <Link href="/live">
            <button className="px-2 py-1 rounded text-[9px] font-mono"
              style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
              ⚡ Live →
            </button>
          </Link>
        </div>
      </div>

      {/* ── Layout principal ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: "calc(100vh - 170px)" }}>

        {/* ── Colonne gauche : Timeline ────────────────────────────────────── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col"
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
                  background: filter === f ? "#a78bfa18" : "transparent",
                  border: `1px solid ${filter === f ? "#a78bfa50" : "transparent"}`,
                  color: filter === f ? "#a78bfa" : "oklch(0.50 0.01 240)",
                }}
              >
                {f === "all" ? "Tous" : DOMAIN_COLORS[f].icon}
              </button>
            ))}
            <span className="text-[8px] font-mono ml-auto" style={{ color: "oklch(0.40 0.01 240)" }}>
              {filtered.length} runs
            </span>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto">
            <TimelineBar runs={filtered} selected={selectedId} onSelect={setSelectedId} />
          </div>

          {/* Stats */}
          <div className="px-3 py-2 grid grid-cols-3 gap-1 text-center"
            style={{ borderTop: "1px solid oklch(0.16 0.01 240)", background: "oklch(0.11 0.01 240)" }}>
            {[
              { label: "ALLOW", count: MOCK_RUNS.filter(r => r.envelope?.x108_gate === "ALLOW").length, color: "oklch(0.72 0.18 145)" },
              { label: "HOLD",  count: MOCK_RUNS.filter(r => r.envelope?.x108_gate === "HOLD").length,  color: "oklch(0.72 0.18 45)" },
              { label: "BLOCK", count: MOCK_RUNS.filter(r => r.envelope?.x108_gate === "BLOCK").length, color: "oklch(0.65 0.25 25)" },
            ].map(s => (
              <div key={s.label}>
                <div className="text-[11px] font-mono font-bold" style={{ color: s.color }}>{s.count}</div>
                <div className="text-[8px] font-mono" style={{ color: "oklch(0.40 0.01 240)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Colonne centre : Détail run ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {selected ? (
            <>
              {/* Tabs */}
              <div className="flex items-center gap-1 px-4 py-2"
                style={{ borderBottom: "1px solid oklch(0.16 0.01 240)", background: "oklch(0.11 0.01 240)" }}>
                {(["detail", "proof", "replay"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-3 py-1 rounded text-[9px] font-mono font-bold"
                    style={{
                      background: activeTab === tab ? "#a78bfa18" : "transparent",
                      border: `1px solid ${activeTab === tab ? "#a78bfa50" : "transparent"}`,
                      color: activeTab === tab ? "#a78bfa" : "oklch(0.50 0.01 240)",
                    }}
                  >
                    {tab === "detail" ? "Détail" : tab === "proof" ? "Proof Chain" : "Replay"}
                  </button>
                ))}
                <span className="ml-auto text-[9px] font-mono" style={{ color: "oklch(0.40 0.01 240)" }}>
                  {selected.run_id.slice(0, 20)}…
                </span>
              </div>

              <div className="p-4 flex flex-col gap-4">
                {activeTab === "detail" && selected.envelope && (
                  <>
                    <DecisionEnvelopeCard envelope={selected.envelope} variant="expanded" />
                    {/* Compare */}
                    {compare && compare.envelope && (
                      <div>
                        <div className="text-[9px] font-mono mb-2" style={{ color: "#a78bfa" }}>
                          Comparaison avec {compare.scenario_name}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <DecisionEnvelopeCard envelope={selected.envelope} variant="compact" />
                          <DecisionEnvelopeCard envelope={compare.envelope} variant="compact" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "proof" && proofChain && (
                  <ProofChainView chain={proofChain} variant="full" />
                )}

                {activeTab === "replay" && (
                  <ReplayPanel
                    run={selected}
                    onReplay={handleReplay}
                    onCompare={handleCompare}
                    futureLink="/future"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-[10px] font-mono"
              style={{ color: "oklch(0.40 0.01 240)" }}>
              Sélectionner un run dans la timeline
            </div>
          )}
        </div>

        {/* ── Colonne droite : Liste runs + compare ────────────────────────── */}
        <div className="hidden xl:flex w-72 shrink-0 flex-col p-4 gap-3"
          style={{ borderLeft: "1px solid oklch(0.16 0.01 240)" }}>
          <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.45 0.01 240)" }}>
            TOUS LES RUNS
          </div>
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
            {MOCK_RUNS.map(run => (
              <ReplayPanel
                key={run.run_id}
                run={run}
                onReplay={handleReplay}
                onCompare={handleCompare}
                futureLink="/future"
              />
            ))}
          </div>
          <Link href="/control">
            <button className="w-full py-2 rounded text-[9px] font-mono"
              style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
              🛡️ Control →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
