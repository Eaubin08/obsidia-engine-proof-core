> Ce document est une annexe du [THREAT_MODEL_v16.md](./THREAT_MODEL_v16.md) et doit être lu conjointement.

# OBSIDIA — Proof Obligations Map v16

Ce tableau cartographie chaque revendication de sécurité (*claim*) aux éléments du modèle de menace, aux contrôles mis en place, et aux preuves ou tests qui la valident.

| ID | Claim | Adversary | Surface | Assumption | Mechanism | Proof/Tests | Artifact | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **TM-01** | La modification d'un fichier scellé est détectée. | ADV-01 | AS-01, AS-02 | ASM-01 | C-01 | `test_seal_tamper.py` | `tools/adversarial/ADVERSARIAL_RESULTS.md` | ✅ PASS |
| **TM-02** | La dérive du contenu d'un repo (fichiers trackés) modifie le `ROOT_HASH`. | ADV-01 | AS-01, AS-02 | ASM-01 | C-01, C-02 | `test_merkle_collision.py` | `tools/adversarial/ADVERSARIAL_RESULTS.md` | ✅ PASS |
| **TM-03** | Un consensus partagé (ex: 2 ACT / 2 HOLD) résulte en un état sûr (`BLOCK`). | ADV-03 | AS-04 | - | C-02, C-05 | `test_consensus_split.py` | `tools/adversarial/ADVERSARIAL_RESULTS.md` | ✅ PASS |
| **TM-04** | La modification d'une entrée de l'audit log invalide la chaîne de hachage. | ADV-01, ADV-04 | AS-05 | ASM-01 | C-04 | `test_signature_tamper.py` | `tools/adversarial/ADVERSARIAL_RESULTS.md` | ✅ PASS |
| **TM-05** | La modification d'une feuille de l'arbre de Merkle modifie la racine. | ADV-01, ADV-02 | AS-06 | ASM-01 | C-02 | `lean/Obsidia/Sensitivity.lean` | `lean/lake-manifest.json` | ✅ PASS |
| **TM-06** | Le moteur de décision est monotone (une augmentation de `S` ne peut affaiblir la décision). | ADV-01 | AS-03 | - | C-03 | `test_monotonic_break.py` | `tools/adversarial/ADVERSARIAL_RESULTS.md` | ✅ PASS |
| **TM-07** | Le moteur de décision est déterministe à la frontière `theta_S`. | ADV-01, ADV-02 | AS-03 | - | C-03 | `test_threshold_fuzz.py` | `tools/adversarial/ADVERSARIAL_RESULTS.md` | ✅ PASS |
| **TM-08** | La modification du `ROOT_HASH` modifie le `GLOBAL_SEAL_HASH`. | ADV-01 | AS-02 | ASM-01 | C-01 | `seal_verify.py` | `proofkit/V15_GLOBAL_SEAL/SEAL_META_V15.json` | ✅ PASS |
