# LIMITS — Ce qui n'est pas encore fermé

**Version :** 1.0.0 · **Date :** 2026-03-11

Ce fichier liste sans exagération tout ce qui reste partiel, non prouvé, ou dépendant d'intégrations futures. Aucun composant listé ici ne doit être présenté comme prouvé.

---

## A — Non prouvé formellement

### A1 — Preuves Lean 4

**Statut :** Présentes dans `Obsidia-lab-trad/proofkit/` mais non fermées.

Les fichiers `.lean` existent (répertoire `lean/` dans le repo parent). Les théorèmes sont énoncés. Certains sont partiellement prouvés (`sorry` présents). Aucune preuve complète sans `sorry` n'a été vérifiée avec `lake build` sur la version actuelle du moteur.

**Ce qui manque :** Vérification `lake build` propre + correspondance formelle entre le code Python et les théorèmes Lean.

### A2 — Spécifications TLA+

**Statut :** Spécifications TLA+ présentes dans le repo parent mais non exécutées avec TLC (TLA+ model checker).

**Ce qui manque :** Installation TLA+ toolbox + exécution TLC sur les specs + rapport de model checking.

### A3 — Preuve de non-anticipation formelle

L'invariant de non-anticipation (le moteur ne peut pas utiliser d'information future) est affirmé dans la gouvernance (`non_anticipation: bool = True` dans `Governance`) mais n'est pas testé formellement. Il s'agit d'un flag déclaratif, pas d'une contrainte vérifiée à l'exécution.

---

## B — Partiellement implémenté

### B1 — Guard X-108 : tests unitaires manquants

Les invariants G-X108-1 à G-X108-4 (BLOCK > HOLD > ALLOW, FRAUD_PATTERN → BLOCK, ticket sur ALLOW, attestation) sont implémentés dans le code mais n'ont pas de tests unitaires dédiés. Ils sont couverts indirectement par `test_agents_functional.py` mais pas de manière exhaustive.

### B2 — Agents Meta (cross-domaine)

Les 10 agents Meta (`meta_agents.py`) sont présents et instanciables mais n'ont pas de tests fonctionnels dédiés. Leur comportement sur des états cross-domaine réels n'est pas vérifié.

### B3 — Couche Proof (Layer.PROOF)

La couche PROOF est définie dans l'enum `Layer` et référencée dans l'architecture. Les agents de cette couche (génération de preuves cryptographiques, Lean proof hash) sont partiellement présents dans `core/engine/obsidia_os2` mais non intégrés au pipeline `run_pipeline.py`.

### B4 — Verrou temporel X-108

Le verrou temporel (`x108_elapsed_s`, `x108_min_wait_s=108`) est implémenté dans le kernel (`kernel.py`) et transmis au runtime. Son effet réel sur la décision (délai de 108 secondes avant ACT sur opérations irréversibles) est présent dans le code mais non testé avec des timestamps réels.

### B5 — `HumanGate` — Gate humaine

La `HumanGate` est générée par le kernel quand `decision in (HOLD, BLOCK)` et `acp_status == "REFUSE_UNTIL_RESOLVED"`. Le mécanisme ACP (Ambiguity Control Protocol) est partiellement implémenté. La résolution effective de la gate humaine (workflow d'approbation) n'est pas dans ce repo.

---

## C — Dépendances futures non résolues

### C1 — Données de marché réelles

Le pipeline Trading utilise des données synthétiques dans les tests. L'intégration avec des données réelles (CoinGecko, Binance WebSocket) est présente dans `os4-platform` mais dépend de clés API externes et n'est pas dans ce repo moteur.

### C2 — Persistance des traces

Les `trace_id`, `decision_id`, `ticket_id` sont générés à chaque exécution mais non persistés. Un système de persistance (base de données, fichier de log structuré) est nécessaire pour un audit longitudinal.

### C3 — RFC 3161 timestamping

Les artefacts `proofkit` (V11, V14, V15, V18) dans le repo parent contiennent des références à des timestamps RFC 3161. Ces timestamps ne sont pas vérifiables sans accès à l'autorité de timestamping d'origine.

### C4 — Intégration OS3 (couche Proof formelle)

Le module `obsidia_os2` dans `core/engine` contient une référence à `os1` et `os2` dans l'`audit_path`. La couche OS3 (preuve formelle complète) est mentionnée dans l'architecture mais non implémentée dans le pipeline actuel.

---

## D — Ce qui est écarté de ce repo

| Composant | Raison d'exclusion |
|---|---|
| Front-end React (11 pages) | Hors périmètre moteur |
| tRPC server (`routers.ts`) | Couche API applicative |
| Base de données (`drizzle/schema.ts`) | Persistance applicative |
| Dashboard HTML | Interface de visualisation |
| Pages métier (TradingWorld, BankWorld, EcomWorld) | Démo applicative |
| Artefacts proofkit complets | Non intégrés au pipeline moteur |

---

## Résumé des limites

| Catégorie | Élément | Impact |
|---|---|---|
| Non prouvé formellement | Lean 4, TLA+, non-anticipation | Preuve formelle incomplète |
| Partiellement implémenté | Tests Guard X-108, agents Meta, couche Proof, verrou temporel | Couverture de test insuffisante |
| Dépendances futures | Données réelles, persistance, RFC 3161, OS3 | Intégration production non démontrée |
