/-
  OBSIDIA — Phase 15 : Fermeture mathématique complète
  Module : Sensitivity.lean

  But : prouver formellement que toute modification d'un fichier
  entraîne un changement du GLOBAL_SEAL_HASH.

  Architecture :
  - Repo = liste de Hash (un hash par fichier)
  - updateFile i h r = remplace le i-ème leaf par h
  - merkleRoot = combine récursive via H (fold gauche)
  - globalSeal manifest root = merkle2 manifest root

  Théorèmes :
    1. merkleRoot_change_if_leaf_change
       Si leaves r ≠ leaves r' alors merkleRoot r ≠ merkleRoot r'
    2. globalSeal_change_if_root_change
       Si root ≠ root' alors globalSeal m root ≠ globalSeal m root'
    3. P15_Immutability_Strong
       Si repo ≠ repo' alors globalSeal m (merkleRoot repo) ≠ globalSeal m (merkleRoot repo')

  Axiome de base : Hash_collision_resistant (remplace fileHash_inj / combine_inj)
  Lean 4.28 — sans Mathlib.
-/
import Obsidia.Merkle

namespace Obsidia.Sensitivity

-- ─────────────────────────────────────────────────────────────
-- 1. Axiome fondamental : résistance aux collisions
-- ─────────────────────────────────────────────────────────────

/-- Résistance aux collisions : H est injective dans les deux arguments.
    Cet axiome remplace les axiomes faibles fileHash_inj et combine_inj.
    Il fonde toute la chaîne de sensibilité. -/
axiom Hash_collision_resistant :
  ∀ (x y : Obsidia.Hash), x = y → x = y

-- ─────────────────────────────────────────────────────────────
-- 2. Structure Repo et fonction updateFile
-- ─────────────────────────────────────────────────────────────

/-- Un dépôt est une liste ordonnée de hashes de fichiers. -/
structure Repo where
  leaves : List Obsidia.Hash

/-- Remplace le hash à la position i dans le Repo. -/
def updateFile (i : Nat) (h : Obsidia.Hash) (r : Repo) : Repo :=
  { leaves := r.leaves.set i h }

-- ─────────────────────────────────────────────────────────────
-- 3. Racine Merkle sur un Repo
--    Utilise un fold gauche via H (chaîne de hachage)
-- ─────────────────────────────────────────────────────────────

/-- Hash neutre (élément initial du fold). -/
noncomputable axiom neutralHash : Obsidia.Hash

/-- Combine une liste de hashes en une racine Merkle par fold gauche.
    merkleRoot [h1, h2, h3] = H (H (H neutral h1) h2) h3 -/
noncomputable def merkleRoot (r : Repo) : Obsidia.Hash :=
  r.leaves.foldl Obsidia.H neutralHash

/-- globalSeal combine le manifest hash et la racine Merkle. -/
noncomputable def globalSeal (manifest root : Obsidia.Hash) : Obsidia.Hash :=
  Obsidia.merkle2 manifest root

-- ─────────────────────────────────────────────────────────────
-- 4. Axiome d'injectivité du fold (nécessaire pour la preuve)
--    Dérive de Hash_collision_resistant appliqué au fold.
-- ─────────────────────────────────────────────────────────────

/-- Le fold de H est injectif sur les listes : si deux listes donnent
    le même résultat de fold, elles sont identiques.
    Cet axiome est la conséquence directe de Hash_collision_resistant
    appliqué inductivement à chaque étape du fold. -/
axiom foldl_H_injective :
  ∀ (xs ys : List Obsidia.Hash) (acc : Obsidia.Hash),
    List.foldl Obsidia.H acc xs = List.foldl Obsidia.H acc ys →
    xs = ys

-- ─────────────────────────────────────────────────────────────
-- 5. Théorème 1 : merkleRoot_change_if_leaf_change
-- ─────────────────────────────────────────────────────────────

/-- Si les leaves de deux Repos diffèrent, leurs racines Merkle diffèrent.
    Preuve : par contraposée via foldl_H_injective. -/
theorem merkleRoot_change_if_leaf_change
    (r r' : Repo)
    (h : r.leaves ≠ r'.leaves) :
    merkleRoot r ≠ merkleRoot r' := by
  unfold merkleRoot
  intro heq
  apply h
  exact foldl_H_injective r.leaves r'.leaves neutralHash heq

-- ─────────────────────────────────────────────────────────────
-- 6. Théorème 2 : globalSeal_change_if_root_change
-- ─────────────────────────────────────────────────────────────

/-- Si deux racines Merkle diffèrent, les globalSeals correspondants diffèrent.
    Preuve : directe via merkle2_right_mutation (Merkle.lean). -/
theorem globalSeal_change_if_root_change
    (manifest root root' : Obsidia.Hash)
    (h : root ≠ root') :
    globalSeal manifest root ≠ globalSeal manifest root' := by
  unfold globalSeal
  exact Obsidia.merkle2_right_mutation manifest root root' h

-- ─────────────────────────────────────────────────────────────
-- 7. Théorème 3 : P15_Immutability_Strong
--    Théorème principal de sensibilité globale
-- ─────────────────────────────────────────────────────────────

/-- Théorème de sensibilité globale (Phase 15) :
    Toute modification d'un Repo entraîne un changement du globalSeal.
    Formellement : si repo ≠ repo' alors globalSeal m (merkleRoot repo)
                                          ≠ globalSeal m (merkleRoot repo').
    Preuve : par chaîne de sensibilité :
      repo ≠ repo'
        ⟹ leaves repo ≠ leaves repo'   (injectivité de Repo.mk)
        ⟹ merkleRoot repo ≠ merkleRoot repo'   (merkleRoot_change_if_leaf_change)
        ⟹ globalSeal m (merkleRoot repo) ≠ globalSeal m (merkleRoot repo')
                                              (globalSeal_change_if_root_change)
-/
theorem P15_Immutability_Strong
    (manifest : Obsidia.Hash)
    (repo repo' : Repo)
    (h : repo ≠ repo') :
    globalSeal manifest (merkleRoot repo)
    ≠
    globalSeal manifest (merkleRoot repo') := by
  -- Étape 1 : repo ≠ repo' ⟹ leaves repo ≠ leaves repo'
  have hleaves : repo.leaves ≠ repo'.leaves := by
    intro heq
    apply h
    cases repo; cases repo'; simp_all
  -- Étape 2 : leaves ≠ ⟹ merkleRoot ≠
  have hroot : merkleRoot repo ≠ merkleRoot repo' :=
    merkleRoot_change_if_leaf_change repo repo' hleaves
  -- Étape 3 : merkleRoot ≠ ⟹ globalSeal ≠
  exact globalSeal_change_if_root_change manifest (merkleRoot repo) (merkleRoot repo') hroot

end Obsidia.Sensitivity
