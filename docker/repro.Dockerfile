# OBSIDIA — Reproductibilité déterministe Phase 14A2
# Base : Ubuntu 22.04 LTS avec Python 3.11 + Lean 4.28 + elan
FROM ubuntu:22.04

LABEL maintainer="OBSIDIA Project"
LABEL version="v13-final"
LABEL description="Reproductible build: seal_verify + pytest + lake build"

ENV DEBIAN_FRONTEND=noninteractive
ENV ELAN_HOME=/root/.elan
ENV PATH="/root/.elan/bin:${PATH}"

# Dépendances système
RUN apt-get update && apt-get install -y \
    python3 python3-pip git curl wget unzip \
    build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
RUN pip3 install pytest fastapi uvicorn pynacl numpy

# Installer elan (gestionnaire Lean 4)
RUN curl -sSf https://raw.githubusercontent.com/leanprover/elan/master/elan-init.sh \
    | sh -s -- -y --default-toolchain leanprover/lean4:v4.28.0

# Cloner le repo au tag v13-final
WORKDIR /workspace
RUN git clone https://github.com/Eaubin08/Obsidia-lab-trad.git . && \
    git checkout v13-final

# Pré-télécharger les toolchains Lean (cache layer)
RUN cd lean && lake build Obsidia.Main 2>&1 | tail -5 || true

# Point d'entrée
COPY run_repro.sh /workspace/docker/run_repro.sh
RUN chmod +x /workspace/docker/run_repro.sh

CMD ["/workspace/docker/run_repro.sh"]
