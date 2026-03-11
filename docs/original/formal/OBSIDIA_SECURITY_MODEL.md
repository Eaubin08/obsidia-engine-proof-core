# OBSIDIA — Security Model (Phase 18)

**Version**: 1.0  
**Date**: 2026-03-03  
**Statut**: Draft

> Ce document définit le modèle de sécurité formel pour le système OBSIDIA, en s'appuyant sur le [modèle de système formel (Phase 17)](./OBSIDIA_SYSTEM_MODEL.md).

---

## 1. Attacker Model

Un adversaire `A` est une entité probabiliste en temps polynomial (PPT) qui interagit avec le système OBSIDIA via ses interfaces publiques. Nous définissons les capacités de l'adversaire comme suit :

| ID | Capacité | Description | Formalisation |
|:---|:---|:---|:---|
| **C1** | **Contrôle des entrées** | L'adversaire peut soumettre n'importe quelle entrée `I` de son choix au système. | `∀ i ∈ I, A peut soumettre i` |
| **C2** | **Manipulation du Dépôt** | L'adversaire peut modifier, ajouter ou supprimer n'importe quel fichier dans une copie locale du `Repo` `R`. | `A peut produire R' à partir de R` |
| **C3** | **Manipulation du Log** | L'adversaire peut tenter de modifier ou de forger des enregistrements dans une copie de l' `AuditLog` `A`. | `A peut produire A' à partir de A` |

**Non-capacités** : L'adversaire ne peut pas :
-   Casser les primitives cryptographiques (SHA-256, ED25519).
-   Accéder à la clé de signature privée `ed25519_private.key`.
-   Compromettre l'environnement d'exécution (OS, matériel).

---

## 2. Security Goals

Les objectifs de sécurité décrivent les propriétés que le système doit maintenir, même en présence d'un adversaire.

| ID | Objectif | Description |
|:---|:---|:---|
| **G1** | **Déterminisme de la Décision** | Une même entrée `I` et un même état `S` doivent toujours produire la même décision `D` du kernel. |
| **G2** | **Détection de Falsification (Repo)** | Toute modification non autorisée du `Repo` `R` doit être détectée. |
| **G3** | **Intégrité de l'Audit** | Toute modification non autorisée de l' `AuditLog` `A` doit être détectée. |

---

## 3. Security Games

Nous formalisons les objectifs de sécurité à travers des jeux entre un `Challenger` (le système) et un `Adversaire` `A`. L'adversaire gagne s'il parvient à briser une propriété de sécurité.

### 3.1. Game 1: Seal Forgery (Jeu de Falsification du Sceau)

Ce jeu formalise l'objectif **G2 (Détection de Falsification)**.

1.  **Setup**: Le `Challenger` choisit un `Repo` `R` et calcule son sceau `σ ← Σ(R)`. Il donne `(R, σ)` à l'adversaire `A`.
2.  **Challenge**: L'adversaire `A` produit un nouveau `Repo` `R'`. 
3.  **Condition de victoire**: L'adversaire gagne si et seulement si `R' ≠ R` **ET** `Σ(R') = σ`.

**Revendication de sécurité (Security Claim)**: La probabilité que n'importe quel adversaire `A` gagne le jeu `Seal Forgery` est négligeable.

**Justification**: Gagner ce jeu implique de trouver une seconde pré-image pour la fonction de hachage SHA-256 (utilisée dans l'arbre de Merkle), ce qui est considéré comme calculatoirement infaisable.

**Artefact de test**: `tools/adversarial/test_merkle_collision.py` et `tools/adversarial/test_seal_tamper.py`.

### 3.2. Game 2: Audit Forgery (Jeu de Falsification de l'Audit)

Ce jeu formalise l'objectif **G3 (Intégrité de l'Audit)**.

1.  **Setup**: Le `Challenger` génère un `AuditLog` `A` valide, où chaque enregistrement est signé et chaîné au précédent.
2.  **Challenge**: L'adversaire `A` reçoit `A` et tente de produire un `AuditLog` `A'`.
3.  **Condition de victoire**: L'adversaire gagne si `A' ≠ A` **ET** `verify_audit_chain(A') = PASS`.

**Revendication de sécurité**: La probabilité qu'un adversaire `A` (qui ne possède pas la clé privée) gagne le jeu `Audit Forgery` est négligeable.

**Justification**: Gagner ce jeu implique soit de forger une signature ED25519 (calculatoirement infaisable), soit de trouver une collision de hash SHA-256 dans la chaîne de hachage des enregistrements.

**Artefact de test**: `tools/adversarial/test_signature_tamper.py`.

### 3.3. Game 3: Determinism Violation (Jeu de Violation du Déterminisme)

Ce jeu formalise l'objectif **G1 (Déterminisme de la Décision)**.

1.  **Setup**: Le `Challenger` définit un état `S` et une entrée `I`.
2.  **Challenge**: L'adversaire `A` demande au `Challenger` d'exécuter deux fois la transition `T(S, I)` pour obtenir `(D1, S1)` et `(D2, S2)`.
3.  **Condition de victoire**: L'adversaire gagne si `D1 ≠ D2` ou `S1 ≠ S2`.

**Revendication de sécurité**: La probabilité qu'un adversaire `A` gagne ce jeu est nulle.

**Justification**: La fonction de transition `T` est composée de fonctions pures. Le théorème `P17_Determinism` prouve formellement cette propriété.

**Artefact de test**: `tools/adversarial/test_monotonic_break.py` et `test_threshold_fuzz.py` (qui testent des aspects du déterminisme du moteur sous-jacent).

---

## 4. Conclusion

Ce modèle de sécurité formalise les garanties offertes par OBSIDIA. Il établit que, sous des hypothèses cryptographiques standards, un adversaire ne peut pas compromettre l'intégrité du code ou de l'audit, ni le déterminisme des décisions. Ces revendications sont soutenues par des preuves formelles en Lean et validées empiriquement par une suite de tests adversariaux.
