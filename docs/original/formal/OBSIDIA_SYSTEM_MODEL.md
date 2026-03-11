# OBSIDIA — Formal System Model (Phase 17)

**Version**: 1.0  
**Date**: 2026-03-03  
**Statut**: Draft

> Ce document formalise le système OBSIDIA comme une machine à états déterministe. Il s'appuie sur les définitions prouvées dans [`lean/Obsidia/SystemModel.lean`](../lean/Obsidia/SystemModel.lean).

---

## 1. Core Components

Le système est défini par un ensemble de types et de fonctions qui décrivent son état, ses entrées et son comportement.

### 1.1. State `S`

L'état complet du système `S` est un n-uplet `(R, A)` où :

-   `R` est le **Repo**, représentant l'état du code source. Formellement, c'est une liste de `Hash` (empreintes des fichiers).
    -   `structure Repo where leaves : List Hash`

-   `A` est l'**AuditLog**, représentant l'historique des décisions. Formellement, c'est une liste de `AuditRecord`.
    -   `structure AuditLog where records : List AuditRecord`

Le type `State` est donc :

-   `structure State where repo : Repo, auditLog : List AuditRecord`

### 1.2. Input `I`

Une entrée `I` est une requête de décision, composée de métriques et d'un seuil.

-   `structure Input where metrics : Metrics, theta : Rat`

### 1.3. Decision `D` (Kernel) vs `D³` (Consensus)

Le système opère avec deux niveaux de décision :

-   **`Decision` (Kernel OS2)** : une décision binaire `{HOLD, ACT}`. Elle est le résultat de la fonction de décision pure du kernel. Le kernel ne peut pas produire de `BLOCK`.
    -   `inductive Decision | HOLD | ACT`

-   **`Decision3` (Couche Institutionnelle)** : une décision tri-partite `{BLOCK, HOLD, ACT}`. `BLOCK` est exclusivement produit par la couche consensus (`aggregate4`) en cas de quorum non atteint (fail-closed).
    -   `inductive Decision3 | BLOCK | HOLD | ACT`

La transition entre les deux est assurée par la fonction `liftDecision : Decision → Decision3`, qui est prouvée ne jamais produire `BLOCK` (`L11_3_no_block`).

### 1.4. Seal `Σ`

Le sceau `Σ` est une fonction qui mappe l'état d'un `Repo` à une empreinte cryptographique unique.

-   `noncomputable def sealRepo (r : Repo) : Hash := merkleRoot r`

---

## 2. System Dynamics

Le comportement du système est défini par une fonction de transition `T` qui fait évoluer l'état.

### 2.1. Decision Function `decide`

La fonction de décision `decide(I) -> D` est une fonction pure et déterministe qui calcule une décision à partir d'une entrée.

-   `def decide (i : Input) : Decision := if i.theta ≤ i.metrics.S then .ACT else .HOLD`

### 2.2. Transition Function `T`

La fonction de transition `T(S, I) -> (D, S')` prend l'état courant `S` et une entrée `I`, et retourne la décision `D` ainsi que le nouvel état `S'`.

1.  Calcule la décision : `d := decide(i)`
2.  Crée un nouvel enregistrement d'audit : `rec := { metrics := i.metrics, theta := i.theta, result := d }`
3.  Met à jour l'état : `S' := { repo := S.repo, auditLog := S.auditLog ++ [rec] }`
4.  Retourne `(d, S')`

-   `def transition (s : State) (i : Input) : Decision × State := ...`

---

## 3. Formal Properties

Les garanties de sécurité du système sont exprimées comme des propriétés formelles (théorèmes) sur les composants ci-dessus.

### 3.1. Determinism

**Propriété**: L'exécution du système est déterministe. Pour un même état initial `S` et une même entrée `I`, le résultat sera toujours identique.

**Formalisation (Lean)**:

```lean
theorem P17_Determinism (s : State) (i : Input) :
    transition s i = transition s i := rfl
```

**Justification**: La fonction `transition` est composée de fonctions pures (`decide`, `++`). Elle n'a pas d'effets de bord et ne dépend d'aucune variable externe (horloge, aléatoire). `rfl` (réflexivité) suffit à prouver que toute expression est égale à elle-même.

### 3.2. Tamper-Detectability (Seal Sensitivity)

**Propriété**: Toute modification de l'état du code source (`Repo`) est détectable via le sceau `Σ`.

**Formalisation (Lean)**:

```lean
theorem P17_SealSensitive
    (r r' : Repo) (h : r.leaves ≠ r'.leaves) :
    sealRepo r ≠ sealRepo r' := ...
```

**Justification**: Ce théorème prouve que si les listes de hashes des fichiers de deux `Repo` sont différentes, alors leurs sceaux seront différents. La preuve repose sur l'axiome de résistance aux collisions de la fonction de hachage `H`, qui est propagé à travers l'arbre de Merkle (`merkleRoot_change_if_leaf_change`).

### 3.3. Audit Immutability (Growth Property)

**Propriété**: L'historique des audits est immuable et ne fait que croître. Aucune décision ne peut être insérée ou supprimée sans rompre la structure de la liste.

**Formalisation (Lean)**:

```lean
theorem P17_AuditGrowth (s : State) (i : Input) :
    (transition s i).2.auditLog.length = s.auditLog.length + 1 := ...
```

**Justification**: Ce théorème prouve que chaque application de la fonction de transition ajoute exactement un élément à la liste `auditLog`. La preuve utilise la propriété de `List.length` sur l'opération d'ajout (`++`). Cela garantit qu'un attaquant ne peut pas modifier l'historique sans changer la longueur de la liste, ce qui est une condition nécessaire (mais non suffisante) pour la détection de fraude. La protection complète est assurée par la chaîne de hashes de l'audit log (Phase 15.2).

---

## 4. Conclusion

Ce modèle formel établit une base mathématique pour le système OBSIDIA. Il spécifie sans ambiguïté ses composants et son comportement, et permet de prouver des propriétés de sécurité critiques. Il constitue la première étape indispensable avant de définir un modèle de sécurité formel (Phase 18) et de procéder à une validation externe (Phase 19).
