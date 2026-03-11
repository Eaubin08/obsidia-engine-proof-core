# Phase 20 + Phase 20b — Patch Pack

This pack adds:

- Phase 20 (Refinement / Conformance model)
  - docs/formal/OBSIDIA_REFINEMENT_MODEL.md
  - lean/Obsidia/Refinement.lean
  - tools/conformance/run_conformance.py

- Phase 20b (X-108 temporal gate in Lean)
  - lean/Obsidia/TemporalX108.lean

Integration:
- apply the patch to `lean/Obsidia/Main.lean` (see `lean/Obsidia/Main.lean.patch`)
- ensure executable bit on tools/conformance/run_conformance.py if needed

Suggested CI step:
- python tools/conformance/run_conformance.py
