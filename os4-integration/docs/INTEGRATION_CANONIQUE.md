# OS4 — Documentation d'intégration du pipeline canonique

**Version :** 1.0 — Mars 2026  
**Auteur :** Équipe Obsidia  
**Statut :** Intégré en production (branche `main`)

---

## Vue d'ensemble

Le **pipeline canonique OS4** est l'architecture décisionnelle centrale de la plateforme Obsidia. Il orchestre une constellation d'agents spécialisés par domaine métier (Trading, Bank, E-Commerce), des méta-agents transversaux, et un juge unique — **Guard X-108** — qui émet le verdict final sous forme d'un `CanonicalEnvelope` standardisé.

Cette documentation couvre l'intégration réalisée dans la plateforme OS4 (Node.js/TypeScript + Python), les contrats de données, les points d'extension, et le guide de continuation pour les prochaines étapes.

---

## Architecture du pipeline

### Flux de décision

```
État domaine (TradingState | BankState | EcomState)
    │
    ▼
[Agents domaine] — couches : Observation → Interprétation → Contradiction/Preuve locale
    │  Trading : 17 agents  |  Bank : 12 agents  |  Ecom : 12 agents
    ▼
[Agrégateur domaine] — calcule verdict métier + confidence + risk_flags
    │
    ▼
[Méta-agents transversaux] — 10 agents (UnknownsAgent, ConflictResolutionAgent, …)
    │
    ▼
[Guard X-108] — juge unique, émet ALLOW | HOLD | BLOCK
    │
    ▼
CanonicalEnvelope — payload standardisé (trace_id, attestation_ref, evidence_refs, …)
```

### Règles absolues

| Règle | Description |
|-------|-------------|
| **R1** | Aucun agent métier n'autorise seul une action irréversible. |
| **R2** | Un seul juge final : GuardX108. |
| **R3** | Tous les domaines convergent vers le même payload canonique. |
| **R4** | Les agents méta sont transversaux et réutilisables. |
| **R5** | Les domaines changent ; la souveraineté ne change jamais. |

---

## Structure des fichiers

### Backend Python (agents)

```
server/python_agents/
├── contracts.py          — Dataclasses : TradingState, BankState, EcomState, AgentVote, CanonicalEnvelope
├── base.py               — Classe abstraite BaseAgent
├── aggregation.py        — Agrégateurs domaine + méta-agents
├── guard.py              — GuardX108 (juge unique)
├── registry.py           — AgentRegistry (chargement dynamique)
├── protocols.py          — Règles absolues + validation
├── run_pipeline.py       — CLI bridge (appelé par Node.js via child_process)
├── demo_run.py           — Exemple de run complet
├── domains/
│   ├── trading_agents.py — 17 agents Trading
│   ├── bank_agents.py    — 12 agents Bank
│   └── ecom_agents.py    — 12 agents E-Commerce
└── tests/
    └── test_canonical.py — Tests unitaires
```

### Backend TypeScript (bridge + contrats)

```
server/canonical/
├── canonicalPipeline.ts  — Bridge Node→Python + états par défaut + scénarios
├── contracts.ts          — Types TypeScript alignés sur contracts.py
└── payloadValidator.ts   — Validation du CanonicalEnvelope retourné
```

### Endpoints tRPC ajoutés

| Procédure | Type | Description |
|-----------|------|-------------|
| `engine.canonicalRun` | mutation | Exécute le pipeline complet pour un domaine + scénario |
| `engine.canonicalAgentRegistry` | query | Liste tous les agents disponibles par domaine |
| `engine.canonicalScenarios` | query | Liste les scénarios prédéfinis par domaine |

### Composant UI

```
client/src/components/CanonicalAgentPanel.tsx
```

Visualise un `CanonicalEnvelope` complet : gate X-108, confidence, contradictions, unknowns, risk_flags, evidence_refs, métriques domaine, JSON brut.

Intégré dans `Simuler.tsx` via l'onglet **Agents** (6ème onglet).

---

## Contrat de données : CanonicalEnvelope

```typescript
interface CanonicalEnvelope {
  domain: "trading" | "bank" | "ecom";
  market_verdict: string;        // Verdict métier agrégé
  confidence: number;            // [0, 1] — confiance globale
  contradictions: string[];      // Contradictions détectées entre agents
  unknowns: string[];            // Inconnues signalées par les agents
  risk_flags: string[];          // Drapeaux de risque agrégés
  x108_gate: "ALLOW" | "HOLD" | "BLOCK";  // Décision finale
  reason_code: string;           // Code raison lisible
  severity: "S0" | "S1" | "S2" | "S3" | "S4";
  decision_id: string;           // UUID de la décision
  trace_id: string;              // Hash de traçabilité
  ticket_required: boolean;      // Ticket humain requis ?
  ticket_id: string | null;      // ID ticket si créé
  attestation_ref: string | null; // Référence attestation
  source: string;                // "canonical_framework" | "canonical_fallback"
  evidence_refs: string[];       // Agents ayant voté (domaine + méta)
  metrics: Record<string, unknown>; // Métriques domaine spécifiques
  raw_engine: Record<string, unknown>; // Données brutes moteur
  python_available: boolean;     // Python disponible ?
  elapsed_ms: number;            // Temps d'exécution
}
```

---

## États domaine : structure et scénarios

### TradingState (17 agents)

| Champ | Type | Description |
|-------|------|-------------|
| `prices` | `number[]` | Série de prix (min 20 points) |
| `volumes` | `number[]` | Volumes correspondants |
| `spreads_bps` | `number[]` | Spreads bid/ask en bps |
| `sentiment_scores` | `number[]` | Scores de sentiment [-1, 1] |
| `exposure` | `number` | Exposition portefeuille [0, 1] |
| `drawdown` | `number` | Drawdown courant [0, 1] |
| `order_book_imbalance` | `number` | Déséquilibre carnet [0, 1] |
| `slippage_bps` | `number` | Slippage estimé en bps |

**Scénarios prédéfinis :** `flash_crash` (S4), `bull_run` (S1), `range_bound` (S0), `high_volatility` (S3)

### BankState (12 agents)

| Champ | Type | Description |
|-------|------|-------------|
| `amount` | `number` | Montant de la transaction |
| `fraud_score` | `number` | Score fraude [0, 1] |
| `behavior_shift_score` | `number` | Anomalie comportementale [0, 1] |
| `identity_mismatch_score` | `number` | Incohérence identité [0, 1] |
| `policy_limit` | `number` | Limite de politique |
| `affordability_score` | `number` | Score de solvabilité [0, 1] |
| `elapsed_s` | `number` | Temps écoulé depuis initiation |
| `min_required_elapsed_s` | `number` | Verrou temporel X-108 |

**Scénarios prédéfinis :** `large_transfer` (S2), `fraud_attempt` (S4), `normal_payment` (S0), `limit_breach` (S3)

### EcomState (12 agents)

| Champ | Type | Description |
|-------|------|-------------|
| `traffic_quality` | `number` | Qualité du trafic [0, 1] |
| `customer_trust` | `number` | Score de confiance client [0, 1] |
| `margin_rate` | `number` | Taux de marge [0, 1] |
| `roas` | `number` | Return on Ad Spend |
| `intent_conflict_score` | `number` | Conflit d'intention [0, 1] |
| `x108_compliance_rate` | `number` | Taux de conformité X-108 [0, 1] |

**Scénarios prédéfinis :** `high_roas` (S0), `low_margin` (S2), `cart_abandonment` (S1), `fraud_checkout` (S4)

---

## Méta-agents transversaux (10 agents)

Ces agents s'exécutent après les agents domaine et vérifient la cohérence globale de la décision :

| Agent | Rôle |
|-------|------|
| `UnknownsAgent` | Détecte les inconnues critiques non résolues |
| `ConflictResolutionAgent` | Arbitre les contradictions entre agents |
| `PolicyScopeAgent` | Vérifie que la décision est dans le périmètre de politique |
| `TicketReadinessAgent` | Détermine si un ticket humain est requis |
| `TraceIntegrityAgent` | Valide l'intégrité de la trace de décision |
| `AttestationReadinessAgent` | Prépare la référence d'attestation |
| `HumanOverrideEligibilityAgent` | Évalue l'éligibilité à une intervention humaine |
| `SeverityClassifierAgent` | Classifie la sévérité finale (S0→S4) |
| `ReplayConsistencyAgent` | Garantit la reproductibilité déterministe |
| `ProofConsistencyAgent` | Vérifie la cohérence avec les preuves formelles |

---

## Utilisation depuis le frontend

### Appel simple (mutation tRPC)

```typescript
import { trpc } from "@/lib/trpc";

const runMutation = trpc.engine.canonicalRun.useMutation({
  onSuccess: (envelope) => {
    console.log(envelope.x108_gate);     // "ALLOW" | "HOLD" | "BLOCK"
    console.log(envelope.confidence);    // 0.0 → 1.0
    console.log(envelope.contradictions); // ["IDENTITY_CONTEXT_MISMATCH", ...]
    console.log(envelope.evidence_refs); // ["TradingAgent:MarketDataAgent", ...]
  },
});

// Lancer un run Flash Crash Trading
runMutation.mutate({
  domain: "trading",
  scenarioId: "flash_crash",
  seed: 42,
});
```

### Composant prêt à l'emploi

```tsx
import { CanonicalAgentPanel } from "@/components/CanonicalAgentPanel";

<CanonicalAgentPanel
  domain="trading"
  scenarioId="flash_crash"
  seed={42}
/>
```

### Récupérer le registre des agents

```typescript
const { data: registry } = trpc.engine.canonicalAgentRegistry.useQuery();
// registry.trading = ["MarketDataAgent", "LiquidityAgent", ...]
// registry.meta = ["UnknownsAgent", "ConflictResolutionAgent", ...]
```

---

## Fallback automatique

Si Python n'est pas disponible dans l'environnement d'exécution, le bridge `canonicalPipeline.ts` active automatiquement le mode **`canonical_fallback`** :

- Le pipeline TypeScript local est utilisé à la place du pipeline Python.
- `envelope.python_available = false` et `envelope.source = "canonical_fallback"`.
- Les décisions de fallback **ne sont pas persistées** en base (sécurité : pas de faux tickets).
- Le composant `CanonicalAgentPanel` affiche un badge **FALLBACK** orange.

---

## Guide de continuation — Prochaines étapes

### Étape 1 : Activer le serveur Python autonome (optionnel)

Pour des performances maximales en production, déployer le pipeline Python comme microservice HTTP séparé :

```bash
cd server/python_agents
pip install fastapi uvicorn
uvicorn server:app --port 3001
```

Puis configurer `OBSIDIA_PYTHON_URL=http://localhost:3001` dans les secrets du projet.

### Étape 2 : Ajouter de nouveaux agents domaine

1. Créer la classe dans `server/python_agents/domains/{domain}_agents.py` :

```python
class MonNouvelAgent(BaseAgent):
    agent_id = "MonNouvelAgent"
    
    def evaluate(self, state: TradingState) -> AgentVote:
        score = compute_my_score(state)
        verdict = "BLOCK" if score > 0.8 else "ANALYZE" if score > 0.5 else "AUTHORIZE"
        return AgentVote(
            self.agent_id, Domain.TRADING, Layer.INTERPRETATION,
            f"mon_score={score:.2f}", score, Severity.S2,
            proposed_verdict=verdict,
            risk_flags=["MON_FLAG"] if score > 0.5 else []
        )
```

2. Enregistrer dans `server/python_agents/registry.py`.
3. Ajouter à la liste `canonicalAgentRegistry` dans `server/routers.ts`.

### Étape 3 : Étendre le CanonicalEnvelope

Pour ajouter de nouveaux champs au payload canonique :

1. Modifier `contracts.py` (Python) et `contracts.ts` (TypeScript) en parallèle.
2. Mettre à jour `payloadValidator.ts` pour valider les nouveaux champs.
3. Mettre à jour le composant `CanonicalAgentPanel.tsx` pour les afficher.

### Étape 4 : Intégrer dans les simulations existantes

Les simulations Trading/Bank/Ecom existantes (`tradingEngine.ts`, `bankEngine.ts`, `ecomEngine.ts`) peuvent être enrichies pour retourner un `CanonicalEnvelope` en plus de leurs métriques actuelles :

```typescript
// Dans tradingRouter.simulate
const canonicalEnvelope = runCanonicalPipeline("trading", buildStateFromScenario("trading", "flash_crash", input.seed));
return { ...existingResult, canonical: canonicalEnvelope };
```

### Étape 5 : Tests et CI

```bash
# Tests Python
cd server/python_agents && python3 -m pytest tests/ -v

# Tests TypeScript
cd /home/ubuntu/os4-platform && pnpm test
```

---

## Synchronisation GitHub

Le dépôt lié est `Eaubin08/Obsidia-lab-trad`. Pour synchroniser les agents canoniques :

```bash
cd /home/ubuntu/os4-platform
git add server/python_agents/ server/canonical/ client/src/components/CanonicalAgentPanel.tsx
git commit -m "feat: intégration pipeline canonique OS4 (agents + bridge + UI)"
git push origin main
```

---

## Résumé des fichiers créés/modifiés

| Fichier | Action | Description |
|---------|--------|-------------|
| `server/python_agents/` | **Créé** | Pack Python complet (agents + contrats + guard) |
| `server/python_agents/run_pipeline.py` | **Créé** | CLI bridge pour appel depuis Node.js |
| `server/canonical/canonicalPipeline.ts` | **Créé** | Bridge TypeScript + états par défaut + scénarios |
| `server/canonical/contracts.ts` | **Créé** | Types TypeScript alignés sur Python |
| `server/canonical/payloadValidator.ts` | **Créé** | Validation du CanonicalEnvelope |
| `server/routers.ts` | **Modifié** | +3 procédures : `canonicalRun`, `canonicalAgentRegistry`, `canonicalScenarios` |
| `client/src/components/CanonicalAgentPanel.tsx` | **Créé** | Composant UI de visualisation |
| `client/src/pages/Simuler.tsx` | **Modifié** | +onglet "Agents" avec 3 panels canoniques |
