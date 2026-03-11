# OBSIDIA — Threat Model v16

**Version**: 1.0  
**Date**: 2026-03-03T15:30:00Z  
**Statut**: Draft

---

## 1. Scope

Ce document modélise les menaces contre l'intégrité, la non-répudiation et la reproductibilité du système OBSIDIA, tel que défini dans le dépôt `Eaubin08/Obsidia-lab-trad` au tag `v15.2-final`.

### In-Scope

- **Intégrité du code source** : Toute modification non autorisée des fichiers suivis par Git.
- **Intégrité du sceau** : Toute altération du `GLOBAL_SEAL_HASH` et de ses composants (`ROOT_HASH`, `MASTER_MANIFEST`).
- **Reproductibilité de la décision** : La capacité de recalculer la même décision à partir des mêmes entrées.
- **Non-répudiation** : L'impossibilité pour une partie de nier avoir soumis une décision enregistrée dans l'audit log.
- **Consensus** : La robustesse du mécanisme de consensus 3/4 face à des votes divergents.

### Out-of-Scope

- **Disponibilité du service** : Attaques par déni de service (DoS/DDoS) contre l'API ou les nœuds de consensus.
- **Sécurité de l'infrastructure sous-jacente** : Compromission de l'OS, du matériel, du réseau, ou de la plateforme d'hébergement (GitHub, Docker Hub).
- **Sécurité des dépendances** : Vulnérabilités dans les bibliothèques tierces (Python, Lean, nacl).
- **Confidentialité des données** : Le système est conçu pour être transparent ; les données ne sont pas considérées comme confidentielles.
- **Gestion des clés privées** : Compromission de la clé `ed25519_private.key`.

---

## 2. Assets

Les actifs à protéger sont des propriétés immatérielles du système.

| ID | Asset | Description |
|----|-------|-------------|
| A-01 | **Intégrité du code** | Le code source correspond exactement à ce qui est scellé dans le manifest. |
| A-02 | **Intégrité du sceau** | Le `GLOBAL_SEAL_HASH` représente fidèlement l'état du code source. |
| A-03 | **Immutabilité de l'audit log** | Une fois enregistrée, une entrée de l'audit log ne peut être modifiée sans invalider la chaîne. |
| A-04 | **Déterminisme du moteur** | La fonction `decision_act_hold` est déterministe et monotone. |
| A-05 | **Robustesse du consensus** | Le consensus ne peut produire `ACT` sans une supermajorité de 3/4. |
| A-06 | **Validité des preuves formelles** | Les théorèmes prouvés en Lean sont corrects et pertinents. |

---

## 3. Adversaries

| ID | Adversaire | Capacités | Motivations |
|----|------------|-----------|-------------|
| ADV-01 | **Développeur malveillant** | Accès en écriture au dépôt Git ; peut modifier le code, les sceaux, les scripts. | Sabotage, introduction de backdoors, discrédit du projet. |
| ADV-02 | **Auditeur externe sceptique** | Accès en lecture seule au dépôt ; peut exécuter tous les scripts de vérification. | Trouver des failles, prouver que le système n'est pas fiable. |
| ADV-03 | **Opérateur de nœud corrompu** | Contrôle total d'un ou deux nœuds de consensus (sur quatre). | Forcer une décision `ACT` ou `HOLD` illégitime, bloquer le consensus. |
| ADV-04 | **Attaquant réseau (MITM)** | Peut intercepter et modifier les communications entre les nœuds ou avec l'API. | Falsifier les décisions, injecter des données malveillantes. |

---

## 4. Attack Surfaces

| ID | Surface d'attaque | Description |
|----|-------------------|-------------|
| AS-01 | **Dépôt Git** | `git push` direct, modification des tags, réécriture de l'historique. |
| AS-02 | **Scripts de sceau** | `generate_seal.py`, `seal_verify.py` ; manipulation des exclusions, des règles de hachage. |
| AS-03 | **Moteur de décision** | `obsidia_os2/metrics.py` ; introduction de non-déterminisme, violation de la monotonie. |
| AS-04 | **Consensus** | `distributed/aggregator.py`, `lean/Obsidia/Consensus.lean` ; manipulation de la logique de vote. |
| AS-05 | **Audit Log** | `core/api/audit_log.jsonl` ; modification manuelle des entrées, rupture de la chaîne de hashes. |
| AS-06 | **Preuves Lean** | Fichiers `.lean` ; introduction d'axiomes faibles ou incorrects, modification des théorèmes. |

---

## 5. Assumptions

| ID | Assumption | Justification |
|----|------------|---------------|
| ASM-01 | **Résistance aux collisions de SHA-256** | L'algorithme SHA-256 est considéré comme résistant aux collisions (second pre-image). | Standard de l'industrie, aucune collision connue à ce jour. |
| ASM-02 | **Sécurité de ED25519** | L'algorithme de signature ED25519 est considéré comme non forgeable. | Standard cryptographique moderne. |
| ASM-03 | **Intégrité de l'environnement d'exécution** | Le système d'exploitation et le matériel sur lesquels les scripts s'exécutent ne sont pas compromis. | Hors du périmètre du modèle de menace applicatif. |
| ASM-04 | **Disponibilité et intégrité de GitHub** | GitHub préserve l'intégrité des commits et des tags une fois poussés. | Acteur de confiance dans l'écosystème de développement. |

---

## 6. Security Invariants

| ID | Invariant | Description |
|----|-----------|-------------|
| INV-01 | **Intégrité du sceau** | `seal_verify.py` doit échouer si un fichier du manifest est modifié. |
| INV-02 | **Sensibilité Merkle** | Toute modification d'un fichier tracké doit entraîner un changement du `ROOT_HASH`. |
| INV-03 | **Sensibilité globale** | Toute modification du `ROOT_HASH` doit entraîner un changement du `GLOBAL_SEAL_HASH`. |
| INV-04 | **Monotonie du moteur** | `decision(S1) <= decision(S2)` si `S1 <= S2`. |
| INV-05 | **Fail-closed du consensus** | En l'absence de supermajorité 3/4, la décision est `BLOCK`. |
| INV-06 | **Intégrité de la chaîne d'audit** | Toute modification d'une entrée dans `audit_log.jsonl` invalide la chaîne de hashes. |

---

## 7. Controls

| ID | Contrôle | Description | Invariants couverts |
|----|----------|-------------|--------------------|
| C-01 | **Global Seal (V15.1)** | Sceau cryptographique de l'état du dépôt via une chaîne de hashes (manifest → root → global). | INV-01, INV-02, INV-03 |
| C-02 | **Preuves formelles (Lean)** | Preuves mathématiques de la sensibilité Merkle et de la robustesse du consensus. | INV-02, INV-05 |
| C-03 | **Audit adversarial (V15.2)** | Suite de tests automatisés simulant des attaques sur les composants clés. | INV-01, INV-02, INV-04, INV-05, INV-06 |
| C-04 | **Chaîne de hashes de l'audit log** | Chaque entrée de log est liée à la précédente par un hash, empêchant toute modification inaperçue. | INV-06 |
| C-05 | **Consensus 3/4** | Algorithme de consensus qui garantit qu'aucune décision ne peut être prise sans une supermajorité. | INV-05 |

---

## 8. Residual Risks

| ID | Risque résiduel | Description | Mitigation possible |
|----|-----------------|-------------|---------------------|
| RR-01 | **Compromission de la clé de signature** | Un attaquant obtenant `ed25519_private.key` peut signer de fausses entrées de log. | Stockage de la clé dans un HSM (Hardware Security Module). |
| RR-02 | **Collusion de 3 nœuds sur 4** | Si 3 opérateurs de nœuds conspirent, ils peuvent forcer n'importe quelle décision. | Diversité des opérateurs, surveillance externe. |
| RR-03 | **Vulnérabilité 0-day dans une dépendance** | Une faille dans `nacl` ou `hashlib` pourrait casser les assumptions cryptographiques. | Veille sécuritaire, mises à jour régulières. |
| RR-04 | **Erreur dans les preuves Lean** | Une erreur logique non détectée dans les preuves formelles pourrait invalider les garanties. | Audit externe des preuves par des experts Lean. |

---

## 9. Verification

| Claim | Mécanisme de vérification | Commande |
|-------|---------------------------|----------|
| Intégrité du code et du sceau | Script de vérification du sceau | `python3 proofkit/V15_GLOBAL_SEAL/seal_verify.py` |
| Robustesse des invariants | Suite de tests adversariaux | `bash tools/adversarial/RUN_ALL_ADVERSARIAL.sh` |
| Correction des preuves formelles | Compilation par le compilateur Lean | `cd lean/ && lake build` |
| Intégrité de la chaîne d'audit | Test adversarial de tamper | `python3 tools/adversarial/test_signature_tamper.py` |
