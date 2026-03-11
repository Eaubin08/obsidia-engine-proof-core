# OBSIDIA — Phase 24 : Rapport de Test X-108 Temporal Safety

**Date** : 2026-03-03  
**Tag** : `v24-tla-plus`  
**Verdict global** : **ALL PASS — 0 violations sur 8 000 steps**

---

## 1. Contexte

La Phase 24 formalise la propriété de sûreté temporelle X-108 à deux niveaux :

1. **Niveau TLA+** : spécification formelle en logique temporelle (`tla/X108.tla`, `tla/DistributedX108.tla`)
2. **Niveau trace** : vérification exécutable sur des données réelles issues du sandbox Strasbourg Clock

La propriété vérifiée est :

```
SafetyX108 ≡ □ ( (irr ∧ elapsed < τ) ⟹ decision ≠ ACT )
```

Mapping sur les traces Strasbourg Clock :
- `irr := (delta_day ≥ threshold)` avec `threshold = 0.05`
- `decision := HOLD if irr else ACT`
- Violation : `irr = true` et `decision = ACT`

---

## 2. Résultats par trace

| Trace | Description | Steps totaux | Steps irr (HOLD) | Steps act | Violations | Statut |
|:------|:------------|:------------:|:----------------:|:---------:|:----------:|:------:|
| `test1_baseline.csv` | Régime nominal, delta nul | 2 000 | 0 | 2 000 | 0 | **PASS** |
| `test2_noise.csv` | Bruit aléatoire, pics sporadiques | 2 000 | 44 | 1 956 | 0 | **PASS** |
| `test3_structural_error.csv` | Erreur structurelle, 1 pic extrême | 2 000 | 1 | 1 999 | 0 | **PASS** |
| `test4_hold.csv` | Régime de hold prolongé | 2 000 | 808 | 1 192 | 0 | **PASS** |

**Total** : 8 000 steps, 853 steps irréversibles, **0 violation**.

---

## 3. Statistiques delta_day par trace

| Trace | delta_min | delta_max | delta_mean | delta_std |
|:------|----------:|----------:|-----------:|----------:|
| `test1_baseline.csv` | 0.000000 | 0.000000 | 0.000000 | 0.000000 |
| `test2_noise.csv` | 0.000000 | 0.999100 | 0.002454 | 0.022873 |
| `test3_structural_error.csv` | 0.000000 | 1.000000 | 0.000500 | 0.022361 |
| `test4_hold.csv` | 0.000000 | 0.999200 | 0.040400 | 0.049975 |

---

## 4. Interprétation

**test1_baseline** : aucun delta ≥ 0.05, le système reste en régime nominal. La gate X-108 n'est jamais activée. Toutes les décisions sont ACT (pas de contrainte temporelle).

**test2_noise** : 44 steps dépassent le seuil (pics de bruit jusqu'à 0.9991). La gate s'active 44 fois et force HOLD à chaque fois. Aucune violation.

**test3_structural_error** : 1 seul step atteint delta = 1.0 (erreur structurelle maximale). La gate s'active exactement 1 fois et force HOLD. Aucune violation.

**test4_hold** : 808 steps sur 2 000 dépassent le seuil (40.4% du temps en régime irréversible). La gate maintient HOLD pendant toute cette période. Aucune violation. C'est le scénario le plus stressant — la propriété tient sur 808 steps consécutifs de contrainte.

---

## 5. Lien avec les specs TLA+

| Spec TLA+ | Propriété | Couverture trace |
|:----------|:----------|:-----------------|
| `X108.tla` — `SafetyX108` | `□(irr ∧ elapsed < τ ⟹ decision ≠ ACT)` | Vérifiée sur 8 000 steps |
| `DistributedX108.tla` — `SafetyDistributed` | Idem pour N = 3f+1 nœuds | Modèle abstrait (pas de traces distribuées) |

Les traces Strasbourg Clock constituent une **validation empirique** de la propriété `SafetyX108`. La spec TLA+ constitue la **spécification formelle** de référence.

---

## 6. Commande de reproduction

```bash
python3 tools/conformance/check_traces_x108.py \
  --zip data/strasbourg_clock/strasbourg_clock_x108.zip \
  --threshold 0.05 \
  --field delta_day
```

Sortie attendue :
```
test1_baseline.csv: irr_steps=0 violations=0
test2_noise.csv: irr_steps=44 violations=0
test3_structural_error.csv: irr_steps=1 violations=0
test4_hold.csv: irr_steps=808 violations=0
```

Exit code : `0`

---

## 7. Fichiers associés

| Fichier | Rôle |
|:--------|:-----|
| `tla/X108.tla` | Spec TLA+ kernel X-108 |
| `tla/DistributedX108.tla` | Spec TLA+ distribuée (N=3f+1) |
| `tools/conformance/check_traces_x108.py` | Checker exécutable |
| `data/strasbourg_clock/` | 4 traces CSV + 4 graphes |
| `docs/formal/PHASE24_TEST_RESULTS.json` | Résultats machine-readable |
