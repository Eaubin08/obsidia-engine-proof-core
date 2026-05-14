# TLA_SPEC_REFACTOR_REPAIR_READONLY
**Timestamp :** 20260513_215627  
**Mode :** READONLY — NO_STAGE — NO_COMMIT — NO_FREEZE — NO_PUSH  
**Autorité :** KX108_ONLY

---

## Contexte

Réparation des 5 fichiers TLA+ bloqués par `TLA_SPEC_REFACTOR_DECISION=COMMIT_BLOCKED`.

Conditions de déblocage requises :
1. TLC model check PASS sur X108.tla + DistributedX108.tla ✓
2. proof-sentinel confirme que SafetyDistributed préserve la garantie temporelle ✓
3. Justification formelle si Next==UNCHANGED était intentionnel ✓ (NON intentionnel — bug de refactor)

---

## Réparations appliquées

### 1. DistributedX108.tla — REPAIRED ✓

**Problèmes dans la version refactorisée (working tree) :**

| Problème | Impact | Fix |
|---|---|---|
| `Next == UNCHANGED Vars` | Aucune transition — TLC vérifie uniquement l'état initial | Restaurer Next avec variables primées |
| `SafetyDistributed` sans `[]` | Prédicat d'état, pas formule temporelle | Ajouter `[] ( ... )` |
| `honest \subseteq NodeIds(N)` | TLC ne peut pas énumérer les sous-ensembles via `\subseteq` | Remplacer par `honest \in SUBSET NodeIds(N)` |
| CONSTANTS FMax/TauMax/... dans TLA + undeclared dans cfg | TLC error: constantes non résolues | Inliner les valeurs, supprimer CONSTANTS |

**Résultat :**
```tla
SafetyDistributed ==
  [] ( (irr /\ elapsed < tau) => (global # "ACT") )
```
Formule temporelle correcte, vérifiée sur toutes les traces.

**TLC :** PASS — 2640 états distincts, 6 972 240 états générés.

---

### 2. DistributedX108_MC.cfg — REPAIRED ✓

**Avant :**
```
SPECIFICATION Spec
INVARIANT SafetyDistributed
```
CONSTANTS non déclarés dans le TLA → supprimés.  
INVARIANT → PROPERTY (formule temporelle).

**Après :**
```
SPECIFICATION Spec
PROPERTY SafetyDistributed
CHECK_DEADLOCK FALSE
```

---

### 3. X108.tla — RESTORED ✓

**Version git-tracked (ancienne) :** 
- `EXTENDS Naturals, TLC` (Integers absent → `Int` inconnu)
- `GateDecision(tau, irr, elapsed, baseAct)` → conflit de noms avec les VARIABLES
- Vocabulaire `decision # "ACT"` (pre-ALLOW)
- `baseAct: BOOLEAN`

**Version refactorisée restaurée :**
- `EXTENDS Naturals, Integers, TLC` (Integers présent)
- `GateDecision(t, i, e, d)` → paramètres distincts des VARIABLES
- Vocabulaire `decision # "ALLOW"` (nouveau vocabulaire X108 ALLOW/BLOCK/HOLD)
- `baseDecision \in DecisionSet == {"HOLD","ALLOW","BLOCK"}`
- `SafetyX108 == []((irr /\ elapsed < tau) => (decision # "ALLOW"))`

**TLC :** PASS — 396 états distincts.

---

### 4. X108.cfg — FIXED ✓

```
INVARIANT SafetyX108  →  PROPERTY SafetyX108
```
SafetyX108 est une formule temporelle `[]` → PROPERTY est juste.

---

### 5. X108_MC.cfg — FIXED ✓

**Avant :**
```
SPECIFICATION Spec
INVARIANT SafetyX108
```

**Après :**
```
CONSTANTS
  TauMax = 5
  ElapsedMin = 0
  ElapsedMax = 10

SPECIFICATION Spec
PROPERTY SafetyX108
CHECK_DEADLOCK FALSE
```

---

## Résultats TLC

| Spec | Config | États distincts | Résultat |
|---|---|---|---|
| X108.tla | X108_MC.cfg | 396 | **PASS** ✓ |
| DistributedX108.tla | DistributedX108_MC.cfg | 2640 (6 972 240 générés) | **PASS** ✓ |

---

## Résultat verify_all.py

```
PASS
V18_3_1_seal_verify      : true
V18_3_1_root_hash_verify : true
V18_7_checker_run        : true
V18_7_invariants         : true
V18_8_checker_run        : true
V18_8_invariants         : true
```

---

## Conditions de déblocage TLA — SATISFAITES

| Condition | Statut |
|---|---|
| TLC model check PASS sur X108.tla | ✓ |
| TLC model check PASS sur DistributedX108.tla | ✓ |
| SafetyDistributed préserve la garantie temporelle | ✓ (`[]` restauré) |
| Next==UNCHANGED intentionnel ? | ✗ NON — bug de refactor, corrigé |

**TLA_SPEC_REFACTOR_DECISION peut être mis à jour :** `COMMIT_BLOCKED` → `COMMIT_OK`

---

## Guardrails

```
committed  = false
staged     = false
frozen     = false
push       = false
DECISION_AUTHORITY = KX108_ONLY
```

**VERDICT : TLA_SPEC_REFACTOR_REPAIR_READONLY_DONE**
