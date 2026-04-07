import Obsidia.Basic

namespace Obsidia

namespace Layer1_RawTime

structure TInput_Raw where
  metrics   : Metrics
  theta     : Rat
  irr       : Bool
  createdAt : Int
  now       : Int

def elapsed_raw (i : TInput_Raw) : Int :=
  i.now - i.createdAt

end Layer1_RawTime

namespace Layer2_Canonicalization

open Layer1_RawTime

structure TInput_Canon where
  metrics : Metrics
  theta   : Rat
  irr     : Bool
  elapsed : Nat

def canonicalize_elapsed (e : Int) : Nat :=
  Int.toNat e

def canonicalize_input (i : TInput_Raw) : TInput_Canon :=
  { metrics := i.metrics
    theta   := i.theta
    irr     := i.irr
    elapsed := canonicalize_elapsed (elapsed_raw i) }

theorem canonicalize_nonneg (e : Int) (h : 0 ≤ e) :
    canonicalize_elapsed e = Int.toNat e := by
  rfl

end Layer2_Canonicalization

namespace Layer3_Kernel

open Layer2_Canonicalization

def beforeTau (τ : Nat) (i : TInput_Canon) : Bool :=
  i.irr && decide (i.elapsed < τ)

def decideX108 (τ : Nat) (i : TInput_Canon) : Decision :=
  match beforeTau τ i with
  | true  => Decision.HOLD
  | false => decision i.metrics i.theta

def decide3X108 (τ : Nat) (i : TInput_Canon) : Decision3 :=
  liftDecision (decideX108 τ i)

theorem X108_no_act_before_tau (τ : Nat) (i : TInput_Canon)
    (hIrr : i.irr = true)
    (h : i.elapsed < τ) :
    decideX108 τ i = Decision.HOLD := by
  unfold decideX108 beforeTau
  have hlt : decide (i.elapsed < τ) = true := decide_eq_true h
  rw [hIrr, hlt]
  rfl

theorem X108_after_tau_equals_base (τ : Nat) (i : TInput_Canon)
    (h : Not (beforeTau τ i = true)) :
    decideX108 τ i = decision i.metrics i.theta := by
  unfold decideX108
  cases hb : beforeTau τ i with
  | true =>
      exfalso
      exact h hb
  | false =>
      rfl

theorem X108_kernel_never_blocks (τ : Nat) (i : TInput_Canon) :
    Not (decide3X108 τ i = Decision3.BLOCK) := by
  intro h
  unfold decide3X108 at h
  cases hd : decideX108 τ i <;> simp [liftDecision, hd] at h

theorem X108_reversible_equals_base (τ : Nat) (i : TInput_Canon)
    (hIrr : i.irr = false) :
    decideX108 τ i = decision i.metrics i.theta := by
  unfold decideX108 beforeTau
  rw [hIrr]
  rfl

theorem X108_irreversible_after_tau_equals_base (τ : Nat) (i : TInput_Canon)
    (hIrr : i.irr = true)
    (h : τ ≤ i.elapsed) :
    decideX108 τ i = decision i.metrics i.theta := by
  apply X108_after_tau_equals_base
  intro hb
  unfold beforeTau at hb
  rw [hIrr] at hb
  simp at hb
  exact (Nat.not_lt.mpr h) hb

end Layer3_Kernel

namespace Orchestration

open Layer1_RawTime
open Layer2_Canonicalization
open Layer3_Kernel

def decide_with_skew_handling (τ : Int) (i : TInput_Raw) : Decision :=
  let e := elapsed_raw i
  if hneg : e < 0 then
    if hIrr : i.irr = true then
      if hTau : 0 ≤ τ then
        Decision.HOLD
      else
        decision i.metrics i.theta
    else
      decision i.metrics i.theta
  else
    decideX108 (Int.toNat τ) (canonicalize_input i)

theorem skew_negative_implies_hold (τ : Int) (i : TInput_Raw)
    (hIrr : i.irr = true)
    (hneg : elapsed_raw i < 0)
    (hTau : 0 ≤ τ) :
    decide_with_skew_handling τ i = Decision.HOLD := by
  unfold decide_with_skew_handling
  simp [Layer1_RawTime.elapsed_raw, hneg, hIrr, hTau]

end Orchestration

#print axioms Obsidia.Layer3_Kernel.X108_no_act_before_tau
#print axioms Obsidia.Layer3_Kernel.X108_after_tau_equals_base
#print axioms Obsidia.Layer3_Kernel.X108_kernel_never_blocks
#print axioms Obsidia.Layer3_Kernel.X108_reversible_equals_base
#print axioms Obsidia.Layer3_Kernel.X108_irreversible_after_tau_equals_base
#print axioms Obsidia.Orchestration.skew_negative_implies_hold

end Obsidia