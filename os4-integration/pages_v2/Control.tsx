/**
 * Control — tour de commandement OS4 V2
 * 4 matrices santé + alertes/incidents + next actions + deep links
 * Règle UX : jamais masquer un problème — toujours indiquer l'état réel
 */
import React, { useState } from "react";
import { Link } from "wouter";
import { useWorld, DOMAIN_COLORS, type WorldDomain } from "@/contexts/WorldContext";
import HealthMatrix, { type HealthMatrixData } from "@/components/canonical/HealthMatrix";
import IncidentCard, { type IncidentData } from "@/components/canonical/IncidentCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HEALTH: Record<WorldDomain, HealthMatrixData> = {
  trading: {
    domain: "trading",
    agent_health:     { label: "Agent Health",     score: 94, trend: "stable", details: "17/17 agents actifs" },
    proof_coverage:   { label: "Proof Coverage",   score: 96, trend: "up",     details: "96% des décisions prouvées" },
    decision_quality: { label: "Decision Quality", score: 89, trend: "up",     details: "Accuracy 89% sur 24h" },
    risk_exposure:    { label: "Risk Exposure",     score: 32, trend: "down",   details: "Exposition contrôlée" },
    last_updated: Date.now() - 30000,
  },
  bank: {
    domain: "bank",
    agent_health:     { label: "Agent Health",     score: 91, trend: "stable", details: "12/12 agents actifs" },
    proof_coverage:   { label: "Proof Coverage",   score: 88, trend: "stable", details: "88% des décisions prouvées" },
    decision_quality: { label: "Decision Quality", score: 76, trend: "down",   details: "Accuracy 76% — attention" },
    risk_exposure:    { label: "Risk Exposure",     score: 68, trend: "up",     details: "Risque crédit élevé", critical: true },
    last_updated: Date.now() - 60000,
  },
  ecom: {
    domain: "ecom",
    agent_health:     { label: "Agent Health",     score: 88, trend: "stable", details: "12/12 agents actifs" },
    proof_coverage:   { label: "Proof Coverage",   score: 79, trend: "down",   details: "79% — proof partielle détectée" },
    decision_quality: { label: "Decision Quality", score: 82, trend: "up",     details: "Accuracy 82% sur 24h" },
    risk_exposure:    { label: "Risk Exposure",     score: 45, trend: "up",     details: "Signal fraude actif", critical: true },
    last_updated: Date.now() - 90000,
  },
};

const MOCK_INCIDENTS: IncidentData[] = [
  {
    id: "INC-001",
    title: "Risque crédit Bank dépassé",
    domain: "bank",
    severity: "S3",
    status: "investigating",
    trigger: "CreditRiskAgent score > 6.0",
    x108_response: "HOLD",
    decision_id: "DEC-B-2024-0334",
    timestamp: Date.now() - 3600000,
    description: "Le score de risque crédit a dépassé le seuil de 6.0/10. X-108 a émis un HOLD sur toutes les nouvelles décisions de crédit.",
    next_action: "Réviser les paramètres de seuil CreditRiskAgent",
  },
  {
    id: "INC-002",
    title: "Signal fraude Ecom actif",
    domain: "ecom",
    severity: "S2",
    status: "active",
    trigger: "FraudDetector score 0.12 > seuil 0.10",
    x108_response: "ALLOW",
    timestamp: Date.now() - 7200000,
    description: "FraudDetector a détecté un signal de fraude faible mais persistant. Décisions autorisées avec surveillance renforcée.",
    next_action: "Activer le mode surveillance renforcée sur les transactions > 500€",
  },
  {
    id: "INC-003",
    title: "Flash Crash Trading bloqué",
    domain: "trading",
    severity: "S4",
    status: "resolved",
    trigger: "Price drop -15% en 2min",
    x108_response: "BLOCK",
    decision_id: "DEC-T-2024-0890",
    timestamp: Date.now() - 600000,
    resolved_at: Date.now() - 300000,
    description: "Circuit breaker déclenché suite à une chute de -15% en 2 minutes. Toutes les opérations de trading bloquées pendant 5 minutes.",
    next_action: "Post-mortem planifié dans 24h",
  },
];

const NEXT_ACTIONS = [
  { id: "NA-001", priority: "P1", label: "Réviser seuils CreditRiskAgent Bank", domain: "bank",    link: "/past",    due: "Aujourd'hui" },
  { id: "NA-002", priority: "P2", label: "Activer surveillance fraude Ecom",    domain: "ecom",    link: "/live",    due: "Aujourd'hui" },
  { id: "NA-003", priority: "P2", label: "Post-mortem Flash Crash Trading",     domain: "trading", link: "/past",    due: "Demain" },
  { id: "NA-004", priority: "P3", label: "Améliorer proof coverage Ecom (79%)", domain: "ecom",    link: "/future",  due: "Cette semaine" },
];

// ─── Composants internes ──────────────────────────────────────────────────────

function SystemOverviewBar() {
  const allHealth = Object.values(MOCK_HEALTH);
  const avgScore = Math.round(allHealth.reduce((acc, h) => {
    const s = (h.agent_health.score + h.proof_coverage.score + h.decision_quality.score + (100 - h.risk_exposure.score)) / 4;
    return acc + s;
  }, 0) / allHealth.length);

  const scoreColor = avgScore >= 80 ? "oklch(0.72 0.18 145)" : avgScore >= 60 ? "oklch(0.72 0.18 45)" : "oklch(0.65 0.25 25)";

  return (
    <div className="flex items-center gap-4 px-4 py-3"
      style={{ background: "oklch(0.105 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)" }}>
      {/* Score global */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: scoreColor }} />
        <span className="text-[11px] font-mono font-bold" style={{ color: scoreColor }}>
          Système {avgScore}/100
        </span>
      </div>
      {/* Séparateur */}
      <div className="w-px h-4" style={{ background: "oklch(0.20 0.01 240)" }} />
      {/* Incidents actifs */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-mono" style={{ color: "oklch(0.65 0.25 25)" }}>
          {MOCK_INCIDENTS.filter(i => i.status === "active" || i.status === "investigating").length} incidents actifs
        </span>
      </div>
      {/* Séparateur */}
      <div className="w-px h-4" style={{ background: "oklch(0.20 0.01 240)" }} />
      {/* Next actions */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] font-mono" style={{ color: "oklch(0.72 0.18 45)" }}>
          {NEXT_ACTIONS.filter(a => a.priority === "P1").length} actions P1
        </span>
      </div>
      {/* Liens rapides */}
      <div className="ml-auto flex items-center gap-2">
        <Link href="/live">
          <button className="px-2 py-1 rounded text-[9px] font-mono"
            style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
            ⚡ Live →
          </button>
        </Link>
        <Link href="/past">
          <button className="px-2 py-1 rounded text-[9px] font-mono"
            style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
            📚 Past →
          </button>
        </Link>
        <Link href="/future">
          <button className="px-2 py-1 rounded text-[9px] font-mono"
            style={{ background: "oklch(0.14 0.01 240)", border: "1px solid oklch(0.22 0.01 240)", color: "oklch(0.60 0.01 240)" }}>
            🔭 Future →
          </button>
        </Link>
      </div>
    </div>
  );
}

function NextActionsPanel() {
  const priorityColor = { P1: "oklch(0.65 0.25 25)", P2: "oklch(0.72 0.18 45)", P3: "oklch(0.55 0.01 240)" };

  return (
    <div className="rounded overflow-hidden" style={{ border: "1px solid oklch(0.18 0.01 240)" }}>
      <div className="px-3 py-2 text-[9px] font-mono font-bold"
        style={{ background: "oklch(0.12 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.55 0.01 240)" }}>
        Next Actions
      </div>
      <div className="flex flex-col gap-0.5 p-1.5">
        {NEXT_ACTIONS.map(action => {
          const dom = DOMAIN_COLORS[action.domain as WorldDomain];
          const pColor = priorityColor[action.priority as keyof typeof priorityColor];
          return (
            <Link key={action.id} href={action.link}>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer"
                style={{ background: "oklch(0.115 0.01 240)" }}>
                <span className="text-[8px] font-mono font-bold px-1 rounded"
                  style={{ background: `${pColor}15`, color: pColor }}>{action.priority}</span>
                <span className="text-[9px]">{dom.icon}</span>
                <span className="text-[9px] font-mono flex-1 truncate" style={{ color: "oklch(0.70 0.01 240)" }}>{action.label}</span>
                <span className="text-[8px] font-mono shrink-0" style={{ color: "oklch(0.40 0.01 240)" }}>{action.due}</span>
                <span className="text-[9px]" style={{ color: "oklch(0.40 0.01 240)" }}>→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Control ──────────────────────────────────────────────────────────────────

export default function Control() {
  const { domain } = useWorld();
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [activeIncidentFilter, setActiveIncidentFilter] = useState<"all" | "active" | "resolved">("all");

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds(prev => [...prev, id]);
  };

  const filteredIncidents = MOCK_INCIDENTS.filter(i => {
    if (activeIncidentFilter === "active") return i.status === "active" || i.status === "investigating";
    if (activeIncidentFilter === "resolved") return i.status === "resolved" || i.status === "suppressed";
    return true;
  });

  return (
    <div className="flex flex-col gap-0" style={{ minHeight: "calc(100vh - 120px)" }}>

      {/* ── Header Control ───────────────────────────────────────────────────── */}
      <SystemOverviewBar />

      {/* ── Layout principal ─────────────────────────────────────────────────── */}
      <div className="p-4 flex flex-col gap-4">

        {/* ── 3 matrices santé (Trading / Bank / Ecom) ────────────────────── */}
        <div>
          <div className="text-[9px] font-mono mb-2" style={{ color: "oklch(0.45 0.01 240)" }}>
            Matrices de santé — 3 mondes
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {(["trading", "bank", "ecom"] as WorldDomain[]).map(d => (
              <HealthMatrix key={d} data={MOCK_HEALTH[d]} />
            ))}
          </div>
        </div>

        {/* ── Incidents + Next Actions ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Incidents */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-[9px] font-mono font-bold" style={{ color: "oklch(0.45 0.01 240)" }}>
                Incidents & Alertes
              </div>
              <div className="flex gap-1">
                {(["all", "active", "resolved"] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveIncidentFilter(f)}
                    className="px-2 py-0.5 rounded text-[8px] font-mono"
                    style={{
                      background: activeIncidentFilter === f ? "oklch(0.65 0.25 25 / 0.12)" : "transparent",
                      border: `1px solid ${activeIncidentFilter === f ? "oklch(0.65 0.25 25 / 0.40)" : "transparent"}`,
                      color: activeIncidentFilter === f ? "oklch(0.65 0.25 25)" : "oklch(0.50 0.01 240)",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {filteredIncidents.map(inc => (
                <IncidentCard
                  key={inc.id}
                  incident={acknowledgedIds.includes(inc.id) ? { ...inc, status: "suppressed" } : inc}
                  onAcknowledge={handleAcknowledge}
                  pastLink="/past"
                />
              ))}
            </div>
          </div>

          {/* Next Actions + Liens domaine */}
          <div className="flex flex-col gap-3">
            <NextActionsPanel />

            {/* Deep links par domaine */}
            <div className="rounded overflow-hidden" style={{ border: "1px solid oklch(0.18 0.01 240)" }}>
              <div className="px-3 py-2 text-[9px] font-mono font-bold"
                style={{ background: "oklch(0.12 0.01 240)", borderBottom: "1px solid oklch(0.16 0.01 240)", color: "oklch(0.55 0.01 240)" }}>
                Deep Links
              </div>
              <div className="p-2 grid grid-cols-3 gap-1.5">
                {(["trading", "bank", "ecom"] as WorldDomain[]).map(d => {
                  const dom = DOMAIN_COLORS[d];
                  return (
                    <div key={d} className="flex flex-col gap-1">
                      <div className="text-[9px] font-mono font-bold" style={{ color: dom.accent }}>
                        {dom.icon} {dom.label}
                      </div>
                      {[
                        { label: "Live", href: "/live" },
                        { label: "Past", href: "/past" },
                        { label: "Future", href: "/future" },
                      ].map(link => (
                        <Link key={link.label} href={link.href}>
                          <button className="w-full text-left px-1.5 py-1 rounded text-[8px] font-mono"
                            style={{ background: dom.bg, border: `1px solid ${dom.border}`, color: dom.accent }}>
                            {link.label} →
                          </button>
                        </Link>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Statut agents par domaine */}
            <div className="rounded p-3" style={{ background: "oklch(0.12 0.01 240)", border: "1px solid oklch(0.18 0.01 240)" }}>
              <div className="text-[9px] font-mono font-bold mb-2" style={{ color: "oklch(0.55 0.01 240)" }}>
                Agents actifs
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { domain: "trading", total: 17, active: 17 },
                  { domain: "bank",    total: 12, active: 12 },
                  { domain: "ecom",    total: 12, active: 12 },
                ].map(row => {
                  const dom = DOMAIN_COLORS[row.domain as WorldDomain];
                  const pct = Math.round((row.active / row.total) * 100);
                  return (
                    <div key={row.domain} className="flex items-center gap-2">
                      <span className="text-[9px]">{dom.icon}</span>
                      <span className="text-[9px] font-mono w-12" style={{ color: dom.accent }}>{dom.label}</span>
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "oklch(0.18 0.01 240)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: dom.accent }} />
                      </div>
                      <span className="text-[8px] font-mono" style={{ color: "oklch(0.55 0.01 240)" }}>
                        {row.active}/{row.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
