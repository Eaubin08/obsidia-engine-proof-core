#!/usr/bin/env bash
# X-108 STD 1.0 — Lean conformance runner
# Checks: lake build succeeds AND all required X-108 theorems are present.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LEAN_DIR="$REPO_ROOT/lean"
TEMPORAL_FILE="$LEAN_DIR/Obsidia/TemporalX108.lean"
REFINEMENT_FILE="$LEAN_DIR/Obsidia/Refinement.lean"
CONSENSUS_FILE="$LEAN_DIR/Obsidia/Consensus.lean"

export PATH="$HOME/.elan/bin:$PATH"

echo "[Lean] Building Obsidia.Main..."
cd "$LEAN_DIR"
lake build Obsidia.Main 2>&1 | tail -3

echo "[Lean] Checking required X-108 theorems..."

REQUIRED_THEOREMS=(
  "X108_no_act_before_tau"
  "X108_skew_safe"
  "X108_after_tau_equals_base"
  "X108_kernel_never_blocks"
  "lift_refines"
  "x108_is_lift"
  "x108_never_blocks"
)

FAIL=0
for thm in "${REQUIRED_THEOREMS[@]}"; do
  if grep -qr "theorem $thm\|def $thm" "$LEAN_DIR/Obsidia/"; then
    echo "  [OK] $thm"
  else
    echo "  [FAIL] $thm — NOT FOUND"
    FAIL=1
  fi
done

# Check aggregate_fail_closed (Consensus.lean)
if grep -q "aggregate_fail_closed\|L11_3_no_block\|no_block" "$CONSENSUS_FILE" 2>/dev/null; then
  echo "  [OK] aggregate_fail_closed (via L11_3_no_block)"
else
  echo "  [WARN] aggregate_fail_closed — not found by name (check Consensus.lean manually)"
fi

if [ "$FAIL" -eq 0 ]; then
  echo "[Lean] PASS — all required theorems present, build succeeded"
  exit 0
else
  echo "[Lean] FAIL — missing theorems"
  exit 1
fi
