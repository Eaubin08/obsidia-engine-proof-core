> Ce document est une annexe du [OBSIDIA_PAPER_v16.md](./OBSIDIA_PAPER_v16.md).

# OBSIDIA — Artifact Index v16

Cet index fournit une référence complète des artefacts logiciels, des sceaux cryptographiques et des commandes de vérification pour garantir la reproductibilité totale du système OBSIDIA jusqu'à la Phase 16.

---

## 1. Git Tags

Liste des tags Git marquant les versions et phases clés du projet.

```
v12-global-sealed
v13-final
v13-immutability-proof
v13-immutability-proof-2
v14-final
v15-final
v15.1-final
v15.2-final
v16A-threat-model
```

---

## 2. Global Seal Hashes

Chaque `GLOBAL_SEAL_HASH` est une empreinte cryptographique de l'intégralité du code base à un tag donné. La vérification de ce hash garantit l'intégrité de tous les fichiers scellés.

| Tag | GLOBAL_SEAL_HASH |
|:---|:---|
| **v15.2-final** | `1b23775be41377e0117e0cbe9a855c2d0cce22be3766b678b5ab8798ccd33c3c` |
| **v15.1-final** | `fc905b8f427be91604cef0612d7e0e574bea0c043a14bca046b900aaffe2361d` |
| **v15-final** | `a0b95a5d8fab12d70faf2ac89160b9610bc5bd39104ecbd82f5aedb6ad0cbb6a` |
| **v14-final** | `105e7e6edc0be3ccdbc2c896fb12b66e4d8a478a55255d2f922cc0142cacea72` |

*Note: Les sceaux antérieurs à la v14 ne suivent pas la même structure et ne sont pas listés.* 

---

## 3. Key Artifacts & Scripts

Cette section liste les fichiers et scripts les plus importants pour comprendre et vérifier le système.

### 3.1. Preuves Formelles (Lean)

| Artefact | Chemin | Description |
|:---|:---|:---|
| Preuve de sensibilité Merkle | `lean/Obsidia/Sensitivity.lean` | Prouve que `repo ≠ repo' → globalSeal ≠ globalSeal'`. |
| Preuve de consensus | `lean/Obsidia/Consensus.lean` | Prouve que le consensus 3/4 est `fail-closed`. |
| Définition Merkle | `lean/Obsidia/Merkle.lean` | Définitions de base de l'arbre de Merkle. |
| Point d'entrée principal | `lean/Obsidia/Main.lean` | Point d'entrée pour la compilation des preuves. |

### 3.2. Audit Adversarial

| Artefact | Chemin | Description |
|:---|:---|:---|
| Orchestrateur | `tools/adversarial/RUN_ALL_ADVERSARIAL.sh` | Exécute l'intégralité de la suite de tests. |
| Attaque Moteur (Monotonie) | `tools/adversarial/test_monotonic_break.py` | Teste l'invariant G3 sur 1M de cas. |
| Attaque Moteur (Frontière) | `tools/adversarial/test_threshold_fuzz.py` | Fuzzing de la frontière de décision `theta_S`. |
| Attaque Merkle | `tools/adversarial/test_merkle_collision.py` | Tente de trouver des collisions de racine Merkle. |
| Attaque Sceau | `tools/adversarial/test_seal_tamper.py` | Vérifie que la modification d'un fichier est détectée. |
| Attaque Consensus | `tools/adversarial/test_consensus_split.py` | Simule un vote partagé pour tester le `fail-closed`. |
| Attaque Chaîne d'Audit | `tools/adversarial/test_signature_tamper.py` | Tente de modifier l'audit log sans invalider la chaîne. |

### 3.3. Modèle de Menace

| Artefact | Chemin | Description |
|:---|:---|:---|
| Modèle de Menace | `docs/security/THREAT_MODEL_v16.md` | Description formelle des menaces, actifs, et contrôles. |
| Obligations de Preuve | `docs/security/PROOF_OBLIGATIONS_v16.md` | Tableau mappant les `claims` aux preuves. |
| Manifeste de Menaces | `docs/security/threat_manifest_v16.json` | Version machine-readable du modèle de menace. |
| Vérificateur de Menaces | `tools/verify_threat_model.py` | Script pour valider automatiquement les `claims` du manifeste. |

---

## 4. Commands for Full Reproducibility

Les commandes suivantes permettent de reproduire l'intégralité des vérifications présentées dans le paper.

### 4.1. Vérification du Sceau (Intégrité du code)

```bash
# Se placer au tag de la version à vérifier
git checkout v15.2-final

# Exécuter le script de vérification
python3 proofkit/V15_GLOBAL_SEAL/seal_verify.py

# Sortie attendue : PASS
```

### 4.2. Exécution de l'Audit Adversarial

```bash
# Se placer au tag de la version de l'audit
git checkout v15.2-final

# Exécuter l'orchestrateur
bash tools/adversarial/RUN_ALL_ADVERSARIAL.sh

# Sortie attendue : ALL TESTS PASSED
```

### 4.3. Compilation des Preuves Formelles

```bash
# Se placer à la racine du projet
cd lean/

# Construire le projet Lean
lake build

# Sortie attendue : Build completed successfully
```

### 4.4. Vérification du Modèle de Menace

```bash
# Se placer au tag de la version du modèle de menace
git checkout v16A-threat-model

# Exécuter le script de vérification
python3 tools/verify_threat_model.py

# Sortie attendue : PASS — All 8 claims verified
```
