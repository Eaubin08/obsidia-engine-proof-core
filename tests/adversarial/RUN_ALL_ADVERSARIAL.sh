#!/usr/bin/env bash
# ============================================================================
# OBSIDIA — Phase 15.2 — Audit Adversarial Structuré
# RUN_ALL_ADVERSARIAL.sh
#
# Exécute les 6 batteries de tests adversariaux et publie les résultats.
#
# Usage :
#   bash tools/adversarial/RUN_ALL_ADVERSARIAL.sh [--report]
#
# Sortie attendue :
#   ALL TESTS PASSED
#   NO STRUCTURAL WEAKNESS DETECTED
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
REPORT_FILE="${REPO_ROOT}/tools/adversarial/ADVERSARIAL_RESULTS.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# ─── Couleurs ────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}[PASS]${NC} $1"; }
fail() { echo -e "  ${RED}[FAIL]${NC} $1"; }
info() { echo -e "  ${BLUE}[INFO]${NC} $1"; }
header() { echo -e "\n${BOLD}${BLUE}══════════════════════════════════════════════════════${NC}"; echo -e "${BOLD}  $1${NC}"; echo -e "${BOLD}${BLUE}══════════════════════════════════════════════════════${NC}"; }

# ─── Initialisation ──────────────────────────────────────────────────────────
header "OBSIDIA Phase 15.2 — Audit Adversarial Structuré"
echo -e "  Timestamp : ${TIMESTAMP}"
echo -e "  Repo root : ${REPO_ROOT}"
echo ""

PASSED=0
FAILED=0
RESULTS=()

run_test() {
    local name="$1"
    local script="$2"
    local description="$3"

    echo -e "\n${YELLOW}▶ ${name}${NC} — ${description}"
    local start_time=$(date +%s%N)

    if python3 "${SCRIPT_DIR}/${script}" 2>&1; then
        local end_time=$(date +%s%N)
        local elapsed=$(( (end_time - start_time) / 1000000 ))
        pass "${name} (${elapsed}ms)"
        PASSED=$((PASSED + 1))
        RESULTS+=("| ${name} | PASS | ${elapsed}ms | ${description} |")
    else
        local end_time=$(date +%s%N)
        local elapsed=$(( (end_time - start_time) / 1000000 ))
        fail "${name} (${elapsed}ms)"
        FAILED=$((FAILED + 1))
        RESULTS+=("| ${name} | **FAIL** | ${elapsed}ms | ${description} |")
    fi
}

# ─── Batterie A : Attaque moteur ─────────────────────────────────────────────
header "15.2.A — Attaque logique (moteur)"

run_test "A1_monotonic_break" \
    "test_monotonic_break.py" \
    "1M paires aléatoires — violation G3 (monotonie)"

run_test "A2_threshold_fuzz" \
    "test_threshold_fuzz.py" \
    "Fuzzing θ_S ± 1e-12 — flip non déterministe"

# ─── Batterie B : Attaque Merkle ─────────────────────────────────────────────
header "15.2.B — Attaque Merkle"

run_test "B1_merkle_collision" \
    "test_merkle_collision.py" \
    "100K repos — collision de racine Merkle"

# ─── Batterie C : Attaque Seal ───────────────────────────────────────────────
header "15.2.C — Attaque Seal V15.1"

run_test "C1_seal_tamper" \
    "test_seal_tamper.py" \
    "Modification fichier sans MAJ manifest — seal_verify.py doit FAIL"

# ─── Batterie D : Attaque Consensus ──────────────────────────────────────────
header "15.2.D — Attaque Consensus 3/4"

run_test "D1_consensus_split" \
    "test_consensus_split.py" \
    "Split 2 ACT / 2 HOLD — doit être FAIL-CLOSED (BLOCK)"

# ─── Batterie E : Attaque Signature ──────────────────────────────────────────
header "15.2.E — Attaque Signature / Audit Chain"

run_test "E1_signature_tamper" \
    "test_signature_tamper.py" \
    "Modification audit_log.jsonl — chaîne de hashes invalidée"

# ─── Résumé final ────────────────────────────────────────────────────────────
TOTAL=$((PASSED + FAILED))
header "Résultats Phase 15.2"

echo -e "  Tests exécutés : ${TOTAL}"
echo -e "  ${GREEN}Passés${NC}         : ${PASSED}"
echo -e "  ${RED}Échoués${NC}        : ${FAILED}"
echo ""

if [ "${FAILED}" -eq 0 ]; then
    echo -e "${BOLD}${GREEN}"
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║  ALL TESTS PASSED                            ║"
    echo "  ║  NO STRUCTURAL WEAKNESS DETECTED             ║"
    echo "  ╚══════════════════════════════════════════════╝"
    echo -e "${NC}"
else
    echo -e "${BOLD}${RED}"
    echo "  ╔══════════════════════════════════════════════╗"
    echo "  ║  ${FAILED} TEST(S) FAILED                              ║"
    echo "  ║  STRUCTURAL WEAKNESS DETECTED                ║"
    echo "  ╚══════════════════════════════════════════════╝"
    echo -e "${NC}"
fi

# ─── Génération du rapport Markdown ──────────────────────────────────────────
cat > "${REPORT_FILE}" << EOF
# OBSIDIA — Rapport Audit Adversarial Phase 15.2

**Date** : ${TIMESTAMP}
**Repo** : ${REPO_ROOT}
**Résultat global** : $([ "${FAILED}" -eq 0 ] && echo "✅ ALL TESTS PASSED — NO STRUCTURAL WEAKNESS DETECTED" || echo "❌ ${FAILED} FAILURE(S) DETECTED")

---

## Résultats par batterie

| Test | Résultat | Durée | Description |
|------|----------|-------|-------------|
$(for r in "${RESULTS[@]}"; do echo "${r}"; done)

---

## Détail des batteries

### 15.2.A — Attaque logique (moteur)
- **A1** : 1 000 000 paires (S1, S2) aléatoires avec S1 ≤ S2 — recherche de violation G3
- **A2** : Fuzzing autour de θ_S ± 1e-12 — détection de flip non déterministe

### 15.2.B — Attaque Merkle
- **B1** : 100 000 repos × modification d'un seul leaf + 10 000 paires directes

### 15.2.C — Attaque Seal V15.1
- **C1** : Modification de fichiers trackés sans MAJ manifest — seal_verify.py doit détecter

### 15.2.D — Attaque Consensus 3/4
- **D1** : Toutes combinaisons 2 ACT / 2 HOLD + exhaustif 3^4 = 81 cas

### 15.2.E — Attaque Signature / Audit Chain
- **E1** : 5 types de tamper sur audit_log.jsonl — chaîne de hashes doit être invalidée

---

## Conclusion

$([ "${FAILED}" -eq 0 ] && echo "Le système OBSIDIA a résisté à toutes les attaques adversariales structurées de la Phase 15.2. Aucune faiblesse structurelle n'a été détectée." || echo "Des faiblesses ont été détectées. Voir les tests FAIL ci-dessus.")

*Généré automatiquement par RUN_ALL_ADVERSARIAL.sh*
EOF

echo -e "  Rapport généré : ${REPORT_FILE}"
echo ""

# Exit code
[ "${FAILED}" -eq 0 ] && exit 0 || exit 1
