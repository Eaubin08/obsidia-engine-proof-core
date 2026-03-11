# OBSIDIA — Refinement / Conformance Model (Phase 20)

## 0. Scope

Phase 20 defines a **refinement relation** between:

- the **formal model** proved in Lean (Phase 17 / 17.1 / 20b),
- the **reproduction artifact** (ProofKit + scripts),
- and the **executed decision pipeline** (runner outputs / JSON artifacts).

Goal: make explicit *what exactly is claimed to be the same*, and what is merely tested.

This phase introduces:

- a projection function ⟦·⟧ from implementation artifacts to formal objects,
- conformance obligations checked automatically in CI.

---

## 1. Formal objects (Lean)

From `lean/Obsidia/SystemModel.lean` (v17.1):

- `Repo` (leaves : List Hash)
- `State` (repo, auditLog)
- `Input` (metrics, theta)
- `Decision` = {HOLD, ACT}    (kernel OS2)
- `Decision3` = {BLOCK, HOLD, ACT}  (institutional consensus)
- `transition : State → Input → (Decision × State)`
- `sealRepo : Repo → Hash` (Merkle root)

From `lean/Obsidia/Consensus.lean`:

- `aggregate4 : Decision3 → Decision3 → Decision3 → Decision3 → Decision3`
  (3/4 supermajority; else fail-closed BLOCK)

From Phase 20b (`lean/Obsidia/TemporalX108.lean`):

- temporal input `TInput` including `createdAt`, `now`, `irr`
- temporal kernel `decideX108 : TInput → Decision`
- institutional temporal lift `decide3X108 : TInput → Decision3`
- key theorems: no ACT before τ for irr=1, monotonicity in time, skew-safety.

---

## 2. Implementation artifacts

Phase 19 provides a one-command reproduction script and outputs:

- Seal verification artifacts (manifest + ROOT_HASH + GLOBAL_SEAL_HASH)
- Adversarial suite outputs (JSON)
- ProofKit summary report (JSON)

These artifacts are treated as the *implementation evidence layer*.

---

## 3. Projection ⟦·⟧ (Implementation → Formal)

### 3.1 Repo projection

Let `MANIFEST` be the file list used for sealing.
Define:

- ⟦Repo_impl⟧ = Repo(leaves := sorted(file_hashes_from_manifest))

The exact leaf hashing procedure MUST match the ProofKit rule used for sealing.

### 3.2 Seal projection

Let `ROOT_HASH` be the computed root from the manifest.
Define:

- ⟦seal_impl⟧ = ROOT_HASH

Conformance obligation:

- ⟦seal_impl⟧ == sealRepo(⟦Repo_impl⟧)

(checked indirectly via ProofKit `seal_verify.py` + `root_hash_verify.py`)

### 3.3 Decision projection (kernel)

For an implementation input record `i_impl` containing at minimum:

- metrics.S
- theta

Define:

- ⟦i_impl⟧ = Input(metrics := Metrics(...), theta := θ)

Decision obligation:

- decision_impl(i_impl) == decide(⟦i_impl⟧)

### 3.4 Decision projection (institutional)

If the implementation exposes 4 node outputs (Decision3), define:

- ⟦d1..d4⟧ = Decision3 values
- consensus_impl == aggregate4(d1,d2,d3,d4)

If node outputs are not exposed, conformance is limited to kernel-only obligations.

---

## 4. Conformance obligations (what Phase 20 *actually* guarantees)

Phase 20 guarantees the following **executable** conformance checks:

C20.1 — Seal conformance  
- ProofKit seal verification PASS.

C20.2 — Formal build conformance  
- `lake build` completes successfully.

C20.3 — Decision invariants conformance  
- The adversarial suite outputs satisfy:
  - determinism
  - no ACT before threshold / temporal gate (when enabled)
  - convergence / stability claims tracked in the threat report.

C20.4 — Evidence linkability  
- Each claim has a mapping to:
  - a Lean theorem (if applicable),
  - and/or a ProofKit test + output JSON path.

---

## 5. Non-claims

Phase 20 does NOT claim:

- equivalence to an external production engine not represented in the repo,
- hardware trust, TEEs, or OS compromise resistance,
- distributed Byzantine security.

---

## 6. Acceptance criteria

Phase 20 is PASS if:

- ProofKit PASS (Phase 19 runner)
- `tools/conformance/run_conformance.py` PASS
- `docs/research/THEOREM_MAPPING.md` (or equivalent) includes entries for new X-108 theorems.

