
namespace Obsidia

-- Abstract Hash type
axiom Hash : Type

-- Abstract hash function (binary combine)
noncomputable axiom H : Hash → Hash → Hash

-- Collision resistance assumption (local injectivity)
axiom H_injective_left :
  ∀ {a b c : Hash}, H a b = H c b → a = c

axiom H_injective_right :
  ∀ {a b c : Hash}, H a b = H a c → b = c

-- Simple Merkle over 2 leaves (minimal formal core)

noncomputable def merkle2 (a b : Hash) : Hash :=
  H a b

-- Mutation theorem (2-leaf version)

theorem merkle2_left_mutation
  (a a' b : Hash)
  (h : a ≠ a') :
  merkle2 a b ≠ merkle2 a' b := by
  unfold merkle2
  intro h_eq
  apply h
  exact H_injective_left h_eq

theorem merkle2_right_mutation
  (a b b' : Hash)
  (h : b ≠ b') :
  merkle2 a b ≠ merkle2 a b' := by
  unfold merkle2
  intro h_eq
  apply h
  exact H_injective_right h_eq

end Obsidia
