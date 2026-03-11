#!/usr/bin/env bash
# OBSIDIA — Phase 19 : External Reproduction One-Command Script
# Usage: bash tools/verify_all_phases.sh
# Doit être exécuté depuis la racine du dépôt.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

PASS=0
FAIL=0
RESULTS=()

echo ""
echo "========================================================"
echo "  [PHASE 17/18/19] OBSIDIA Full Reproduction Check"
echo "  Repo: $REPO_ROOT"
echo "========================================================"
echo ""

run_step() {
    local step_name="$1"
    local cmd="$2"
    printf "  %-40s" "$step_name"
    if eval "$cmd" > /tmp/obsidia_step_out.txt 2>&1; then
        echo "PASS"
        PASS=$((PASS + 1))
        RESULTS+=("PASS: $step_name")
    else
        echo "FAIL"
        echo "    --- Output ---"
        tail -5 /tmp/obsidia_step_out.txt | sed 's/^/    /'
        echo "    --------------"
        FAIL=$((FAIL + 1))
        RESULTS+=("FAIL: $step_name")
    fi
}

# Step 1 — Seal Verification
run_step "Step 1: Seal Verification" \
    "python3 proofkit/V15_GLOBAL_SEAL/seal_verify.py"

# Step 2 — Lean Formal Proofs
run_step "Step 2: Lean Formal Proofs" \
    "cd \"$REPO_ROOT/lean\" && PATH=\"$HOME/.elan/bin:$PATH\" lake build Obsidia.Main && cd \"$REPO_ROOT\""

# Step 3 — Adversarial Suite
run_step "Step 3: Adversarial Suite (A1)" \
    "python3 \"$REPO_ROOT/tools/adversarial/test_monotonic_break.py\""
run_step "Step 3: Adversarial Suite (A2)" \
    "python3 \"$REPO_ROOT/tools/adversarial/test_threshold_fuzz.py\""
run_step "Step 3: Adversarial Suite (B1)" \
    "python3 \"$REPO_ROOT/tools/adversarial/test_merkle_collision.py\""
run_step "Step 3: Adversarial Suite (C1)" \
    "python3 \"$REPO_ROOT/tools/adversarial/test_seal_tamper.py\""
run_step "Step 3: Adversarial Suite (D1)" \
    "python3 \"$REPO_ROOT/tools/adversarial/test_consensus_split.py\""
run_step "Step 3: Adversarial Suite (E1)" \
    "python3 \"$REPO_ROOT/tools/adversarial/test_signature_tamper.py\""

# Step 4 — Threat Model
run_step "Step 4: Threat Model (8 claims)" \
    "python3 \"$REPO_ROOT/tools/verify_threat_model.py\""

echo ""
echo "========================================================"
echo "  Results: PASS=$PASS  FAIL=$FAIL"
echo "========================================================"
echo ""

if [ "$FAIL" -eq 0 ]; then
    echo "ALL PHASES PASS — OBSIDIA IS FULLY REPRODUCIBLE"
    echo ""
    exit 0
else
    echo "FAIL — $FAIL step(s) failed"
    for r in "${RESULTS[@]}"; do
        echo "  $r"
    done
    echo ""
    exit 1
fi
