import Obsidia.Basic
import Obsidia.TemporalRaw

namespace Obsidia
namespace TemporalBridge

open TemporalRaw

def canonicalize_elapsed (e : Int) : Nat :=
  Int.toNat e

theorem canonicalize_preserves_nonneg (e : Int) (h : 0 ≤ e) :
    canonicalize_elapsed e = Int.toNat e := by
  rfl

theorem skew_negative_implies_lt_tau (τ : Int) (i : TInput_Raw)
    (hneg : elapsed_raw i < 0)
    (hTau : 0 ≤ τ) :
    elapsed_raw i < τ := by
  exact Int.lt_of_lt_of_le hneg hTau

#print axioms Obsidia.TemporalBridge.canonicalize_preserves_nonneg
#print axioms Obsidia.TemporalBridge.skew_negative_implies_lt_tau

end TemporalBridge
end Obsidia
