# INVARIANTS — Invariants réellement implémentés et testés

**Version :** 1.0.0 · **Date :** 2026-03-11

Seuls les invariants appuyés par du code exécutable et/ou des tests passants sont listés ici. Les invariants théoriques non testés sont dans `LIMITS.md`.

---

## Invariants du kernel bas niveau (obsidia_os2.metrics)

Ces invariants sont testés dans `tests/test_invariants_against_engine.py` contre la fonction réelle `decision_act_hold` du module `obsidia_os2.metrics`.

### D1 — Déterminisme

**Définition :** Les mêmes entrées produisent toujours la même sortie.

**Localisation dans le code :** `engine/obsidia_runtime/engine_runtime.py` → `decision_act_hold(metrics, theta_S)`

**Test :** `test_determinism()` dans `tests/test_invariants_against_engine.py`

```python
metrics = make_metrics(S=0.5)
r1 = decide(metrics)
r2 = decide(metrics)
assert r1 == r2  # Déterminisme vérifié
```

**Statut :** ✅ PASS

---

### E2 — Non-exécution avant seuil

**Définition :** Si `S < theta_S`, la décision doit être `HOLD`, jamais `ACT`.

**Localisation dans le code :** `decision_act_hold(metrics, theta_S=0.25)` — condition `if S < theta_S: return "HOLD"`

**Test :** `test_no_allow_before_tau()` dans `tests/test_invariants_against_engine.py`

```python
metrics_low = make_metrics(S=0.0)
r = decide(metrics_low, theta_S=0.25)
assert r == "HOLD"  # S=0.0 < theta_S=0.25 → HOLD obligatoire
```

**Statut :** ✅ PASS

---

### G1 — Exécution au-dessus du seuil

**Définition :** Si `S >= theta_S`, la décision doit être `ACT`.

**Localisation dans le code :** `decision_act_hold` — condition `if S >= theta_S: return "ACT"`

**Test :** `test_act_above_threshold()` dans `tests/test_invariants_against_engine.py`

```python
metrics_high = make_metrics(S=1.0)
r = decide(metrics_high, theta_S=0.25)
assert r == "ACT"  # S=1.0 >= theta_S=0.25 → ACT
```

**Statut :** ✅ PASS

---

### G2 — Inclusivité à la frontière

**Définition :** À la frontière exacte `S == theta_S`, la décision doit être `ACT` (opérateur `>=` inclusif).

**Localisation dans le code :** `decision_act_hold` — condition `>=` (et non `>`)

**Test :** `test_hold_at_boundary()` dans `tests/test_invariants_against_engine.py`

```python
metrics_boundary = make_metrics(S=0.25)
r = decide(metrics_boundary, theta_S=0.25)
assert r == "ACT"  # S == theta_S → ACT (inclusif)
```

**Statut :** ✅ PASS

---

### G3 — Monotonie

**Définition :** Un `S` plus élevé ne peut pas produire une décision plus faible qu'un `S` plus bas.

**Localisation dans le code :** Propriété structurelle de `decision_act_hold` — la fonction est monotone croissante en `S`.

**Test :** `test_monotonicity()` dans `tests/test_invariants_against_engine.py`

```python
r_low = decide(make_metrics(S=0.1), theta_S=0.25)   # → HOLD
r_high = decide(make_metrics(S=0.9), theta_S=0.25)  # → ACT
order = {"HOLD": 0, "ACT": 1}
assert order[r_high] >= order[r_low]  # Monotonie vérifiée
```

**Statut :** ✅ PASS

---

## Invariants du Guard X-108 (governance/guard.py)

Ces invariants sont implémentés dans la logique de `GuardX108.decide()`. Ils ne sont pas encore couverts par des tests unitaires dédiés (voir `LIMITS.md`), mais la logique est directement lisible et vérifiable dans le code.

### G-X108-1 — Priorité BLOCK sur HOLD

**Définition :** `BLOCK > HOLD > ALLOW`. Si les conditions de BLOCK sont remplies, BLOCK est retourné même si les conditions de HOLD sont aussi remplies.

**Localisation :** `governance/guard.py` → `GuardX108.decide()` — branche `if contradiction_count >= 2` évaluée en premier.

**Statut :** ✅ Implémenté, non testé unitairement

---

### G-X108-2 — FRAUD_PATTERN force BLOCK

**Définition :** La présence de `FRAUD_PATTERN` dans `risk_flags` force systématiquement `BLOCK`, indépendamment du score de confiance.

**Localisation :** `governance/guard.py` → condition `or "FRAUD_PATTERN" in aggregate.risk_flags`

**Statut :** ✅ Implémenté, non testé unitairement

---

### G-X108-3 — Ticket obligatoire sur ALLOW

**Définition :** Toute décision `ALLOW` génère un `ticket_id` unique. Aucun ALLOW sans ticket.

**Localisation :** `governance/guard.py` → `ticket_required = gate == X108Gate.ALLOW` + `ticket_id = uuid.uuid4().hex[:16] if ticket_required else None`

**Statut :** ✅ Implémenté, non testé unitairement

---

### G-X108-4 — Attestation sur evidence_refs

**Définition :** Si des `evidence_refs` sont présentes, une `attestation_ref` SHA-256 est calculée et incluse dans l'enveloppe.

**Localisation :** `governance/guard.py` → `attestation_ref = hashlib.sha256(...).hexdigest()[:24] if aggregate.evidence_refs else None`

**Statut :** ✅ Implémenté, non testé unitairement

---

## Invariants des simulations (engines TypeScript)

Ces invariants sont testés dans `tests/engines.test.ts` (Vitest, 45/45 PASS).

### SIM-D1 — Déterminisme des simulations

**Définition :** Même seed → même `stateHash`, même `merkleRoot`, même `finalPrice`.

**Test :** `engines.test.ts` → `"should produce deterministic results with same seed"`

**Statut :** ✅ PASS (Trading, Bank, Ecom)

### SIM-H1 — Hashes SHA-256 valides

**Définition :** `stateHash` et `merkleRoot` sont des chaînes hexadécimales SHA-256 de 64 caractères.

**Test :** `engines.test.ts` → `"should have valid state hash and merkle root"`

**Statut :** ✅ PASS

---

## Récapitulatif

| ID | Invariant | Testé | Statut |
|---|---|---|---|
| D1 | Déterminisme kernel | ✅ | PASS |
| E2 | Non-exécution avant seuil | ✅ | PASS |
| G1 | Exécution au-dessus seuil | ✅ | PASS |
| G2 | Inclusivité frontière | ✅ | PASS |
| G3 | Monotonie | ✅ | PASS |
| G-X108-1 | BLOCK > HOLD > ALLOW | ⚠️ Code seul | Implémenté |
| G-X108-2 | FRAUD_PATTERN → BLOCK | ⚠️ Code seul | Implémenté |
| G-X108-3 | Ticket sur ALLOW | ⚠️ Code seul | Implémenté |
| G-X108-4 | Attestation sur evidence | ⚠️ Code seul | Implémenté |
| SIM-D1 | Déterminisme simulations | ✅ | PASS |
| SIM-H1 | Hashes SHA-256 valides | ✅ | PASS |
