# MANIFEST — Composants retenus

**Version :** 1.0.0 · **Date :** 2026-03-11

Ce fichier liste chaque composant retenu, sa source d'origine, sa raison de présence et son statut de preuve.

---

## Composants retenus

| Composant | Fichier source | Dossier cible | Raison | Statut |
|---|---|---|---|---|
| `ObsidiaKernel` | `core/engine/obsidia_kernel/kernel.py` | `engine/` | Noyau de décision principal | **Prouvé** — testé, exécutable |
| `contract.py` | `core/engine/obsidia_kernel/contract.py` | `engine/` | Contrats `Request/Result/Decision` | **Prouvé** — utilisé par tous les tests |
| `engine_runtime.py` | `core/engine/obsidia_runtime/engine_runtime.py` | `engine/` | Runtime bas niveau `run_obsidia` | **Prouvé** — appelé par kernel |
| `engine_final.py` | `core/engine/obsidia_runtime/engine_final.py` | `engine/` | Entrée finale du moteur | **Testé** |
| `guard.py` | `server/python_agents/guard.py` | `governance/` | Guard X-108 : règles BLOCK/HOLD/ALLOW | **Prouvé** — logique vérifiable |
| `contracts.py` | `server/python_agents/contracts.py` | `governance/` | Types `AgentVote`, `DomainAggregate`, `CanonicalDecisionEnvelope` | **Prouvé** — utilisé par tous les agents |
| `aggregation.py` | `server/python_agents/aggregation.py` | `governance/` | Agrégation pondérée des votes agents | **Prouvé** — logique déterministe |
| `base.py` | `server/python_agents/base.py` | `agents/` | Classe de base `BaseAgent` | **Prouvé** |
| `protocols.py` | `server/python_agents/protocols.py` | `agents/` | Pipelines `run_trading/bank/ecom_pipeline` | **Prouvé** — testé fonctionnellement |
| `registry.py` | `server/python_agents/registry.py` | `agents/` | Registre des agents par domaine | **Prouvé** |
| `trading_agents.py` | `server/python_agents/domains/trading_agents.py` | `agents/domains/` | 10 agents Trading | **Testé** |
| `bank_agents.py` | `server/python_agents/domains/bank_agents.py` | `agents/domains/` | 8 agents Bank | **Testé** |
| `ecom_agents.py` | `server/python_agents/domains/ecom_agents.py` | `agents/domains/` | 6 agents Ecom | **Testé** |
| `meta_agents.py` | `server/python_agents/domains/meta_agents.py` | `agents/domains/` | 10 agents Meta (cross-domaine) | **Partiel** — présents, non testés isolément |
| `indicators.py` | `server/python_agents/utils/indicators.py` | `agents/utils/` | Indicateurs techniques (RSI, MACD, Bollinger) | **Prouvé** — utilisé par agents trading |
| `run_pipeline.py` | `server/python_agents/run_pipeline.py` | `automation/` | CLI bridge JSON → décision | **Prouvé** — exécutable |
| `canonicalPipeline.ts` | `server/canonical/canonicalPipeline.ts` | `automation/` | Bridge TypeScript → Python subprocess | **Prouvé** — utilisé en production |
| `test_agents_functional.py` | `server/python_agents/tests/test_agents_functional.py` | `tests/` | Tests fonctionnels 3 pipelines | **Prouvé** — PASS |
| `test_invariants_against_engine.py` | `core/tests/test_invariants_against_engine.py` | `tests/` | Tests invariants D1/E2/G1/G2/G3 | **Prouvé** — PASS |
| `engines.test.ts` | `server/engines.test.ts` | `tests/` | Tests Vitest engines Trading/Bank/Ecom | **Prouvé** — 45/45 PASS |
| `canonical_components.test.ts` | `server/canonical_components.test.ts` | `tests/` | Tests contrats canoniques | **Prouvé** — PASS |
| `integrityGate.ts` | `lib/gates/integrityGate.ts` | `governance/` | Gate d'intégrité TypeScript | **Partiel** — présent, non testé isolément |
| `riskKillswitch.ts` | `lib/gates/riskKillswitch.ts` | `governance/` | Kill-switch risque | **Partiel** |
| `x108TemporalLock.ts` | `lib/gates/x108TemporalLock.ts` | `governance/` | Verrou temporel X-108 | **Partiel** |
| `invariants.ts` | `lib/core/invariants.ts` | `governance/` | Invariants TypeScript | **Partiel** |

---

## Exclusions majeures

| Composant exclu | Raison |
|---|---|
| Pages React (Live, Future, Past, Mission, Control) | Front-end applicatif — hors périmètre |
| `server/routers.ts` (tRPC) | Couche API applicative — hors périmètre |
| `drizzle/schema.ts` (DB) | Base de données applicative — hors périmètre |
| Preuves Lean 4 (`lean/`) | Présentes dans `Obsidia-lab-trad` mais non fermées — placées dans LIMITS |
| Artefacts RFC 3161 (`proofkit/`) | Présents mais non intégrés au pipeline moteur — référencés dans AUDIT_GUIDE |
| TLA+ specs (`tla/`) | Présentes mais non exécutables sans TLA+ toolbox — référencées dans LIMITS |
| Dashboard HTML | Interface de visualisation — hors périmètre |

---

## Statuts de preuve

| Statut | Définition |
|---|---|
| **Prouvé** | Exécutable, testé, résultat vérifiable |
| **Testé** | Tests présents et passants mais couverture partielle |
| **Partiel** | Code présent, logique correcte, tests insuffisants ou absents |
| **Non retenu** | Exclu du périmètre moteur |
