"""
Obsidia Sigma Dashboard — V18.9 Stability Phase Map
====================================================
Génère un graphique de phase montrant si la trajectoire de décision
est dans la zone de sécurité Sigma.

Usage :
    python3 agents/sigma_dashboard.py
    python3 agents/sigma_dashboard.py --report proofs/PROOFKIT_REPORT.json

Sortie :
    proofs/V18_9/sigma_dashboard.png
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import matplotlib
    matplotlib.use("Agg")  # mode non-interactif (sans display)
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    HAS_MATPLOTLIB = True
except ImportError:
    HAS_MATPLOTLIB = False


def plot_sigma_stability(report_path: str = "proofs/PROOFKIT_REPORT.json") -> None:
    """
    Génère le dashboard de stabilité Sigma depuis un rapport ProofKit.
    """
    if not HAS_MATPLOTLIB:
        print("❌ matplotlib non disponible. Installez-le : pip install matplotlib")
        sys.exit(1)

    path = Path(report_path)
    if not path.exists():
        print(f"❌ Rapport introuvable : {path}")
        print("   Lancez d'abord : python3 agents/run_pipeline.py")
        sys.exit(1)

    with open(path, "r") as f:
        data = json.load(f)

    if "V18_9_sigma_stability" not in data:
        print("❌ Clé V18_9_sigma_stability absente du rapport.")
        sys.exit(1)

    sigma = data["V18_9_sigma_stability"]
    metrics = sigma.get("metrics", {})
    steps_detail = sigma.get("steps_detail", [])
    constraints = sigma.get("constraints", {})

    # Seuils lus depuis le rapport (ou valeurs par défaut)
    tau_min = 0.05
    tau_max = metrics.get("tau_max_used", 0.75)
    accel_limit = metrics.get("accel_limit_used", 0.40)
    status = sigma.get("status", "UNKNOWN")
    mean_v = metrics.get("mean_velocity", 0.0)

    # Extraction des séries temporelles depuis steps_detail
    step_indices = [s["step"] for s in steps_detail]
    velocities = [s.get("velocity", 0.0) for s in steps_detail]
    accelerations = [s.get("acceleration", 0.0) for s in steps_detail]
    z_values = [s.get("z", s.get("z_t", 0.0)) for s in steps_detail]
    severities = [s.get("severity", "?") for s in steps_detail]

    # Couleur selon statut global
    status_color = "#2ecc71" if status == "PASS" else "#e74c3c"

    fig, axes = plt.subplots(3, 1, figsize=(12, 10))
    fig.suptitle(
        f"Obsidia Engine — Sigma Stability Phase Map\n"
        f"Statut global : {status}  |  Vitesse moyenne : {mean_v:.4f}  |  "
        f"tau_max={tau_max}  accel_limit={accel_limit}",
        fontsize=13,
        color=status_color,
        fontweight="bold",
    )

    # ── Graphique 1 : Vecteur latent z(t) ──────────────────────────────
    ax1 = axes[0]
    if step_indices:
        ax1.plot(step_indices, z_values, "b.-", linewidth=2, markersize=8, label="z(t) — vecteur latent")
        for i, (idx, sev) in enumerate(zip(step_indices, severities)):
            ax1.annotate(sev, (idx, z_values[i]), textcoords="offset points",
                         xytext=(0, 6), ha="center", fontsize=8, color="#555")
    ax1.set_ylabel("z(t)")
    ax1.set_title("Trajectoire de décision z(t)")
    ax1.legend(loc="upper left")
    ax1.grid(True, alpha=0.3)
    ax1.set_facecolor("#f8f9fa")

    # ── Graphique 2 : Velocity Band ─────────────────────────────────────
    ax2 = axes[1]
    ax2.axhspan(tau_min, tau_max, color="#2ecc71", alpha=0.15, label=f"Zone sûre [{tau_min}, {tau_max}]")
    ax2.axhline(y=tau_max, color="#e67e22", linestyle="--", linewidth=1.5, label=f"tau_max={tau_max}")
    ax2.axhline(y=tau_min, color="#3498db", linestyle="--", linewidth=1.5, label=f"tau_min={tau_min}")
    if step_indices and any(v > 0 for v in velocities):
        ax2.plot(step_indices, velocities, "ro-", linewidth=2, markersize=7, label="||ż(t)|| — vitesse")
        ax2.axhline(y=mean_v, color="#9b59b6", linestyle=":", linewidth=1.5,
                    label=f"Vitesse moyenne={mean_v:.4f}")
    else:
        ax2.text(0.5, 0.5, "Pas assez de pas pour calculer la vitesse\n(nécessite ≥ 2 décisions)",
                 transform=ax2.transAxes, ha="center", va="center",
                 fontsize=10, color="#888", style="italic")
    ax2.set_ylabel("||ż(t)||")
    ax2.set_title("Velocity Band Control")
    ax2.legend(loc="upper right", fontsize=8)
    ax2.grid(True, alpha=0.3)
    ax2.set_facecolor("#f8f9fa")

    # ── Graphique 3 : Accélération ──────────────────────────────────────
    ax3 = axes[2]
    ax3.axhline(y=accel_limit, color="#e74c3c", linestyle="--", linewidth=2,
                label=f"Accel Limit={accel_limit}")
    ax3.axhspan(0, accel_limit, color="#2ecc71", alpha=0.10, label="Zone stable")
    if step_indices and any(a > 0 for a in accelerations):
        ax3.plot(step_indices, accelerations, "m^-", linewidth=2, markersize=7, label="||z̈(t)|| — accélération")
    else:
        ax3.text(0.5, 0.5, "Pas assez de pas pour calculer l'accélération\n(nécessite ≥ 3 décisions)",
                 transform=ax3.transAxes, ha="center", va="center",
                 fontsize=10, color="#888", style="italic")
    ax3.set_ylabel("||z̈(t)||")
    ax3.set_xlabel("Pas de décision")
    ax3.set_title("Vanishing Acceleration (Curvature)")
    ax3.legend(loc="upper right", fontsize=8)
    ax3.grid(True, alpha=0.3)
    ax3.set_facecolor("#f8f9fa")

    # ── Annotation des violations ───────────────────────────────────────
    for s in steps_detail:
        for viol in s.get("violations", []):
            idx = s["step"]
            for ax in axes:
                ax.axvline(x=idx, color="#e74c3c", alpha=0.4, linewidth=1.5)

    plt.tight_layout(rect=[0, 0, 1, 0.93])

    # Sauvegarde
    out_dir = Path("proofs/V18_9")
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "sigma_dashboard.png"
    plt.savefig(out_path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"✅ Dashboard généré : {out_path}")
    print(f"   Statut Sigma    : {status}")
    print(f"   Vitesse moyenne : {mean_v:.4f}")
    print(f"   Seuils utilisés : tau_max={tau_max}, accel_limit={accel_limit}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Obsidia Sigma Dashboard")
    parser.add_argument(
        "--report",
        default="proofs/PROOFKIT_REPORT.json",
        help="Chemin vers PROOFKIT_REPORT.json (défaut: proofs/PROOFKIT_REPORT.json)",
    )
    args = parser.parse_args()
    plot_sigma_stability(args.report)
