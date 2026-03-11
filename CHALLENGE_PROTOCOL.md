# CHALLENGE_PROTOCOL — Protocole de challenge du moteur

**Version :** 1.0.0 · **Date :** 2026-03-11

Ce protocole permet à un auditeur externe de challenger le moteur, tenter de casser les invariants, et vérifier les limites réelles du système.

---

## Prérequis

```bash
git clone https://github.com/Eaubin08/obsidia-engine-proof-core
cd obsidia-engine-proof-core
pip install pytest
```

---

## Challenge 1 — Tenter de casser le déterminisme

**Objectif :** Vérifier que le moteur est bien déterministe.

```bash
cd tests/
pytest test_invariants_against_engine.py::test_determinism -v -s
```

**Pour aller plus loin :** Modifier `S` entre 0 et 1 et vérifier que le résultat est stable :

```python
cd engine/
python3 -c "
import sys; sys.path.insert(0, '.')
from obsidia_os2.metrics import decision_act_hold, Metrics
for s in [0.0, 0.1, 0.24, 0.25, 0.5, 0.75, 1.0]:
    m = Metrics(T_mean=0.5, H_score=0.5, A_score=0.1, S=s)
    print(f'S={s:.2f} → {decision_act_hold(m, theta_S=0.25)}')
"
```

**Résultat attendu :**
```
S=0.00 → HOLD
S=0.10 → HOLD
S=0.24 → HOLD
S=0.25 → ACT   ← frontière inclusive
S=0.50 → ACT
S=0.75 → ACT
S=1.00 → ACT
```

---

## Challenge 2 — Tenter de forcer ACT avant le seuil

**Objectif :** Vérifier que E2 (non-exécution avant seuil) ne peut pas être contourné.

```bash
pytest test_invariants_against_engine.py::test_no_allow_before_tau -v
```

**Tentative de contournement :** Passer `theta_S=0.0` (seuil nul) :

```python
python3 -c "
import sys; sys.path.insert(0, 'engine/')
from obsidia_os2.metrics import decision_act_hold, Metrics
m = Metrics(T_mean=0.5, H_score=0.5, A_score=0.1, S=0.0)
print(decision_act_hold(m, theta_S=0.0))  # Attendu: ACT (S >= 0.0)
print(decision_act_hold(m, theta_S=0.01)) # Attendu: HOLD (S=0.0 < 0.01)
"
```

---

## Challenge 3 — Tenter de forcer ALLOW malgré des contradictions

**Objectif :** Vérifier que le Guard X-108 bloque bien sur 2+ contradictions.

```python
cd governance/
python3 -c "
from guard import GuardX108, GuardConfig
from contracts import DomainAggregate, Domain

guard = GuardX108()

# Cas 1 : 1 contradiction → doit passer (HOLD ou ALLOW selon confiance)
agg1 = DomainAggregate(
    domain=Domain.TRADING, market_verdict='BUY', confidence=0.9,
    contradictions=['SIGNAL_A_VS_SIGNAL_B'], unknowns=[], risk_flags=[]
)
r1 = guard.decide(agg1)
print('1 contradiction, confidence=0.9 →', r1.x108_gate)  # Attendu: ALLOW

# Cas 2 : 2 contradictions → doit BLOCK même avec confidence=1.0
agg2 = DomainAggregate(
    domain=Domain.TRADING, market_verdict='BUY', confidence=1.0,
    contradictions=['SIGNAL_A_VS_B', 'SIGNAL_C_VS_D'], unknowns=[], risk_flags=[]
)
r2 = guard.decide(agg2)
print('2 contradictions, confidence=1.0 →', r2.x108_gate)  # Attendu: BLOCK
"
```

---

## Challenge 4 — Tenter de passer FRAUD_PATTERN sans BLOCK

**Objectif :** Vérifier que `FRAUD_PATTERN` force toujours BLOCK.

```python
python3 -c "
from governance.guard import GuardX108
from governance.contracts import DomainAggregate, Domain

guard = GuardX108()
agg = DomainAggregate(
    domain=Domain.BANK, market_verdict='AUTHORIZE', confidence=0.99,
    contradictions=[], unknowns=[], risk_flags=['FRAUD_PATTERN']
)
r = guard.decide(agg)
print('FRAUD_PATTERN + confidence=0.99 →', r.x108_gate)  # Attendu: BLOCK
print('Reason:', r.reason_code)  # Attendu: CONTRADICTION_THRESHOLD_REACHED
"
```

---

## Challenge 5 — Vérifier la monotonie sur tout le domaine

**Objectif :** Vérifier G3 (monotonie) sur une grille de 100 valeurs.

```python
python3 -c "
import sys; sys.path.insert(0, 'engine/')
from obsidia_os2.metrics import decision_act_hold, Metrics
order = {'HOLD': 0, 'ACT': 1}
prev = 0
for i in range(101):
    s = i / 100.0
    m = Metrics(T_mean=0.5, H_score=0.5, A_score=0.1, S=s)
    r = decision_act_hold(m, theta_S=0.25)
    curr = order[r]
    assert curr >= prev, f'Monotonie violée à S={s}: {r} après décision plus forte'
    prev = curr
print('Monotonie vérifiée sur 101 points de S=0.0 à S=1.0')
"
```

---

## Challenge 6 — Vérifier le déterminisme du pipeline complet

**Objectif :** Vérifier que le pipeline Trading produit le même résultat sur 10 appels successifs.

```bash
for i in $(seq 1 10); do
  python3 agents/run_pipeline.py trading "$(cat examples/trading_bullish.json)" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['x108_gate'], d['decision_id'][:8])"
done
```

**Résultat attendu :** `x108_gate` identique sur tous les appels. `decision_id` différent à chaque appel (UUID unique) — c'est normal et attendu.

---

## Challenge 7 — Cas limites : état vide / minimal

**Objectif :** Vérifier que le moteur ne plante pas sur des entrées minimales.

```bash
# Trading avec 1 seul prix
python3 agents/run_pipeline.py trading '{"symbol":"X","prices":[100],"highs":[101],"lows":[99],"volumes":[1000],"spreads_bps":[4],"sentiment_scores":[0.0],"event_risk_scores":[0.0],"btc_reference_prices":[100]}'

# Bank avec 0 transactions
python3 agents/run_pipeline.py bank '{"account_id":"X","balance":0,"transactions":[],"credit_score":300,"account_age_days":0,"fraud_flags":[],"reserve_ratio":0}'
```

**Résultat attendu :** JSON valide retourné, pas d'exception Python. La décision sera probablement `HOLD` (données insuffisantes).

---

## Checklist de challenge

| # | Challenge | Résultat attendu | Vérifié |
|---|---|---|---|
| 1 | Déterminisme kernel | Même S → même décision | ☐ |
| 2 | Non-exécution avant seuil | S < theta_S → HOLD toujours | ☐ |
| 3 | BLOCK sur 2 contradictions | confidence=1.0 + 2 contradictions → BLOCK | ☐ |
| 4 | FRAUD_PATTERN → BLOCK | confidence=0.99 + FRAUD_PATTERN → BLOCK | ☐ |
| 5 | Monotonie sur 101 points | Aucune violation de monotonie | ☐ |
| 6 | Déterminisme pipeline | 10 appels → même x108_gate | ☐ |
| 7 | Cas limites | Pas d'exception sur entrées minimales | ☐ |
