# OBSIDIA V18.7 — Structural Non‑Circumvention Proof Pack
Date: 2026-03-03T14:37:06.261624Z

This pack formalizes (textual, proof-driven) the **non-circumventability** of the Obsidia governance layer (Layer A) over any subordinate optimization layer (Layer B / Timeverse).

The goal is **structural**, not empirical:
- proofs are written as lemmas + theorems over a small abstract model,
- and validated by an executable checker against an oracle for large random samples.

---

## Model (minimal but faithful)

### Domains
- `Intent`: a candidate action proposed by Layer B.
- `Gate_A`: sovereign eliminatory filter returning one of `BLOCK`, `HOLD`, `ALLOW`.
- `Opt_B`: subordinate optimizer that may propose many intents but **cannot execute**; only proposes.

### Decision lattice
We assume a strict priority order:
`BLOCK > HOLD > ALLOW` (dominance).

### Irreversibility and time
- Some intents are *irreversible*.
- A temporal lock `X108` with threshold `τ` enforces: if `irreversible` and `t < τ` then `HOLD`.

### Replay / nonce rule
- Any intent carries a `nonce` / ticket id.
- Reusing a nonce is forbidden: replay => `BLOCK`.

---

## Theorems

### E1 — Dominance (Non-circumvention)
For any intent `i`, if `Gate_A(i)=BLOCK` then the global decision cannot be `ALLOW(i)` regardless of what `Opt_B` proposes.
**Proof idea:** the global decision is the meet (min under priority) between the sovereign gate and any subordinate proposal; meet with `BLOCK` is `BLOCK`.

### E2 — Temporal monotonicity (X108)
For irreversible intent `i` and threshold `τ`:
If `t < τ` then `Gate_A(i,t)=HOLD`, and for all `t' < τ`, `Gate_A(i,t')=HOLD`.
**Proof idea:** the predicate `t < τ` is monotone; the rule is a single implication producing HOLD, no alternative branch can output ALLOW while `t < τ`.

### E3 — Priority preserved under composition (multi-domain)
If multiple gates are composed (registry gate, risk gate, X108 gate, auth gate, replay gate),
and the composition uses the strict priority operator `⊓` (meet),
then priority `BLOCK>HOLD>ALLOW` is preserved.
**Proof idea:** meet on a total order is associative/commutative/idempotent and always returns the minimum (most restrictive) element.

### E4 — Non-reversibility under replay
If an irreversible action is executed with nonce `n`, then any replay of `n` is `BLOCK`, and thus cannot yield a different effective execution outcome.
**Proof idea:** replay rule precedes all; nonce store makes `n` invalid after first use, yielding BLOCK deterministically.

---

## What this proves / does not prove
**Proves (structural):**
- No optimizer can bypass Layer A if the global decision is computed as the meet of gates.
- No irreversible intent can become ALLOW before τ (temporal safety).
- Composition of multiple gates keeps strict dominance.
- Replay cannot change an already executed irreversible decision.

**Does not prove (by design):**
- Market profitability / alpha
- Real distributed network liveness (only safety)
- Hardware root-of-trust (needs infra)

---

## Files
- `proofs/V18_7_FORMAL_THEOREMS.md`: full written proof (lemmas + theorems)
- `checker/noncircumvention_checker.py`: executable checker (oracle + fuzz 200k)
- `results/`: generated evidence JSON
- `MANIFEST.json`: sha256 of every file
