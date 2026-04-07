import Obsidia.Basic

namespace Obsidia

structure TInput where
  metrics   : Metrics
  theta     : Rat
  irr       : Bool
  createdAt : Int
  now       : Int

def elapsed (i : TInput) : Int :=
  i.now - i.createdAt

abbrev Tau := Int

def beforeTau (τ : Tau) (i : TInput) : Bool :=
  i.irr && decide (elapsed i < τ)

def decideX108 (τ : Tau) (i : TInput) : Decision :=
  match beforeTau τ i with
  | true  => Decision.HOLD
  | false => decision i.metrics i.theta

def decide3X108 (τ : Tau) (i : TInput) : Decision3 :=
  liftDecision (decideX108 τ i)

theorem X108_no_act_before_tau (τ : Tau) (i : TInput)
    (hIrr : i.irr = true)
    (h : elapsed i < τ) :
    decideX108 τ i = Decision.HOLD := by
  unfold decideX108 beforeTau
  have hlt : decide (elapsed i < τ) = true := decide_eq_true h
  rw [hIrr, hlt]
  rfl

theorem int_lt_of_neg_and_nonneg (a b : Int) (hneg : a < 0) (hnonneg : 0 ≤ b) : a < b := by
  exact Int.lt_of_lt_of_le hneg hnonneg

theorem int_not_lt_of_le (a b : Int) (h : a ≤ b) : ¬ (b < a) := by
  exact Int.not_lt_of_ge h

theorem X108_skew_safe (τ : Tau) (i : TInput)
    (hIrr : i.irr = true)
    (hneg : elapsed i < 0)
    (hTau : 0 ≤ τ) :
    decideX108 τ i = Decision.HOLD := by
  have hlt : elapsed i < τ :=
    int_lt_of_neg_and_nonneg (elapsed i) τ hneg hTau
  exact X108_no_act_before_tau τ i hIrr hlt

theorem X108_after_tau_equals_base (τ : Tau) (i : TInput)
    (h : Not (beforeTau τ i = true)) :
    decideX108 τ i = decision i.metrics i.theta := by
  unfold decideX108
  cases hb : beforeTau τ i with
  | true =>
      exfalso
      exact h hb
  | false =>
      rfl

theorem X108_kernel_never_blocks (τ : Tau) (i : TInput) :
    Not (decide3X108 τ i = Decision3.BLOCK) := by
  intro h
  cases hd : decideX108 τ i with
  | HOLD =>
      rw [show decide3X108 τ i = Decision3.HOLD by
        unfold decide3X108
        rw [hd]
        rfl] at h
      cases h
  | ACT =>
      rw [show decide3X108 τ i = Decision3.ACT by
        unfold decide3X108
        rw [hd]
        rfl] at h
      cases h

theorem X108_reversible_equals_base (τ : Tau) (i : TInput)
    (hIrr : i.irr = false) :
    decideX108 τ i = decision i.metrics i.theta := by
  unfold decideX108 beforeTau
  rw [hIrr]
  rfl

theorem X108_irreversible_after_tau_equals_base (τ : Tau) (i : TInput)
    (hIrr : i.irr = true)
    (hTau : τ ≤ elapsed i) :
    decideX108 τ i = decision i.metrics i.theta := by
  apply X108_after_tau_equals_base
  intro hb
  unfold beforeTau at hb
  rw [hIrr] at hb
  have hlt : elapsed i < τ := by
    simpa using hb
  exact int_not_lt_of_le τ (elapsed i) hTau hlt

end Obsidia

#print axioms Obsidia.X108_no_act_before_tau
#print axioms Obsidia.X108_after_tau_equals_base
#print axioms Obsidia.X108_skew_safe
#print axioms Obsidia.X108_irreversible_after_tau_equals_base
#print axioms Obsidia.int_lt_of_neg_and_nonneg
#print axioms Obsidia.int_not_lt_of_le