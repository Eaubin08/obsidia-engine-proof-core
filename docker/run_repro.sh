#!/bin/bash
# OBSIDIA — Script de reproduction déterministe Phase 14A2
# Exécute les 3 vérifications canoniques et exporte les logs

set -e

WORKSPACE="/workspace"
ARTIFACTS_DIR="${WORKSPACE}/artifacts"
mkdir -p "${ARTIFACTS_DIR}"

echo "============================================="
echo "OBSIDIA Phase 14A2 — Reproduction déterministe"
echo "Commit: $(git rev-parse HEAD)"
echo "Tag: $(git tag --points-at HEAD)"
echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "============================================="
echo ""

# ── 1. seal_verify.py ─────────────────────────────────────────────────────────
echo "=== [1/3] seal_verify.py ==="
cd "${WORKSPACE}"
python3 proofkit/V11_6_GLOBAL_SEAL/seal_verify.py 2>&1 | tee "${ARTIFACTS_DIR}/seal_verify.log"
SEAL_EXIT=${PIPESTATUS[0]}
echo "SEAL_EXIT=${SEAL_EXIT}"
echo ""

# ── 2. pytest invariants ──────────────────────────────────────────────────────
echo "=== [2/3] pytest core/tests/test_invariants_against_engine.py ==="
cd "${WORKSPACE}"
PYTHONPATH=. python3 -m pytest core/tests/test_invariants_against_engine.py -v 2>&1 \
    | tee "${ARTIFACTS_DIR}/pytest_invariants.log"
PYTEST_EXIT=${PIPESTATUS[0]}
echo "PYTEST_EXIT=${PYTEST_EXIT}"
echo ""

# ── 3. lake build Lean ────────────────────────────────────────────────────────
echo "=== [3/3] lake build Obsidia.Main ==="
export PATH="/root/.elan/bin:${PATH}"
cd "${WORKSPACE}/lean"
rm -rf .lake
lake build Obsidia.Main 2>&1 | tee "${ARTIFACTS_DIR}/lake_build.log"
LAKE_EXIT=${PIPESTATUS[0]}
echo "LAKE_EXIT=${LAKE_EXIT}"
echo ""

# ── Rapport final ─────────────────────────────────────────────────────────────
echo "============================================="
echo "RÉSUMÉ"
echo "  seal_verify.py : $([ ${SEAL_EXIT} -eq 0 ] && echo PASS || echo FAIL)"
echo "  pytest         : $([ ${PYTEST_EXIT} -eq 0 ] && echo PASS || echo FAIL)"
echo "  lake build     : $([ ${LAKE_EXIT} -eq 0 ] && echo PASS || echo FAIL)"
echo "============================================="

# Écrire le rapport JSON
python3 -c "
import json, datetime
report = {
    'commit': '$(git -C ${WORKSPACE} rev-parse HEAD)',
    'tag': '$(git -C ${WORKSPACE} tag --points-at HEAD)',
    'timestamp': datetime.datetime.utcnow().isoformat() + 'Z',
    'results': {
        'seal_verify': ${SEAL_EXIT} == 0,
        'pytest_invariants': ${PYTEST_EXIT} == 0,
        'lake_build': ${LAKE_EXIT} == 0
    },
    'verdict': 'PASS' if (${SEAL_EXIT} == 0 and ${PYTEST_EXIT} == 0 and ${LAKE_EXIT} == 0) else 'FAIL'
}
with open('${ARTIFACTS_DIR}/repro_report.json', 'w') as f:
    json.dump(report, f, indent=2)
print('Report written to artifacts/repro_report.json')
"

# Exit avec code non-nul si l'un des tests échoue
TOTAL_EXIT=$((SEAL_EXIT + PYTEST_EXIT + LAKE_EXIT))
exit ${TOTAL_EXIT}
