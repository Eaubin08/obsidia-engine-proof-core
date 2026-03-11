import Obsidia.SystemModel
import Obsidia.TemporalX108

/-
  OBSIDIA — Phase 20 : Refinement / Conformance (Lean side)

  Purpose:
    Provide a *minimal* refinement layer that links:
      - kernel decide (binary) and institutional decide3 (tri-state)
      - temporal gate (X-108) decision with standard decision

  This is not yet a proof about an external engine.
  It is the formal core needed to map implementation evidence to the model.
-/

namespace Obsidia.Refinement

open Obsidia
open Obsidia.SystemModel

/-- Refinement relation between kernel Decision and institutional Decision3. -/
def R_decision : Decision → Decision3 → Prop
| Decision.HOLD, Decision3.HOLD => True
| Decision.ACT,  Decision3.ACT  => True
| _, _ => False

/-- liftDecision refines kernel decision into institutional decision. -/
theorem lift_refines (d : Decision) :
    R_decision d (liftDecision d) := by
  cases d <;> simp [R_decision, liftDecision]

/-- X-108 decision3 is always a lift of a kernel decision. -/
theorem x108_is_lift (τ : Tau) (i : TInput) :
    decide3X108 τ i = liftDecision (decideX108 τ i) := by
  rfl

/-- Conformance lemma: X-108 never introduces BLOCK (institutional view). -/
theorem x108_never_blocks (τ : Tau) (i : TInput) :
    decide3X108 τ i ≠ Decision3.BLOCK := by
  exact Obsidia.X108_kernel_never_blocks τ i

end Obsidia.Refinement
