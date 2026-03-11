#!/bin/bash
# verify_rfc3161.sh — Vérification de l'ancrage RFC3161 du Merkle Root OBSIDIA
# Usage: bash verify_rfc3161.sh

set -e

echo "=== OBSIDIA RFC3161 Anchor Verification ==="
echo ""

# 1. Recalculer le Merkle Root depuis l'audit log actuel
echo "[1] Recalcul du Merkle Root..."
PYTHONPATH=. python3 compute_merkle_root.py
ACTUAL_ROOT=$(python3 -c "import json; print(json.load(open('merkle_root.json'))['merkle_root'])")
echo "    Merkle Root actuel : $ACTUAL_ROOT"
echo ""

# 2. Lire le Merkle Root ancré
ANCHORED_ROOT=$(python3 -c "import json; print(json.load(open('rfc3161_anchor.json'))['merkle_root'])")
ANCHORED_TS=$(python3 -c "import json; print(json.load(open('rfc3161_anchor.json'))['timestamp_utc'])")
echo "[2] Merkle Root ancré : $ANCHORED_ROOT"
echo "    Horodatage RFC3161 : $ANCHORED_TS"
echo ""

# 3. Vérifier la cohérence
if [ "$ACTUAL_ROOT" = "$ANCHORED_ROOT" ]; then
    echo "[3] Cohérence Merkle Root : OK (audit log non modifié depuis l'ancrage)"
else
    echo "[3] ATTENTION : Le Merkle Root a changé depuis l'ancrage !"
    echo "    Des nouvelles entrées ont été ajoutées à l'audit log."
fi
echo ""

# 4. Vérifier la signature RFC3161 (nécessite les certificats FreeTSA)
echo "[4] Vérification signature RFC3161..."
echo -n "$ANCHORED_ROOT" | xxd -r -p > /tmp/merkle_verify.bin

if [ -f "/tmp/freetsa_ca.pem" ] && [ -f "/tmp/freetsa_tsa.crt" ]; then
    openssl ts -verify \
        -data /tmp/merkle_verify.bin \
        -in rfc3161_anchor.tsr \
        -CAfile /tmp/freetsa_ca.pem \
        -untrusted /tmp/freetsa_tsa.crt 2>&1 | grep -E "Verification|Error"
else
    echo "    Téléchargement des certificats FreeTSA..."
    curl -s https://freetsa.org/files/cacert.pem -o /tmp/freetsa_ca.pem
    curl -s https://freetsa.org/files/tsa.crt -o /tmp/freetsa_tsa.crt
    openssl ts -verify \
        -data /tmp/merkle_verify.bin \
        -in rfc3161_anchor.tsr \
        -CAfile /tmp/freetsa_ca.pem \
        -untrusted /tmp/freetsa_tsa.crt 2>&1 | grep -E "Verification|Error"
fi

echo ""
echo "=== Vérification terminée ==="
