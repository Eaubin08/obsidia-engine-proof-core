# OBSIDIA ENGINE PROOF CORE

**Version :** 1.0.0 · **Date :** 2026-03-11 · **Statut :** Partiel — moteur exécutable, tests passants, preuve formelle incomplète

---

## Ce que contient ce repo

Ce repo contient **uniquement le noyau moteur réel** d'Obsidia, extrait et isolé depuis les sources `Obsidia-lab-trad` et `os4-platform`. Il ne contient aucun front-end, aucune page métier, aucune interface utilisateur, aucun dashboard.

Ce qui est présent et exécutable :

- **`engine/`** — Noyau kernel Python (`obsidia_kernel`) avec contrat `Request/Result/Decision`, pipeline `run_obsidia`, logique de décision `BLOCK/HOLD/ACT`
- **`agents/`** — 51 agents Python répartis en 6 couches (Observation, Interpretation, Contradiction, Aggregation, Governance, Proof) pour les domaines Trading, Bank, Ecom et Meta
- **`governance/`** — Guard X-108 : règles de décision, seuils de confiance, gate `ALLOW/HOLD/BLOCK`, contrats `AgentVote`, `DomainAggregate`, `CanonicalDecisionEnvelope`
- **`automation/`** — Pipeline CLI (`run_pipeline.py`) : entrée JSON → décision → sortie JSON ; bridge TypeScript (`canonicalPipeline.ts`)
- **`tests/`** — Tests Python (invariants, agents fonctionnels) + tests TypeScript Vitest (engines, composants canoniques)
- **`examples/`** — Cas d'exécution reproductibles pour Trading, Bank, Ecom
- **`audit/`** — Scripts de vérification des hashes et des artefacts proofkit
- **`hashes/`** — Hashes SHA-256 des fichiers moteur

## Ce que ce repo ne contient pas

- Aucune page React, aucun composant UI, aucun dashboard
- Aucune page métier (TradingWorld, BankWorld, EcomWorld)
- Aucune base de données applicative
- Aucun serveur tRPC ou Express
- Aucune preuve formelle complète (Lean 4, TLA+) — présente dans `Obsidia-lab-trad` mais non fermée
- Aucun artefact RFC 3161 actif (présent dans `Obsidia-lab-trad/proofkit` mais non intégré ici)

## Comment lancer le moteur

### Prérequis

```bash
Python >= 3.11
pip install pytest
```

### Exécution d'un pipeline domaine

```bash
cd agents/
python3 run_pipeline.py trading '{"symbol":"BTCUSDT","prices":[100,101,102],"volumes":[1000,1100,1200]}'
python3 run_pipeline.py bank '{"account_id":"ACC001","balance":50000,"transactions":[{"amount":500,"type":"debit"}]}'
python3 run_pipeline.py ecom '{"session_id":"S001","cart_value":299.0,"items_count":3}'
```

### Exécution du kernel bas niveau

```bash
cd engine/
python3 -c "from obsidia_kernel.kernel import ObsidiaKernel; k = ObsidiaKernel(); print(k)"
```

## Comment exécuter les tests

### Tests Python (invariants + agents)

```bash
cd tests/
pytest -v
```

### Tests TypeScript (Vitest)

```bash
cd ../os4-platform/
pnpm test
```

## Comment lire les résultats

Chaque exécution du pipeline produit un `CanonicalDecisionEnvelope` JSON avec :

```json
{
  "domain": "trading",
  "market_verdict": "EXECUTE_LONG",
  "confidence": 0.82,
  "x108_gate": "ALLOW",
  "reason_code": "GUARD_ALLOW",
  "severity": "S0",
  "decision_id": "trading-a3f2c1...",
  "trace_id": "uuid-...",
  "ticket_required": true,
  "attestation_ref": "sha256-prefix-24chars"
}
```

Le champ `x108_gate` est la décision finale : `ALLOW` (exécution autorisée), `HOLD` (attente), `BLOCK` (refus).

## Distinction moteur vs applications

| Composant | Présent ici | Dans Obsidia-lab-trad |
|---|---|---|
| Kernel Python | ✅ | ✅ |
| Agents domaine | ✅ | ✅ |
| Guard X-108 | ✅ | ✅ |
| Tests invariants | ✅ | ✅ |
| Pages React | ❌ | ✅ |
| tRPC server | ❌ | ✅ |
| Base de données | ❌ | ✅ |
| Preuve Lean 4 | ❌ partielle | ✅ partielle |
