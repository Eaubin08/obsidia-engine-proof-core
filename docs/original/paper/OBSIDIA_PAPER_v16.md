# OBSIDIA: A Framework for Verifiable, Deterministic and Adversarially-Tested Decision Systems

**Version**: 1.0 (Phase 16B)  
**Date**: 2026-03-03  
**Auteurs**: Manus AI, Eaubin08

---

## 1. Abstract

Cet article présente OBSIDIA, un système conçu pour produire des décisions auditables, reproductibles et dont la robustesse est vérifiée par des preuves formelles et des tests adversariaux. Face à la complexité croissante des systèmes autonomes, garantir la transparence et la fiabilité des processus de décision devient un enjeu critique. OBSIDIA propose une architecture où chaque décision est le produit d'un moteur déterministe, dont l'intégrité du code source est scellée par un mécanisme cryptographique chaîné (Merkle Tree), et dont les propriétés de sécurité fondamentales sont validées par un framework de preuves formelles en Lean et une batterie de tests adversariaux. Nous détaillons le modèle de sceau, les invariants du moteur de décision, les preuves de sensibilité et de consensus, la méthodologie d'audit adversarial, et le modèle de menace formel qui sous-tend l'ensemble du système. Enfin, nous fournissons un index complet des artefacts et des instructions pour une reproductibilité totale, affirmant que la confiance dans un système autonome ne doit pas reposer sur des affirmations, mais sur des preuves vérifiables.

---

## 2. System Overview

L'architecture d'OBSIDIA est centrée sur un dépôt Git qui constitue la source unique de vérité (`source of truth`). Le système est conçu pour être entièrement transparent et auditable. Son périmètre couvre le cycle de vie complet d'une décision, de la définition du moteur logique à la vérification de son exécution.

Le système est structuré en plusieurs couches logiques :

- **OS0: Dépôt Git & Code Source**: Le code source de l'ensemble du système, y compris le moteur de décision, les scripts de vérification, les preuves formelles et la documentation.
- **OS1: Moteur de Décision Déterministe**: Un cœur logique (`core/engine/obsidia_os2/metrics.py`) qui prend en entrée un ensemble de métriques et produit une décision (`ACT` ou `HOLD`) de manière déterministe et monotone.
- **OS2: Sceau Cryptographique (Seal Model)**: Un mécanisme (`proofkit/V15_GLOBAL_SEAL/`) qui garantit l'intégrité du code source. Il utilise une arborescence de Merkle pour agréger les hashes de tous les fichiers du dépôt en un seul `ROOT_HASH`, qui est ensuite combiné avec le hash du manifest pour produire un `GLOBAL_SEAL_HASH`.
- **OS3: Preuves Formelles (Lean)**: Un ensemble de preuves mathématiques (`lean/Obsidia/`) qui valident formellement des propriétés critiques du système, telles que la sensibilité de l'arbre de Merkle et la robustesse du consensus.
- **OS4: Validation Adversariale**: Une suite de tests (`tools/adversarial/`) qui simulent des attaques ciblées sur les composants clés du système pour vérifier empiriquement leur résistance.

L'ensemble de ces couches est interconnecté pour former un système cohérent où chaque `claim` de sécurité est soutenu par un ou plusieurs artefacts vérifiables.

---

## 3. Deterministic Decision Core

Le cœur du système OBSIDIA est son moteur de décision, conçu pour être simple, déterministe et prévisible. Il est défini par la fonction `decision_act_hold` dans `core/engine/obsidia_os2/metrics.py`.

La décision repose sur une unique métrique de synthèse, `S`, comparée à un seuil `theta_S`:

```python
def decision_act_hold(metrics: Metrics, theta_S: float = 0.25) -> str:
    return "ACT" if metrics.S >= theta_S else "HOLD"
```

Ce moteur respecte plusieurs invariants de sécurité fondamentaux, vérifiés par la suite de tests adversariaux :

| ID | Invariant | Description | Test de validation |
|:---|:---|:---|:---|
| **D1** | **Déterminisme** | Pour une même entrée `(metrics, theta_S)`, la sortie est toujours identique. | `test_threshold_fuzz.py` |
| **E2** | **Sécurité par défaut** | Si `S < theta_S`, la décision doit être `HOLD`. | `test_threshold_fuzz.py` |
| **G1** | **Activation au-dessus du seuil** | Si `S >= theta_S`, la décision doit être `ACT`. | `test_threshold_fuzz.py` |
| **G2** | **Activation à la frontière** | Si `S == theta_S`, la décision doit être `ACT` (inclusif). | `test_threshold_fuzz.py` |
| **G3** | **Monotonie** | Une augmentation de la métrique `S` ne peut pas produire une décision plus faible (i.e., passer de `ACT` à `HOLD`). | `test_monotonic_break.py` |

La validation de ces invariants par 1 million de tests aléatoires (`test_monotonic_break.py`) et un fuzzing précis de la frontière (`test_threshold_fuzz.py`) donne une confiance élevée dans la prévisibilité et la fiabilité du moteur.

---

## 4. Seal Model

Le modèle de sceau garantit que chaque bit du code source est pris en compte dans une empreinte cryptographique unique, le `GLOBAL_SEAL_HASH`. Ce sceau est basé sur le contenu des fichiers suivis par Git (`git-ls-files-only`), excluant les fichiers de cache, les secrets et les fichiers du sceau lui-même pour éviter les problèmes de bootstrap.

Le processus de scellement se déroule en trois étapes :

1.  **Manifest des Fichiers**: Un `MASTER_MANIFEST_V15.json` est créé. Il mappe chaque chemin de fichier (trié par ordre alphabétique) à son hash SHA-256.

2.  **Racine de Merkle (`ROOT_HASH`)**: Les hashes du manifest sont concaténés dans l'ordre des chemins de fichiers, et le résultat est haché pour produire le `ROOT_HASH`.
    -   `ROOT_RULE: sha256(concat(sorted(manifest_hashes_by_path)))`

3.  **Sceau Global (`GLOBAL_SEAL_HASH`)**: Le hash du fichier manifest et le hash du fichier contenant le `ROOT_HASH` sont combinés pour produire le sceau final.
    -   `GLOBAL_RULE: sha256(manifest_hash + newline + root_hash_file_hash + newline)`

Ce mécanisme garantit deux propriétés essentielles :

-   **Sensibilité Complète**: Toute modification, même d'un seul bit dans un fichier suivi, propage un changement jusqu'au `GLOBAL_SEAL_HASH`.
-   **Vérifiabilité**: Le script `seal_verify.py` permet à un tiers de recalculer indépendamment le sceau et de le comparer à la valeur déclarée, vérifiant ainsi l'intégrité de l'ensemble du code base en une seule commande.

---

## 5. Formal Proofs (Lean)

Pour atteindre un niveau de confiance supérieur, les propriétés les plus critiques du système sont formellement prouvées en utilisant l'assistant de preuve Lean 4. Ces preuves ne se contentent pas de tester un grand nombre de cas, mais démontrent mathématiquement la validité d'un `claim` pour *toutes* les entrées possibles.

Les preuves couvrent deux domaines principaux :

1.  **Sensibilité de l'Arbre de Merkle (`lean/Obsidia/Sensitivity.lean`)**:
    -   **Théorème `merkleRoot_change_if_leaf_change`**: Prouve que si deux listes de feuilles (hashes de fichiers) sont différentes, leurs racines de Merkle seront nécessairement différentes.
    -   **Théorème `P15_Immutability_Strong`**: Prouve que si deux `Repo` (représentant l'ensemble des fichiers) sont différents, leur `globalSeal` sera différent. Cela formalise la garantie de sensibilité de bout en bout.

2.  **Robustesse du Consensus (`lean/Obsidia/Consensus.lean`)**:
    -   **Théorème `aggregate4_fail_closed`**: Prouve par une analyse de cas exhaustive (3^4 = 81 cas) que l'agrégateur de consensus pour 4 nœuds ne retourne jamais `ACT` ou `HOLD` en l'absence d'une supermajorité de 3/4, mais se replie sur `BLOCK`.

Ces preuves éliminent toute incertitude sur le comportement de ces composants fondamentaux, sous réserve de la correction des axiomes (résistance aux collisions de SHA-256) et de l'implémentation du compilateur Lean.

---

## 6. Adversarial Validation

La validation adversariale (Phase 15.2) complète les preuves formelles en testant le système dans des conditions qui simulent des attaques réelles. L'objectif n'est pas de prouver que le système est parfait, mais de démontrer qu'il résiste à une batterie de tentatives de falsification systématiques et ciblées.

La suite de tests, orchestrée par `tools/adversarial/RUN_ALL_ADVERSARIAL.sh`, couvre six domaines d'attaque :

| ID | Test | Cible | Méthode | Résultat (v15.2) |
|:---|:---|:---|:---|:---|
| A1 | `test_monotonic_break` | Moteur de décision | 1M paires aléatoires (S1 ≤ S2) | ✅ PASS |
| A2 | `test_threshold_fuzz` | Moteur de décision | Fuzzing de la frontière θ_S ± 1e-12 | ✅ PASS |
| B1 | `test_merkle_collision` | Arbre de Merkle | 1M+ probes de collision | ✅ PASS |
| C1 | `test_seal_tamper` | Sceau V15.1 | Modification de 6 fichiers sans MAJ du manifest | ✅ PASS |
| D1 | `test_consensus_split` | Consensus 3/4 | Split 2/2 et analyse exhaustive | ✅ PASS |
| E1 | `test_signature_tamper` | Chaîne d'audit | 5 types de tamper sur `audit_log.jsonl` | ✅ PASS |

Le succès de l'ensemble de cette batterie de tests (`ALL TESTS PASSED`) démontre une résilience empirique robuste du système face aux vecteurs d'attaque les plus probables.

---

## 7. Threat Model & Assumptions

La sécurité d'OBSIDIA est évaluée dans le contexte d'un modèle de menace formel, défini dans `docs/security/THREAT_MODEL_v16.md`. Ce modèle identifie les actifs à protéger, les adversaires potentiels, les surfaces d'attaque et les hypothèses de sécurité fondamentales.

-   **Actifs Clés**: Intégrité du code, intégrité du sceau, immutabilité de l'audit log, déterminisme du moteur, robustesse du consensus.
-   **Adversaires Modélisés**: Développeur malveillant (accès en écriture), auditeur externe, opérateur de nœud corrompu, attaquant réseau (MITM).
-   **Surfaces d'Attaque**: Dépôt Git, scripts de sceau, moteur de décision, consensus, audit log, preuves Lean.
-   **Hypothèses Fondamentales**: Résistance aux collisions de SHA-256, non-forgeabilité de ED25519, intégrité de l'environnement d'exécution.

Le document `docs/security/PROOF_OBLIGATIONS_v16.md` établit une cartographie explicite entre chaque `claim` de sécurité (ex: "la modification d'un fichier est détectée") et les mécanismes de contrôle et de preuve qui le soutiennent. La vérification automatisée de ce modèle est assurée par le script `tools/verify_threat_model.py`.

---

## 8. Limitations

Malgré les garanties apportées, OBSIDIA possède des limitations inhérentes qui doivent être comprises.

1.  **Périmètre du Sceau**: Le sceau ne couvre que les fichiers explicitement suivis par `git-ls-files`. Les fichiers non suivis, les variables d'environnement ou l'état de la base de données externe ne font pas partie du sceau.
2.  **Confiance dans les Hypothèses**: La sécurité du système repose sur la validité des hypothèses cryptographiques (SHA-256, ED25519). Une avancée cryptanalytique pourrait invalider ces garanties.
3.  **Disponibilité**: Le modèle de menace ne couvre pas les attaques par déni de service. La disponibilité du système dépend de l'infrastructure sous-jacente (ex: GitHub, serveurs de nœuds).
4.  **Sécurité des Clés**: La sécurité de la chaîne d'audit dépend de la protection de la clé de signature privée `ed25519_private.key`. Sa compromission permettrait à un attaquant de falsifier des entrées de log.
5.  **Collusion du Consensus**: Le modèle de consensus 3/4 est vulnérable si 3 des 4 opérateurs de nœuds conspirent. La sécurité dépend de leur indépendance opérationnelle.

---

## 9. Reproducibility Instructions

La reproductibilité est un pilier central d'OBSIDIA. Un tiers doit être capable de vérifier indépendamment chaque `claim` présenté dans cet article.

### Reproductibilité de l'Audit Adversarial

Pour reproduire l'intégralité de la suite de tests adversariaux (Phase 15.2) :

```bash
# 1. Cloner le dépôt au tag correspondant
git clone https://github.com/Eaubin08/Obsidia-lab-trad.git
cd Obsidia-lab-trad
git checkout v15.2-final

# 2. Exécuter la suite de tests
bash tools/adversarial/RUN_ALL_ADVERSARIAL.sh
```

Le script doit se terminer avec le message `ALL TESTS PASSED`.

### Reproductibilité du Sceau

Pour vérifier l'intégrité du code base par rapport au sceau V15.1 :

```bash
# 1. Cloner le dépôt et se placer au tag correspondant
git checkout v15.1-final

# 2. Exécuter le script de vérification du sceau
python3 proofkit/V15_GLOBAL_SEAL/seal_verify.py
```

Le script doit se terminer avec le message `PASS`.

### Reproductibilité des Preuves Formelles

Pour compiler les preuves Lean :

```bash
# 1. Cloner le dépôt
git clone https://github.com/Eaubin08/Obsidia-lab-trad.git
cd Obsidia-lab-trad/lean

# 2. Construire le projet Lean
lake build
```

La compilation doit se terminer avec le message `Build completed successfully`.

---

## 10. Appendix: Artifact Index

Cet index référence les artefacts clés mentionnés dans ce document. Voir `docs/paper/ARTIFACT_INDEX_v16.md` pour un index plus détaillé.

| Artefact | Chemin | Description |
|:---|:---|:---|
| Moteur de décision | `core/engine/obsidia_os2/metrics.py` | Implémentation de `decision_act_hold`. |
| Script de vérification du sceau | `proofkit/V15_GLOBAL_SEAL/seal_verify.py` | Script pour valider l'intégrité du sceau. |
| Métadonnées du sceau V15.1 | `proofkit/V15_GLOBAL_SEAL/SEAL_META_V15.json` | Contient le `GLOBAL_SEAL_HASH` et les règles. |
| Preuve de sensibilité Merkle | `lean/Obsidia/Sensitivity.lean` | Preuve formelle de l'immutabilité. |
| Preuve de consensus | `lean/Obsidia/Consensus.lean` | Preuve formelle de la robustesse du consensus. |
| Orchestrateur adversarial | `tools/adversarial/RUN_ALL_ADVERSARIAL.sh` | Script principal pour l'audit adversarial. |
| Modèle de menace | `docs/security/THREAT_MODEL_v16.md` | Modèle de menace formel du système. |
| Manifeste de menaces | `docs/security/threat_manifest_v16.json` | Version machine-readable du modèle de menace. |
| Vérificateur de menaces | `tools/verify_threat_model.py` | Script pour valider les `claims` du modèle de menace. |
