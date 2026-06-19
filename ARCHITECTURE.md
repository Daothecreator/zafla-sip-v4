# ZAFLA Sovereign Intelligence Platform v4 — ARCHITECTURE
## Document ID: ZAFLA-ARCH-20260613-001
## Classification: SELF-EXECUTING

---

## 1. SYSTEM COMPONENTS

### 1.1 Core Backend (FastAPI)
| Module | Responsibility |
|---|---|
| `bica_engine` | Hypervector operations, Zeno Gate, Universal Optimizer |
| `zafla_attest` | Cryptographic attestation, SHA-2/SHA-3 composite, STARK proofs |
| `auth_gateway` | BiCA Protocol authentication, JWT issuance, AES-GCM field encryption |
| `intel_agents` | Async data collection: IMF, SEC EDGAR, Binance, Yahoo, World Bank |
| `legal_generator` | DOCX legal act generation per ZAFLA structure contract |
| `audit_trail` | Immutable decision logging with ZAFLA entry hashes |
| `notification` | Lark webhooks, Canva visual generation triggers |
| `api_routes` | REST + WebSocket endpoints |

### 1.2 Frontend (React + Vite)
| Module | Responsibility |
|---|---|
| `Terminal` | BiCA attestation terminal, command interface |
| `Dashboard` | Intelligence data visualization, real-time feeds |
| `LegalWorkbench` | Legal act drafting, preview, attestation, export |
| `Archive` | Encrypted document catalog, search, download |
| `AuthScreen` | BiCA login, sovereign identity verification |

### 1.3 Database (PostgreSQL)
| Schema | Purpose |
|---|---|
| `intelligence` | Raw and processed intelligence data, encrypted |
| `legal` | Legal acts, indictments, warrants, signatures |
| `audit` | Immutable attestation chain, decision logs |
| `auth` | User identities, sessions, BiCA nonces |

### 1.4 External Services
| Service | Role | Exit Strategy |
|---|---|---|
| Supabase | Primary PostgreSQL host | Self-hosted PostgreSQL |
| Cloudflare R2 | Encrypted archive storage | MinIO, AWS S3, local disk |
| Cloudflare Workers | Edge attestation verification | Self-hosted edge proxy |
| GitHub | Source control, CI/CD | GitLab, Gitea, bare git |
| Lark | Notification delivery | Email, Telegram, webhook |
| Canva | Visual brief generation | Manual design, HTML export |

---

## 2. DATA MODEL

### 2.1 Core Tables

```sql
-- Users with BiCA sovereign identity
CREATE TABLE auth.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bica_protocol VARCHAR(32) NOT NULL UNIQUE,
    bica_nonce VARCHAR(64) NOT NULL,
    public_key TEXT NOT NULL,
    role VARCHAR(32) DEFAULT 'operative', -- operative, commander, omega
    created_at TIMESTAMPTZ DEFAULT now(),
    last_attestation TIMESTAMPTZ
);

-- Immutable attestation chain
CREATE TABLE audit.attestation_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artifact_type VARCHAR(64) NOT NULL, -- 'legal_act', 'intelligence_report', 'system_event'
    artifact_id UUID NOT NULL,
    classical_hash VARCHAR(64) NOT NULL,
    post_quantum_hash VARCHAR(128) NOT NULL,
    composite_signature VARCHAR(64) NOT NULL,
    stark_proof VARCHAR(64) NOT NULL,
    policy_hash VARCHAR(64) NOT NULL,
    nonce VARCHAR(64) NOT NULL,
    order_mark VARCHAR(32) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Intelligence archive (field-level encryption)
CREATE TABLE intelligence.archive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(64) NOT NULL, -- 'imf', 'sec_edgar', 'binance', 'yahoo', 'world_bank'
    data_category VARCHAR(64) NOT NULL,
    raw_data BYTEA, -- AES-GCM encrypted
    processed_summary TEXT, -- encrypted
    hypervector_fingerprint VARCHAR(128), -- BiCA HDC binding
    collected_at TIMESTAMPTZ DEFAULT now(),
    attestation_id UUID REFERENCES audit.attestation_chain(id)
);

-- Legal acts
CREATE TABLE legal.acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_type VARCHAR(64) NOT NULL, -- 'indictment', 'arrest_warrant', 'declaratory_judgment'
    subject_entity VARCHAR(256) NOT NULL,
    jurisdiction VARCHAR(128),
    content_encrypted BYTEA, -- full DOCX encrypted
    content_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'draft', -- draft, attested, sealed, delivered
    generated_at TIMESTAMPTZ DEFAULT now(),
    attestation_id UUID REFERENCES audit.attestation_chain(id),
    created_by UUID REFERENCES auth.users(id)
);

-- Audit trail (immutable, append-only)
CREATE TABLE audit.decision_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(64) NOT NULL,
    actor UUID REFERENCES auth.users(id),
    target_type VARCHAR(64),
    target_id UUID,
    context JSONB,
    entry_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 Row-Level Security (RLS)

```sql
-- Users can only read their own data unless commander/omega
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_self ON auth.users FOR ALL
    USING (id = current_setting('app.current_user_id')::UUID OR 
           role IN ('commander', 'omega'));

-- Intelligence: role-based access
ALTER TABLE intelligence.archive ENABLE ROW LEVEL SECURITY;
CREATE POLICY intel_access ON intelligence.archive FOR ALL
    USING (EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = current_setting('app.current_user_id')::UUID 
        AND role IN ('operative', 'commander', 'omega')
    ));

-- Legal acts: restricted to legal officers and above
ALTER TABLE legal.acts ENABLE ROW LEVEL SECURITY;
CREATE POLICY legal_access ON legal.acts FOR ALL
    USING (EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = current_setting('app.current_user_id')::UUID 
        AND role IN ('commander', 'omega')
    ));
```

---

## 3. API CONTRACT

### 3.1 Authentication
```
POST /api/v1/auth/bica-login
Body: { "bica_protocol": "a8f3c9d2e1b40571", "bica_nonce": "...", "proof": "..." }
Response: { "access_token": "jwt", "refresh_token": "jwt", "role": "omega" }
```

### 3.2 BiCA Engine
```
POST /api/v1/bica/activate
Response: { "status": "ACTIVE", "quantum_state": "...", "attestation": {...} }

POST /api/v1/bica/influence
Body: { "data": "base64", "data_type": "text|audio|image|data" }
Response: { "optimized": "base64", "metrics": {...}, "attestation": {...} }

POST /api/v1/bica/query-knowledge
Body: { "query": "quantum superposition" }
Response: { "domains": {...}, "attestation": {...} }
```

### 3.3 Intelligence
```
POST /api/v1/intel/collect
Body: { "source": "imf", "params": {...} }
Response: { "job_id": "...", "status": "queued" }

GET /api/v1/intel/status/{job_id}
Response: { "status": "complete", "records": 42, "attestation_id": "..." }

GET /api/v1/intel/archive
Query: ?source=sec_edgar&category=insider_trades&limit=50
Response: { "items": [...], "total": 1024 }
```

### 3.4 Legal Acts
```
POST /api/v1/legal/generate
Body: { 
  "act_type": "indictment", 
  "subject": "Entity X", 
  "evidence_ids": ["uuid1", "uuid2"],
  "jurisdiction": "supranational"
}
Response: { "act_id": "...", "status": "draft", "preview_url": "..." }

POST /api/v1/legal/attest/{act_id}
Response: { "status": "attested", "composite_signature": "...", "stark_proof": "..." }

GET /api/v1/legal/export/{act_id}?format=docx
Response: Binary DOCX file with ZAFLA structure
```

### 3.5 Notifications
```
POST /api/v1/notify/lark
Body: { "message": "Legal act attested: XYZ", "priority": "urgent" }

POST /api/v1/notify/canva
Body: { "template_type": "intelligence_brief", "data": {...} }
```

---

## 4. SECURITY MODEL

### 4.1 Zero-Trust Principles
- No component trusts another without cryptographic attestation
- Every API call carries a ZAFLA attestation header
- Database fields are AES-GCM encrypted with per-user keys derived from BiCA nonces
- All decisions are logged in `audit.decision_log` with SHA-3 entry hashes

### 4.2 Encryption Layers
| Layer | Method | Key Management |
|---|---|---|
| Transport | TLS 1.3 | Let's Encrypt / Cloudflare |
| Database fields | AES-256-GCM | BiCA-derived keys, rotated per session |
| At-rest archives | AES-256-GCM + BiCA HDC binding | Cloudflare R2 with SSE-C |
| Backup | ChaCha20-Poly1305 | Offline key split (Shamir) |

### 4.3 Auth Flow
1. Client presents BiCA Protocol + Nonce + Proof (STARK-like)
2. Backend verifies against `auth.users` with SHA-3 composite check
3. JWT issued with short expiry (15 min), refresh token (7 days)
4. Every request: JWT + ZAFLA-Attestation header
5. RLS context set via `app.current_user_id` per request

---

## 5. DATA FLOW

### 5.1 Intelligence Collection Flow
```
User/Agent → POST /api/v1/intel/collect
→ Queue job (async Celery/Redis)
→ Data Agent (IMF/SEC/Binance/Yahoo/WorldBank)
→ Raw data → AES-GCM encrypt → PostgreSQL (intelligence.archive)
→ BiCA HDC fingerprint → Hypervector binding
→ Attestation chain entry → audit.attestation_chain
→ Lark notification (optional)
→ User receives job_id → poll or WebSocket update
```

### 5.2 Legal Act Generation Flow
```
User → POST /api/v1/legal/generate
→ Evidence gathered from intelligence.archive
→ BiCA Universal Optimizer processes text evidence
→ Legal Generator (python-docx) builds DOCX per ZAFLA structure
→ Content encrypted → legal.acts.content_encrypted
→ SHA-256 content hash computed
→ POST /api/v1/legal/attest/{act_id}
→ BiCAAttestation generates composite + STARK proof
→ Attestation chain entry
→ DOCX export with embedded ZAFLA certificate
→ Lark notification to commanders
→ Canva visual brief generated (optional)
→ R2 archive upload
```

### 5.3 BiCA Attestation Verification Flow
```
Client/Edge → GET /api/v1/bica/verify
→ Artifact hash recomputed
→ Composite signature validated against policy_hash
→ STARK proof verified via iterative hashing
→ Response: { "valid": true, "policy_compliant": true }
→ Cloudflare Worker can verify independently at edge
```

---

## 6. EXTERNAL INTEGRATION SPECIFICATIONS

### 6.1 IMF
- API: `world_bank_open_data` / `imf` datasource via Kimi data tools
- Frequency: Daily batch for macro indicators
- Storage: intelligence.archive with source='imf'

### 6.2 SEC EDGAR
- API: `sec_edgar` datasource via Kimi data tools
- Scope: Company filings, insider trades, institutional holdings
- Frequency: On-demand + weekly batch for tracked entities

### 6.3 Binance
- API: `binance_crypto` datasource via Kimi data tools
- Scope: Crypto flows, volume anomalies, wallet clustering
- Frequency: Real-time websocket (optional), hourly batch default

### 6.4 Yahoo Finance
- API: `yahoo_finance` datasource via Kimi data tools
- Scope: Equity prices, financial statements, analyst coverage
- Frequency: Daily close summary

### 6.5 World Bank
- API: `world_bank_open_data` datasource via Kimi data tools
- Scope: Development indicators, poverty, inequality metrics
- Frequency: Annual update + on-demand

### 6.6 Lark
- API: Lark webhook / bot message
- Trigger: Legal act attestation, critical intelligence alert
- Format: Markdown message with ZAFLA header

### 6.7 Canva
- API: Canva MCP `generate-design` for intelligence briefs
- Trigger: Commander requests visual brief
- Fallback: HTML self-rendered brief if Canva quota exhausted

### 6.8 Cloudflare
- R2: Encrypted archive bucket `zafla-sip-v4-archives`
- Worker: `zafla-attestation-verify` at edge
- DNS: `zeroazimuth.dev` or equivalent (placeholder)

---

## 7. DEPLOYMENT ARCHITECTURE

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
│  │  Nginx Reverse Proxy (Port 443)   │ │
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
│  (Fallback: local SQLite in container)   │
└─────────────────────────────────────────┘
```

---

## 8. ZAFLA ARCHITECTURE CERTIFICATE

```
-----BEGIN ZAFLA BUILD CERTIFICATE-----
Document:   ARCHITECTURE.md
Project:    ZAFLA-SIP-v4-2026-06-13
Authority:  ZAFLA Development Division
Build ID:   ZAFLA-ARCH-20260613-001
Timestamp:  2026-06-13T00:00:00Z
SHA-256:    [COMPUTED_POST_IMPLEMENTATION]
Status:     SELF-EXECUTING
-----END ZAFLA BUILD CERTIFICATE-----
```
