# BRODY_REAL_ARCHITECTURE_MAP_READONLY_REPORT
Date : 2026-05-13
Heure : 20260513_190155
Source audit : BRODY_REAL_STATE_AUDIT_READONLY_20260513_103158

---

## CORRECTION ARCHITECTURALE FONDAMENTALE

```
Brody = le LLM obsidien lui-même.
Brody n'est PAS "un composant qui a un LLM".
Brody n'exécute pas.
Brody n'autorise pas.
Brody ne décide pas.
```

---

## TABLE DE CARTOGRAPHIE

### COMPOSANT 1 — Brody = LLM obsidien

| Champ | Valeur |
|---|---|
| Rôle | LLM obsidien — produit des réponses structurées à partir de contexte |
| Chemin runtime | obsidia-engine-candidate (hors X108, readonly depuis X108) |
| État | BRODY_LLM_OBSIDIEN=true (déclaré dans API_BRIDGE_CONTRACT, READINESS, AUTHORIZATION_PACKET) |
| Preuve existante | RUNTIME_FREEZE_V1_4_12A — session terminal native documentée. TERMINAL_NATIVE_RUN=true, BOUNDARY_OK=true |
| Manque | Preuve que Brody reçoit un context packet Graphiti réel et produit réponse structurée (chaîne complète) |
| Prochaine action | CONTEXT_PACKET_QUERY → CONTEXT_PACKET_CONSUMER → LOCAL_RESPONSE_ENGINE (dès API 8011 up) |
| Bloqué par | API 8011 DOWN |

### COMPOSANT 2 — API 8011 / ObsidiaShell

| Champ | Valeur |
|---|---|
| Rôle | Surface readonly d'accès au contexte Graphiti. Gateway FastAPI sur port 8011 |
| Chemin | obsidiashell-main/obsidia_core/agent_bridge.py |
| Adapter | obsidiashell-main/graphiti_v20_frozen_adapter.py |
| État | **DOWN** ce jour (connexion refusée). Était live dans dernier audit (f7643fd) |
| venv | .venv_api8011 dans obsidiashell-main/ |
| Endpoints validés (dernier audit) | 14 endpoints GET OK, 3 mutations POST/DELETE bloquées 405 |
| Endpoints frozen | /graph/v20/frozen/status, /counts, /metrics, /readiness, /evidence, /manifest, /context, /search |
| Endpoints live Neo4j | /graph/v20/counts, /entities, /relations, /episodes (live_neo4j_dependency=false vérifié) |
| Mutations bloquées | POST /context = 405, POST /search = 405, DELETE /status = 405 |
| Preuve existante | api_8011_state.json — 14 endpoints OK, 0 fails |
| Manque | API actuellement down. Cause inconnue. Relance requise |
| Prochaine action | Opérateur relance : cd obsidiashell-main ; .\.venv_api8011\Scripts\activate ; python -m uvicorn obsidia_core.api_8011:app --port 8011 |

### COMPOSANT 3 — Graphiti V20 frozen readonly

| Champ | Valeur |
|---|---|
| Rôle | Mémoire contexte readonly. Source de vérité Graphiti Phase0 V20 |
| Chemin freeze | graphiti-lab/.graphiti_runs/freeze_phase0_v20_20260506_140654/ |
| Adapter | obsidiashell-main/graphiti_v20_frozen_adapter.py |
| Contenu | nodes=167, rels=477, indexed_episodes=20, failed_episodes=0, manifest_files=4 |
| Mode | FROZEN_READONLY — pas de live Neo4j actif |
| live_neo4j_dependency | false |
| x108_merge_status | NOT_MERGED |
| commit_status | LOCAL_ONLY |
| État | Freeze physiquement présent. Accessible via API quand API live. Actuellement inaccessible (API down) |
| Preuve existante | context_x108.json (10001 bytes), context_brody.json (2431 bytes), context_kernel.json (25473 bytes), context_canon.json (11856 bytes) — tous issus du dernier audit quand API était live |
| Manque | API 8011 down → contexte inaccessible live ce jour |
| Graphiti write | false |
| Prochaine action | Relancer API → tester micro_smoke → tester context_packet_query |

### COMPOSANT 4 — X108 = Autorité décisionnelle finale

| Champ | Valeur |
|---|---|
| Rôle | Gouverneur décisionnel final. KX108 = seul autorisé à décider |
| Chemin | obsidia-x108-proofs/ (repo principal cible build) |
| État | Repo présent. verify_all.py = PASS (dernier audit). Un fichier modifié (sigma/tools/run_bank_enterprise_pack.py) |
| x108_merge_status | NOT_MERGED |
| DECISION_AUTHORITY | KX108_ONLY (confirmé dans tous les 91+ pointers) |
| kernel_decision | non-actif (confirmé audit) |
| graphiti_decision | non-actif (confirmé audit) |
| Preuve existante | Tous les pointers Brody déclarent DECISION_AUTHORITY=KX108_ONLY sans exception |
| Manque | Aucun manque sur le boundary X108. Solidement établi |
| Prochaine action | Inspecter sigma/tools/run_bank_enterprise_pack.py avant tout commit |

### COMPOSANT 5 — Operator loop

| Champ | Valeur |
|---|---|
| Rôle | Protocole humain : command packet → gate → exécution → receipt → validation → handoff → control loop |
| Chemins | periphery/brody_memory_readonly/brody_human_command_packet_readonly/ |
|  | periphery/brody_memory_readonly/brody_local_command_gate_readonly/ |
|  | periphery/brody_memory_readonly/brody_operator_execution_protocol_readonly/ |
|  | periphery/brody_memory_readonly/brody_operator_execution_receipt_readonly/ |
|  | periphery/brody_memory_readonly/brody_human_output_receipt_validator_readonly/ |
|  | periphery/brody_memory_readonly/brody_operator_supervised_handoff_readonly/ |
| État | PASS sur tous les modules opérateur. COMMAND_GATE_TEST=PASS, OPERATOR_RECEIPT_TEST=PASS |
| Preuve existante | MEMORY_CONTEXT_OPERATOR_INTERACTION_TEST_READONLY_FREEZE_V1 — PASS avec receipts réels |
| Classifications gate | readonly_api_get → EXTERNAL_ACCESS_COMMAND_REVIEW_REQUIRED, git_commit → GIT_MUTATION_COMMAND_HUMAN_ONLY, api_post_mutation → EXTERNAL_ACCESS_COMMAND_REVIEW_REQUIRED |
| Manque | Boucle complète pas encore testée avec contexte Brody réel (ÉTAPE 7) |
| Prochaine action | Après LLM test chain, faire BRODY_OPERATOR_FULL_LOOP_TEST_READONLY |

### COMPOSANT 6 — Mémoire utilisateur candidate

| Champ | Valeur |
|---|---|
| Rôle | Pipeline de triage de mémoire : entrée utilisateur → candidat → validation humaine → éventuellement Graphiti write |
| Chemin principal | periphery/brody_memory_readonly/auto_triage_memory_intake_readonly/ |
| Sous-pipeline | session_memory_ledger, session_presave_buffer, project_intake_capture_buffer |
| Triage zones | CRISTAL (candidat), TRANSITION (revue), NEANT (rejet), REFLEX (alerte) |
| État | STATUS=READY sur tous les modules mémoire candidate |
| AUTO_TRIAGE | true (dans le module) mais pas d'écriture automatique |
| GRAPHITI_INDEX_WRITE | false |
| MEMORY_INTAKE | false |
| Preuve existante | Modules présents avec boundaries déclarés. Pas encore testés comme pipeline |
| Manque | Test end-to-end : entrée → triage → proposition candidat → validation humaine → write=false |
| Prochaine action | BRODY_AUTO_TRIAGE_MEMORY_INTAKE_READONLY (testable maintenant, sans API) |

### COMPOSANT 7 — Memory write boundary

| Champ | Valeur |
|---|---|
| Rôle | Frontière qui empêche toute écriture automatique Graphiti |
| État | GRAPHITI_INDEX_WRITE=false sur TOUS les pointers sans exception |
| NEO4J_WRITE_EXECUTED | false sur tous |
| MEMORY_INTAKE | false sur tous |
| Modules de protection | brody_graphiti_candidate_review_gate_readonly, brody_graphiti_import_apply_guarded_manual_only |
| Preuve existante | 91+ pointers déclarent explicitement les boundaries false |
| Manque | Test du chemin GUARDED_MANUAL_ONLY pour confirmer que même le chemin "apply" requiert opérateur |
| Prochaine action | Module GRAPHITI_GUARDED_MANUAL_APPLY_FROM_REVIEW_DECISION_READONLY_MEMORY_ONLY |

### COMPOSANT 8 — Scraping / External fetch

| Champ | Valeur |
|---|---|
| Rôle | Accès GET-only à des URLs externes autorisées |
| État | scraping_hits présents MAIS tous avec scrape_executed=false ou scrape_allowed_now=false |
| SCRAPE_EXECUTED | false sur tous les pointers API bridge |
| Preuve existante | scraping_hits.json — mentions de scraping mais beaucoup de "This does not scrape" |
| Modules présents | brody_api_bridge_authorization_packet (AUTHORIZATION_STATUS=NOT_AUTHORIZED_FOR_RUNTIME) |
| Manque | Test GET-only avec allowlist, receipt, no POST, no write (ÉTAPE 6) |
| Prochaine action | BRODY_EXTERNAL_FETCH_READONLY_OPERATOR_TEST |

### COMPOSANT 9 — Command gate

| Champ | Valeur |
|---|---|
| Rôle | Classifie chaque commande proposée : READONLY_INSPECTION, GIT_MUTATION, EXTERNAL_ACCESS, SECRET_SURFACE |
| Chemin | periphery/brody_memory_readonly/brody_local_command_gate_readonly/brody_local_command_gate_readonly_v1.py |
| État | PASS — testé, smoke green |
| Classifications confirmées | readonly_api_get_status, readonly_api_get_context, readonly_git_status, readonly_verify_all, git_commit_mutation, git_push_mutation, filesystem_delete, secret_read, api_post_mutation |
| Preuve existante | command_gate_interaction_report.json dans audit 20260513_100913 |
| Manque | Aucun — module validé |

### COMPOSANT 10 — Receipt validator

| Champ | Valeur |
|---|---|
| Rôle | Valide que la sortie opérateur correspond au schéma attendu |
| Chemin | periphery/brody_memory_readonly/brody_human_output_receipt_validator_readonly/ |
| État | PASS (inféré du pattern CLEAN_CLOSE) |
| Preuve existante | operator_receipt_api_status_and_git_status.json dans freeze_v1 |
| Manque | Validation complète de la boucle (ÉTAPE 7) |

### COMPOSANT 11 — Handoff / Control loop

| Champ | Valeur |
|---|---|
| Rôle | Transfert supervisé et boucle de contrôle opérateur |
| Chemins | brody_operator_supervised_handoff_readonly, brody_operator_control_loop_*freeze* |
| État | PASS (confirmé pour handoff, inféré pour control loop) |
| Manque | Test boucle complète avec contexte Brody réel |

---

## FLUX COMPLET ATTENDU

```
[1] Opérateur → commande
       ↓
[2] Command Gate → classification (READONLY/GIT_MUTATION/EXTERNAL_ACCESS)
       ↓ (si READONLY_INSPECTION ou EXTERNAL_ACCESS_APPROVED)
[3] Opérateur exécute → API 8011 GET /graph/v20/frozen/context?q=...
       ↓
[4] API 8011 → graphiti_v20_frozen_adapter → context packet (JSON)
       ↓
[5] Context packet → Brody (LLM obsidien) via obsidia-engine-candidate runner
       ↓ (Brody lit le contexte, ne décide pas, ne lance rien)
[6] Brody → réponse structurée (sans ACT, sans verdict, sans KERNEL_MUTATION)
       ↓
[7] Réponse → opérateur → validation (human output receipt validator)
       ↓
[8] Receipt opérateur signé
       ↓
[9] Handoff supervisé si applicable
       ↓
[10] X108 = seul décideur si action suivante requise
```

**État actuel du flux :**
- Étapes 1-4 : validées (command gate PASS, API 8011 validée, mais DOWN ce jour)
- Étape 5-6 : non encore testées comme chaîne complète (CŒUR DU BUILD MANQUANT)
- Étapes 7-10 : validées structurellement (receipts, handoff PASS)

---

## BLOCAGES ACTUELS

```
BLOCAGE_CRITIQUE : API_8011_DOWN
  → Bloque étapes 3, 4, 5, 6 du flux
  → Bloque CONTEXT_PACKET_QUERY, CONTEXT_PACKET_CONSUMER, LOCAL_RESPONSE_ENGINE
  → Bloque MEMORY_READONLY_MICRO_SMOKE, SESSION_REOPEN_LOOP

BLOCAGE_SECONDAIRE : X108_GIT_NOT_CLEAN
  → sigma/tools/run_bank_enterprise_pack.py modifié non stagé
  → Bloque tout commit jusqu'à inspection de ce fichier
```

---

## ÉTAT PAR COMPOSANT (RÉSUMÉ)

| Composant | État | Preuve | Manque |
|---|---|---|---|
| Brody LLM obsidien | DÉCLARÉ — non encore testé comme chaîne | RUNTIME_FREEZE V1_4_12A | Chaîne context → réponse |
| API 8011 / ObsidiaShell | DOWN ce jour | Dernier audit : 14 endpoints OK | Relancer le serveur |
| Graphiti V20 frozen | Freeze présent, inaccessible (API down) | freeze dir + context JSON dernier audit | API relancée |
| X108 boundary | SOLIDEMENT VALIDÉ | 91+ pointers tous KX108_ONLY | Aucun |
| Operator loop | PASS structurel | MEMORY_CONTEXT_OPERATOR_TEST PASS | Boucle complète avec LLM réel |
| Mémoire utilisateur candidate | READY — non testé | Modules présents | Test pipeline triage |
| Memory write boundary | VALIDÉ sur tous | 91+ pointers tous false | Aucun |
| Scraping / external fetch | NON PROUVÉ runtime | scraping_hits tous false | Test GET-only contrôlé |
| Command gate | PASS | command_gate_interaction_report | Aucun |
| Receipt validator | PASS (inféré) | operator_receipt JSON | Boucle complète |
| Handoff / Control loop | PASS (inféré) | CLEAN_CLOSE pointers | Boucle complète |

---

## GUARDRAILS

```
COMMITTED=false
FROZEN=false
PUSH=false
X108_MODIFICATION=false
AUTRES_REPOS_MODIFICATION=false
```
