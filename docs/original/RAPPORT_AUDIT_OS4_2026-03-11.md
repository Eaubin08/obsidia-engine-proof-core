# Rapport d'Audit OS4 — Obsidia Governance Platform
**Version analysée :** `d529ad45` · **Date :** 11 mars 2026 · **Auteur :** Manus AI

---

## Résumé exécutif

OS4 est une plateforme de gouvernance algorithmique multi-domaine (Trading, Bank, Ecom) pilotée par un moteur de décision Python à 51 agents répartis en 6 couches hiérarchiques. La plateforme comprend 11 pages frontend, 44 procédures tRPC, 9 tables de base de données et un pipeline de preuve canonique (Guard X-108). Le score de conformité actuel est estimé à **~97/100** sur les specs V2.

Ce rapport couvre quatre axes : l'état du branchement backend, la compréhension des agents, la gouvernance et le pilotage opérateur, et la simplification UX.

---

## 1. État du branchement backend par page

Le tableau suivant résume le niveau de branchement réel de chaque page au moteur Python et aux routes tRPC.

| Page | Routes tRPC branchées | Moteur Python | Données live | Manques |
|---|---|---|---|---|
| **Mission** | `proof.guardStats`, `proof.allTickets` | Indirect (via guardStats) | ✅ | Aucun prix marché visible |
| **Live** | `proof.allTickets`, `engine.canonicalAgentRegistry` | Indirect | ✅ | `agent_votes` complets non exposés, 0 action opérateur |
| **Future** | `engine.canonicalRun`, `engine.canonicalAgentRegistry`, `mirror.prices` | ✅ Direct | ✅ | `agent_votes` réduits à des IDs dans `raw_engine` |
| **Past** | `proof.allTickets`, `proof.simulationRuns` | Indirect | ✅ | Contexte marché au moment du run absent |
| **Control** | `proof.guardStats`, `proof.allTickets`, `engine.canonicalAgentRegistry`, `proof.simulationRuns` | Indirect | ✅ | Aucune action opérateur directe |
| **TradingWorld** | `trading.simulate`, `engine.decisionEnvelope`, `engine.verifyTicket`, `portfolio.*`, `ai.explainDecision` | ✅ Direct | ✅ | Complet |
| **BankWorld** | `bank.simulate`, `engine.attestation`, `portfolio.*`, `ai.explainDecision` | ✅ Direct | ✅ | Complet |
| **EcomWorld** | `ecom.simulate`, `portfolio.*`, `proof.guardStats` | ✅ Direct | ⚠️ Partiel | `ai.explainDecision` non branché |
| **StressLab** | `engine.batchRun` | ✅ Direct | ✅ | Résultats non persistés en DB |
| **MirrorMode** | `mirror.prices` (CoinGecko fallback) | — | ⚠️ Fallback | Binance géo-bloqué (HTTP 451) |
| **ScenarioEngine** | `trading.simulate`, `bank.simulate`, `ecom.simulate` | ✅ Direct | ✅ | Complet |

### Problème central : `agent_votes` incomplets

Le pipeline Python (`guard.py`, ligne 70) ne sérialise que les **IDs** des agents dans `raw_engine` :

```python
"agent_votes": [v.agent_id for v in aggregate.agent_votes],
```

Chaque `AgentVote` contient pourtant : `agent_id`, `layer`, `claim`, `confidence`, `severity_hint`, `contradictions`, `unknowns`, `risk_flags`, `proposed_verdict`. Ces données riches ne remontent jamais au frontend. Le résultat : les pages Live, Past et Control reconstruisent les agents côté client à partir des noms seuls, sans les votes réels ni les claims.

**Correction requise :** modifier `guard.py` pour sérialiser les votes complets :

```python
"agent_votes": [
    {
        "agent_id": v.agent_id,
        "layer": v.layer.value,
        "claim": v.claim,
        "confidence": v.confidence,
        "proposed_verdict": v.proposed_verdict,
        "severity": v.severity_hint.value,
        "contradictions": v.contradictions,
        "risk_flags": v.risk_flags,
    }
    for v in aggregate.agent_votes
],
```

---

## 2. Compréhension des agents — Problème majeur

### 2.1 Architecture réelle du moteur (51 agents, 6 couches)

Le moteur Guard X-108 est organisé en 6 couches hiérarchiques. Chaque couche a un rôle précis dans le pipeline de décision.

| Couche | Rôle | Agents représentatifs |
|---|---|---|
| **Observation** | Collecte les signaux bruts du marché | `MarketDataAgent`, `OrderFlowAgent`, `MacroRegimeAgent` |
| **Interpretation** | Transforme les signaux en verdicts métier | `MomentumAgent`, `VolatilityAgent`, `LiquidityAgent`, `RoasAgent`, `FulfillmentRiskAgent` |
| **Contradiction** | Détecte les conflits entre agents | `ConflictResolutionAgent`, `UnknownsAgent`, `IntentConflictAgent`, `CheckoutFrictionAgent` |
| **Aggregation** | Synthèse pondérée des votes | `DomainAggregate` (pipeline interne) |
| **Governance** | Applique les règles X-108 | `PolicyScopeAgent`, `HumanOverrideEligibilityAgent`, `SeverityClassifierAgent` |
| **Proof** | Vérifie la traçabilité et l'auditabilité | `TicketReadinessAgent`, `TraceIntegrityAgent`, `AttestationReadinessAgent`, `ProofConsistencyAgent`, `ReplayConsistencyAgent` |

### 2.2 Ce que l'utilisateur voit actuellement

Sur toutes les pages (Live, Past, Control, Future), les agents sont affichés comme une liste de noms (`MarketDataAgent`, `VolatilityAgent`, etc.) sans :

- **But métier** : "Pourquoi cet agent existe-t-il ?"
- **Fonction technique** : "Que calcule-t-il exactement ?"
- **Dialogue avec le moteur** : "Quel claim a-t-il soumis ? Avec quelle confiance ?"
- **Verdict proposé** : "A-t-il voté ALLOW, HOLD ou BLOCK ?"
- **Position dans la hiérarchie** : "Est-il en couche 1 (Observation) ou couche 6 (Proof) ?"

**Conséquence directe :** un opérateur qui voit `ConflictResolutionAgent` à 0.95 de confiance ne comprend pas que cet agent signale une contradiction active entre deux agents d'interprétation, ce qui devrait déclencher une revue manuelle immédiate.

### 2.3 Plan de correction agents

La correction passe par deux niveaux :

**Niveau 1 — Catalogue statique enrichi** : créer un fichier `agentCatalog.ts` avec pour chaque agent : `id`, `displayName`, `layer`, `layerOrder`, `purpose` (but métier en français), `function` (ce qu'il calcule), `verdictLogic` (quand il vote BLOCK vs ALLOW).

**Niveau 2 — Votes dynamiques** : une fois `agent_votes` complets exposés par le backend, afficher pour chaque agent : son claim réel (`"momentum=0.72, trend=bullish"`), sa confiance, son verdict proposé et ses risk_flags. L'opérateur comprend alors immédiatement pourquoi le gate est HOLD.

---

## 3. Gouvernance et pilotage — Live est quasi inutilisable

### 3.1 État actuel de Live

La page Live est actuellement **100% passive** : elle affiche des tickets, des agents et des statistiques, mais l'opérateur ne peut rien faire d'autre que filtrer par gate et sélectionner un ticket. Il n'existe aucune action opérateur réelle.

| Action attendue par un opérateur | Disponible dans Live ? |
|---|---|
| Forcer un HOLD sur une décision en cours | ❌ Non |
| Escalader un ticket vers un superviseur | ❌ Non |
| Approuver manuellement une décision BLOCK | ❌ Non |
| Rejouer une décision dans Future | ✅ Lien vers Past uniquement |
| Ouvrir la preuve d'un ticket | ✅ Partiel (onglet Proof) |
| Voir pourquoi le gate est actif | ❌ Pas d'explication contextuelle |
| Voir les prix du marché en temps réel | ❌ Aucun MarketBanner |

### 3.2 Routes opérateur manquantes dans le backend

Le backend ne dispose d'aucune route pour les actions opérateur. Les routes existantes sont toutes en lecture ou en simulation. Il manque :

- `engine.forceHold` — forcer un HOLD sur une décision active
- `engine.escalate` — escalader vers un superviseur avec motif
- `engine.approveOverride` — approuver manuellement un BLOCK avec justification
- `engine.operatorNote` — ajouter une note opérateur sur un ticket

Ces routes doivent être protégées (`protectedProcedure`) et traçables (chaque action doit créer un enregistrement en DB avec `operator_id`, `action`, `timestamp`, `motif`).

### 3.3 Flux décisionnel attendu

Un opérateur devrait pouvoir, depuis Live :

1. **Voir** le gate actif et comprendre pourquoi (phrase d'interprétation + agents en désaccord)
2. **Agir** : forcer HOLD, escalader, approuver, rejouer
3. **Tracer** : chaque action est enregistrée et visible dans Past sous l'onglet "Audit Trail"
4. **Naviguer** : depuis un ticket Live → ouvrir dans Past → rejouer dans Future → revenir

---

## 4. Simplification UX et visibilité du marché

### 4.1 Labels techniques non traduits

Plusieurs pages exposent des labels techniques directement à l'opérateur sans explication :

| Label technique | Page | Traduction métier attendue |
|---|---|---|
| `decision_id` | Past, Live | "Référence décision" |
| `trace_id` | Live, Future | "Identifiant de trace" |
| `attestation_ref` | Live, Future | "Référence d'attestation" |
| `x108_gate` | StatusRail, Live | "Verdict du garde X-108" |
| `severity_hint` | Control, Live | "Niveau de criticité" |
| `proposed_verdict` | Future zone basse | "Vote de l'agent" |
| `market_verdict` | Future, Past | "Verdict du marché" |

### 4.2 Absence de contexte marché

Aucune page principale (Mission, Live, Past, Control) n'affiche les prix du marché en temps réel. Un opérateur qui voit un BLOCK sur un ticket Trading ne sait pas si BTC est en chute libre (-8% sur 24h) ou stable. Ce contexte est pourtant décisif pour comprendre si le BLOCK est justifié ou conservateur.

**Solution :** un composant `MarketBanner` partagé (BTC/ETH/SOL + régime + change 24h) à intégrer en bandeau sur Mission, Live, Past et Control.

### 4.3 Absence d'explications contextuelles

Les tableaux de métriques (HealthMatrix, AgentConstellationPanel, DecisionEnvelopeCard) affichent des scores sans expliquer ce qu'ils signifient concrètement. La règle spec V2 "aucun tableau sans phrase d'interprétation" est partiellement respectée (ajoutée dans ce sprint) mais pas encore systématique.

---

## 5. Plan d'action priorisé

### Priorité 0 — Critique (bloquant pour la gouvernance)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| P0.1 | Exposer `agent_votes` complets depuis `guard.py` | `server/python_agents/guard.py` | 30 min |
| P0.2 | Mettre à jour `CanonicalEnvelope` TypeScript pour inclure `agent_votes[]` | `server/routers.ts`, types partagés | 20 min |
| P0.3 | Ajouter routes opérateur : `forceHold`, `escalate`, `approveOverride`, `operatorNote` | `server/routers.ts`, `drizzle/schema.ts` | 2h |

### Priorité 1 — Haute (pilotage opérateur)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| P1.1 | Créer `agentCatalog.ts` avec but métier + fonction + logique de vote pour les 51 agents | `client/src/lib/agentCatalog.ts` | 1h |
| P1.2 | Composant `AgentCard` enrichi : couche + but + claim réel + confiance + verdict proposé | `client/src/components/AgentCard.tsx` | 1h |
| P1.3 | Refonte Live : actions opérateur (forcer HOLD, escalader, approuver) + bandeau marché | `client/src/pages/Live.tsx` | 2h |
| P1.4 | Composant `MarketBanner` partagé (BTC/ETH/SOL + régime + change 24h) | `client/src/components/MarketBanner.tsx` | 45 min |

### Priorité 2 — Moyenne (simplification et explications)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| P2.1 | Traduire tous les labels techniques en labels métier sur Live, Past, Control | Multiple | 1h |
| P2.2 | Ajouter contexte marché au moment du run dans Past (prix BTC/ETH au timestamp du run) | `client/src/pages/Past.tsx` | 45 min |
| P2.3 | Brancher `ai.explainDecision` dans EcomWorld | `client/src/pages/EcomWorld.tsx` | 20 min |
| P2.4 | Ajouter `MarketBanner` sur Mission, Live, Past, Control | 4 fichiers | 30 min |

### Priorité 3 — Basse (polish et traçabilité)

| # | Action | Fichier(s) | Effort |
|---|---|---|---|
| P3.1 | Onglet "Historique des replays" dans Past | `client/src/pages/Past.tsx` | 1h |
| P3.2 | Métriques du run original dans le bandeau Replay de Future | `client/src/pages/Future.tsx` | 30 min |
| P3.3 | Ajouter tests Vitest pour `agentCatalog` et routes opérateur | `server/*.test.ts` | 1h |
| P3.4 | Persistance des résultats StressLab en DB | `server/routers.ts`, `drizzle/schema.ts` | 1h |

---

## 6. Synthèse

Le moteur Python est solide et complet. Le problème n'est pas le moteur — c'est la **transmission** et la **lisibilité** de ce que le moteur sait. Les `agent_votes` complets existent dans Python mais ne remontent pas au frontend. Les actions opérateur n'existent pas. Les labels sont techniques. Le marché est invisible.

La plateforme est aujourd'hui un **observatoire** (on voit les décisions) mais pas encore un **cockpit de gouvernance** (on ne peut pas agir, comprendre et piloter). Les 3 corrections P0 transforment OS4 en vrai outil de pilotage en moins de 3 heures de développement.

---

*Rapport généré le 11 mars 2026 — OS4 Obsidia Governance Platform v`d529ad45`*
