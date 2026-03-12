"""
Obsidia Sigma Monitor v1.3.0 — V18.9 Dynamic Stability Check
ProofKit-compatible version with export_to_proofkit() and save_report().

Surveille la trajectoire de décision du moteur en temps réel :
  - Vanishing Acceleration : z̈ ≈ 0 (pas de flip brutal)
  - Velocity Band Control : tau_min ≤ ||ż|| ≤ tau_max
  - Coherence Stationarity : dΣc/dt = 0 (hash système stable)

Usage :
    monitor = ObsidiaSigmaMonitor()
    monitor.evaluate_step(severity, risks, contras)
    report = monitor.export_to_proofkit()
"""

import json
import time
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Optional


SEVERITY_MAP = {"S0": 0.0, "S1": 0.25, "S2": 0.5, "S3": 0.75, "S4": 1.0}


class ObsidiaSigmaMonitor:
    """
    Moniteur de stabilité dynamique Sigma — V18.9.
    Compatible ProofKit : export_to_proofkit() et save_report().
    """

    def __init__(
        self,
        tau_min: float = 0.05,
        tau_max: float = 0.75,
        accel_limit: float = 0.4,
        coherence_hash: Optional[str] = None,
    ):
        self.tau_min = tau_min
        self.tau_max = tau_max
        self.accel_limit = accel_limit
        self.coherence_hash = coherence_hash  # hash système attendu (optionnel)
        self.history: List[Dict[str, Any]] = []
        self.steps: List[Dict[str, Any]] = []  # trace complète de chaque step

    # ------------------------------------------------------------------
    # Vecteur latent z_t
    # ------------------------------------------------------------------

    def _to_vector(self, severity: str, risk_count: int, contra_count: int) -> float:
        base = SEVERITY_MAP.get(severity, 0.0)
        return round(base + (risk_count * 0.05) + (contra_count * 0.1), 6)

    # ------------------------------------------------------------------
    # Évaluation d'un step
    # ------------------------------------------------------------------

    def evaluate_step(
        self,
        severity: str,
        risks: List[Any],
        contras: List[Any],
        current_hash: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Évalue un step de décision et met à jour l'historique.
        Retourne le rapport de stabilité du step.
        """
        z_t = self._to_vector(severity, len(risks), len(contras))
        t_t = time.time()

        step_report: Dict[str, Any] = {
            "step": len(self.steps),
            "severity": severity,
            "z_t": z_t,
            "velocity": 0.0,
            "acceleration": 0.0,
            "stability_status": "STABLE",
            "violations": [],
            "coherence_ok": True,
        }

        # --- Velocity ---
        if len(self.history) >= 1:
            dt = t_t - self.history[-1]["ts"]
            if dt > 0:
                v_t = abs(z_t - self.history[-1]["val"]) / dt
                step_report["velocity"] = round(v_t, 6)

                if v_t < self.tau_min:
                    step_report["violations"].append("POTENTIAL_COLLAPSE")
                elif v_t > self.tau_max:
                    step_report["violations"].append("LATENT_DRIFT")

                # --- Acceleration ---
                if len(self.history) >= 2:
                    dt_prev = self.history[-1]["ts"] - self.history[-2]["ts"]
                    if dt_prev > 0:
                        v_prev = abs(self.history[-1]["val"] - self.history[-2]["val"]) / dt_prev
                        a_t = abs(step_report["velocity"] - v_prev) / dt
                        step_report["acceleration"] = round(a_t, 6)
                        if a_t > self.accel_limit:
                            step_report["violations"].append("HIGH_CURVATURE_INSTABILITY")

        # --- Coherence Stationarity ---
        if self.coherence_hash and current_hash:
            coherence_ok = self.coherence_hash == current_hash
            step_report["coherence_ok"] = coherence_ok
            if not coherence_ok:
                step_report["violations"].append("COHERENCE_STATIONARITY_VIOLATED")

        # --- Statut global ---
        if step_report["violations"]:
            step_report["stability_status"] = "UNSTABLE"

        # --- Mise à jour historique ---
        self.history.append({"val": z_t, "ts": t_t})
        if len(self.history) > 10:
            self.history.pop(0)

        self.steps.append(step_report)
        return step_report

    # ------------------------------------------------------------------
    # Export ProofKit
    # ------------------------------------------------------------------

    def export_to_proofkit(self) -> Dict[str, Any]:
        """
        Exporte le rapport V18.9 au format ProofKit.
        Compatible avec PROOFKIT_REPORT.json.
        """
        if not self.steps:
            return {
                "V18_9_sigma_stability": {
                    "pass": False,
                    "status": "NO_DATA",
                    "steps_evaluated": 0,
                    "violations_total": 0,
                    "violation_types": [],
                    "stdout": "NO_DATA — no steps evaluated\n",
                }
            }

        total_violations = sum(len(s["violations"]) for s in self.steps)
        all_violation_types = list(
            {v for s in self.steps for v in s["violations"]}
        )
        unstable_steps = [s for s in self.steps if s["stability_status"] == "UNSTABLE"]
        passed = len(unstable_steps) == 0

        status = "PASS" if passed else "FAIL"
        summary_lines = [
            f"V18.9 Sigma Dynamic Stability — {status}",
            f"Steps evaluated : {len(self.steps)}",
            f"Unstable steps  : {len(unstable_steps)}",
            f"Total violations: {total_violations}",
        ]
        if all_violation_types:
            summary_lines.append(f"Violation types : {', '.join(all_violation_types)}")
        else:
            summary_lines.append("No violations detected.")

        return {
            "V18_9_sigma_stability": {
                "pass": passed,
                "status": status,
                "steps_evaluated": len(self.steps),
                "unstable_steps": len(unstable_steps),
                "violations_total": total_violations,
                "violation_types": all_violation_types,
                "steps_detail": self.steps,
                "stdout": "\n".join(summary_lines) + "\n",
            }
        }

    # ------------------------------------------------------------------
    # Save report
    # ------------------------------------------------------------------

    def save_report(self, report_path: str = "proofs/PROOFKIT_REPORT.json") -> None:
        """
        Fusionne le rapport V18.9 dans PROOFKIT_REPORT.json existant.
        Crée le fichier s'il n'existe pas.
        """
        path = Path(report_path)
        sigma_entry = self.export_to_proofkit()

        if path.exists():
            with open(path, "r") as f:
                existing = json.load(f)
        else:
            existing = {}

        existing.update(sigma_entry)

        with open(path, "w") as f:
            json.dump(existing, f, indent=2)

        print(f"[Sigma] Report saved to {report_path}")

    # ------------------------------------------------------------------
    # Coherence hash helper
    # ------------------------------------------------------------------

    @staticmethod
    def compute_coherence_hash(files: List[str]) -> str:
        """Calcule un hash SHA-256 sur une liste de fichiers."""
        h = hashlib.sha256()
        for fp in sorted(files):
            p = Path(fp)
            if p.exists():
                h.update(p.read_bytes())
        return h.hexdigest()
