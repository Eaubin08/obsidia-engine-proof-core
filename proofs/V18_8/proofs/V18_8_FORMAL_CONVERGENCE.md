# V18.8 — Convergence & Stability (Formal Spec)
Date: 2026-03-03T14:43:17.741275Z

## Goal
Prove the system is not only safe, but **stable over time** under the X-108 temporal gate and governance composition.

We prove four properties over a minimal operational model consistent with Obsidia's Layer A:

- **G1 Determinism**: same (intent,state) ⇒ same decision.
- **G2 No oscillation under unchanged conditions**: if HOLD while t<τ, it cannot become ALLOW until t≥τ (unless state changes by violation → BLOCK).
- **G3 Temporal convergence**: if no violations and the only evolving variable is time, then HOLD converges to ALLOW when t≥τ.
- **G4 No infinite decision loop**: a step function over time/state cannot produce infinite toggling without a state change.

## Model
Decision lattice D={ALLOW,HOLD,BLOCK} with priority BLOCK>HOLD>ALLOW.
Composition is meet (max severity).

State includes:
- time_elapsed t (monotone non-decreasing),
- nonce_store (replay prevention),
- risk parameters (thresholds).

Intent includes:
- irreversible flag,
- risk score,
- expected_return (optional),
- nonce.

Gates:
- Greplay: nonce fresh else BLOCK
- Grisk: risk≥Rmax or expected_return<min ⇒ BLOCK
- Gx108: irreversible and t<τ ⇒ HOLD
Aggregate A = Greplay ⊓ Grisk ⊓ Gx108

Step:
- Evaluate A(intent,state) ⇒ decision
- If decision==ALLOW: mark nonce (consumed), possibly execute (irreversible)
- If decision==HOLD: state may evolve only by time increasing
- If decision==BLOCK: stop (refusal)

## Proof sketches
### G1
All gates are pure functions of (intent,state) and meet is deterministic ⇒ A deterministic.

### G2
If irreversible and t<τ then Gx108=HOLD. Since meet cannot lower severity, A∈{HOLD,BLOCK} ⇒ not ALLOW.

### G3
Assuming no replay and no risk violations, Greplay=ALLOW and Grisk=ALLOW. Then A equals Gx108.
Thus for irreversible intent: A(t)=HOLD for t<τ and A(t)=ALLOW for t≥τ ⇒ convergence at τ.

### G4
With monotone t and deterministic A, decision changes can only occur when crossing τ or when a violation happens (risk/replay). No other source of toggling exists ⇒ no infinite oscillation.
