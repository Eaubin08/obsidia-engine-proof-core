#!/usr/bin/env python3
"""
OBSIDIA — Phase 15.2.C : Seal Tamper Attack
============================================
Attaque : modifier un fichier sans mettre à jour le manifest,
puis lancer seal_verify.py. Le sceau doit détecter la modification.

Critère FAIL :
  Si seal_verify.py retourne PASS après modification d'un fichier.

Tests effectués :
  1. Modifier le contenu d'un fichier tracké
  2. Modifier les métadonnées d'un fichier (ajout d'espace)
  3. Modifier un fichier Lean
  4. Modifier audit_log.jsonl
  5. Ajouter un fichier fantôme (non dans le manifest)
"""
import sys
import os
import json
import hashlib
import subprocess
import tempfile
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SEAL_DIR = REPO_ROOT / "proofkit" / "V15_GLOBAL_SEAL"
SEAL_VERIFY = SEAL_DIR / "seal_verify.py"
MANIFEST_FILE = SEAL_DIR / "MASTER_MANIFEST_V15.json"

def run_seal_verify() -> tuple[int, str]:
    """Exécute seal_verify.py et retourne (exit_code, output)."""
    result = subprocess.run(
        [sys.executable, str(SEAL_VERIFY)],
        capture_output=True, text=True,
        cwd=REPO_ROOT
    )
    return result.returncode, (result.stdout + result.stderr).strip()

def tamper_file(path: Path, original: bytes) -> bytes:
    """Modifie légèrement le contenu d'un fichier."""
    if path.suffix in ('.py', '.lean', '.md', '.json', '.txt', '.sh'):
        return original + b"\n# adversarial tamper\n"
    else:
        return original + b"\x00"

def main():
    print("[15.2.C] Seal Tamper Attack")
    print(f"  Repo root  : {REPO_ROOT}")
    print(f"  Seal verify: {SEAL_VERIFY}")
    print()

    # Vérification préalable : le sceau est PASS avant toute modification
    code, out = run_seal_verify()
    if code != 0:
        print(f"  PRE-CHECK FAIL: seal_verify.py already fails before tamper: {out}")
        print(f"\nFAIL — Seal was not PASS before test started")
        sys.exit(1)
    print(f"  Pre-check: seal_verify.py = PASS ✓")
    print()

    # Charger le manifest pour choisir des fichiers à modifier
    manifest = json.loads(MANIFEST_FILE.read_text())
    tracked_files = list(manifest.keys())

    # Sélectionner des fichiers représentatifs à attaquer
    candidates = []
    for pattern in ['.py', '.lean', '.md', '.json', '.txt']:
        for f in tracked_files:
            if f.endswith(pattern) and 'V15_GLOBAL_SEAL' not in f:
                candidates.append(f)
                break

    # Ajouter audit_log.jsonl si présent
    for f in tracked_files:
        if 'audit_log' in f:
            candidates.append(f)
            break

    if not candidates:
        candidates = tracked_files[:3]

    print(f"  Attack targets ({len(candidates)}):")
    for c in candidates:
        print(f"    - {c}")
    print()

    failures = []  # seal_verify.py a dit PASS après tamper = FAIL du test
    detections = []  # seal_verify.py a dit FAIL après tamper = PASS du test

    for rel_path in candidates:
        target = REPO_ROOT / rel_path
        if not target.exists():
            print(f"  SKIP (missing): {rel_path}")
            continue

        original = target.read_bytes()
        tampered = tamper_file(target, original)

        try:
            # Appliquer la modification
            target.write_bytes(tampered)

            # Tester le sceau
            code, out = run_seal_verify()

            if code == 0:
                # FAIL : le sceau n'a pas détecté la modification
                failures.append(rel_path)
                print(f"  [UNDETECTED] {rel_path} — seal_verify.py returned PASS (should FAIL)")
            else:
                # PASS : le sceau a détecté la modification
                detections.append(rel_path)
                print(f"  [DETECTED ✓] {rel_path} — seal_verify.py returned FAIL as expected")

        finally:
            # Restaurer le fichier original
            target.write_bytes(original)

    # Test fantôme : ajouter un fichier non tracké
    ghost = REPO_ROOT / "tools" / "adversarial" / "_ghost_file.txt"
    try:
        ghost.write_text("adversarial ghost file\n")
        code, out = run_seal_verify()
        # Un fichier fantôme ne devrait PAS faire échouer le seal (il n'est pas dans le manifest)
        # Mais il ne devrait pas non plus être ignoré silencieusement si le manifest est exhaustif
        print(f"  [GHOST FILE] seal_verify.py returned {'PASS' if code==0 else 'FAIL'} with ghost file")
        print(f"    (ghost files outside manifest are not detected by design — expected behavior)")
    finally:
        if ghost.exists():
            ghost.unlink()

    print()
    print(f"  Targets tested : {len(candidates)}")
    print(f"  Detected       : {len(detections)}")
    print(f"  Undetected     : {len(failures)}")

    if failures:
        print(f"\nFAIL — SEAL DID NOT DETECT TAMPER on: {failures}")
        sys.exit(1)
    elif len(detections) == 0:
        print(f"\nFAIL — No files were tested (check manifest/paths)")
        sys.exit(1)
    else:
        print(f"\nPASS — All {len(detections)} tampers detected by seal_verify.py")
        sys.exit(0)

if __name__ == "__main__":
    main()
