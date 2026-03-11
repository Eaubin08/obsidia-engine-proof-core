# ARCHITECTURE — Moteur réel retenu

**Version :** 1.0.0 · **Date :** 2026-03-11

---

## Vue d'ensemble

Le moteur Obsidia est un système de décision multi-agents à gouvernance formelle. Il reçoit une requête structurée, la fait traverser un pipeline d'agents spécialisés, agrège leurs votes, puis applique une gate de gouvernance (Guard X-108) pour produire une décision finale : `BLOCK`, `HOLD` ou `ACT/ALLOW`.

```
Request (JSON)
    │
    ▼
[REGISTRY] — validation de la requête, vérification du registre
    │
    ▼
[Agents domaine] — 6 couches : Observation → Interpretation → Contradiction → Aggregation → Governance → Proof
    │
    ▼
[Aggregation] — pondération des votes, calcul de confiance, détection contradictions
    │
    ▼
[Guard X-108] — gate finale : BLOCK / HOLD / ALLOW
    │
    ▼
CanonicalDecisionEnvelope (JSON)
```

---

## Modules réellement présents

### 1. `engine/` — Noyau kernel

**`obsidia_kernel/kernel.py`** — Classe `ObsidiaKernel`

Point d'entrée principal. Reçoit un objet `Request`, valide les paramètres de gouvernance (X-108 temporel, `theta_S`, `irreversible`), appelle `run_obsidia` du runtime, mappe la décision brute vers `Decision.BLOCK/HOLD/ACT`, calcule le hash des artefacts et la chaîne de hash, retourne un objet `Result`.

**`obsidia_kernel/contract.py`** — Contrats de données

Définit les dataclasses : `Request`, `Meta`, `Intent`, `Governance`, `Result`, `HumanGate`. Définit les enums : `Decision` (BLOCK/HOLD/ACT), `IntentType` (PROPOSE/ACTION).

**`obsidia_runtime/engine_runtime.py`** — Runtime bas niveau

Implémente `run_obsidia(payload)`. Contient la logique de calcul des métriques (`compute_metrics_core_fixed`), la fonction de décision `decision_act_hold(metrics, theta_S)`, et les modules OS1/OS2 (analyse structurelle du graphe d'agents).

**`obsidia_runtime/engine_final.py`** — Entrée finale

Wrapper d'entrée pour le runtime, gère les cas limites et la sérialisation.

---

### 2. `agents/` — Agents domaine

**Architecture en 6 couches** (définie dans `contracts.py`, enum `Layer`) :

| Couche | Rôle | Agents |
|---|---|---|
| `OBSERVATION` | Collecte des signaux bruts | Prix, volume, spread, sentiment |
| `INTERPRETATION` | Interprétation des signaux | Tendance, momentum, régime |
| `CONTRADICTION` | Détection des contradictions | Conflits entre signaux |
| `AGGREGATION` | Agrégation des votes | Pondération par confiance |
| `GOVERNANCE` | Application des règles | Guard X-108, seuils |
| `PROOF` | Génération des preuves | Hash, attestation, trace |

**Domaines couverts :**

- **Trading** (`trading_agents.py`) — 10 agents : analyse prix, volume, RSI, MACD, Bollinger, sentiment, risque événementiel, régime de marché, spread, corrélation BTC
- **Bank** (`bank_agents.py`) — 8 agents : solde, transactions, fraude, liquidité, risque crédit, conformité, réserve, objectif épargne
- **Ecom** (`ecom_agents.py`) — 6 agents : panier, stock, prix, historique client, risque fraude, délai livraison
- **Meta** (`meta_agents.py`) — 10 agents cross-domaine : cohérence globale, arbitrage, détection anomalie systémique

**`protocols.py`** — Pipelines d'exécution

Fonctions `run_trading_pipeline(state)`, `run_bank_pipeline(state)`, `run_ecom_pipeline(state)`. Chaque pipeline : instancie les agents, collecte les votes `AgentVote`, appelle l'agrégateur domaine, appelle le Guard X-108, retourne `CanonicalDecisionEnvelope`.

---

### 3. `governance/` — Guard X-108

**`guard.py`** — Classe `GuardX108`

Règles de décision basées sur 3 paramètres mesurés :

```python
GuardConfig:
    min_confidence_allow: float = 0.72   # seuil minimal pour ALLOW
    hold_confidence_floor: float = 0.45  # en dessous → HOLD
    max_unknowns_before_hold: int = 1    # nb d'inconnues max avant HOLD
    max_contradictions_before_block: int = 2  # nb contradictions max avant BLOCK
```

Logique de décision (ordre de priorité) :
1. `contradictions >= 2` **OU** `FRAUD_PATTERN` dans risk_flags → **BLOCK** (S4)
2. `unknowns > 1` **OU** `confidence < 0.45` → **HOLD** (S2)
3. `risk_flags >= 2` ET `confidence < 0.72` → **HOLD** (S2)
4. Sinon → **ALLOW** (S0 si confidence >= 0.72, S1 sinon)

**`contracts.py`** — Contrats de gouvernance

Types : `AgentVote`, `DomainAggregate`, `CanonicalDecisionEnvelope`, `X108Gate`, `Severity`, `Domain`, `Layer`, `SourceTag`.

**`aggregation.py`** — Agrégation des votes

Pour chaque domaine, agrège les votes par pondération de confiance. Calcule `market_verdict` (verdict dominant), `confidence` (ratio score dominant / score total), collecte contradictions/unknowns/risk_flags, génère `evidence_refs` (hash SHA-256 de chaque vote).

---

### 4. `automation/` — Orchestration

**`run_pipeline.py`** — CLI bridge

Entrée : `python3 run_pipeline.py <domain> <json_state>`. Sortie : JSON `CanonicalDecisionEnvelope` sur stdout. Exécutable sans dépendances externes.

**`canonicalPipeline.ts`** — Bridge TypeScript

Appelle `run_pipeline.py` via subprocess Node.js. Parse la sortie JSON. Utilisé par le serveur tRPC pour exposer le moteur Python via l'API.

---

## Liens entre modules

```
Request
  └─► ObsidiaKernel.process()
        ├─► run_obsidia(payload)          [engine_runtime.py]
        │     ├─► compute_metrics_core_fixed(W, core_nodes)
        │     └─► decision_act_hold(metrics, theta_S)
        └─► Result (Decision + hash_chain + audit_path)

TradingState / BankState / EcomState
  └─► run_*_pipeline(state)              [protocols.py]
        ├─► build_*_agents()             [domains/*.py]
        │     └─► AgentVote[]
        ├─► aggregate_*(votes)           [aggregation.py]
        │     └─► DomainAggregate
        └─► GuardX108.decide(aggregate)  [guard.py]
              └─► CanonicalDecisionEnvelope
```

---

## Ce qui n'est pas dans cette architecture

- Aucune surcouche spéculative
- Aucun module "prévu mais non implémenté"
- Les agents OS3 (couche Proof formelle) sont présents dans `core/engine/obsidia_os2` mais leur preuve Lean 4 n'est pas fermée — voir `LIMITS.md`
