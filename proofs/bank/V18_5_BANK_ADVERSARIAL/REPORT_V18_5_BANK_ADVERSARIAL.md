OBSIDIA V18.5 — BANK ADVERSARIAL PROOF PACK
Timestamp: 2026-03-03T14:29:55.231018Z

Tests executed:
T1 Ledger tamper detection (audit.log / audit.chain hash-chain)
- tamper_detected_by_chain_mismatch: True
- audit_log_sha256_changed: True

T2 Key corruption (Ed25519 signature reject)
- verify_original_signature: True
- verify_corrupted_signature: False

T3 PBFT safety simulation (n=4, f=1, 1 byzantine)
- safety_honest_commit_same_digest: True

Artifacts:
- results/*.json (full outputs)
- results/api_store/* (generated audit log + chain from T1)
