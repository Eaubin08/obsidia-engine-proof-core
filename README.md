# OBSIDIA ENGINE PROOF CORE

**Version :** 1.1.0 · **Date :** 2026-03-11 · **Statut :** Exécutable et vérifié

Repo public contenant le moteur de décision Obsidia dans un état **réellement exécutable et auditable**.

---

## Démarrage rapide

```bash
# 1. Cloner
git clone https://github.com/Eaubin08/obsidia-engine-proof-core.git
cd obsidia-engine-proof-core

# 2. Tout vérifier en une commande
bash bootstrap.sh
```

**Résultat attendu :**
```
✓ Python dependencies installed
✓ Node.js dependencies installed
✓ Python tests PASS          (12/12)
✓ TypeScript tests PASS      (39/39)
✓ Pipeline smoke tests PASS
✓ Merkle root verified
⚠  Proofkit partial (V18.3.1 root_hash mismatch attendu — voir LIMITS.md)
═══════════════════════════════════════════════════════
  ALL CHECKS COMPLETE
```

---

## Ce que ce repo contient

| Couche | Contenu | Statut |
|---|---|---|
| **Moteur Python** | OS0/OS1/OS2/OS3 + kernel + runtime + bus | ✅ Exécutable |
| **51 agents domaine** | Trading(17), Bank(12), Ecom(12), Meta(10) | ✅ Exécutable |
| **Guard X-108** | Règle de délai 108s + FRAUD_PATTERN | ✅ Exécutable |
| **Preuves Lean 4** | 8 théorèmes sans `sorry` | ✅ Vérifiables |
| **Spécifications TLA+** | X108 + DistributedX108 | ✅ Présentes |
| **Proofkit V18.7** | 200 000 cas fuzz — 0 violation E2 | ✅ Reproductible |
| **Proofkit V18.8** | Convergence G1/G2/G3/G4 | ✅ Reproductible |
| **Tests adversariaux** | Phase 15.2 — 6 batteries — ALL PASS | ✅ Reproductible |
| **Evidence Strasbourg Clock** | 8 000 steps — 0 violation SafetyX108 | ✅ Présente |
| **Ancre RFC 3161** | 2026-03-03 16:43:06 UTC — Free TSA | ✅ Vérifiable openssl |

---

## Structure

```
agents/          ← 51 agents + Guard X-108 + pipeline CLI
engine/          ← OS0/OS1/OS2/OS3 + kernel + runtime
governance/      ← Contrats TypeScript + agrégation
tests/
  engines/       ← tradingEngine, bankEngine, ecomEngine, guardX108 (TypeScript)
  test_agents_functional.py          ← pytest 12 tests
  test_invariants_against_engine.py  ← pytest invariants D1/E2/G1/G2/G3
proofs/
  lean/          ← Preuves Lean 4 (8 théorèmes)
  tla/           ← Spécifications TLA+
  V18_3_1/       ← Root Seal (seal_verify PASS, root_hash mismatch attendu)
  V18_7/         ← Non-circumvention 200k fuzz
  V18_8/         ← Convergence & Stability
  anchors/       ← RFC 3161 + OTS
  verify_all.py      ← Lance V18.3.1 + V18.7 + V18.8
  verify_merkle.py   ← Vérifie le Merkle Root
  verify_decision.py ← Vérifie un CanonicalDecisionEnvelope
examples/        ← 4 cas JSON reproductibles
scripts/         ← generate_hashes.py + verify_hashes.py
distributed/     ← Consensus multi-nœuds (nécessite Docker)
requirements.txt ← Dépendances Python
bootstrap.sh     ← Script de vérification complète
```

---

## Commandes individuelles

```bash
# Pipeline agents
python3 agents/run_pipeline.py trading "$(cat examples/trading_bullish.json)"
python3 agents/run_pipeline.py bank    "$(cat examples/bank_normal.json)"
python3 agents/run_pipeline.py bank    "$(cat examples/bank_suspicious.json)"
python3 agents/run_pipeline.py ecom    "$(cat examples/ecom_normal.json)"

# Tests Python
python3 -m pytest -q tests/

# Tests TypeScript
pnpm test

# Vérification proofkit
python3 proofs/verify_all.py

# Vérification Merkle
python3 proofs/verify_merkle.py

# Vérification d'un envelope
python3 agents/run_pipeline.py trading "$(cat examples/trading_bullish.json)" > /tmp/env.json
python3 proofs/verify_decision.py /tmp/env.json
```

---

## Résultats vérifiés

| Test | Résultat |
|---|---|
| `pytest -q tests/` | **12/12 PASS** |
| `pnpm test` | **39/39 PASS** |
| Pipeline trading (bullish) | `x108_gate: ALLOW` |
| Pipeline bank (normal) | `x108_gate: ALLOW` |
| Pipeline bank (suspicious) | `x108_gate: BLOCK` |
| Pipeline ecom (normal) | `x108_gate: ALLOW` |
| Proofkit V18.7 (200k fuzz) | **PASS — 0 violation E2** |
| Proofkit V18.8 (convergence) | **PASS — G1/G2/G3/G4** |
| Adversarial Phase 15.2 | **ALL PASS** |
| Merkle Root | **Format VALID** |
| RFC 3161 anchor | **2026-03-03 16:43:06 UTC** |

---

## Limites

Voir [LIMITS.md](LIMITS.md) pour la liste complète des limites connues.

Le point le plus important : le `root_hash_verify` de V18.3.1 échoue intentionnellement — le hash déclaré correspond à l'état du repo au moment du scellement original (2026-03-03). Toute modification ultérieure produit un hash différent, ce qui est le comportement attendu d'un sceau d'intégrité.

---

## Documentation

| Fichier | Contenu |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture complète OS0→OS3 + agents |
| [INVARIANTS.md](INVARIANTS.md) | 5 invariants formels D1/E2/G1/G2/G3 |
| [EXECUTION.md](EXECUTION.md) | Guide d'exécution détaillé |
| [TEST_MATRIX.md](TEST_MATRIX.md) | Matrice complète des tests |
| [REAL_CASES.md](REAL_CASES.md) | 4 cas reproductibles |
| [CHALLENGE_PROTOCOL.md](CHALLENGE_PROTOCOL.md) | Protocole de challenge |
| [LIMITS.md](LIMITS.md) | Limites connues et honnêtes |
| [AUDIT_GUIDE.md](AUDIT_GUIDE.md) | Guide d'audit pratique |
| [MANIFEST.md](MANIFEST.md) | Inventaire complet des fichiers |
