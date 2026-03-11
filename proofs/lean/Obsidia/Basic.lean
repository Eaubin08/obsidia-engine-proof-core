import Std

/-
  OBSIDIA — Formal Core V18.9
  Lean 4.28 — Phase 11.2 (core theorems)

  Domain: Rat (no Mathlib)
-/

namespace Obsidia

/-- OS2 engine metrics (Rat domain) -/
structure Metrics where
  T_mean  : Rat
  H_score : Rat
  A_score : Rat
  S       : Rat

/-- Binary decision -/
inductive Decision
  | HOLD
  | ACT
  deriving Repr, DecidableEq

/-- Decision rule: ACT iff θ ≤ S -/
def decision (m : Metrics) (theta : Rat) : Decision :=
  if theta ≤ m.S then Decision.ACT else Decision.HOLD

/-- Characterization: ACT iff θ ≤ S. -/
theorem decision_eq_ACT_iff (m : Metrics) (theta : Rat) :
    decision m theta = Decision.ACT ↔ theta ≤ m.S := by
  unfold decision
  by_cases h : theta ≤ m.S
  · simp [h]
  · simp [h]

/-- Characterization: HOLD iff ¬(θ ≤ S). -/
theorem decision_eq_HOLD_iff (m : Metrics) (theta : Rat) :
    decision m theta = Decision.HOLD ↔ ¬ theta ≤ m.S := by
  unfold decision
  by_cases h : theta ≤ m.S
  · simp [h]
  · simp [h]

/-- D1 — Determinism (pure function). -/
theorem D1_determinism (m : Metrics) (theta : Rat) :
    decision m theta = decision m theta := rfl

/-- G1 — ACT if θ ≤ S. -/
theorem G1_act_above_threshold (m : Metrics) (theta : Rat)
    (h : theta ≤ m.S) :
    decision m theta = Decision.ACT := (decision_eq_ACT_iff m theta).2 h

/-- E2 — HOLD if ¬(θ ≤ S). -/
theorem E2_no_act_below_threshold (m : Metrics) (theta : Rat)
    (h : ¬ theta ≤ m.S) :
    decision m theta = Decision.HOLD := (decision_eq_HOLD_iff m theta).2 h

/-- G2 — Boundary inclusive: S = θ → ACT. -/
theorem G2_boundary_inclusive (m : Metrics) (theta : Rat)
    (h : m.S = theta) :
    decision m theta = Decision.ACT := by
  -- goal: θ ≤ S
  have : theta ≤ m.S := by
    -- rewrite using h
    simpa [h] using (Rat.le_refl : theta ≤ theta)
  exact G1_act_above_threshold m theta this

/-- G3 — Monotonicity: if θ ≤ S₁ and S₁ ≤ S₂ then decision₂ = ACT. -/
theorem G3_monotonicity (m₁ m₂ : Metrics) (theta : Rat)
    (h1 : theta ≤ m₁.S) (h2 : m₁.S ≤ m₂.S) :
    decision m₂ theta = Decision.ACT := by
  have : theta ≤ m₂.S := Rat.le_trans h1 h2
  exact G1_act_above_threshold m₂ theta this


/-
  Phase 11.3 — Institutional decision layer preparation

  We introduce a tri-state decision for institutional stacks:
  BLOCK > HOLD > ACT

  In OS2 core, the computed decision is binary (HOLD/ACT).
  We lift it into Decision3, and prove it never yields BLOCK.
-/

/-- Tri-state institutional decision (for future consensus / PBFT / refusal). -/
inductive Decision3
  | BLOCK
  | HOLD
  | ACT
  deriving Repr, DecidableEq

/-- Lift binary Decision into Decision3 (no BLOCK at OS2 core). -/
def liftDecision (d : Decision) : Decision3 :=
  match d with
  | Decision.HOLD => Decision3.HOLD
  | Decision.ACT  => Decision3.ACT

/-- Institutional decision rule: lifted OS2 decision (no BLOCK here). -/
def decision3 (m : Metrics) (theta : Rat) : Decision3 :=
  liftDecision (decision m theta)

/-- L11.3 — Core never outputs BLOCK. -/
theorem L11_3_no_block (m : Metrics) (theta : Rat) :
    decision3 m theta ≠ Decision3.BLOCK := by
  unfold decision3 liftDecision
  -- decision m theta is either HOLD or ACT
  cases h : decision m theta <;> simp [h]

/-- L11.3 — If θ ≤ S then decision3 = ACT. -/
theorem L11_3_act (m : Metrics) (theta : Rat) (h : theta ≤ m.S) :
    decision3 m theta = Decision3.ACT := by
  unfold decision3 liftDecision
  have : decision m theta = Decision.ACT := G1_act_above_threshold m theta h
  simp [this]

/-- L11.3 — If ¬(θ ≤ S) then decision3 = HOLD. -/
theorem L11_3_hold (m : Metrics) (theta : Rat) (h : ¬ theta ≤ m.S) :
    decision3 m theta = Decision3.HOLD := by
  unfold decision3 liftDecision
  have : decision m theta = Decision.HOLD := E2_no_act_below_threshold m theta h
  simp [this]

end Obsidia
