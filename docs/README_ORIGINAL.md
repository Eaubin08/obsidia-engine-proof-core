# Obsidia Lab Trad — Unified Structure

This repository centralizes:

- Deterministic governance engine
- Public ProofKit (formal verification)
- Bank-grade adversarial evidence
- Documentation for audit and research

## Verify proofs

```
cd proofkit
python verify_all.py
```

Expected output: PASS

## Standard X-108

This repository implements the **X-108 STD 1.0** — Ex-Ante Governance Interface (Canon Spec).

- **Standard specification**: [`docs/standards/X108_STANDARD.md`](docs/standards/X108_STANDARD.md)
- **Compliance claim**: [`docs/standards/COMPLIANCE_CLAIM.md`](docs/standards/COMPLIANCE_CLAIM.md)
- **Lean proofs** (machine-checked): [`lean/Obsidia/TemporalX108.lean`](lean/Obsidia/TemporalX108.lean)
- **TLA+ specs**: [`tla/X108.tla`](tla/X108.tla), [`tla/DistributedX108.tla`](tla/DistributedX108.tla)
- **OS4 evidence** (Strasbourg Clock): [`evidence/os4/strasbourg_clock_x108/`](evidence/os4/strasbourg_clock_x108/)

### One-command conformance check

```bash
bash tools/standard/verify_x108_standard.sh
```

Expected output: `X-108 STD 1.0 — ALL CHECKS PASS`
