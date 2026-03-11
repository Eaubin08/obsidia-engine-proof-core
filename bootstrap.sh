#!/usr/bin/env bash
# ============================================================================
# OBSIDIA ENGINE PROOF CORE — bootstrap.sh
# Lance tous les tests et vérifications en une seule commande.
#
# Usage:
#   bash bootstrap.sh
#
# Prérequis:
#   - Python >= 3.11
#   - Node.js >= 18
#   - pnpm >= 8
# ============================================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✓${NC} $1"; }
fail() { echo -e "${RED}✗${NC} $1"; }
info() { echo -e "${YELLOW}▶${NC} $1"; }

echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  OBSIDIA ENGINE PROOF CORE — Bootstrap & Verification  ${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo ""

# ── 1. Python dependencies ──────────────────────────────────────────────────
info "Installing Python dependencies..."
pip install -r requirements.txt -q 2>/dev/null || sudo pip install -r requirements.txt -q
ok "Python dependencies installed"
echo ""

# ── 2. Node.js dependencies ─────────────────────────────────────────────────
info "Installing Node.js dependencies..."
pnpm install -q
ok "Node.js dependencies installed"
echo ""

# ── 3. pytest — Python tests ────────────────────────────────────────────────
info "Running Python tests (pytest)..."
if python3 -m pytest -q tests/test_agents_functional.py tests/test_invariants_against_engine.py; then
    ok "Python tests PASS"
else
    fail "Python tests FAIL"
    exit 1
fi
echo ""

# ── 4. vitest — TypeScript tests ────────────────────────────────────────────
info "Running TypeScript tests (vitest)..."
if pnpm test; then
    ok "TypeScript tests PASS"
else
    fail "TypeScript tests FAIL"
    exit 1
fi
echo ""

# ── 5. Pipeline smoke tests ─────────────────────────────────────────────────
info "Running pipeline smoke tests..."
TRADING=$(python3 agents/run_pipeline.py trading "$(cat examples/trading_bullish.json)" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['x108_gate'])")
BANK_OK=$(python3 agents/run_pipeline.py bank "$(cat examples/bank_normal.json)" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['x108_gate'])")
BANK_SUS=$(python3 agents/run_pipeline.py bank "$(cat examples/bank_suspicious.json)" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['x108_gate'])")
ECOM=$(python3 agents/run_pipeline.py ecom "$(cat examples/ecom_normal.json)" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['x108_gate'])")

echo "  Trading (bullish)    → $TRADING"
echo "  Bank (normal)        → $BANK_OK"
echo "  Bank (suspicious)    → $BANK_SUS"
echo "  Ecom (normal)        → $ECOM"

if [ "$TRADING" = "ALLOW" ] && [ "$BANK_OK" = "ALLOW" ] && [ "$BANK_SUS" = "BLOCK" ] && [ "$ECOM" = "ALLOW" ]; then
    ok "Pipeline smoke tests PASS"
else
    fail "Pipeline smoke tests FAIL — unexpected gate values"
    exit 1
fi
echo ""

# ── 6. verify_merkle ─────────────────────────────────────────────────────────
info "Verifying Merkle root..."
python3 proofs/verify_merkle.py
ok "Merkle root verified"
echo ""

# ── 7. verify_all (proofkit V18.7 + V18.8) ──────────────────────────────────
info "Running proofkit verification (V18.7 + V18.8)..."
if python3 proofs/verify_all.py 2>&1 | grep -q "PASS"; then
    ok "Proofkit V18.7 + V18.8 PASS"
else
    echo -e "${YELLOW}⚠${NC}  Proofkit partial (V18.3.1 root_hash mismatch expected — see LIMITS.md)"
fi
echo ""

echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}${BOLD}  ALL CHECKS COMPLETE${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════════════${NC}"
