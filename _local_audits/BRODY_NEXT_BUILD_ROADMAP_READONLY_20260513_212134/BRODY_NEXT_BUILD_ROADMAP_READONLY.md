# BRODY_NEXT_BUILD_ROADMAP_READONLY
**Timestamp :** 20260513_212134  
**Source :** BRODY_SESSION_CHECKPOINT_20260513_FINAL  
**Mode :** ROADMAP ONLY — NO_BUILD — NO_COMMIT — NO_FREEZE — NO_PUSH  
**Autorité :** KX108_ONLY

---

## 1. ÉTAT VALIDÉ

Tout ce qui suit est prouvé par audit local avec smoke tests PASS.

| Composant | Audit | Résultat | Smoke |
|---|---|---|---|
| Context packet chain QUERY→CONSUMER→ENGINE | BRODY_CONTEXT_PACKET_CHAIN_TEST_READONLY_20260513_192629 | **CHAIN_PASS** | — |
| API 8011 / ObsidiaShell | preflight step8 + BRODY_MEMORY_CONTEXT_OPERATOR | **LIVE FROZEN_READONLY** | — |
| Graphiti V20 frozen | API /graph/v20/frozen/status | **FROZEN_READONLY** nodes=167, rels=477 | — |
| Neo4j BrodyMemoryDoc | BRODY_API_MEMORY_CONTEXT_READONLY_20260513_194604 | **LIVE** 3267 nodes — LOW_MATERIAL | — |
| User memory candidate (auto_triage) | BRODY_USER_MEMORY_INTAKE_CANDIDATE_READONLY V2 | **PARTIAL_PASS** | 48/48 |
| External fetch GET-only | BRODY_EXTERNAL_FETCH_READONLY_OPERATOR_TEST_20260513_203216 | **PASS** | 67/67 |
| Operator full loop (5 scénarios) | BRODY_OPERATOR_FULL_LOOP_TEST_READONLY_20260513_204510 | **PASS** | 115/115 |
| Decision report 16 composants | BRODY_REAL_STATE_DECISION_REPORT_READONLY_20260513_205557 | **PASS** | 62/62 |
| Commit candidate audit | BRODY_COMMIT_CANDIDATE_AUDIT_READONLY_20260513_211832 | **DONE** | — |
| Sigma dirty restore | SIGMA_TOOLS_DIRTY_REVERT_APPLIED_READONLY_20260513_210248 | **DONE** | — |
| X108 repo | git status x108-proofs | **CLEAN** | — |
| verify_all.py | proofs/verify_all.py | **PASS** | — |

**Brody = LLM obsidien.** N'exécute pas, n'autorise pas, ne décide pas. KX108_ONLY sur 100% des modules.

---

## 2. CE QUI RESTE NON FAIT

### A. LOW_MATERIAL — coalesce Cypher manquant `text_preview`

| Champ | Valeur |
|---|---|
| Cause | `brody_context_packet_query_readonly_v1.py` — coalesce utilise `text,content,body,excerpt,summary,preview` mais pas `text_preview` |
| Impact | 3267/3267 nodes ont `text_preview` mais zéro résultat de texte → excerpts vides dans le contexte Brody |
| Statut | Patch identifié, non encore autorisé |
| Risque | Toucher le module query — nécessite inspection du diff, smoke avant/après, approbation opérateur |
| Bloquant ? | **NON** — chaîne fonctionne, matière dégradée mais non bloquante |

**Patch minimal à soumettre :**
```python
# Ajouter p.text_preview au coalesce dans brody_context_packet_query_readonly_v1.py
# Avant : coalesce(p.text, p.content, p.body, p.excerpt, p.summary, p.preview, '')
# Après : coalesce(p.text, p.content, p.body, p.excerpt, p.summary, p.preview, p.text_preview, '')
```

---

### B. post_human_review_memory_triage — READY_PENDING_PRECURSOR

| Champ | Valeur |
|---|---|
| Statut | READY — code présent, pointer présent |
| Bloqueur | `SESSION_CLOSE_DECISION_APPLY` avec **51 décisions humaines** à produire |
| Précurseur requis | `BRODY_SESSION_CLOSE_DECISION_APPLY_READONLY` — opérateur classe 51 candidats mémoire (CRISTAL/TRANSITION/NEANT) |
| Contenu | Les 51 décisions deviennent le fichier d'input du module post_human_review |
| Test runtime | Non testable sans ce précurseur |
| Bloquant ? | **Bloquant pour cette étape uniquement** — ne bloque pas le commit |

---

### C. graphiti_candidate_prep — READY_PENDING_PRECURSOR

| Champ | Valeur |
|---|---|
| Statut | READY — code présent, pointer présent |
| Bloqueur | Output `post_human_review` (`BRODY_POST_HUMAN_MEMORY_CANDIDATES_READONLY.jsonl`) |
| Mode | DRY_RUN uniquement — `graphiti_index_write=false` |
| Test runtime | Non testable sans output post_human_review |
| Bloquant ? | **Bloquant pour cette étape uniquement** |

---

### D. Mémoire writable (Graphiti / Neo4j write path)

| Champ | Valeur |
|---|---|
| Statut | **NON ACTIVE** — `graphiti_write=false`, `neo4j_write=false` sur tous les modules |
| Activation | Nécessite protocole opérateur explicite + gate X108 + autorisation runtime |
| Chemin | graphiti_candidate_prep (dry-run) → review gate → import apply guarded manual only |
| Prérequis | post_human_review validé + dry-run vérifié + gate humain explicite |
| Bloquant ? | **Non bloquant pour les étapes actuelles** — décision future |

---

### E. Brody LLM obsidien réel — ce qui est validé vs ce qui reste

**Validé :**
- Boucle opérateur : command_packet → gate → receipt → handoff → boundary_final ✓
- Réponse structurée en contexte readonly ✓
- Contexte injecté depuis Neo4j BrodyMemoryDoc (chain PASS) ✓
- Reflex dangerous mutation bloquée ✓
- KX108_ONLY sur 100% des modules ✓
- `brody_executed=false` sur tous les scénarios ✓

**Pas encore validé :**
- Mémoire writable durable (intake réel dans Graphiti/Neo4j)
- Ingestion de nouveaux documents après post_human_review
- Autonomie runtime (non autorisée — KX108_ONLY)
- Réponse à des providers externes réels (hors example.com)

---

### F. External fetch — monde réel

| Champ | Validé | Pas encore validé |
|---|---|---|
| GET allowlisté example.com | ✓ PASS | — |
| 7 negative tests bloqués | ✓ PASS | — |
| Providers réels (APIs métier) | ✗ | Nécessite nouveau protocole allowlist |
| POST opérateur-approuvé | ✗ | POST reste interdit sauf nouveau protocole |
| Crawling | ✗ | Interdit — boundary permanent |
| Multi-domaine | ✗ | Chaque domaine = autorisation opérateur explicite |

---

### G. Runtime binding

| Champ | Valeur |
|---|---|
| Statut | `READY_FOR_RUNTIME_BINDING=false` |
| Prérequis | Validate complet + post_human_review + graphiti_prep + autorisation KX108 |
| Risque | Modification permanente du comportement runtime — décision irréversible |

---

### H. X108 merge

| Champ | Valeur |
|---|---|
| Statut | `x108_merge_status=NOT_MERGED` — `READY_FOR_X108_MERGE=false` |
| Prérequis | verify_all PASS (ok) + runtime binding + review complet architecture + autorisation KX108 explicite |
| Risque | Fusion définitive — irréversible — décision KX108_ONLY uniquement |

---

### I. Commit candidate — état actuel

| Champ | Valeur |
|---|---|
| Audit commit candidate | **DONE** — BRODY_COMMIT_CANDIDATE_AUDIT_READONLY_20260513_211832 |
| Prochaine étape | BRODY_COMMIT_STAGE_PLAN_READONLY |
| GROUP_A | ~107 fichiers — session courante steps 1-8 + sigma + checkpoint |
| GROUP_B | ~15 fichiers — post_human_review + graphiti_prep modules |
| GROUP_C | 468 `CURRENT_BRODY_*.txt` pointers |
| Bloqueur restant | 11 fichiers modifiés dans root repo (examples/, package.json, proofs/) — origine inconnue, nécessitent audit séparé |

---

## 3. ORDRE RECOMMANDÉ

> Une étape à la fois. La prochaine unique est indiquée en premier.

| # | Étape | Mode | Prérequis | Claude ? |
|---|---|---|---|---|
| **1** | **BRODY_COMMIT_STAGE_PLAN_READONLY** | READONLY | Commit candidate audit DONE ✓ | Oui |
| 2 | Operator approval du plan de staging | HUMAIN | Plan étape 1 | Non |
| 3 | Commit GROUP_A (steps 1-8 audit dirs) | OPERATOR GIT | Approval étape 2 | Non |
| 4 | Commit GROUP_B (post_human_review + graphiti_prep) | OPERATOR GIT | Approval étape 2 | Non |
| 5 | Commit GROUP_C (468 pointers) | OPERATOR GIT | Approval étape 2 | Non |
| 6 | Audit des 11 modified files (examples/ proofs/) | READONLY | — | Oui |
| 7 | LOW_MATERIAL_PATCH_CANDIDATE_READONLY | READONLY | Approval opérateur | Oui |
| 8 | BRODY_SESSION_CLOSE_DECISION_APPLY_PRECURSOR_READONLY | HUMAIN | 51 décisions opérateur | Hybride |
| 9 | BRODY_POST_HUMAN_REVIEW_MEMORY_TRIAGE_READONLY | READONLY | Étape 8 terminée | Oui |
| 10 | BRODY_GRAPHITI_CANDIDATE_PREP_READONLY | READONLY | Étape 9 terminée | Oui |
| 11 | BRODY_GRAPHITI_IMPORT_DRY_RUN_REVIEW_GATE_READONLY | READONLY | Étape 10 terminée | Oui |
| 12 | BRODY_WRITABLE_MEMORY_PROTOCOL_CANDIDATE_READONLY | READONLY | Étapes 9-11 + gate humain | Oui |
| 13 | BRODY_WORLD_PROVIDER_MATRIX_READONLY | READONLY | — | Oui |
| 14 | BRODY_RUNTIME_BINDING_RISK_REVIEW_READONLY | READONLY | Étapes 1-13 validées | Oui |

**Pourquoi cet ordre :**  
Nettoyer le repo (commits 1-5) avant de toucher au code (patch LOW_MATERIAL). Le précurseur humain (51 décisions) peut être préparé en parallèle par l'opérateur pendant que Claude travaille sur les commits et le patch. Le runtime binding et le X108 merge restent en fin de chaîne — irréversibles.

---

## 4. PROCHAINE ACTION UNIQUE

```
BRODY_COMMIT_STAGE_PLAN_READONLY
```

L'audit des candidats (BRODY_COMMIT_CANDIDATE_AUDIT_READONLY) est **DONE** (20260513_211832). La prochaine étape est le plan de staging détaillé avec les commandes `git add` exactes par groupe, la vérification pre-staging, et la proposition de message de commit — sans exécuter.

---

## 5. COMMANDES DE REPRISE (PowerShell)

```powershell
# Lire le checkpoint
Get-Content "C:\Users\User\Desktop\obsidia-engine-proof-core\_local_audits\BRODY_SESSION_CHECKPOINT_20260513_FINAL\BRODY_SESSION_CHECKPOINT_FINAL.md"

# Vérifier repo X108 propre
git -C "C:\Users\User\Desktop\obsidia-engine-proof-core\obsidia-x108-proofs" status --short

# Lancer verify_all
python "C:\Users\User\Desktop\obsidia-engine-proof-core\obsidia-x108-proofs\proofs\verify_all.py"

# Lister les audits produits cette session
Get-ChildItem "C:\Users\User\Desktop\obsidia-engine-proof-core\_local_audits" -Directory | Where-Object { $_.Name -like "*20260513_1*" -or $_.Name -like "*20260513_2*" } | Sort-Object Name | Select-Object Name

# Inspecter le rapport Step 8
Get-Content "C:\Users\User\Desktop\obsidia-engine-proof-core\_local_audits\BRODY_REAL_STATE_DECISION_REPORT_READONLY_20260513_205557\CURRENT_BRODY_REAL_STATE_DECISION_REPORT_READONLY.txt"

# Lire l'audit commit candidate
Get-Content "C:\Users\User\Desktop\obsidia-engine-proof-core\_local_audits\BRODY_COMMIT_CANDIDATE_AUDIT_READONLY_20260513_211832\CURRENT_BRODY_COMMIT_CANDIDATE_AUDIT_READONLY.txt"

# Inspecter les 11 fichiers modified (root repo) — AVANT tout git add
git -C "C:\Users\User\Desktop\obsidia-engine-proof-core" diff -- examples/ package.json proofs/PROOFKIT_REPORT.json proofs/V18_7/ proofs/V18_8/ proofs/tla/ | head -100

# Démarrer BRODY_COMMIT_STAGE_PLAN_READONLY avec Claude Code
# → Ouvrir Claude Code, coller le prompt BRODY_COMMIT_STAGE_PLAN_READONLY
```

---

## 6. CE QUE TU PEUX FAIRE SANS CLAUDE

Actions simples, sans risque, sans build :

- Lire les rapports MD dans `_local_audits/*/reports/`
- Vérifier `git status` dans les deux repos
- Lancer `verify_all.py`
- Ouvrir les dossiers d'audit dans l'explorateur
- Lire les pointer `.txt` (`CURRENT_BRODY_*.txt`)
- Comparer les checkpoints entre sessions
- Copier les prompts de reprise
- Inspecter le diff des 11 modified files avec `git diff`
- Préparer la liste des 51 décisions mémoire (SESSION_CLOSE_DECISION_APPLY)
- Décider si GROUP_C (468 pointers) doit être splitté ou commité en bloc
- Lire le rapport du commit candidate audit (BRODY_COMMIT_CANDIDATE_AUDIT_READONLY_20260513_211832)

---

## 7. CE QUI DOIT RESTER POUR CLAUDE CODE

Actions qui nécessitent génération, inspection structurée, ou smoke tests :

| Action | Pourquoi Claude |
|---|---|
| BRODY_COMMIT_STAGE_PLAN_READONLY | Génère les commandes `git add` exactes par groupe, vérifie staging plan avant exécution |
| Audit des 11 modified files | Lecture structurée du diff + classification (origine, impact, candidat ou non) |
| LOW_MATERIAL_PATCH_CANDIDATE_READONLY | Lit le fichier query, propose le patch minimal, écrit le smoke avant/après |
| Création smoke tests | Écriture des scripts Python de validation |
| Protocole post_human_review | Structuration des 51 décisions en format attendu par le module |
| Préparation Graphiti import dry-run | Orchestration du pipeline avec boundary checks |
| Protocole writable memory | Conception gate humain + boundary enforcement |
| BRODY_RUNTIME_BINDING_RISK_REVIEW_READONLY | Analyse des risques avant toute activation runtime |

---

## 8. INTERDICTIONS PERMANENTES

Ces règles ne changent pas, quelles que soient les étapes futures :

| Interdiction | Portée |
|---|---|
| `no commit` sans audit préalable et approbation opérateur | Toujours |
| `no freeze` | Jusqu'à décision KX108 explicite |
| `no push` | Jusqu'à décision opérateur |
| `no graphiti_write` | Jusqu'à gate humain + autorisation KX108 |
| `no neo4j_write` | Idem |
| `no memory intake` | Idem |
| `no runtime binding` | Jusqu'à review complet + autorisation KX108 |
| `no X108 merge` | Décision KX108_ONLY — irréversible |
| `no POST / no crawler` | Permanent — boundary architectural |
| `no secret read` | Permanent |
| `no sigma/tools touch` sans audit | Permanent |
| `brody_executed=false` | Permanent — Brody ne s'exécute pas |
| `brody_authorize_allowed=false` | Permanent — X108 seule autorité |

---

*BRODY_NEXT_BUILD_ROADMAP_READONLY_DONE — 2026-05-13 — KX108_ONLY*
