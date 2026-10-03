# VASPTrace — Blockchain Forensics & Exchange Identification Platform

**SIH Problem Statement SIH26183:**  
*“Real-Time Identification of Fraud-Linked Cryptocurrency Exchanges from Victim-Reported Suspect Wallet Addresses through Automated Blockchain Analytics”*

**Organization:** Ministry of Home Affairs / Indian Cybercrime Coordination Centre (I4C)  
**Theme:** Blockchain & Cybersecurity  

---

## 🛡️ Executive Summary & Workflow

**VASPTrace** is an enterprise-grade **Investigative Blockchain Forensics & VASP Identification Platform** designed for law enforcement agencies (LEAs), cybercrime investigation units (State Cyber Cells, I4C, CBI, ED), and financial intelligence units (FIU-IND).

### Core Investigative Workflow:
```
VICTIM REPORT (NCRP Reference)
      ↓
SUSPECT WALLET INGESTION (EVM / BTC / TRON)
      ↓
MULTI-HOP TRAVERSAL ENGINE (1 TO 5 HOPS)
      ↓
INTERMEDIARY MULE & PEEL CHAIN DETECTION
      ↓
LAYERING & FUND-MOVEMENT DETECTION
      ↓
VASP & EXCHANGE ATTRIBUTION (FIU-IND & Global Clusters)
      ↓
EXPLAINABLE RISK SCORING (Deterministic Heuristics)
      ↓
CRYPTOGRAPHIC EVIDENCE VAULT (SHA-256 Seal)
      ↓
ACTIONABLE LEGAL DIRECTIVES (Section 91 Cr.P.C. / PMLA)
      ↓
STANDARDIZED INVESTIGATION REPORT (PDF / Print & JSON)
```

---

## 🚀 Key Functional Capabilities

1. **TracePath — Multi-Hop Fund Tracing (1–5 Hops)**:
   - Complete hop-by-hop breakdown from suspect collector wallet $\to$ mules $\to$ bridges $\to$ VASP sweepers.
   - Calculates transfer amounts, USD valuations, block timestamps, elapsed durations ($\Delta t$), risk signals, and attribution confidence ratings.
2. **Interactive Transaction Graph**:
   - Directed acyclic graph with pan, zoom, fit graph, hop depth filters (1–5), node type filters (Exchanges, Bridges, Mixers, Intermediaries), and instant inspection drawers.
3. **Wallet Clustering Engine**:
   - Heuristic grouping based on common input ownership, gas relayer linkages, and synchronized timings with mandatory **non-proof evidentiary disclaimer**.
4. **Layering & Fund Movement Detection**:
   - Automated detection of Rapid Fund Movement ($<10\text{ min}$ egress), Fan-Out Layering, Peel Chain Fragmentation, Consolidation, Cross-Chain Bridge Lock, and Privacy Pool Interruption with explainable severities and evidence.
5. **Real-Time Wallet Surveillance & Monitoring**:
   - Configurable monitoring rules (Thresholds, Risk, Duration), live `MONITORING ACTIVE` state, and **"⚡ Trigger Sim Alert"** on-chain movement simulator.
6. **Smart Alert System**:
   - Complete event lifecycle (`NEW` $\to$ `ACKNOWLEDGED` $\to$ `INVESTIGATING` $\to$ `RESOLVED`) with 1-click jumps to TracePath and Case Dossiers.
7. **Cross-Chain Bridge Tracking**:
   - Multi-chain tracing: $\text{Ethereum} \to \text{Hop Protocol Router} \to \text{Polygon PoS} \to \text{WazirX Gateway}$, with fallback notice when destination is unresolvable.
8. **Trace Interruption Detection**:
   - Explicit breakpoint identification at Tornado Cash zero-knowledge privacy pools with last observable wallet and LEA referral protocol.
9. **VASP & Entity Intelligence Registry**:
   - Verified registry of FIU-IND registered entities (WazirX, CoinDCX) and global VASPs (Binance, Kraken) with **Section 91 Cr.P.C. / PMLA subpoena drafting directives**.
10. **Fraud Pattern Library**:
    - Indicator catalog and rule engine across **all 8 typologies**: Investment Fraud, Task Fraud, Phishing, Ransomware, Sextortion, Darknet Fraud, Organized Cyber Fraud, and Other.
11. **Forensic Chronological Timeline**:
    - Timestamped vertical event trail of fund dispersal milestones from victim inflow to exchange cashout.
12. **Evidence Locker & Chain of Custody**:
    - Cryptographically sealed vault with block heights, SHA-256 integrity hash verification, and JSON/CSV export.
13. **Investigator Notes System**:
    - Integrated forensic notes editor across Cases, Wallets, Transactions, and Alerts with author and timestamp recording.
14. **Collaborative Case Management**:
    - Multi-tier role assignment (Lead Investigator, Supporting Forensic Analyst, Reviewing Supervisor) and full audit logs.
15. **Explainable Risk Scoring**:
    - Mathematical score breakdown matrix with component factor weights (Velocity: 25%, Mixer: 30%, Layering: 20%, VASP Terminus: 25%) and legal limitations disclaimer.
16. **Executive Analytics Dashboard**:
    - High-level overview of total cases, critical priority docket, VASP attribution success rate (92.4%), top identified exchanges, and crime distribution.
17. **Global Search (`Ctrl+K`)**:
    - Multi-index search modal across Wallets, Transactions, Cases, Entities, and Clusters.
18. **Standardized Dossier Reports**:
    - Formal MHA / I4C investigation reports with print/PDF preview and digital SHA-256 seal.
19. **Data Sources & System Health**:
    - Live latency monitoring across Ethereum, Bitcoin, Polygon, Tron archive nodes, and FIU-IND registries.
20. **Deterministic Demo & Live Data Modes**:
    - Explicit provenance tags (`DEMO DATA` vs `LIVE DATA` vs `EXTERNAL LABEL`).

---

## 🏃 Running the Application

### 1. Requirements
- Node.js (v20+ or v22+)
- Modern Web Browser (Chrome / Edge / Firefox)

### 2. Start Standalone Forensic Platform
```bash
node server.js
```
The server runs locally at:  
👉 **`http://localhost:5000`**

---

## 📂 Project Architecture
```
sih26183-forensics-platform/
├── server.js               # Node.js + SQLite (WAL mode) backend & REST API engine
├── public/
│   └── index.html          # High-performance SPA frontend (4 themes, SVG graph, 20 views)
├── forensics.sqlite        # Relational forensic database (cases, alerts, notes, clusters)
├── README.md               # Comprehensive documentation & deployment guide
└── start.bat               # Windows one-click startup script
```
