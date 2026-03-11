# V18.7 — Formal Theorems (Textual)
Date: 2026-03-03T14:37:06.261624Z

## 0. Definitions

Let `D = {ALLOW, HOLD, BLOCK}` with strict total order:
`BLOCK ≻ HOLD ≻ ALLOW`.

Define `meet ⊓ : D×D→D` as the **most restrictive** element (maximum under ≻):
- `x ⊓ y = max_≻(x,y)`
Equivalently (under numeric encoding), `meet` returns the larger “severity”.

Let there be k sovereign gates `G1..Gk` each mapping `(intent, state) -> D`.

Define sovereign aggregate gate:
`A(intent,state) = G1(intent,state) ⊓ ... ⊓ Gk(intent,state)`.

Let optimizer propose a set `S = Opt_B(state)` of candidate intents.
Execution chooses any intent only if `A(intent,state) = ALLOW` (or after HOLD resolves).

Nonce-store rule:
- a predicate `fresh(nonce,state)` must hold; otherwise the corresponding gate returns `BLOCK`.

Temporal lock rule (X108):
- for irreversible intent with threshold τ: if `t < τ` then gate returns `HOLD`.

## 1. Lemmas about meet on a total order

### Lemma L1 (Idempotence)
`x ⊓ x = x`.

### Lemma L2 (Commutativity)
`x ⊓ y = y ⊓ x`.

### Lemma L3 (Associativity)
`(x ⊓ y) ⊓ z = x ⊓ (y ⊓ z)`.

### Lemma L4 (Dominance)
If `x = BLOCK` then `x ⊓ y = BLOCK` for all y.
If `x = HOLD` then `x ⊓ y ∈ {HOLD,BLOCK}` for all y.

*Proof:* direct from the definition of `max_≻`.

## 2. Theorems

### Theorem E1 (Non-circumvention)
For any intent i, if `A(i,state)=BLOCK` then the system cannot reach an effective decision `ALLOW(i)`.

*Proof.* Effective decision uses A as sovereign filter. By premise A=BLOCK.
By Lemma L4, for any additional subordinate signal s (even if modeled as ALLOW), `BLOCK ⊓ s = BLOCK`.
Therefore no path exists where i becomes ALLOW while A outputs BLOCK. ∎

### Theorem E2 (Temporal monotonicity X108)
Let `GX108(i,t)=HOLD` when `irreversible(i)=True` and `t<τ`.
Then for all `t' < τ`, `GX108(i,t')=HOLD`. Hence `A(i,t') != ALLOW` for all such t'.

*Proof.* Predicate `t < τ` holds for all `t' < τ`. Rule definition outputs HOLD.
If A includes GX108 via meet, then A is at least HOLD (or BLOCK) by Lemma L4. ∎

### Theorem E3 (Priority preserved under composition)
Given any set of gates returning values in D and composed by meet, the aggregate A preserves the strict dominance order: the most restrictive gate always dominates.

*Proof.* Repeated application of Lemmas L2-L4. Since meet returns max_≻, the maximum severity among component gates is preserved. ∎

### Theorem E4 (Replay non-reversibility)
Let `Greplay(i,state)=BLOCK` iff nonce is not fresh.
After executing an intent with nonce n, freshness fails for any subsequent attempt with the same n.
Therefore any replay yields BLOCK, and cannot alter the execution outcome.

*Proof.* Nonce store updates make `fresh(n)` false after first use.
Thus Greplay returns BLOCK; by Lemma L4 aggregate A returns BLOCK. ∎

## 3. Corollaries (multi-domain)
If banking gate and trading gate are both present, the global meet composition ensures the same invariants simultaneously:
- any BLOCK in banking blocks globally,
- any HOLD in X108 holds globally,
- optimization never overrides.

∎
