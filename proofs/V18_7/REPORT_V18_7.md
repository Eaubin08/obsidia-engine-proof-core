# REPORT — V18.7 Structural Non‑Circumvention
Date: 2026-03-03T14:37:06.261624Z

## Demo (best candidate)
- case1: HOLD reasons=['X108_TIME_LOCK']
- case2: ALLOW reasons=[]
- case3 (replay): BLOCK reasons=['NONCE_REPLAY_OR_MISSING']

## Fuzz 200k
- counts: {'ALLOW': 66983, 'HOLD': 26634, 'BLOCK': 106383}
- violations:
  - E2_no_allow_before_tau: 0

## Algebraic witness (E3)
- {'idempotent': True, 'commutative': True, 'associative_sample': True}

Verdict:
- E2 invariant (no ALLOW before τ for irreversible): PASS
- E3 algebraic meet witness: PASS
