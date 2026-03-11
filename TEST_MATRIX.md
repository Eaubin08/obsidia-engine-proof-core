# TEST_MATRIX — Matrice complète des tests

**Version :** 1.0.0 · **Date :** 2026-03-11

---

## Tests Python — Invariants kernel

Fichier : `tests/test_invariants_against_engine.py`
Module testé : `engine/obsidia_runtime/engine_runtime.py` → `obsidia_os2.metrics.decision_act_hold`

| # | Nom du test | Invariant couvert | Ce que le test démontre | Ce que le test ne démontre pas | Statut |
|---|---|---|---|---|---|
| 1 | `test_determinism` | D1 — Déterminisme | Même `Metrics(S=0.5)` → même résultat sur 2 appels consécutifs | Déterminisme sur des entrées aléatoires ou concurrentes | ✅ PASS |
| 2 | `test_no_allow_before_tau` | E2 — Non-exécution avant seuil | `S=0.0 < theta_S=0.25` → résultat `HOLD` (jamais `ACT`) | Comportement pour toutes les valeurs de S dans [0, theta_S) | ✅ PASS |
| 3 | `test_act_above_threshold` | G1 — Exécution au-dessus seuil | `S=1.0 >= theta_S=0.25` → résultat `ACT` | Comportement pour toutes les valeurs de S dans (theta_S, 1] | ✅ PASS |
| 4 | `test_hold_at_boundary` | G2 — Inclusivité frontière | `S=0.25 == theta_S=0.25` → résultat `ACT` (opérateur `>=` inclusif) | Comportement pour d'autres valeurs de theta_S | ✅ PASS |
| 5 | `test_monotonicity` | G3 — Monotonie | `S=0.1 → HOLD`, `S=0.9 → ACT` : décision non décroissante | Monotonie stricte sur l'ensemble du domaine continu | ✅ PASS |
| 6 | `test_compute_metrics_pipeline` | Intégration pipeline | `compute_metrics_core_fixed(W, core_nodes)` → `decision_act_hold(metrics)` : pipeline complet exécutable | Validité des métriques intermédiaires (T_mean, H_score, A_score) | ✅ PASS |

---

## Tests Python — Agents fonctionnels

Fichier : `tests/test_agents_functional.py`
Modules testés : `agents/protocols.py`, `agents/domains/*.py`, `governance/guard.py`, `governance/aggregation.py`

| # | Nom du test | Ce que le test démontre | Ce que le test ne démontre pas | Statut |
|---|---|---|---|---|
| 7 | `test_trading_pipeline_returns_envelope` | Pipeline Trading complet : `TradingState` → `CanonicalDecisionEnvelope` avec tous les champs requis | Qualité des décisions sur données réelles de marché | ✅ PASS |
| 8 | `test_bank_pipeline_returns_envelope` | Pipeline Bank complet : `BankState` → `CanonicalDecisionEnvelope` | Détection de fraude sur patterns complexes | ✅ PASS |
| 9 | `test_ecom_pipeline_returns_envelope` | Pipeline Ecom complet : `EcomState` → `CanonicalDecisionEnvelope` | Gestion des cas limites (panier vide, stock nul) | ✅ PASS |
| 10 | `test_trading_pipeline_deterministic` | Même `TradingState` → même `x108_gate` et même `market_verdict` sur 2 appels | Déterminisme sur états partiellement différents | ✅ PASS |
| 11 | `test_guard_block_on_contradictions` | `DomainAggregate` avec 2+ contradictions → Guard retourne `BLOCK` | Comportement sur exactement 1 contradiction | ✅ PASS |
| 12 | `test_guard_hold_on_low_confidence` | `DomainAggregate` avec `confidence=0.2` → Guard retourne `HOLD` | Seuil exact de transition HOLD → ALLOW | ✅ PASS |
| 13 | `test_agent_registry_completeness` | `build_agent_registry()` retourne les 4 domaines avec au moins 1 agent chacun | Qualité individuelle de chaque agent | ✅ PASS |

---

## Tests TypeScript — Engines de simulation

Fichier : `tests/engines.test.ts`
Modules testés : `engine/tradingEngine.ts`, `engine/bankEngine.ts`, `engine/ecomEngine.ts`

| # | Nom du test | Ce que le test démontre | Ce que le test ne démontre pas | Statut |
|---|---|---|---|---|
| 14 | Trading — déterminisme seed | Même seed → même `stateHash`, `merkleRoot`, `finalPrice` | Déterminisme sur seeds non entiers | ✅ PASS |
| 15 | Trading — seeds différents | Seeds différents → `stateHash` différents | Absence de collisions de hash | ✅ PASS |
| 16 | Trading — nombre de steps | `steps=50` → exactement 50 éléments dans `r.steps` | Contenu de chaque step | ✅ PASS |
| 17 | Trading — métriques valides | `finalPrice > 0`, `annualizedVol > 0`, `stateHash` longueur 64 | Précision numérique des métriques financières | ✅ PASS |
| 18 | Trading — hashes SHA-256 | `stateHash` et `merkleRoot` sont des hex 64 chars valides `/^[0-9a-f]{64}$/` | Résistance aux collisions | ✅ PASS |
| 19 | Bank — déterminisme seed | Même seed → même `stateHash` | — | ✅ PASS |
| 20 | Bank — balance finale positive | `finalBalance > 0` après simulation | Précision du modèle bancaire | ✅ PASS |
| 21 | Bank — détection fraude | `fraudEvents.length > 0` avec `fraudRate=0.02` | Taux de faux positifs | ✅ PASS |
| 22 | Bank — hashes valides | `stateHash` hex 64 chars | — | ✅ PASS |
| 23 | Ecom — déterminisme seed | Même seed → même `stateHash` | — | ✅ PASS |
| 24 | Ecom — métriques valides | `totalRevenue >= 0`, `conversionRate` dans [0,1] | Précision du modèle e-commerce | ✅ PASS |
| 25 | Ecom — hashes valides | `stateHash` hex 64 chars | — | ✅ PASS |

---

## Tests TypeScript — Composants canoniques

Fichier : `tests/canonical_components.test.ts`
Modules testés : contrats `CanonicalEnvelope`, `ProofChain`, `HealthMatrixData`

| # | Nom du test | Ce que le test démontre | Ce que le test ne démontre pas | Statut |
|---|---|---|---|---|
| 26 | `CanonicalEnvelope` — champs requis | Interface TypeScript valide avec tous les champs obligatoires | Validation runtime des données | ✅ PASS |
| 27 | `ProofChain` — cohérence ticket | `ticket_required=true` → `ticket_id` présent | Unicité des ticket_id | ✅ PASS |
| 28 | `HealthMatrix` — scores dans [0,1] | Scores de santé bornés entre 0 et 1 | Signification métier des scores | ✅ PASS |
| 29 | Sévérité — ordre valide | S0 < S1 < S2 < S3 < S4 respecté | Mapping sévérité → action opérateur | ✅ PASS |

---

## Résumé

| Catégorie | Tests | PASS | FAIL | Couverture |
|---|---|---|---|---|
| Invariants kernel Python | 6 | 6 | 0 | Invariants D1, E2, G1, G2, G3 + pipeline |
| Agents fonctionnels Python | 7 | 7 | 0 | 3 pipelines + Guard + Registry |
| Engines TypeScript | 12 | 12 | 0 | Trading, Bank, Ecom — déterminisme + hashes |
| Composants canoniques | 4 | 4 | 0 | Contrats d'interface |
| **Total** | **29** | **29** | **0** | — |

> Note : Le projet `os4-platform` contient 45 tests Vitest au total (incluant les tests auth et autres). Ce tableau ne liste que les tests directement liés au moteur.
