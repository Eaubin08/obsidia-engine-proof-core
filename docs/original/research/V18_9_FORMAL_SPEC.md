# OBSIDIA — V18.9 Formal Specification

## 1. State Model

Let W ∈ ℝ^{n×n}

Metrics:
T = triangle_mean(W)
H = meso_proxy(W)
A = asymmetry(W)

S = αT + βH − γA

Decision rule:
ACT  if S ≥ θ
HOLD otherwise

## 2. Invariants
D1 — Determinism
E2 — No ACT before threshold
G1 — ACT above threshold
G2 — Boundary inclusive
G3 — Monotonicity

## 3. Cryptographic Integrity
Merkle root mutation detection (Phase 8)

## 4. Distributed Agreement
Supermajority ≥ 3/4 (Phase 9)
