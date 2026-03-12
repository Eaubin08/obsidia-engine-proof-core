# Obsidia Engine — Proof Core

> **Version :** 1.3.0 · **Date :** 2026-03-11 · **Statut :** Exécutable · Auditable · Reproductible

**Obsidia Engine** est un moteur décisionnel déterministe gouverné par invariants formels. Ses décisions sont auditées cryptographiquement et vérifiables par un tiers indépendant.

Ce dépôt constitue le noyau de preuve public du projet : il contient le code source exécutable, les spécifications formelles, les tests à grande échelle et les artefacts cryptographiques qui démontrent les propriétés du moteur.

---

## Licence et protection intellectuelle

Ce projet est publié sous licence **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

| Usage | Statut |
|---|---|
| Lecture, étude, audit, citation académique | ✅ Autorisé |
| Partage du lien et référencement public | ✅ Autorisé |
| Usage commercial | ❌ Interdit sans accord écrit préalable |
| Modification, fork ou travaux dérivés | ❌ Interdit sans accord écrit préalable |
| Réutilisation du code dans d'autres projets | ❌ Interdite sans accord écrit préalable |

**Propriétaire intellectuel :** Eaubin · Projet Obsidia · 2024–2026

Pour toute demande de licence commerciale, partenariat ou collaboration de recherche, ouvrir une issue ou contacter directement via GitHub.

Voir [`LICENSE`](./LICENSE) et [`NOTICE.md`](./NOTICE.md) pour les termes complets.

---

## Ce que ce projet démontre

Ce projet explore une question fondamentale en ingénierie logicielle :

> Peut-on construire un système dont les décisions sont **déterministes**, **gouvernées par invariants formels**, **auditées cryptographiquement** et **vérifiables par un tiers** ?

La réponse apportée par ce dépôt est affirmative. Chaque propriété est démontrée par des artefacts exécutables et vérifiables — pas seulement affirmée dans une documentation.

---

## Résultats vérifiés (v1.3.0)

Tous les résultats ci-dessous ont été rejoués en environnement réel le 2026-03-11. Le log brut complet est disponible dans [`EXECUTION_LOG_v1.3.0.txt`](./EXECUTION_LOG_v1.3.0.txt).

| Couche | Commande | Résultat | Exit |
|---|---|---|---|
| Tests Python | `pytest -q tests/` | **12/12 PASS** | 0 |
| Tests TypeScript | `pnpm test` | **39/39 PASS** | 0 |
| Pipeline Trading | `run_pipeline.py trading` | **ALLOW** | 0 |
| Pipeline Bank normal | `run_pipeline.py bank` | **ALLOW** | 0 |
| Pipeline Bank suspect | `run_pipeline.py bank` | **BLOCK** (FRAUD_PATTERN) | 0 |
| Pipeline E-commerce | `run_pipeline.py ecom` | **ALLOW** | 0 |
| Proofkit global | `python3 proofs/verify_all.py` | **PASS** | 0 |
| Ancre RFC 3161 v1.0 | `openssl ts -verify` | **Verification: OK** | 0 |
| Ancre RFC 3161 v1.1.0 | `openssl ts -verify` | **Verification: OK** | 0 |
| Consensus in-process | `test_consensus_inprocess.py` | **fail-closed VERIFIED** | 0 |
| Adversarial A1 | 1 000 000 paires — invariant G3 | **0 violation** | 0 |
| Adversarial A2 | 144 probes boundary | **0 flip** | 0 |
| Adversarial B1 | 1 049 881 probes Merkle | **0 collision** | 0 |
| Adversarial C1 | 3 attaques seal tamper | **3/3 détectés** | 0 |
| Adversarial D1 | 141 cas consensus | **0 violation fail-closed** | 0 |
| Adversarial E1 | 5 types signature tamper | **5/5 détectés** | 0 |
| TLA+ X108 | TLC — 97 656 états | **No error** | 0 |
| TLA+ DistributedX108 | TLC — 1 255 520 états | **No error** | 0 |
| Lean 4 | `lake build` — 0 sorry | **Build completed** | 0 |
| Bootstrap | `bash bootstrap.sh` | **ALL CHECKS COMPLETE** | 0 |

---

## Architecture du moteur

Le moteur est organisé en quatre versions successives (OS0 → OS3), chacune ajoutant une couche de capacité au-dessus de la précédente.

**OS0** définit le langage intermédiaire (IR) avec 7 types de nœuds et le validateur de contrat (règles R1–R10). Toute entrée qui passe la validation produit un IR structurellement correct. Le sandbox garantit l'isolation et le rollback sur violation.

**OS1** ajoute le pipeline complet parse → validate → X108 check → décision. La Gate X-108 applique la règle de délai temporel : un intent irréversible ne peut pas obtenir `ACT` avant 108 secondes.

**OS2** introduit les métriques quantitatives et la décision par seuil. C'est le modèle formalisé en Lean 4 : `decision(m, theta) = ACT si theta ≤ S, HOLD sinon`. Tous les invariants D1/E2/G1/G2/G3 sont des propriétés de cette fonction.

**OS3** ajoute la séparation des composants, les métriques étendues et la génération de visualisations SVG.

Le **Guard X-108** est le composant de gouvernance central. Il applique cinq règles de blocage : délai temporel (108s), contradictions entre agents, flags de risque critiques (`FRAUD_PATTERN`, `LIMIT_PRESSURE`), seuil de confiance et règle de non-anticipation.

Les **51 agents domaine** sont organisés en trois domaines : Trading (10 agents), Bank (8 agents), E-commerce (6 agents), complétés par des agents Meta (10 agents) pour la coordination et la détection de contradictions.

---

## Propriétés formelles démontrées

### Invariants du noyau — Lean 4 (0 sorry)

| Invariant | Théorème | Énoncé |
|---|---|---|
| D1 — Déterminisme | `D1_determinism` | La fonction `decision` est pure et déterministe |
| E2 — Non-anticipation | `E2_no_act_below_threshold` | Jamais `ACT` avant le seuil theta_S |
| G1 — Décision au seuil | `G1_act_above_threshold` | Si `theta ≤ S` alors `decision = ACT` |
| G2 — Frontière inclusive | `G2_boundary_inclusive` | Si `S = theta` alors `decision = ACT` |
| G3 — Monotonie | `G3_monotonicity` | Si `S₁ ≤ S₂` alors `decision(S₁) ≤ decision(S₂)` |
| L11.3 — Isolation BLOCK | `L11_3_no_block` | Le noyau OS2 ne produit jamais `BLOCK` — seul le Guard peut bloquer |

### Spécifications TLA+ — TLC model checking

**X108.tla** — `SafetyX108` : aucun état atteignable où un intent irréversible obtient `ACT` avant le délai de 108 secondes. Vérifié sur **97 656 états**.

**DistributedX108.tla** — `SafetyDistributed` : avec N=3f+1 nœuds et jusqu'à f byzantins, si la gate doit tenir sur les nœuds honnêtes, la décision globale n'est jamais `ACT`. Vérifié sur **1 255 520 états**.

### Tests adversariaux Phase 15.2

| Batterie | Ampleur | Résultat |
|---|---|---|
| A1 — Monotonie G3 | 1 000 000 paires aléatoires | **0 violation** |
| A2 — Boundary fuzz | 144 probes ± 1e-12 autour de theta_S | **0 flip sémantique** |
| B1 — Collision Merkle | 1 049 881 probes SHA-256 | **0 collision** |
| C1 — Seal tamper | 3 types d'attaque sur V18.3.1 | **3/3 détectés** |
| D1 — Consensus split | 141 cas exhaustifs | **0 violation fail-closed** |
| E1 — Signature tamper | 5 types de modification de chaîne d'audit | **5/5 détectés** |

---

## Ancrage cryptographique

L'intégrité du moteur est ancrée par deux mécanismes complémentaires.

Le **Merkle Root** couvre l'ensemble des fichiers critiques du moteur. Tout fichier modifié invalide le hash calculé, détectable immédiatement par `python3 proofs/verify_merkle.py`.

L'**ancre RFC 3161** (Free TSA) établit une preuve temporelle cryptographique de l'existence du moteur à une date donnée. Deux sceaux sont présents dans ce dépôt : le sceau original du **3 mars 2026 à 16:43:06 UTC**, et le sceau v1.1.0 du **11 mars 2026**. Vérification : `openssl ts -verify`.

---

## Démarrage rapide

```bash
# Cloner le dépôt
git clone https://github.com/Eaubin08/obsidia-engine-proof-core.git
cd obsidia-engine-proof-core

# Bootstrap complet (installe les dépendances, lance les tests, vérifie le proofkit)
bash bootstrap.sh
```

**Résultat attendu :**
```
[1/5] Python deps...        OK
[2/5] Pipeline trading...   ALLOW ✓
[3/5] pytest tests/...      12/12 PASS ✓
[4/5] verify_all.py...      PASS ✓
[5/5] verify_merkle.py...   VALID ✓

ALL CHECKS COMPLETE
```

**Commandes individuelles :**
```bash
# Pipelines agents
python3 agents/run_pipeline.py trading examples/trading_bullish.json
python3 agents/run_pipeline.py bank    examples/bank_normal.json
python3 agents/run_pipeline.py bank    examples/bank_suspicious.json
python3 agents/run_pipeline.py ecom    examples/ecom_normal.json

# Tests Python
python3 -m pytest -q tests/

# Tests TypeScript
pnpm install && pnpm test

# Vérification proofkit global
python3 proofs/verify_all.py

# Vérification RFC 3161
openssl ts -verify \
  -in proofs/anchors/rfc3161_v110.tsr \
  -data proofs/anchors/merkle_root_v110.json \
  -CAfile proofs/anchors/freetsa_ca.pem
```

---

## Structure du dépôt

```
engine/          ← Noyau Python OS0/OS1/OS2/OS3 + kernel + runtime + bus
agents/          ← 51 agents domaine (Trading, Bank, Ecom, Meta) + Guard X-108
governance/      ← Contrats TypeScript, agrégation, gates
automation/      ← Pipeline CLI + bridge TypeScript
tests/           ← Tests Python (12) + TypeScript (39) + adversariaux Phase 15.2
proofs/
  lean/          ← Preuves formelles Lean 4 (8 théorèmes, 0 sorry)
  tla/           ← Spécifications TLA+ (X108 + DistributedX108)
  V18_3_1/       ← Proofkit scellé v18.3.1 (root seal)
  V18_7/         ← Proofkit v18.7 (non-circumvention, 200k fuzz)
  V18_8/         ← Proofkit v18.8 (convergence, stabilité)
  anchors/       ← Ancres RFC 3161 + OTS
  verify_all.py  ← Vérification globale du proofkit
  verify_merkle.py   ← Vérification intégrité Merkle
  verify_decision.py ← Vérification d'un CanonicalDecisionEnvelope
distributed/     ← Consensus distribué (in-process + Docker)
examples/        ← 4 cas JSON reproductibles
scripts/         ← generate_hashes.py + verify_hashes.py
hashes/          ← SHA-256 des fichiers moteur
docs/            ← Rapports et documentation
```

---

## Perspectives d'usage

Les exemples présents dans ce dépôt (Trading, Banque, E-commerce) constituent des bancs d'essai techniques pour démontrer le fonctionnement du moteur. Ils ne sont pas des produits métier.

Les propriétés explorées — gouvernance par invariants, décisions auditées et scellées cryptographiquement — ouvrent des perspectives dans plusieurs domaines où la fiabilité des décisions logicielles est critique. Les domaines ci-dessous ne sont pas des implémentations existantes dans ce dépôt, mais des pistes d'application possibles.

**Finance et régulation.** Un moteur capable de refuser automatiquement certaines décisions selon des règles formelles pourrait servir de couche de gouvernance pour la validation de transactions, le contrôle de conformité ou l'audit automatique des décisions prises par des systèmes financiers. L'intérêt serait de produire des décisions traçables et vérifiables, plutôt que des processus opaques. Les institutions concernées incluent les banques d'investissement, les banques centrales et les régulateurs financiers.

**Trading algorithmique et finance quantitative.** Un moteur gouverné par invariants pourrait servir de garde de sécurité logique autour de stratégies automatisées : empêcher certaines décisions lorsque des contradictions apparaissent, limiter certaines actions selon des contraintes formelles, produire un historique auditable des décisions. Les acteurs concernés incluent les hedge funds, les plateformes de trading algorithmique et les plateformes crypto ou DeFi.

**Paiement et e-commerce.** Une gouvernance décisionnelle pourrait détecter et bloquer certaines transactions suspectes avant exécution, tout en laissant passer les transactions normales. Le principe serait d'intégrer une sentinelle logique dans les flux transactionnels. Les acteurs concernés incluent les réseaux de paiement, les marketplaces et les processeurs de transactions.

**Audit et cybersécurité.** Un système qui scelle ses décisions et son état pourrait servir de journal technique vérifiable, facilitant les audits ou les investigations. Il permettrait de prouver qu'une règle a été appliquée, qu'une décision a été refusée, que le code n'a pas été modifié. Les acteurs concernés incluent les cabinets d'audit, les enquêteurs financiers et les assurances cyber.

**Systèmes critiques et autonomes.** Dans certains systèmes automatisés, un moteur capable de refuser certaines actions selon des règles strictes pourrait servir de couche de sécurité supplémentaire pour éviter des décisions dangereuses. Les acteurs concernés incluent les opérateurs d'infrastructures, les réseaux énergétiques et les systèmes autonomes.

Ce projet ne vise pas à fournir un produit métier clé en main. Il explore une idée plus générale : un système logiciel peut être conçu pour produire des décisions qui sont déterministes, auditables, gouvernées par invariants et vérifiables par un tiers.

---

## Limites déclarées

Ce dépôt est honnête sur ce qu'il ne démontre pas encore. Le consensus HTTP multi-processus (4 nœuds FastAPI sur ports distincts) n'a pas été rejoué dans ce sandbox — la démo in-process (threads Python) passe, mais la démo réseau réelle nécessite Docker (`distributed/docker-compose.yml` fourni). Les tests adversariaux ont été rejoués sur données synthétiques. La résistance aux attaques adversariales sophistiquées n'est pas couverte.

Le document complet des limites est dans [`LIMITS.md`](./LIMITS.md).

---

## Documents de référence

| Document | Contenu |
|---|---|
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Architecture détaillée OS0→OS3, Guard X-108, agents |
| [`INVARIANTS.md`](./INVARIANTS.md) | Définition formelle des 5 invariants D1/E2/G1/G2/G3 |
| [`EXECUTION.md`](./EXECUTION.md) | Guide d'exécution détaillé |
| [`TEST_MATRIX.md`](./TEST_MATRIX.md) | Matrice complète des tests avec résultats |
| [`REAL_CASES.md`](./REAL_CASES.md) | 4 cas reproductibles avec sorties attendues |
| [`CHALLENGE_PROTOCOL.md`](./CHALLENGE_PROTOCOL.md) | Protocole pour challenger les preuves |
| [`AUDIT_GUIDE.md`](./AUDIT_GUIDE.md) | Guide pratique pour un auditeur externe |
| [`LIMITS.md`](./LIMITS.md) | Ce qui n'est pas encore démontré |
| [`MANIFEST.md`](./MANIFEST.md) | Inventaire complet des fichiers |
| [`EXECUTION_LOG_v1.3.0.txt`](./EXECUTION_LOG_v1.3.0.txt) | Log brut complet de toutes les exécutions |

---

## Citation

Si tu utilises ce travail dans un contexte académique ou de recherche :

```
Eaubin. Obsidia Engine — Proof Core (v1.3.0).
GitHub, 2026. https://github.com/Eaubin08/obsidia-engine-proof-core
```

---

*Projet Obsidia · © 2024–2026 Eaubin · Tous droits réservés · Licence CC BY-NC-ND 4.0*
