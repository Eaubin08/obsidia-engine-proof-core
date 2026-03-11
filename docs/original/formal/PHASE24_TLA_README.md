# Phase 24 — Temporal Logic Model (TLA+) Starter Pack

This pack contains:
- `tla/X108.tla` : single-node X-108 temporal gate model
- `tla/DistributedX108.tla` : N-node model with `N = 3*f + 1` and an attacker controlling up to `f` nodes
- `tools/check_traces_x108.py` : checks the temporal safety property on the Strasbourg Clock sandbox CSV traces
- `tla/README.md` : how to run with TLC (or Apalache) and how the property maps to Obsidia claims

Temporal safety property (Phase 24):

    [] ( irr /\ elapsed < tau => decision # "ACT" )

where `[]` is "always".

This pack is intentionally minimal and readable. It is a specification + checker scaffold.
