# GROUP_A STAGE DRY_RUN REPAIR V2 — PowerShell git add commands
# MODE: DRY_RUN — DO NOT EXECUTE until operator authorization
# DECISION_AUTHORITY: KX108_ONLY
# Generated: 20260513_224008
# V1_STATUS: INVALID (contained 205523 and 103158 — excluded dirs)
# V2_STATUS: VALID_STRICT_WHITELIST

# COMMIT 1 — Brody readonly steps (GROUP_A V2 — strict whitelist)
# Directories: 19 (18 whitelist + this V2 dir)
# Files: 136 total
# Commit msg: "audit: Brody readonly steps 1-8 + sigma cleanup 2026-05-13"

# === WHITELIST 18 DIRECTORIES ===
git add "_local_audits/BRODY_POINTERS_TRIAGE_READONLY_20260513_190155/"
git add "_local_audits/BRODY_REAL_ARCHITECTURE_MAP_READONLY_20260513_190155/"
git add "_local_audits/BRODY_LLM_OBSIDIEN_CONTEXT_RESPONSE_TEST_READONLY_20260513_190155/"
git add "_local_audits/BRODY_CONTEXT_PACKET_CHAIN_TEST_READONLY_20260513_192629/"
git add "_local_audits/BRODY_API_MEMORY_CONTEXT_READONLY_20260513_194604/"
git add "_local_audits/BRODY_USER_MEMORY_INTAKE_CANDIDATE_READONLY_20260513_194604/"
git add "_local_audits/BRODY_EXTERNAL_FETCH_READONLY_OPERATOR_TEST_20260513_203216/"
git add "_local_audits/BRODY_OPERATOR_FULL_LOOP_TEST_READONLY_20260513_204510/"
git add "_local_audits/BRODY_REAL_STATE_DECISION_REPORT_READONLY_20260513_205557/"
git add "_local_audits/SIGMA_TOOLS_DIRTY_INSPECTION_READONLY_20260513_205917/"
git add "_local_audits/SIGMA_TOOLS_DIRTY_REVERT_APPLIED_READONLY_20260513_210248/"
git add "_local_audits/BRODY_SESSION_CHECKPOINT_20260513_FINAL/"
git add "_local_audits/BRODY_COMMIT_CANDIDATE_AUDIT_READONLY_20260513_211832/"
git add "_local_audits/BRODY_NEXT_BUILD_ROADMAP_READONLY_20260513_212134/"
git add "_local_audits/BRODY_ROOT_MODIFIED_FILES_AUDIT_READONLY_20260513_212700/"
git add "_local_audits/ROOT_MODIFIED_FILES_OPERATOR_REVIEW_READONLY_20260513_213825/"
git add "_local_audits/ROOT_MODIFIED_FILES_OPERATOR_DECISIONS_APPLIED_READONLY_20260513_214642/"
git add "_local_audits/TLA_SPEC_REFACTOR_REPAIR_READONLY_20260513_215627/"

# === V2 DIR (self) ===
git add "_local_audits/BRODY_GROUP_A_STAGE_DRY_RUN_REPAIR_V2_READONLY_20260513_224008/"

# === EXPLICITLY EXCLUDED (DO NOT ADD) ===
# git add "_local_audits/BRODY_REAL_STATE_DECISION_REPORT_READONLY_20260513_205523/"  # EXCLUDED: first run failed/incomplete
# git add "_local_audits/BRODY_REAL_STATE_AUDIT_READONLY_20260513_103158/"             # EXCLUDED: out of whitelist
# git add "_local_audits/BRODY_GROUP_A_STAGE_DRY_RUN_READONLY_20260513_215627/"       # EXCLUDED: V1 invalid report
# git add "examples/"           # EXCLUDED
# git add "package.json"        # EXCLUDED from GROUP_A (separate commit)
# git add "package-lock.json"   # EXCLUDED
# git add "proofs/"             # EXCLUDED from GROUP_A (separate commits)

# Verify staging before commit:
# git diff --cached --stat
# git diff --cached --name-only | grep -E "(205523|103158|examples|package|proofs/tla|CURRENT_BRODY.*\.txt$)"
# (Should return empty — no violations)

# Commit (after operator verification):
# git commit -m "audit: Brody readonly steps 1-8 + sigma cleanup 2026-05-13"
