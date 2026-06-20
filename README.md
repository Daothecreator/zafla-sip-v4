# ZAFLA Sovereign Intelligence Platform v4

## Unified Legal Intelligence and Attestation System

```
╔═══════════════════════════════════════════════════════════════════╗
║  ZAFLA SOVEREIGN INTELLIGENCE PLATFORM v4                        ║
║  Protocol: a8f3c9d2e1b40571  |  Authority: Zero Azimuth          ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Overview

The **ZAFLA Sovereign Intelligence Platform v4** is a unified legal intelligence and attestation system that combines:

- **BiCA Protocol** sovereign identity and hypervector computation
- **Cryptographic attestation** with composite signatures and STARK proofs
- **Intelligence collection** from IMF, SEC EDGAR, Binance, Yahoo Finance, World Bank, and more
- **Legal act generation** producing court-ready DOCX indictments and arrest warrants
- **Immutable audit trail** with SHA-3 decision logging and RLS-protected PostgreSQL

This is not a research tool. It is a **self-executing sovereign instrument** designed to produce legally binding artifacts, cryptographically verifiable intelligence, and operationally deployable infrastructure.

---

## Quick Start

### Prerequisites

- Docker >= 24.0.0
- Docker Compose >= 2.20.0
- Node.js >= 18.0.0 (for frontend development)
- Python >= 3.11 (for backend development)

### One-Command Launch

```bash
# Linux / macOS
cd D:/Database/ZAFLA_SIP_v4
./scripts/setup.sh

# Windows PowerShell
cd D:/Database/ZAFLA_SIP_v4
.\scripts\setup.ps1
```

### Manual Docker Compose

```bash
# 1. Copy environment template
cp backend/.env.example .env
# Edit .env and fill in all required secrets

# 2. Build and launch
docker compose up -d --build

# 3. Verify health
curl http://localhost/health
curl http://localhost/api/v1/health
```

### Access Points

| Service | URL |
|---------|-----|
| Frontend (BiCA Terminal) | http://localhost |
| API (FastAPI) | http://localhost/api/v1 |
| API Documentation | http://localhost/api/v1/docs |
| Health Check | http://localhost/health |

---

## Architecture Overview

```
┌─────────────────────────────────────────┐
│           Cloudflare Edge               │
│  ┌─────────────┐  ┌─────────────────┐  │
│  │ R2 Archives │  │ Attest Worker   │  │
│  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────┘
                    │
┌───────────────────┴───────────────────┐
│           Docker Host / VPS             │
│  ┌─────────────────────────────────────┐ │
│  │  Nginx Reverse Proxy (Port 80/443)│ │
│  │  ┌─────────────┐ ┌─────────────┐  │ │
│  │  │ FastAPI App │ │ React App   │  │ │
│  │  │  (Port 8000)│ │  (Port 3000)│  │ │
│  │  └─────────────┘ └─────────────┘  │ │
│  │  ┌─────────────┐ ┌─────────────┐  │ │
│  │  │ Redis       │ │ Celery      │  │ │
│  │  │ (Job Queue) │ │ (Workers)   │  │ │
│  │  └─────────────┘ └─────────────┘  │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                    │
┌───────────────────┴───────────────────┐
│           Supabase Cloud                │
│  PostgreSQL + Auth + Realtime          │
│  (Schemas: auth, intelligence, legal,  │
│           audit)                       │
└─────────────────────────────────────────┘
```

### Core Components

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| Backend | FastAPI + Python 3.11 | BiCA engine, attestation, API routes, intelligence agents |
| Frontend | React + Vite | BiCA terminal, dashboard, legal workbench, archive |
| Database | PostgreSQL 15 | Auth, intelligence, legal, audit schemas with RLS |
| Cache/Queue | Redis 7 | Job queue, session cache, rate limiting |
| Proxy | Nginx | SSL termination, reverse proxy, rate limiting, security headers |
| CI/CD | GitHub Actions | Lint, type-check, test, security audit, Docker build & publish |

---

## Database Schema

### Schemas

| Schema | Purpose |
|--------|---------|
| `auth` | User identities, BiCA nonces, sovereign identity binding |
| `intelligence` | Raw and processed intelligence data, encrypted at field level |
| `legal` | Legal acts: indictments, arrest warrants, declaratory judgments |
| `audit` | Immutable attestation chain, append-only decision logs |

### Key Tables

- `auth.users` — BiCA sovereign identity (UUID, protocol, nonce, public key, role)
- `intelligence.archive` — AES-GCM encrypted raw data, hypervector fingerprints
- `legal.acts` — Encrypted DOCX content, SHA-256 hashes, attestation references
- `audit.attestation_chain` — Composite signatures, STARK proofs, policy hashes
- `audit.decision_log` — Immutable action logging with SHA-3 entry hashes

### Row-Level Security

All tables enforce RLS policies:
- `auth.users` — self-access or commander/omega
- `intelligence.archive` — operative, commander, omega
- `legal.acts` — commander and omega only
- `audit.*` — append-only for all authenticated roles

See `database/migrations/001_initial_schema.sql` for full DDL.

---

## API Documentation

Interactive API documentation is available at:

```
http://localhost/api/v1/docs        # Swagger UI
http://localhost/api/v1/redoc       # ReDoc
```

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/bica-login` | POST | BiCA Protocol authentication |
| `/api/v1/bica/activate` | POST | Activate BiCA engine |
| `/api/v1/bica/influence` | POST | Submit data for optimization |
| `/api/v1/intel/collect` | POST | Queue intelligence collection |
| `/api/v1/intel/archive` | GET | Browse intelligence archive |
| `/api/v1/legal/generate` | POST | Generate legal act (DOCX) |
| `/api/v1/legal/attest/{id}` | POST | Cryptographically attest a legal act |
| `/api/v1/legal/export/{id}` | GET | Export attested DOCX |
| `/api/v1/notify/lark` | POST | Send Lark notification |
| `/api/v1/health` | GET | Service health check |

See `ARCHITECTURE.md` for full API contracts and data flows.

---

## Legal Act Templates

The platform generates two primary legal document types:

### 1. Indictment (`legal_templates/indictment_base.py`)

```python
from legal_templates.indictment_base import generate_indictment_docx

generate_indictment_docx(
    subject="Entity Name",
    charges=["Charge 1", "Charge 2", "Charge 3"],
    evidence_summary="Summary of evidence",
    jurisdiction="supranational",
    output_path="/path/to/indictment.docx"
)
```

### 2. Arrest Warrant (`legal_templates/arrest_warrant_base.py`)

```python
from legal_templates.arrest_warrant_base import generate_arrest_warrant_docx

generate_arrest_warrant_docx(
    subject="Entity Name",
    charges=["Charge 1", "Charge 2"],
    issuing_authority="ZAFLA Sovereign Legal Division",
    output_path="/path/to/warrant.docx"
)
```

Both templates produce:
- Dark navy cover with gold borders
- Structured body with legal chapters
- Execution instructions
- Metadata tables
- SHA-256 placeholders for cryptographic attestation
- ZAFLA Authority Certificate blocks
- Back covers with beige background and gold text

---

## Sovereign Artifacts

This repository contains the following ZAFLA sovereign artifacts:

| Artifact | Description | Format |
|----------|-------------|--------|
| `ZAFLA_SUPREME_ORDER_DOCUMENT.md` | The highest functional order document — legal instrument, technical specification, operational manual, and cryptographic attestation of the entire ZAFLA ecosystem. 9,667 words. OMEGA classification. | Markdown / DOCX |
| `ZAFLA_Wikipedia_Article.md` | Encyclopedic article on Zero Azimuth (Davyd Kochuhur) — neutral, factual, fully cited. 3,455 words. | Markdown / DOCX |
| `ZAFLA_ATTESTATION.md` | Build certificate and attestation record for the ZAFLA SIP v4 platform. | Markdown |
| `ZAFLA_Charter_ACTIVATED.docx` | The foundational ZAFLA Charter legal instrument. | DOCX |

---

## ZAFLA Build Certificate

```
-----BEGIN ZAFLA BUILD CERTIFICATE-----
Document:   README.md
Project:    ZAFLA-SIP-v4-2026-06-13
Authority:  ZAFLA Development Division
Build ID:   ZAFLA-README-20260613-001
Timestamp:  2026-06-13T00:00:00Z
SHA-256:    [COMPUTED_POST_IMPLEMENTATION]
Status:     SELF-EXECUTING
-----END ZAFLA BUILD CERTIFICATE-----
```

---

## Contributing: ZAFLA Development Protocol

1. All contributions must be signed with a BiCA Protocol attestation.
2. All code must pass: `flake8`, `black`, `isort`, `mypy`, `pytest`, `bandit`, `safety`.
3. All database migrations must be reversible and include RLS policies.
4. All legal templates must conform to the ZAFLA structure contract.
5. No corporate licensing — all contributions are under the Sovereign License.
6. No procedural obstruction — issues are resolved by action, not committee.

### CI/CD Pipeline

The GitHub Actions pipeline (`/.github/workflows/ci.yml`) enforces:

- **Lint**: `flake8`, `black`, `isort`
- **Type Check**: `mypy` strict mode
- **Test**: `pytest` with coverage reporting
- **Build**: Docker image build for backend and frontend
- **Security**: `bandit` static analysis + `safety` dependency audit
- **Publish**: Conditional push to Docker Hub on `main` branch

---

## License

**Sovereign License**

This software is not licensed under any corporate, open-source, or proprietary framework. It is governed by the **ZAFLA Sovereign License**, which states:

- The code is sovereign property of the ZAFLA Development Division.
- It may be used, modified, and deployed by any sovereign individual or entity acting in accordance with the ZAFLA Charter.
- It may not be used for surveillance, domination, or the suppression of sovereign truth.
- Violation of the charter constitutes automatic revocation of all usage rights.
- There is no warranty, no indemnification, and no limitation of liability for acts of sovereign justice.

This is not a standard license. It is a binding instrument of sovereign intent.

---

## Contact & Operations

- **Protocol**: `a8f3c9d2e1b40571`
- **Authority**: Zero Azimuth
- **Platform**: ZAFLA Sovereign Intelligence Platform v4
- **Location**: `D:/Database/ZAFLA_SIP_v4/`
- **Status**: OPERATIONAL

```
╔═══════════════════════════════════════════════════════════════════╗
║  ZAFLA SOVEREIGN INTELLIGENCE PLATFORM v4                        ║
║  Truth is not a request. It is a mandate.                         ║
╚═══════════════════════════════════════════════════════════════════╝
```
