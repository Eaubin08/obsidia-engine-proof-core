# OBSIDIA — External Reproduction Guide (Phase 19)

**Version**: 1.0  
**Date**: 2026-03-03

> Ce guide permet à un tiers de reproduire indépendamment l'intégralité des vérifications du système OBSIDIA à partir d'un dépôt vierge, sans aucune aide extérieure.

---

## Prérequis

| Outil | Version | Vérification |
|:---|:---|:---|
| Git | ≥ 2.30 | `git --version` |
| Python | ≥ 3.10 | `python3 --version` |
| Lean 4 / Elan | v4.28.0 | `lean --version` |
| Lake | ≥ 4.28 | `lake --version` |
| pip packages | `pynacl` | `pip3 install pynacl` |

---

## Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/Eaubin08/Obsidia-lab-trad.git
cd Obsidia-lab-trad
```

---

## Étape 2 — Vérification du Sceau (Intégrité du Code)

**Objectif** : Confirmer que le code source n'a pas été altéré depuis le scellement.

```bash
python3 proofkit/V15_GLOBAL_SEAL/seal_verify.py
```

**Sortie attendue** :

```
Verifying V15 GLOBAL SEAL...
PASS
```

**Ce que cela prouve** : Chaque fichier du dépôt correspond exactement à son empreinte SHA-256 dans le manifest. Le `GLOBAL_SEAL_HASH` est recalculable et correspond à la valeur déclarée dans `SEAL_META_V15.json`.

---

## Étape 3 — Compilation des Preuves Formelles

**Objectif** : Confirmer que les théorèmes Lean compilent sans erreur.

```bash
cd lean/
lake build
```

**Sortie attendue** :

```
Build completed successfully (8 jobs).
```

**Ce que cela prouve** : Les théorèmes suivants sont vérifiés par le compilateur Lean :
-   `P17_Determinism` : le système est déterministe.
-   `P17_SealSensitive` : toute modification du Repo change le sceau.
-   `P17_AuditGrowth` : l'audit log ne fait que croître.
-   `P15_Immutability_Strong` : immutabilité globale du sceau.
-   `aggregate4_fail_closed` : le consensus est fail-closed.

---

## Étape 4 — Audit Adversarial

**Objectif** : Confirmer que le système résiste à toutes les attaques de la suite adversariale.

```bash
cd ..  # retour à la racine du repo
bash tools/adversarial/RUN_ALL_ADVERSARIAL.sh
```

**Sortie attendue** :

```
ALL TESTS PASSED
NO STRUCTURAL WEAKNESS DETECTED
```

**Ce que cela prouve** : Aucune violation des invariants G1–G3 n'a été trouvée sur :
-   1 000 000 paires de métriques aléatoires (monotonie).
-   Fuzzing de la frontière de décision à ±1e-12.
-   1 000 000+ tentatives de collision Merkle.
-   6 types de tamper sur le seal et l'audit log.
-   Analyse exhaustive du consensus (81 cas).

---

## Étape 5 — Vérification du Modèle de Menace

**Objectif** : Confirmer que tous les `claims` du modèle de menace sont vérifiés.

```bash
python3 tools/verify_threat_model.py
```

**Sortie attendue** :

```
PASS — All 8 claims verified
```

---

## Étape 6 — Script One-Command

Pour exécuter toutes les vérifications en une seule commande :

```bash
bash tools/verify_all_phases.sh
```

**Sortie attendue** :

```
[PHASE 17/18/19] OBSIDIA Full Reproduction Check
  Step 1: Seal Verification ......... PASS
  Step 2: Lean Formal Proofs ........ PASS
  Step 3: Adversarial Suite ......... PASS
  Step 4: Threat Model .............. PASS

ALL PHASES PASS — OBSIDIA IS FULLY REPRODUCIBLE
```

---

## Résultats Attendus (Référence)

| Vérification | Tag | Résultat |
|:---|:---|:---|
| Seal V15.1 | `v15.1-final` | PASS |
| Lean Build | `v15.2-final` | 8 jobs, Build completed successfully |
| Adversarial Suite | `v15.2-final` | ALL TESTS PASSED |
| Threat Model | `v16A-threat-model` | 8/8 claims PASS |
| System Model | `v17-system-model` | 3 théorèmes prouvés |
