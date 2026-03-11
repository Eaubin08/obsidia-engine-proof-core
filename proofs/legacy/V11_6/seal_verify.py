#!/usr/bin/env python3
"""
OBSIDIA V11.6 GLOBAL SEAL — Verification script
Verifies:
  1. Each file in the manifest matches its recorded SHA-256
  2. Root hash recalculated from manifest values matches ROOT_HASH_V11_6.txt
  3. SEAL_META_V11_6.json is internally consistent
"""
import hashlib, json, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(BASE, "..", ".."))

MANIFEST_PATH  = os.path.join(BASE, "MASTER_MANIFEST_V11_6.json")
ROOT_HASH_PATH = os.path.join(BASE, "ROOT_HASH_V11_6.txt")
META_PATH      = os.path.join(BASE, "SEAL_META_V11_6.json")

errors = []

# --- 1. Load manifest ---
with open(MANIFEST_PATH) as f:
    manifest = json.load(f)

# --- 2. Verify each file ---
for rel_path, expected_hash in manifest.items():
    abs_path = os.path.normpath(os.path.join(REPO, rel_path))
    if not os.path.exists(abs_path):
        errors.append(f"MISSING: {rel_path}")
        continue
    with open(abs_path, "rb") as fh:
        actual = hashlib.sha256(fh.read()).hexdigest()
    if actual != expected_hash:
        errors.append(f"DRIFT: {rel_path}\n  expected: {expected_hash}\n  actual:   {actual}")

# --- 3. Recalculate root hash ---
entries = sorted(manifest.values())
root_recalc = hashlib.sha256(("".join(entries)).encode()).hexdigest()

with open(ROOT_HASH_PATH) as f:
    root_stored = f.read().strip()

if root_recalc != root_stored:
    errors.append(f"ROOT_HASH MISMATCH\n  stored:  {root_stored}\n  recalc:  {root_recalc}")

# --- 4. Verify SEAL_META consistency ---
with open(META_PATH) as f:
    meta = json.load(f)

with open(MANIFEST_PATH, "rb") as f:
    manifest_hash_actual = hashlib.sha256(f.read()).hexdigest()
with open(ROOT_HASH_PATH, "rb") as f:
    root_hash_file_actual = hashlib.sha256(f.read()).hexdigest()

global_seal_actual = hashlib.sha256(
    (manifest_hash_actual + "\n" + root_hash_file_actual + "\n").encode()
).hexdigest()

if meta.get("manifest_hash") != manifest_hash_actual:
    errors.append(f"META manifest_hash mismatch")
if meta.get("root_hash_file_hash") != root_hash_file_actual:
    errors.append(f"META root_hash_file_hash mismatch")
if meta.get("global_seal_hash") != global_seal_actual:
    errors.append(f"META global_seal_hash mismatch")

# --- Result ---
if errors:
    print("FAIL")
    for e in errors:
        print(" ", e)
    sys.exit(1)
else:
    print("PASS")
    sys.exit(0)
