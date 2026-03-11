/-
  OBSIDIA — Phase 11.5
  Consensus 3/4 (4 nodes) over Decision3, without Mathlib.

  Rule:
    - If ≥3 nodes agree on ACT  -> ACT
    - Else if ≥3 nodes agree on HOLD -> HOLD
    - Else if ≥3 nodes agree on BLOCK -> BLOCK
    - Else -> BLOCK (fail-closed)

  All theorems proved by exhaustive case analysis (3^4 = 81 cases).
-/

import Obsidia.Basic

namespace Obsidia

/-- Count occurrences of a value in a list (no Mathlib). -/
def countDec (d : Decision3) (xs : List Decision3) : Nat :=
  xs.foldl (fun acc x => if x = d then acc + 1 else acc) 0

/-- Consensus aggregator for exactly 4 nodes (supermajority 3/4). -/
def aggregate4 (d1 d2 d3 d4 : Decision3) : Decision3 :=
  let xs : List Decision3 := [d1, d2, d3, d4]
  if 3 ≤ countDec Decision3.ACT xs then
    Decision3.ACT
  else if 3 ≤ countDec Decision3.HOLD xs then
    Decision3.HOLD
  else if 3 ≤ countDec Decision3.BLOCK xs then
    Decision3.BLOCK
  else
    Decision3.BLOCK

/-- If the ACT supermajority condition holds, aggregate4 = ACT. -/
theorem aggregate4_act
  (d1 d2 d3 d4 : Decision3)
  (h : 3 ≤ countDec Decision3.ACT [d1,d2,d3,d4]) :
  aggregate4 d1 d2 d3 d4 = Decision3.ACT := by
  unfold aggregate4
  simp only [countDec, List.foldl] at *
  cases d1 <;> cases d2 <;> cases d3 <;> cases d4 <;> simp_all (config := { decide := true })

/-- If ACT does not supermajority, but HOLD does, aggregate4 = HOLD. -/
theorem aggregate4_hold
  (d1 d2 d3 d4 : Decision3)
  (hAct : ¬ (3 ≤ countDec Decision3.ACT [d1,d2,d3,d4]))
  (hHold : 3 ≤ countDec Decision3.HOLD [d1,d2,d3,d4]) :
  aggregate4 d1 d2 d3 d4 = Decision3.HOLD := by
  unfold aggregate4
  simp only [countDec, List.foldl] at *
  cases d1 <;> cases d2 <;> cases d3 <;> cases d4 <;> simp_all (config := { decide := true })

/-- If neither ACT nor HOLD supermajority, but BLOCK does, aggregate4 = BLOCK. -/
theorem aggregate4_block_by_supermajority
  (d1 d2 d3 d4 : Decision3)
  (hAct : ¬ (3 ≤ countDec Decision3.ACT [d1,d2,d3,d4]))
  (hHold : ¬ (3 ≤ countDec Decision3.HOLD [d1,d2,d3,d4]))
  (hBlock : 3 ≤ countDec Decision3.BLOCK [d1,d2,d3,d4]) :
  aggregate4 d1 d2 d3 d4 = Decision3.BLOCK := by
  unfold aggregate4
  simp only [countDec, List.foldl] at *
  cases d1 <;> cases d2 <;> cases d3 <;> cases d4 <;> simp_all (config := { decide := true })

/-- Fail-closed: if no decision reaches 3/4, output is BLOCK. -/
theorem aggregate4_fail_closed
  (d1 d2 d3 d4 : Decision3)
  (hAct : ¬ (3 ≤ countDec Decision3.ACT [d1,d2,d3,d4]))
  (hHold : ¬ (3 ≤ countDec Decision3.HOLD [d1,d2,d3,d4]))
  (hBlock : ¬ (3 ≤ countDec Decision3.BLOCK [d1,d2,d3,d4])) :
  aggregate4 d1 d2 d3 d4 = Decision3.BLOCK := by
  unfold aggregate4
  simp only [countDec, List.foldl] at *
  cases d1 <;> cases d2 <;> cases d3 <;> cases d4 <;> simp_all (config := { decide := true })

end Obsidia
