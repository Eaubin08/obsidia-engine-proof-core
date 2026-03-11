import json
import sys
from core.api.security.merkle import compute_merkle_root

def verify():
    with open("merkle_root.json", "r") as f:
        expected = json.load(f)["merkle_root"]

    actual = compute_merkle_root("core/api/audit_log.jsonl")

    if expected == actual:
        print("Merkle root VALID")
    else:
        print("Merkle root INVALID")

if __name__ == "__main__":
    verify()
