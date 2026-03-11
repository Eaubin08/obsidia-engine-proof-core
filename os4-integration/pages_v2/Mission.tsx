/**
 * Mission — surface d'entrée OS4 V2
 * Point de départ opératoire : 3 WorldCards (Trading/Bank/Ecom) + accès rapide Live/Future/Past/Control
 * Règle UX : jamais une landing marketing — toujours une console de départ
 */
import React from "react";
import { Link } from "wouter";
import { useWorld, DOMAIN_COLORS, type WorldDomain } from "@/contexts/WorldContext";

// ─── Données mock ─────────────────────────────────────────────────────────────

const WORLD_SUMMARY: Record<WorldDomain, {
  status: "ALLOW" | "HOLD" | "BLOCK";
  confidence: number;
  active_agents: number;
  last_decision: string;
  last_verdict: string;
  proof_complete: boolean;
  risk_flags: string[];
  metrics: { label: string; value: string; trend: "up" | "down" | "stable" }[];
}> = {
  trading: {
    status: "ALLOW",
    confidence: 0.87,
    active_agents: 17,
    last_decision: "DEC-T-2024-0891",
    last_verdict: "BUY_SIGNAL_CONFIRMED",
    proof_complete: true,
    risk_flags: [],
    metrics: [
      { label: "PnL 24h",   value: "+2.3%",   trend: "up" },
      { label: "Volatility", value: "0.42",   trend: "stable" },
      { label: "Exposure",  value: "68%",     trend: "up" },
    ],
  },
  bank: {
    status: "HOLD",
    confidence: 0.71,
    active_agents: 12,
    last_decision: "DEC-B-2024-0334",
    last_verdict: "CREDIT_RISK_ELEVATED",
    proof_complete: true,
    risk_flags: ["CREDIT_RISK"],
    metrics: [
      { label: "Risk Score", value: "6.2/10", trend: "up" },
      { label: "Liquidity",  value: "94.1%",  trend: "stable" },
      { label: "Compliance", value: "✓",      trend: "stable" },
    ],
  },
  ecom: {
    status: "ALLOW",
    confidence: 0.79,
    active_agents: 12,
    last_decision: "DEC-E-2024-0127",
    last_verdict: "CAMPAIGN_LAUNCH_APPROVED",
    proof_complete: false,
    risk_flags: ["FRAUD_SIGNAL"],
    metrics: [
      { label: "Conv. Rate", value: "3.8%",   trend: "up" },
      { label: "Fraud Score", value: "0.12",  trend: "down" },
      { label: "Revenue",    value: "+12%",   trend: "up" },
    ],
  },
};

// ─── Couleurs gate ────────────────────────────────────────────────────────────

const GATE_CFG = {
  ALLOW: { color: "oklch(0.72 0.18 145)", bg: "oklch(0.72 0.18 145 / 0.10)", label: "ALLOW" },
  HOLD:  { color: "oklch(0.72 0.18 45)",  bg: "oklch(0.72 0.18 45 / 0.10)",  label: "HOLD"  },
  BLOCK: { color: "oklch(0.65 0.25 25)",  bg: "oklch(0.65 0.25 25 / 0.10)",  label: "BLOCK" },
};

// ─── WorldCard ────────────────────────────────────────────────────────────────

function WorldCard({ domain, active, onClick }: { domain: WorldDomain; active: boolean; onClick: () => void }) {
  const colors = DOMAIN_COLORS[domain];
  const summary = WORLD_SUMMARY[domain];
  const gate = GATE_CFG[summary.status];
  const confPct = Math.round(summary.confidence * 100);
  const trendIcon = { up: "↑", down: "↓", stable: "→" };

  return (
    <button
      onClick={onClick}
      className="rounded text-left transition-all w-full"
      style={{
        background: active ? colors.bg : "oklch(0.11 0.01 240)",
        border: `1px solid ${active ? colors.border : "oklch(0.18 0.01 240)"}`,
        outline: active ? `1px solid ${colors.accent}` : "none",
        outlineOffset: "1px",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid oklch(0.16 0.01 240)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{colors.icon}</span>
          <div>
            <div className="text-xs font-mono font-bold" style={{ color: colors.accent }}>{colors.label}</div>
            <div className="text-[9px] font-mono" style={{ color: "oklch(0.50 0.01 240)" }}>
              {summary.active_agents} agents actifs
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
            style={{ background: gate.bg, border: `1px solid ${gate.color}40`, color: gate.color }}>
            X-108 {gate.label}
          </span>
          <span className="text-[9px] font-mono" style={{ color: confPct >= 80 ? "oklch(0.72 0.18 145)" : confPct >= 60 ? "oklch(0.72 0.18 45)" : "oklch(0.65 0.25 25)" }}>
            {confPct}% conf
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className="px-4 py-2" style={{ borderBottom: "1px solid oklch(0.14 0.01 240)" }}>
        <div className="text-[9px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>Dernier verdict</div>
        <div className="text-[10px] font-mono font-bold mt-0.5" style={{ color: "oklch(0.80 0.01 240)" }}>
          {summary.last_verdict}
        </div>
        <div className="text-[8px] font-mono mt-0.5" style={{ color: "oklch(0.40 0.01 240)" }}>
          {summary.last_decision}
        </div>
      </div>

      {/* Métriques */}
      <div className="px-4 py-2 grid grid-cols-3 gap-2">
        {summary.metrics.map(m => (
          <div key={m.label}>
            <div className="text-[8px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>{m.label}</div>
            <div className="text-[10px] font-mono font-bold" style={{ color: "oklch(0.75 0.01 240)" }}>
              {m.value}
              <span className="ml-0.5 text-[8px]" style={{
                color: m.trend === "up" ? "oklch(0.72 0.18 145)" : m.trend === "down" ? "oklch(0.65 0.25 25)" : "oklch(0.45 0.01 240)"
              }}>{trendIcon[m.trend]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Risk flags */}
      {summary.risk_flags.length > 0 && (
        <div className="px-4 pb-2 flex gap-1">
          {summary.risk_flags.map(f => (
            <span key={f} className="text-[8px] font-mono px-1.5 py-0.5 rounded"
              style={{ background: "oklch(0.65 0.25 25 / 0.12)", color: "oklch(0.65 0.25 25)" }}>{f}</span>
          ))}
        </div>
      )}

      {/* Proof */}
      <div className="px-4 pb-3">
        <span className="text-[8px] font-mono" style={{ color: summary.proof_complete ? "oklch(0.72 0.18 145)" : "oklch(0.72 0.18 45)" }}>
          {summary.proof_complete ? "✓ Proof complete" : "⚠ Proof partial"}
        </span>
      </div>
    </button>
  );
}

// ─── QuickAccessCard ──────────────────────────────────────────────────────────

function QuickAccessCard({ href, icon, label, description, accent }: {
  href: string; icon: string; label: string; description: string; accent: string;
}) {
  return (
    <Link href={href}>
      <div className="rounded p-4 cursor-pointer transition-all"
        style={{ background: "oklch(0.11 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}
        onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = accent + "60"; }}
        onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.18 0.01 240)"; }}
      >
        <div className="text-xl mb-2">{icon}</div>
        <div className="text-[11px] font-mono font-bold" style={{ color: accent }}>{label}</div>
        <div className="text-[9px] font-mono mt-1" style={{ color: "oklch(0.50 0.01 240)" }}>{description}</div>
      </div>
    </Link>
  );
}

// ─── Mission ──────────────────────────────────────────────────────────────────

export default function Mission() {
  const { domain, setDomain } = useWorld();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">

      {/* ── En-tête Mission ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-base font-mono font-bold tracking-widest" style={{ color: "oklch(0.72 0.18 145)" }}>
            OBSIDIA OS4
          </h1>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: "oklch(0.50 0.01 240)" }}>
            Gouvernance pour agents autonomes — Observation · Interprétation · Décision · Preuve
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-mono"
          style={{ background: "oklch(0.14 0.04 145)", border: "1px solid oklch(0.72 0.18 145 / 0.3)", color: "oklch(0.72 0.18 145)" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.72 0.18 145)" }} />
          3 mondes actifs
        </div>
      </div>

      {/* ── Pipeline OS4 ────────────────────────────────────────────────────── */}
      <div className="rounded p-3 flex items-center gap-1 overflow-x-auto"
        style={{ background: "oklch(0.115 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
        {[
          { step: "Observe",    color: "oklch(0.65 0.18 240)", desc: "Agents domaine lisent les signaux" },
          { step: "Interpret",  color: "oklch(0.72 0.18 145)", desc: "Agents interprètent et proposent" },
          { step: "Contradict", color: "oklch(0.72 0.18 45)",  desc: "Agents détectent les conflits" },
          { step: "Aggregate",  color: "#a78bfa",               desc: "Voix unique du domaine" },
          { step: "X-108",      color: "oklch(0.72 0.18 145)", desc: "Gate de gouvernance" },
          { step: "Proof",      color: "oklch(0.60 0.15 290)", desc: "Traçabilité formelle" },
        ].map((s, i, arr) => (
          <React.Fragment key={s.step}>
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded"
                style={{ background: s.color + "18", border: `1px solid ${s.color}40`, color: s.color }}>
                {s.step}
              </span>
              <span className="text-[7px] font-mono text-center" style={{ color: "oklch(0.40 0.01 240)", maxWidth: "80px" }}>
                {s.desc}
              </span>
            </div>
            {i < arr.length - 1 && <span className="text-[10px] shrink-0" style={{ color: "oklch(0.30 0.01 240)" }}>→</span>}
          </React.Fragment>
        ))}
      </div>

      {/* ── 3 WorldCards ────────────────────────────────────────────────────── */}
      <div>
        <div className="text-[9px] font-mono mb-2" style={{ color: "oklch(0.45 0.01 240)" }}>
          Sélectionner un monde pour filtrer toutes les surfaces
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["trading", "bank", "ecom"] as WorldDomain[]).map(d => (
            <WorldCard key={d} domain={d} active={domain === d} onClick={() => setDomain(d)} />
          ))}
        </div>
      </div>

      {/* ── Accès rapide 4 surfaces ──────────────────────────────────────────── */}
      <div>
        <div className="text-[9px] font-mono mb-2" style={{ color: "oklch(0.45 0.01 240)" }}>
          Surfaces de travail
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAccessCard
            href="/live"
            icon="⚡"
            label="Live"
            description="Console du présent — décisions en cours, feed d'enveloppes, proof snapshot"
            accent="oklch(0.72 0.18 145)"
          />
          <QuickAccessCard
            href="/future"
            icon="🔭"
            label="Future"
            description="Cockpit de simulation — configurer, lancer, observer la constellation agentique"
            accent="oklch(0.65 0.18 240)"
          />
          <QuickAccessCard
            href="/past"
            icon="📚"
            label="Past"
            description="Registre prouvé — historique, proof chains, replay, compare runs"
            accent="#a78bfa"
          />
          <QuickAccessCard
            href="/control"
            icon="🛡️"
            label="Control"
            description="Tour de commandement — santé système, alertes, next actions"
            accent="oklch(0.72 0.18 45)"
          />
        </div>
      </div>

      {/* ── Statut système global ────────────────────────────────────────────── */}
      <div className="rounded p-4" style={{ background: "oklch(0.115 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
        <div className="text-[9px] font-mono font-bold mb-3" style={{ color: "oklch(0.55 0.01 240)" }}>
          Statut système global
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Agents actifs",      value: "41",   color: "oklch(0.72 0.18 145)" },
            { label: "Décisions / 24h",    value: "1 352", color: "oklch(0.65 0.18 240)" },
            { label: "Proof coverage",     value: "94%",  color: "#a78bfa" },
            { label: "X-108 blocks / 24h", value: "7",    color: "oklch(0.72 0.18 45)" },
          ].map(s => (
            <div key={s.label} className="flex flex-col gap-0.5">
              <div className="text-[8px] font-mono" style={{ color: "oklch(0.45 0.01 240)" }}>{s.label}</div>
              <div className="text-xl font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
