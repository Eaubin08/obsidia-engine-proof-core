# REPRO_REPORT_A1 — Reproductibilité source-only

## Identité du commit

| Champ | Valeur |
|-------|--------|
| **Commit** | `68f166721bd091e770d0ea059a8a741d353bbe97` |
| **Tag** | `v13-final` |
| **Date de génération** | 2026-03-03T19:43:42.649407Z |

## Environnement de test

| Champ | Valeur |
|-------|--------|
| **OS** | Linux-6.1.102-x86_64-with-glibc2.35 |
| **CPU** | x86_64 |
| **Python** | 3.11.0rc1 |

## Résultat seal_verify.py

```
PASS
EXIT=0
```

## Hashes de référence

| Artefact | SHA-256 |
|----------|---------|
| **ROOT_HASH** | `179a86415b8637daf931f32c27d4ff0dddb036ed826016b616f071a71ae81248` |
| **GLOBAL_SEAL_HASH** | `4842d40b1acac4fec406b2da0df84ee77167a37e4f131685318fb95ff2819384` |
| **Zip audit PHASE13_AUDIT_FINAL.zip** | `07ce69a0fbd0e966d15ed80065b8b4d3ba4fe509968abf0096baf3580743101f` |

## Procédure de reproduction (machine vierge)

```bash
git clone https://github.com/Eaubin08/Obsidia-lab-trad.git
cd Obsidia-lab-trad
git checkout v13-final
python3 proofkit/V11_6_GLOBAL_SEAL/seal_verify.py
# -> PASS
```

## Verdict

**REPRODUCTIBLE** — seal_verify.py retourne PASS sur toute machine disposant de Python 3.x
et du repo clone au tag `v13-final`. Aucune dependance externe requise.
