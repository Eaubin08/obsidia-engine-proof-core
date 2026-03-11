
import os, json, pathlib, hashlib, shutil
from api_server.audit_log import append_audit, AUDIT_LOG, AUDIT_CHAIN, STORE_DIR
from pathlib import Path
from api_server.attestation import build_attestation

def sha256_file(p: pathlib.Path) -> str:
    h=hashlib.sha256()
    with p.open("rb") as f:
        for c in iter(lambda: f.read(1024*1024), b""):
            h.update(c)
    return h.hexdigest()

def recompute_chain(chain_path: pathlib.Path, log_path: pathlib.Path) -> str:
    # Recompute expected last hash from audit.log lines
    prev = "0"*64
    for ln in log_path.read_text(encoding="utf-8").splitlines():
        if not ln.strip(): 
            continue
        event = json.loads(ln)
        payload = json.dumps(event, separators=(",", ":"), sort_keys=True).encode("utf-8")
        prev = hashlib.sha256(prev.encode("utf-8")+payload).hexdigest()
    return prev

def main():
    # clean store
    store_dir = Path(STORE_DIR)
    if store_dir.exists():
        shutil.rmtree(store_dir)
    store_dir.mkdir(parents=True, exist_ok=True)

    # generate traffic
    for i in range(5):
        append_audit({"trace_id": f"t{i}", "event": "DECISION", "i": i})

    att_before = build_attestation()

    logp = pathlib.Path(AUDIT_LOG)
    chainp = pathlib.Path(AUDIT_CHAIN)

    # tamper audit.log: modify one line deterministically
    lines = logp.read_text(encoding="utf-8").splitlines()
    obj = json.loads(lines[2])
    obj["i"] = 999  # corruption
    lines[2] = json.dumps(obj, separators=(",", ":"), sort_keys=True)
    logp.write_text("\n".join(lines) + "\n", encoding="utf-8")

    att_after = build_attestation()
    expected_last = recompute_chain(chainp, logp)
    declared_last = chainp.read_text(encoding="utf-8").splitlines()[-1].split(" ",1)[0]

    out = {
        "attestation_before": att_before,
        "attestation_after": att_after,
        "audit_log_sha256_changed": att_before["audit_log_sha256"] != att_after["audit_log_sha256"],
        "audit_chain_sha256_changed": att_before["audit_chain_sha256"] != att_after["audit_chain_sha256"],
        "chain_last_hash_declared": declared_last,
        "chain_last_hash_recomputed_from_log": expected_last,
        "tamper_detected_by_chain_mismatch": declared_last != expected_last,
    }
    print(json.dumps(out, indent=2))

if __name__ == "__main__":
    main()
