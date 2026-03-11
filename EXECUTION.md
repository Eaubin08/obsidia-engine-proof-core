# EXECUTION — Guide d'exécution

**Version :** 1.0.0 · **Date :** 2026-03-11

---

## Environnement requis

| Dépendance | Version minimale | Installation |
|---|---|---|
| Python | 3.11 | `sudo apt install python3.11` |
| pytest | 7.0+ | `pip install pytest` |
| Node.js | 18+ | (optionnel, pour tests Vitest) |
| pnpm | 8+ | (optionnel, pour tests Vitest) |

Aucune dépendance externe Python (pas de pandas, numpy, torch). Le moteur est pur Python stdlib + dataclasses.

---

## Point d'entrée 1 — Pipeline CLI (recommandé)

Le pipeline CLI est le point d'entrée principal. Il accepte un domaine et un état JSON, et retourne une `CanonicalDecisionEnvelope` JSON.

### Trading

```bash
cd agents/
python3 run_pipeline.py trading '{
  "symbol": "BTCUSDT",
  "prices": [100,101,102,103,104,106,108,110,111,113],
  "highs": [101,102,103,104,105,107,109,111,112,114],
  "lows": [99,100,101,102,103,105,107,109,110,112],
  "volumes": [1000,1050,1100,1150,1200,1250,1300,1350,1400,1450],
  "spreads_bps": [4,4,4,4,4,4,4,4,4,4],
  "sentiment_scores": [0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2],
  "event_risk_scores": [0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1],
  "btc_reference_prices": [100,101,102,103,104,106,108,110,111,113]
}'
```

### Bank

```bash
python3 run_pipeline.py bank '{
  "account_id": "ACC001",
  "balance": 50000.0,
  "transactions": [
    {"amount": 500.0, "type": "debit", "category": "purchase"},
    {"amount": 2000.0, "type": "credit", "category": "salary"}
  ],
  "credit_score": 720,
  "account_age_days": 365,
  "fraud_flags": [],
  "reserve_ratio": 0.1
}'
```

### Ecom

```bash
python3 run_pipeline.py ecom '{
  "session_id": "S001",
  "cart_value": 299.0,
  "items_count": 3,
  "customer_history_score": 0.85,
  "stock_available": true,
  "fraud_risk_score": 0.05,
  "delivery_delay_days": 2
}'
```

---

## Point d'entrée 2 — Kernel bas niveau

```bash
cd engine/
python3 -c "
import sys
sys.path.insert(0, '.')
from obsidia_kernel.kernel import ObsidiaKernel
from obsidia_kernel.contract import Request, Meta, Intent, IntentType, Governance

kernel = ObsidiaKernel()
req = Request(
    meta=Meta(request_id='test-001', timestamp='2026-03-11T10:00:00Z', domain='generic'),
    intent=Intent(type=IntentType.PROPOSE, name='test_action', payload={'value': 42}),
    governance=Governance(irreversible=False, theta_S=0.25)
)
result = kernel.process(req)
print('Decision:', result.decision)
print('Hash:', result.artifacts_hash)
print('Audit path:', result.audit_path)
"
```

---

## Point d'entrée 3 — Tests invariants

```bash
cd tests/
pytest test_invariants_against_engine.py -v
```

Sortie attendue :
```
test_invariants_against_engine.py::test_determinism PASSED
test_invariants_against_engine.py::test_no_allow_before_tau PASSED
test_invariants_against_engine.py::test_act_above_threshold PASSED
test_invariants_against_engine.py::test_hold_at_boundary PASSED
test_invariants_against_engine.py::test_monotonicity PASSED
test_invariants_against_engine.py::test_compute_metrics_pipeline PASSED
```

---

## Point d'entrée 4 — Tests agents fonctionnels

```bash
cd tests/
pytest test_agents_functional.py -v
```

---

## Sorties attendues

### Format `CanonicalDecisionEnvelope`

```json
{
  "domain": "trading",
  "market_verdict": "EXECUTE_LONG",
  "confidence": 0.82,
  "contradictions": [],
  "unknowns": [],
  "risk_flags": [],
  "x108_gate": "ALLOW",
  "reason_code": "GUARD_ALLOW",
  "severity": "S0",
  "decision_id": "trading-a3f2c1b4e5d6",
  "trace_id": "550e8400-e29b-41d4-a716-446655440000",
  "ticket_required": true,
  "ticket_id": "a1b2c3d4e5f6a7b8",
  "attestation_ref": "sha256prefix24chars",
  "source": "canonical_framework",
  "evidence_refs": ["hash1", "hash2", "..."],
  "metrics": {
    "buy_score": 0.82,
    "sell_score": 0.12,
    "hold_score": 0.06,
    "proof_ready": true,
    "deterministic": true
  }
}
```

### Codes de sortie CLI

| Code | Signification |
|---|---|
| 0 | Succès — JSON valide sur stdout |
| 1 | Erreur — JSON d'erreur sur stderr |

---

## Variables d'environnement

Aucune variable d'environnement requise pour le moteur Python. Le moteur est autonome.

Pour les tests Vitest (TypeScript), les variables sont gérées par le projet `os4-platform` (voir `.env` du projet parent).
