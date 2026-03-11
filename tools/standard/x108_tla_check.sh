#!/usr/bin/env bash
# X-108 STD 1.0 — TLA+ conformance runner
# Checks: required TLA+ properties are present in spec files.
# Note: TLC/Apalache model-checking requires Java installation.
# This script performs structural validation (grep-based) + optional TLC check.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TLA_DIR="$REPO_ROOT/tla"

echo "[TLA+] Checking spec files..."

for f in "$TLA_DIR/X108.tla" "$TLA_DIR/DistributedX108.tla"; do
  if [ -f "$f" ]; then
    echo "  [OK] $(basename $f) exists"
  else
    echo "  [FAIL] $(basename $f) — NOT FOUND"
    exit 1
  fi
done

echo "[TLA+] Checking required safety properties..."

REQUIRED_PROPS=(
  "SafetyX108"
  "SafetyDistributed"
  "GateDecision"
  "THEOREM Spec => SafetyX108"
  "THEOREM Spec => SafetyDistributed"
)

FAIL=0
for prop in "${REQUIRED_PROPS[@]}"; do
  if grep -rq "$prop" "$TLA_DIR/"; then
    echo "  [OK] $prop"
  else
    echo "  [FAIL] $prop — NOT FOUND"
    FAIL=1
  fi
done

echo "[TLA+] Checking temporal safety formula..."
# SafetyX108 must contain the canonical formula
if grep -q "irr.*elapsed.*tau.*decision.*ACT\|elapsed < tau.*decision" "$TLA_DIR/X108.tla"; then
  echo "  [OK] SafetyX108 formula: □(irr ∧ elapsed < τ ⟹ decision ≠ ACT)"
else
  echo "  [FAIL] SafetyX108 formula not found"
  FAIL=1
fi

# Optional: TLC model check (requires java + tla2tools.jar)
TLC_JAR="${TLC_JAR:-}"
if [ -n "$TLC_JAR" ] && [ -f "$TLC_JAR" ]; then
  echo "[TLA+] Running TLC on X108.tla..."
  java -jar "$TLC_JAR" -config "$TLA_DIR/X108.cfg" "$TLA_DIR/X108.tla" 2>&1 | tail -5
  echo "[TLA+] TLC check complete"
else
  echo "[TLA+] TLC not available (set TLC_JAR=/path/to/tla2tools.jar to enable model checking)"
fi

if [ "$FAIL" -eq 0 ]; then
  echo "[TLA+] PASS — all required properties present in spec files"
  exit 0
else
  echo "[TLA+] FAIL — missing properties"
  exit 1
fi
