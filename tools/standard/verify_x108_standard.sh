#!/usr/bin/env bash
# X-108 STD 1.0 — One-command conformance verifier
# Runs all 4 checks: Lean, TLA+, vectors, traces
# Exit: 0 if ALL PASS, 1 otherwise
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

export PATH="$HOME/.elan/bin:$PATH"

PASS=0
FAIL=0
RESULTS=()

run_check() {
    local name="$1"
    local cmd="$2"
    echo ""
    echo "──────────────────────────────────────────"
    echo "CHECK: $name"
    echo "──────────────────────────────────────────"
    if eval "$cmd"; then
        echo "→ $name: PASS"
        PASS=$((PASS + 1))
        RESULTS+=("PASS: $name")
    else
        echo "→ $name: FAIL"
        FAIL=$((FAIL + 1))
        RESULTS+=("FAIL: $name")
    fi
}

echo "============================================================"
echo "X-108 STD 1.0 — Full Conformance Suite"
echo "Repository: $REPO_ROOT"
echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "============================================================"

# Check 1: Lean proofs
run_check "Lean (machine-checked proofs)" \
    "bash tools/standard/x108_lean_check.sh"

# Check 2: TLA+ specs
run_check "TLA+ (temporal logic specs)" \
    "bash tools/standard/x108_tla_check.sh"

# Check 3: Executable vectors
run_check "Vectors (boundary + skew-safe, 80 cases)" \
    "python3 tools/standard/x108_vectors_check.py"

# Check 4: OS4 traces (optional but recommended)
run_check "Traces OS4 (Strasbourg Clock, 8000 steps)" \
    "python3 tools/standard/x108_trace_check.py \
        --dir evidence/os4/strasbourg_clock_x108 \
        --threshold 0.05 \
        --field delta_day \
        --out /tmp/x108_trace_report.json"

# Summary
echo ""
echo "============================================================"
echo "SUMMARY"
echo "============================================================"
for r in "${RESULTS[@]}"; do
    echo "  $r"
done
echo ""
echo "PASS=$PASS  FAIL=$FAIL"
echo ""
if [ "$FAIL" -eq 0 ]; then
    echo "X-108 STD 1.0 — ALL CHECKS PASS"
    exit 0
else
    echo "X-108 STD 1.0 — FAIL ($FAIL check(s) failed)"
    exit 1
fi
