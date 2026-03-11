#!/usr/bin/env bash
# ============================================================
# Obsidia-lab-trad — Script de démarrage combiné
# Lance le moteur Python (FastAPI port 8000) + Express (port 3000)
# ============================================================
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
ENGINE_DIR="$ROOT/core/engine"

echo "🔷 Obsidia-lab-trad — Démarrage des serveurs"
echo "   Moteur Python : http://localhost:8000"
echo "   Interface web : http://localhost:3000"
echo ""

# ── 1. Vérifier les dépendances Python ──────────────────────
if ! command -v uvicorn &> /dev/null; then
  echo "⚠️  uvicorn non trouvé. Installation..."
  pip3 install uvicorn fastapi --quiet
fi

# ── 2. Démarrer le moteur Python en arrière-plan ────────────
echo "▶ Démarrage du moteur Python (port 8000)..."
cd "$ENGINE_DIR"
uvicorn api_server.main:app --host 0.0.0.0 --port 8000 --log-level warning &
PYTHON_PID=$!
echo "  PID moteur Python : $PYTHON_PID"

# Attendre que le moteur Python soit prêt
sleep 2
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
  echo "  ✅ Moteur Python opérationnel"
else
  echo "  ⚠️  Moteur Python en cours de démarrage..."
fi

# ── 3. Démarrer le serveur Express Node.js ──────────────────
echo "▶ Démarrage du serveur Express (port 3000)..."
cd "$ROOT"
export PYTHON_ENGINE_URL="http://localhost:8000"

# Trap pour arrêter les deux processus proprement
cleanup() {
  echo ""
  echo "🛑 Arrêt des serveurs..."
  kill $PYTHON_PID 2>/dev/null || true
  exit 0
}
trap cleanup SIGINT SIGTERM

# Démarrer Express (bloquant)
pnpm dev
