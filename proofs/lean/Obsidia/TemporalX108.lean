import Obsidia.Basic
/-
  OBSIDIA — Phase 20b : Temporal Gate Formalization (X-108)

  This module formalizes a minimal temporal gate:

    - Kernel decision remains binary: Decision = {HOLD, ACT}
    - For irreversible intents (irr = true),
      ACT is forbidden before elapsed ≥ τ.

  Time domain: Int (allows negative elapsed for clock skew robustness).
  No Mathlib.

  This module is intentionally minimal and composable.
-/

namespace Obsidia

/-- Temporal input for X-108 gating. -/
structure TInput where
  metrics   : Metrics
  theta     : Rat
  irr       : Bool       -- irreversible?
  createdAt : Int        -- intent creation time
  now       : Int        -- evaluation time

/-- Elapsed time, allowing negative values (clock skew). -/
def elapsed (i : TInput) : Int :=
  i.now - i.createdAt

/-- Gate threshold τ (seconds). Caller chooses τ ≥ 0. -/
abbrev Tau := Int

/-- X-108 temporal gate predicate. -/
def beforeTau (τ : Tau) (i : TInput) : Bool :=
  i.irr && (elapsed i < τ)

/-- Temporal kernel decision:
    - if irreversible and elapsed < τ => HOLD
    - else delegate to standard decision rule (θ ≤ S => ACT) -/
def decideX108 (τ : Tau) (i : TInput) : Decision :=
  if beforeTau τ i then Decision.HOLD
  else decision i.metrics i.theta

/-- Lift to institutional tri-state (still no BLOCK at kernel). -/
def decide3X108 (τ : Tau) (i : TInput) : Decision3 :=
  liftDecision (decideX108 τ i)

/-──────────────────────────────────────────────────────────────
  Theorems
──────────────────────────────────────────────────────────────-/

/-- X108-1: No ACT before τ for irreversible intents. -/
theorem X108_no_act_before_tau (τ : Tau) (i : TInput)
    (hIrr : i.irr = true)
    (h : elapsed i < τ) :
    decideX108 τ i = Decision.HOLD := by
  unfold decideX108 beforeTau
  have hb : (i.irr && (elapsed i < τ)) = true := by
    simp [hIrr, h]
  simp [hb]

/-- X108-2: For irreversible intents, negative elapsed implies HOLD when τ ≥ 0 (skew-safe).
    Precondition τ ≥ 0 is the canonical usage (gate threshold is non-negative).
    If elapsed < 0 ≤ τ, then elapsed < τ, so the gate fires and HOLD is returned. -/
theorem X108_skew_safe (τ : Tau) (i : TInput)
    (hIrr : i.irr = true)
    (hneg : elapsed i < 0)
    (hTau : 0 ≤ τ) :
    decideX108 τ i = Decision.HOLD := by
  have hlt : elapsed i < τ := Int.lt_of_lt_of_le hneg hTau
  exact X108_no_act_before_tau τ i hIrr hlt

/-- X108-3: After τ, kernel decision equals base decision (gate inactive). -/
theorem X108_after_tau_equals_base (τ : Tau) (i : TInput)
    (h : ¬ ((i.irr && (elapsed i < τ)) = true)) :
    decideX108 τ i = decision i.metrics i.theta := by
  unfold decideX108 beforeTau
  simp [h]

/-- X108-4: Institutional lift still never produces BLOCK. -/
theorem X108_kernel_never_blocks (τ : Tau) (i : TInput) :
    decide3X108 τ i ≠ Decision3.BLOCK := by
  unfold decide3X108
  cases decideX108 τ i <;> simp [liftDecision]

end Obsidia
