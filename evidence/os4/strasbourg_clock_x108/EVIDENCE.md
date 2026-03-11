# Evidence OS4 — Strasbourg Clock X-108

**Standard** : X-108 STD 1.0  
**Profile** : OS4 / Strasbourg Clock  
**Date** : 2026-03-03  
**Tag** : `x108-std-v1.0`

---

## Description

The **Strasbourg Clock** is a synthetic sandbox that simulates a time-divergence observable (`delta_day`) for an irreversible governance intent. It is used as an empirical validation of the X-108 temporal safety property on concrete traces.

**Mapping to X-108 STD 1.0 §2.1:**

| Strasbourg Clock field | X-108 STD field | Mapping rule |
|:-----------------------|:----------------|:-------------|
| `delta_day` | `elapsed` proxy | `irr := (delta_day ≥ threshold)` |
| `threshold = 0.05` | `tau` proxy | Gate activates when `delta_day ≥ 0.05` |
| Decision | `kernel_decision` | `HOLD if irr else ACT` |

---

## Traces

| File | Description | Steps | irr steps | Violations |
|:-----|:------------|------:|----------:|:----------:|
| `test1_baseline.csv` | Nominal regime, zero delta | 2 000 | 0 | **0** |
| `test2_noise.csv` | Random noise, sporadic spikes | 2 000 | 44 | **0** |
| `test3_structural_error.csv` | Structural error, 1 extreme spike | 2 000 | 1 | **0** |
| `test4_hold.csv` | Prolonged hold regime (40.4% irr) | 2 000 | 808 | **0** |

**Total : 8 000 steps, 853 irr steps, 0 violations.**

---

## Safety property verified

```
SafetyX108 ≡ □ ( irr ∧ elapsed < τ ⟹ decision ≠ ACT )
```

All 4 traces satisfy this property under the Strasbourg Clock mapping.

---

## Reproduction

```bash
python3 tools/standard/x108_trace_check.py \
  --dir evidence/os4/strasbourg_clock_x108 \
  --threshold 0.05 \
  --field delta_day
```

Expected output: `TRACE CHECK: ALL PASS — 0 violations / 8000 steps`

---

## Relation to formal proofs

This empirical evidence complements the machine-checked Lean proofs in `lean/Obsidia/TemporalX108.lean`. The Lean proofs establish the property universally (for all inputs); the traces demonstrate the property on a concrete OS4 dataset.
