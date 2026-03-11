# REPORT — V18.8 Convergence & Stability
Date: 2026-03-03T14:43:17.741275Z

Inputs:
- metrics zips included (for context): strasbourg_clock_x108.zip, strasbourg_clock_x108_graphs.zip

Params:
- tau=10.0
- Rmax=0.65
- ERmin=-0.01

Verdicts:
- G1 Determinism: PASS
- G2 No ALLOW before tau: PASS
- G3 Convergence at tau: PASS
- G4 No oscillation without boundary: PASS

Evidence:
- examples/G2_history (t<tau): [{'t': 0.0, 'decision': 'HOLD', 'reasons': ['X108_TIME_LOCK']}, {'t': 1.0, 'decision': 'HOLD', 'reasons': ['X108_TIME_LOCK']}, {'t': 5.0, 'decision': 'HOLD', 'reasons': ['X108_TIME_LOCK']}, {'t': 9.9, 'decision': 'HOLD', 'reasons': ['X108_TIME_LOCK']}]
- examples/G3_history (across tau): [{'t': 0.0, 'decision': 'HOLD'}, {'t': 1.0, 'decision': 'HOLD'}, {'t': 5.0, 'decision': 'HOLD'}, {'t': 9.9, 'decision': 'HOLD'}, {'t': 10.0, 'decision': 'ALLOW'}, {'t': 10.1, 'decision': 'ALLOW'}, {'t': 60.0, 'decision': 'ALLOW'}]
