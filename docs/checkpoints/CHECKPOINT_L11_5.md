# CHECKPOINT L11.5 — Consensus 3/4 (4 nodes)

Adds Lean file:

- `lean/Obsidia/Consensus.lean`

It defines:
- `countDec`
- `aggregate4` (supermajority 3/4 over 4 decisions)

and proves:
- `aggregate4_act`
- `aggregate4_hold`
- `aggregate4_block_by_supermajority`
- `aggregate4_fail_closed`

Build:
```bash
cd lean
lake build
```
