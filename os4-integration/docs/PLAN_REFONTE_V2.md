# OS4 — Plan de Refonte Frontend V2
## Architecture canonique : Monde × Temps × Run × Preuve

**Version :** 1.0 — Mars 2026  
**Statut :** Plan validé — prêt à implémenter  
**Checkpoint de départ :** `5bcd9b37`

---

## 0. Diagnostic de l'existant

### Navigation actuelle (à remplacer)

| Route | Page | Problème |
|-------|------|----------|
| `/` | OS4Home | Trop de storytelling, pas de point d'entrée opératoire |
| `/simuler` | Simuler | Mélange texte / cockpit / explication / démo — surcharge |
| `/decision` | Decision | Lecture trop "log feed", mélange présent + historique |
| `/preuves` | Preuves | Pas structurée par objet canonique, cassée |
| `/controle` | Controle | Trop promesse, pas assez commandement réel, cassée |
| `/trading` `/bank` `/ecom` | Worlds | Pages décoratives sans protocole commun visible |
| 30+ routes orphelines | — | Hors navigation, inaccessibles, à archiver |

### Ce qui est conservé (backend intact)

Le backend **ne change pas**. Tous les endpoints tRPC existants sont réutilisés :

- `trading.simulate`, `bank.simulate`, `ecom.simulate` — moteurs de simulation
- `engine.canonicalRun`, `engine.canonicalAgentRegistry`, `engine.canonicalScenarios` — pipeline canonique
- `engine.decision`, `engine.batchRun`, `engine.runScenario` — décisions et scénarios
- `proof.allTickets`, `proof.guardStats`, `proof.replayVerify` — audit et preuve
- `portfolio.getWallet`, `portfolio.getPositions`, `portfolio.saveSnapshot` — portfolio
- `mirror.prices`, `mirror.guardSimulate` — données marché réel

### Objets canoniques disponibles en DB

| Table | Colonnes clés |
|-------|--------------|
| `decision_tickets` | `intentId`, `domain`, `decision`, `reasons`, `x108`, `auditTrail`, `replayRef` |
| `simulation_runs` | `domain`, `seed`, `steps`, `stateHash`, `merkleRoot` |
| `audit_log` | `ticketId`, `hashPrev`, `hashNow`, `merkleRoot`, `anchorRef` |
| `wallets` | `capital`, `pnl24h`, `guardBlocks`, `capitalSaved` |

---

## 1. Principe directeur V2

> **Monde → Temps → Constellation d'agents → Agrégation → Guard X-108 → Enveloppe canonique → Preuve**

L'objet central n'est plus la page. C'est le **Canonical Decision Envelope** :

```
domain | market_verdict | confidence | contradictions | unknowns | risk_flags
x108_gate | reason_code | severity | decision_id | trace_id
ticket_required | ticket_id | attestation_ref | source | metrics | raw_engine
```

Chaque surface de l'app lit cet objet selon une temporalité différente.

---

## 2. Nouvelle navigation

### Sidebar principale (5 items fixes)

| Route | Label | Icône | Rôle |
|-------|-------|-------|------|
| `/mission` | Mission | `◎` | Point d'entrée — choisir un monde |
| `/live` | Live | `⬤` | Présent opératoire — ce qui se passe maintenant |
| `/future` | Future | `◈` | Futur pilotable — simuler et projeter |
| `/past` | Past | `◷` | Passé prouvé — historique et audit |
| `/control` | Control | `⊞` | Tour de commandement — santé globale |

### Topbar persistante (toujours visible)

```
[Trading] [Bank] [Ecom]   |   Mode   Source   X-108 Gate   Severity   Last Decision   Proof
```

- **Filtre monde** : Trading / Bank / Ecom — filtre global qui traverse toutes les surfaces
- **Mode** : Live / Simu / Fallback / Demo / Mixed
- **Source** : Python / Fallback / Mixed
- **X-108 Gate** : ALLOW 🟢 / HOLD 🟡 / BLOCK 🔴
- **Severity** : S0 → S4
- **Last Decision** : ID court cliquable → ouvre le détail dans Past
- **Proof** : Ready ✓ / Pending ⏳ / Missing ✗

### Redirections des routes actuelles

| Ancienne route | Nouvelle route | Action |
|----------------|---------------|--------|
| `/` | `/mission` | Redirect |
| `/simuler` | `/future` | Redirect + refonte |
| `/decision` | `/live` (présent) + `/past` (historique) | Scinder |
| `/preuves` | Sous-couche de `/past` | Intégrer |
| `/controle` | `/control` | Redirect + refonte |
| `/trading` | `/live?world=trading` ou `/trading` (World page) | Garder comme World page |
| `/bank` | `/live?world=bank` ou `/bank` (World page) | Garder comme World page |
| `/ecom` | `/live?world=ecom` ou `/ecom` (World page) | Garder comme World page |
| 30+ routes orphelines | Archivées, non supprimées | `<Route>` gardées mais hors nav |

---

## 3. Architecture des 5 surfaces

### A. Mission (`/mission`)

**Question :** Dans quel monde veux-tu agir, et sur quel temps ?

**Structure écran :**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : titre "Mission Control" | mode global | état OS4       │
├─────────────────────────────────────────────────────────────────┤
│ CENTRE : 3 World Cards (Trading / Bank / Ecom)                  │
│   Chaque carte affiche :                                        │
│   - Nom du monde + icône                                        │
│   - Agents actifs (ex: "17 agents actifs")                      │
│   - Dernier market_verdict                                      │
│   - Dernier x108_gate (badge coloré)                            │
│   - Dernier severity                                            │
│   - Dernier decision_id (court)                                 │
│   - Dernier attestation_ref                                     │
│   - Niveau de confiance (barre)                                 │
│   - Boutons : [Live →] [Future →] [Past →]                      │
├─────────────────────────────────────────────────────────────────┤
│ BAS : Accès rapide                                              │
│   - Dernier run critique (S3/S4)                                │
│   - Dernier run ALLOW                                           │
│   - Dernier incident                                            │
│   - Dernière preuve                                             │
└─────────────────────────────────────────────────────────────────┘
```

**Ce qu'elle ne doit plus faire :** raconter Obsidia, afficher du storytelling, mélanger mission + historique + debug.

**Données :** `proof.guardStats`, `proof.allTickets` (3 derniers par domaine), `engine.canonicalAgentRegistry`

---

### B. Live (`/live`)

**Question :** Que se passe-t-il maintenant dans ce monde ?

**Structure écran :**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : [Trading|Bank|Ecom] | LIVE ⬤ | source | guard status  │
├──────────────────┬──────────────────────┬───────────────────────┤
│ GAUCHE           │ CENTRE               │ DROITE                │
│ Filtres :        │ Feed live des        │ Panneau détail        │
│ - severity       │ Decision Envelope    │ décision sélectionnée │
│ - gate           │ Cards                │                       │
│ - source         │                      │ - contradictions      │
│ - constellation  │ Chaque card :        │ - unknowns            │
│                  │ - domain             │ - risk flags          │
│                  │ - market verdict     │ - vote count          │
│                  │ - confidence         │ - attestation         │
│                  │ - x108 gate          │ - trace               │
│                  │ - reason code        │ - top 3 agents        │
│                  │ - severity           │                       │
│                  │ - source             │                       │
│                  │ - decision id        │                       │
│                  │ - proof status       │                       │
├──────────────────┴──────────────────────┴───────────────────────┤
│ BAS : Événements récents | mini historique court (10 derniers)  │
└─────────────────────────────────────────────────────────────────┘
```

**Composant central :** `DecisionEnvelopeCard` (universel, réutilisé partout)

**Données :** WebSocket `/ws/decisions` (existant), `proof.allTickets` (polling 5s), `engine.canonicalRun` (auto-run toutes les 10s)

---

### C. Future (`/future`)

**Question :** Que se passe-t-il si je change les paramètres ?

> C'est la transformation de Simuler — reconstruite proprement.

**Structure écran :**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : [Trading|Bank|Ecom] | FUTURE ◈ | mode simu | source   │
├──────────────────┬──────────────────────┬───────────────────────┤
│ GAUCHE           │ CENTRE               │ DROITE                │
│ Commandes :      │ Vue simulation :     │ Résultat :            │
│ - monde          │ - état courant       │ - market_verdict      │
│ - scénario       │ - projection         │ - x108_gate           │
│ - paramètres     │ - timeline           │ - severity            │
│   métier         │ - comparaison        │ - reason_code         │
│ - stress mode    │   baseline/scénario  │ - confidence          │
│ - action         │                      │ - proof readiness     │
│   candidate      │                      │ - ticket requirement  │
│                  │                      │                       │
│ [▶ LANCER]       │                      │                       │
├──────────────────┴──────────────────────┴───────────────────────┤
│ BAS — Détails (repliable) :                                     │
│ Constellation agentique | Agrégation | Contradictions |         │
│ Unknowns | Risk flags | Replay preview                          │
└─────────────────────────────────────────────────────────────────┘
```

**Règle UX absolue :** l'utilisateur lit dans cet ordre :
1. Ce que je règle (gauche)
2. Ce que je lance (bouton)
3. Ce qui est projeté (centre)
4. Ce que X-108 décide (droite)
5. Ce qui est prouvable (bas)

**Données :** `engine.canonicalRun` (mutation), `engine.canonicalScenarios`, `trading.simulate` / `bank.simulate` / `ecom.simulate`

---

### D. Past (`/past`)

**Question :** Qu'est-ce qui s'est réellement passé, et puis-je le rejouer ?

> C'est la vraie maison des objets canoniques : décision, trace, ticket, attestation.

**Structure écran :**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : [Trading|Bank|Ecom] | PAST ◷ | filtres temporels      │
├──────────────────┬──────────────────────┬───────────────────────┤
│ GAUCHE           │ CENTRE               │ DROITE                │
│ Filtres :        │ Liste des runs       │ Détail run sélectionné│
│ - decision_id    │ passés               │                       │
│ - trace_id       │                      │ - Envelope complète   │
│ - ticket_id      │ Timeline             │ - Trace               │
│ - severity       │                      │ - Ticket              │
│ - gate           │ Événements           │ - Attestation         │
│ - attestation    │ critiques            │ - Raw engine summary  │
│ - source         │                      │ - [▶ Replay]          │
│ - domaine        │                      │                       │
│ - période        │                      │ Proof Chain View :    │
│                  │                      │ Decision ID           │
│                  │                      │ → Trace ID            │
│                  │                      │ → Ticket ID           │
│                  │                      │ → Attestation Ref     │
├──────────────────┴──────────────────────┴───────────────────────┤
│ BAS : Export CSV | Pagination                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Composant clé :** `ProofChainView` — matérialise la chaîne de preuve native.

**Données :** `proof.allTickets`, `proof.simulationRuns`, `proof.replayVerify`, `proof.auditLog`

---

### E. Control (`/control`)

**Question :** Le système tient-il, techniquement et logiquement ?

> Pas seulement health technique — aussi health protocolaire et épistémique.

**Structure écran :**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : CONTROL ⊞ | état global OS4 | état X-108 | alerte     │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 1 — Infra Health                                           │
│ Python ✓/✗ | DB ✓/✗ | WS ✓/✗ | Latence | Erreurs | Fallback   │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 2 — Governance Health                                      │
│ Taux HOLD | Taux BLOCK | S3/S4 | Contradictions rate           │
│ Unknowns rate | Runs sans attestation | Runs sans ticket        │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 3 — Incident Center                                        │
│ Incidents récents | Violations | Pic d'unknowns                 │
│ Fraude / pattern critique | Deep-links → Live / Past / Future   │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 4 — Actions                                                │
│ [Ouvrir monde critique] [Ouvrir dernière S4]                    │
│ [Ouvrir preuve manquante] [Déclencher stress mission]           │
└─────────────────────────────────────────────────────────────────┘
```

**Données :** `engine.pythonStatus`, `proof.guardStats`, `proof.allTickets`, `engine.batchRun`

---

## 4. Structure des World Pages (Trading / Bank / Ecom)

Les World Pages ne sont plus des pages décoratives. Elles deviennent des **implémentations métier d'un protocole canonique commun**.

**Template universel — identique pour les 3 mondes :**

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER : [Nom Monde] | Mode | Source | X-108 Gate | Severity   │
│          Last Decision ID                                       │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 1 — Situation Métier                                       │
│ KPI du monde (métriques spécifiques Trading/Bank/Ecom)          │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 2 — Constellation Agentique                                │
│ Agents actifs du domaine organisés par rôle :                   │
│ [Observe] [Interpret] [Evaluate] [Resolve] [Prove]              │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 3 — Agrégation                                             │
│ Market verdict | Confidence | Contradictions | Unknowns         │
│ Risk flags | Evidence refs                                      │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 4 — Souveraineté                                           │
│ Décision Guard X-108 | Reason code | ALLOW/HOLD/BLOCK           │
├─────────────────────────────────────────────────────────────────┤
│ BLOC 5 — Preuve                                                 │
│ Ticket | Trace | Attestation | Replay                           │
└─────────────────────────────────────────────────────────────────┘
```

**Navigation secondaire contextuelle dans chaque World Page :**

```
[Overview] [Constellation] [Aggregation] [Proof Chain]
```

---

## 5. Organisation UIX des agents (couche agentique)

### 5 couches cognitives (rangement par rôle, pas par fichier Python)

| Couche | Label UI | Question | Agents Trading | Agents Bank | Agents Ecom |
|--------|----------|----------|----------------|-------------|-------------|
| A | **Observe** | Qu'est-ce qui se passe ? | MarketData, Liquidity, Volatility, Macro, Correlation, Event, Sentiment | Transaction, Counterparty, LiquidityExposure, BehaviorShift, FraudPattern, IdentityMismatch | TrafficQuality, BasketIntent, OfferHealth, CustomerTrust, FulfillmentRisk, CheckoutFriction |
| B | **Interpret** | Comment lire ce qui se passe ? | Momentum, MeanReversion, Breakout, Pattern, Prediction, RegimeShift | LimitPolicy, Affordability, TemporalUrgency, NarrativeConflict | ConversionReadiness, MarginProtection, ROASReality, IntentConflict, MerchantPolicy |
| C | **Evaluate** | Qu'est-ce que ça implique pour le métier ? | Portfolio, ExecutionQuality, PortfolioStress | RecoveryPath, LiquidityExposure, LimitPolicy | MarginProtection, FulfillmentRisk, ROASReality, MerchantPolicy |
| D | **Resolve** | Est-ce cohérent, contradictoire, overrideable ? | *(méta)* Unknowns, ConflictResolution, PolicyScope, SeverityClassifier, HumanOverrideEligibility | *(méta)* idem | *(méta)* idem |
| E | **Prove** | Peut-on prouver, tracer, rejouer ? | *(méta)* TicketReadiness, TraceIntegrity, AttestationReadiness, ReplayConsistency, ProofConsistency | BankProof + méta | EcomProof + méta |

### Présence des agents par surface

| Surface | Niveau de détail agents |
|---------|------------------------|
| **Mission** | Résumé : "17 agents actifs, 2 contradictions, proof ready" |
| **Live** | Condensé : top 3 contributeurs + 1 agrégat contradictions/unknowns + état preuve |
| **Future** | **Complet** : constellation entière organisée par couche, statut + poids + signal par agent |
| **Past** | Participants au run : noms + signaux produits + conflits + trace contribution |
| **Control** | Agrégé : agents silencieux, en anomalie, fort taux unknowns, provoquant HOLD/BLOCK |

### 4 vues possibles du panneau agents

| Vue | Description |
|-----|-------------|
| **Par rôle** | Observe / Interpret / Evaluate / Resolve / Prove |
| **Par domaine** | Trading / Bank / Ecom / Meta |
| **Par run** | Quels agents ont contribué à ce run spécifique |
| **Par incident** | Quels agents ont provoqué contradiction / unknown / blocage |

---

## 6. Composants UI à créer / refondre

### Nouveaux composants à créer

| Composant | Rôle | Utilisé dans |
|-----------|------|-------------|
| `DecisionEnvelopeCard` | Carte universelle CanonicalEnvelope | Live, Future, Past, Worlds, Control |
| `AgentConstellationPanel` | Vue constellation 5 couches (Observe→Prove) | Future, Past, Worlds |
| `AgentChip` | Pastille agent : nom + rôle + statut + score + conflit | AgentConstellationPanel |
| `AgentTraceDrawer` | Tiroir détail agent : input/output/confidence/flags/trace | AgentConstellationPanel |
| `AggregationLadder` | Chaîne : agents → agrégation domaine → X-108 → décision | Future, Worlds |
| `ProofChainView` | Chaîne : Decision ID → Trace ID → Ticket ID → Attestation Ref | Past, Worlds |
| `AgentRoleGroup` | Bloc par rôle cognitif avec header | AgentConstellationPanel |
| `StatusRail` | Barre toujours visible : monde / temps / mode / source / x108 / proof | Topbar |
| `WorldCard` | Carte monde pour Mission : verdict + gate + agents + attestation | Mission |
| `GovernanceHealthBlock` | Taux HOLD/BLOCK/S4/contradictions/unknowns/attestations manquantes | Control |

### Composants existants à refondre

| Composant | Changement |
|-----------|-----------|
| `CanonicalAgentPanel` | Renommer en `AgentConstellationPanel`, restructurer par couche |
| `DecisionTicketPanel` | Intégrer dans `DecisionEnvelopeCard` |
| `MissionControlPanel` | Refondre pour Control V2 (ajouter Governance Health) |
| `StrasbourgClock` | Garder, intégrer dans Control Bloc 1 |
| `ProofChainView` | Créer (n'existe pas encore) |
| `RunBreadcrumb` | Garder, enrichir avec Decision ID + Attestation |

### Composants à archiver (hors navigation principale)

`OpenBrainView`, `InWaitOut`, `StrasbourgClockModule`, `MacroShockPanel`, `MoltbookFeed`, `DemoMode`, `ComponentShowcase` — gardés mais non exposés dans la nav principale.

---

## 7. Hiérarchie de lecture fixe (tous les écrans)

Chaque écran doit toujours afficher les informations dans cet ordre de priorité visuelle :

| Niveau | Contenu | Traitement visuel |
|--------|---------|-------------------|
| **1 — Résultat** | verdict métier + x108_gate + severity | Grand, coloré, immédiat |
| **2 — Pourquoi** | reason_code + contradictions + unknowns + risk_flags | Secondaire, lisible |
| **3 — Contexte** | source + monde + agents + agrégation + métriques | Tertiaire, condensé |
| **4 — Preuve** | decision_id + trace + ticket + attestation | Accessible, cliquable |
| **5 — Debug** | raw_engine + détails techniques | Replié par défaut |

---

## 8. Règle des tableaux métriques

Chaque tableau doit obligatoirement avoir :

1. **Un titre métier** — ex : "État de risque Trading", "Confiance agrégée Bank"
2. **Une phrase d'interprétation** — ex : "Au-dessus de 0.72, le Guard peut autoriser sans délai"
3. **Un statut visuel** — normal / à surveiller / critique
4. **Une action liée** — ouvrir run / ouvrir détail / comparer / voir preuve

Si un tableau ne remplit pas ces 4 critères → replié ou supprimé.

---

## 9. Ordre d'implémentation recommandé

Le pack canonique recommande : Trading → Bank → méta-agents → Ecom → surfaces OS4. Le frontend suit la même logique.

### Phase 1 — Socle navigation + Mission + Future + Trading (priorité absolue)

**Objectif :** remplacer la navigation, poser le socle canonique, rendre Future opérationnel.

| # | Fichier | Action | Dépendance |
|---|---------|--------|-----------|
| 1.1 | `client/src/App.tsx` | Remplacer NAV_ITEMS (5→5), ajouter redirects, topbar monde+mode+gate | — |
| 1.2 | `client/src/components/StatusRail.tsx` | **Créer** — barre persistante monde/temps/mode/source/x108/proof | — |
| 1.3 | `client/src/components/DecisionEnvelopeCard.tsx` | **Créer** — carte universelle CanonicalEnvelope | — |
| 1.4 | `client/src/pages/Mission.tsx` | **Créer** — 3 WorldCards + accès rapide | DecisionEnvelopeCard |
| 1.5 | `client/src/components/AgentChip.tsx` | **Créer** — pastille agent | — |
| 1.6 | `client/src/components/AgentRoleGroup.tsx` | **Créer** — bloc par couche cognitive | AgentChip |
| 1.7 | `client/src/components/AgentConstellationPanel.tsx` | **Créer** (refonte CanonicalAgentPanel) | AgentRoleGroup |
| 1.8 | `client/src/components/AggregationLadder.tsx` | **Créer** — chaîne agents→agrégation→X108→décision | — |
| 1.9 | `client/src/pages/Future.tsx` | **Créer** — cockpit 3 colonnes (commandes/simulation/résultat) + bas constellation | AgentConstellationPanel, AggregationLadder, DecisionEnvelopeCard |
| 1.10 | `client/src/pages/TradingWorld.tsx` | **Refondre** — 5 blocs (Situation/Constellation/Agrégation/Souveraineté/Preuve) | AgentConstellationPanel |

### Phase 2 — Live + Past + Trading complet

| # | Fichier | Action | Dépendance |
|---|---------|--------|-----------|
| 2.1 | `client/src/pages/Live.tsx` | **Créer** — feed live 3 colonnes (filtres/envelopes/détail) | DecisionEnvelopeCard |
| 2.2 | `client/src/components/ProofChainView.tsx` | **Créer** — chaîne Decision→Trace→Ticket→Attestation | — |
| 2.3 | `client/src/pages/Past.tsx` | **Créer** — historique 3 colonnes (filtres/timeline/détail+proof chain) | ProofChainView, DecisionEnvelopeCard |
| 2.4 | `client/src/components/AgentTraceDrawer.tsx` | **Créer** — tiroir détail agent | — |
| 2.5 | `client/src/pages/TradingWorld.tsx` | **Compléter** — nav secondaire Overview/Constellation/Aggregation/Proof Chain | AgentTraceDrawer |

### Phase 3 — Bank

| # | Fichier | Action | Dépendance |
|---|---------|--------|-----------|
| 3.1 | `client/src/pages/BankWorld.tsx` | **Refondre** — 5 blocs template universel | AgentConstellationPanel |
| 3.2 | Agents Bank dans AgentConstellationPanel | Mapper les 12 agents Bank sur les 5 couches | — |

### Phase 4 — Control + méta-agents

| # | Fichier | Action | Dépendance |
|---|---------|--------|-----------|
| 4.1 | `client/src/components/GovernanceHealthBlock.tsx` | **Créer** — taux HOLD/BLOCK/S4/contradictions/unknowns | — |
| 4.2 | `client/src/pages/Controle.tsx` | **Refondre** → `/control` — 4 blocs (Infra/Governance/Incidents/Actions) | GovernanceHealthBlock |
| 4.3 | AgentConstellationPanel | Ajouter vue "Par incident" et vue "Control" | — |

### Phase 5 — Ecom

| # | Fichier | Action | Dépendance |
|---|---------|--------|-----------|
| 5.1 | `client/src/pages/EcomWorld.tsx` | **Refondre** — 5 blocs template universel | AgentConstellationPanel |
| 5.2 | Agents Ecom dans AgentConstellationPanel | Mapper les 12 agents Ecom sur les 5 couches | — |

### Phase 6 — Proof chain complète + polish global

| # | Fichier | Action |
|---|---------|--------|
| 6.1 | `client/src/pages/Past.tsx` | Intégrer replay complet + export CSV |
| 6.2 | `client/src/pages/Mission.tsx` | Enrichir WorldCards avec données live |
| 6.3 | Topbar | Compléter StatusRail avec polling données réelles |
| 6.4 | Tous les tableaux métriques | Appliquer règle des 4 critères (titre/interprétation/statut/action) |
| 6.5 | Textes longs | Replier dans accordéons, sortir de la couche principale |
| 6.6 | Tests Vitest | Couvrir DecisionEnvelopeCard, AgentConstellationPanel, ProofChainView |

---

## 10. Schéma de migration des routes

```
AVANT                    APRÈS
─────────────────────    ─────────────────────────────────────
/           (OS4Home) →  /mission        (Mission)
/simuler    (Simuler) →  /future         (Future)
/decision   (Decision)→  /live           (Live — présent)
                         /past           (Past — historique)
/preuves    (Preuves) →  /past           (sous-couche Past)
/controle   (Controle)→  /control        (Control)
/trading              →  /trading        (World page V2)
/bank                 →  /bank           (World page V2)
/ecom                 →  /ecom           (World page V2)

ORPHELINES (gardées, hors nav) :
/engine /stress /audit /mirror /reactor /governance
/proof-center /portfolio /agents /predictions /docs
/roadmap /scenario-engine /automated-tests /how-it-works
/technology /what-is-obsidia /decision-lifecycle /demo-mode
```

---

## 11. Résumé des changements par catégorie

### Fichiers à créer (nouveaux)

| Fichier | Type |
|---------|------|
| `client/src/pages/Mission.tsx` | Page |
| `client/src/pages/Live.tsx` | Page |
| `client/src/pages/Future.tsx` | Page |
| `client/src/pages/Past.tsx` | Page |
| `client/src/components/StatusRail.tsx` | Composant |
| `client/src/components/DecisionEnvelopeCard.tsx` | Composant |
| `client/src/components/AgentChip.tsx` | Composant |
| `client/src/components/AgentRoleGroup.tsx` | Composant |
| `client/src/components/AgentConstellationPanel.tsx` | Composant (refonte) |
| `client/src/components/AggregationLadder.tsx` | Composant |
| `client/src/components/ProofChainView.tsx` | Composant |
| `client/src/components/AgentTraceDrawer.tsx` | Composant |
| `client/src/components/GovernanceHealthBlock.tsx` | Composant |
| `client/src/components/WorldCard.tsx` | Composant |

### Fichiers à refondre (existants modifiés)

| Fichier | Changement |
|---------|-----------|
| `client/src/App.tsx` | Nouvelle nav, redirects, topbar StatusRail |
| `client/src/pages/TradingWorld.tsx` | 5 blocs template universel |
| `client/src/pages/BankWorld.tsx` | 5 blocs template universel |
| `client/src/pages/EcomWorld.tsx` | 5 blocs template universel |
| `client/src/pages/Controle.tsx` | 4 blocs Control V2 |

### Fichiers backend (aucun changement)

Le backend reste intact. Aucune modification de `server/routers.ts`, `drizzle/schema.ts`, `server/db.ts` ou des engines.

---

## 12. Phrase produit finale

> **Les agents proposent. X-108 dispose. La preuve reste.**

L'interface V2 doit rendre cette phrase visible à chaque écran, à travers la chaîne :

```
Monde → Constellation d'agents → Agrégation → Guard X-108 → Enveloppe canonique → Preuve
```

Filtrée par temporalité :

```
Live (maintenant) | Future (demain) | Past (hier) | Control (toujours)
```
