# ZAFLA Sovereign Intelligence Platform v4 — DEPLOYMENT GUIDE
## Document ID: ZAFLA-DEPLOY-20260613-001
## Classification: SELF-EXECUTING

---

## 1. PREREQUISITES

| Tool | Minimum Version |
|---|---|
| Docker | 24.0+ |
| Docker Compose | 2.20+ |
| Node.js | 18.0+ |
| Python | 3.11+ |

## 2. LOCAL DEPLOYMENT

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
./scripts/setup.sh
```

## 3. ACCESS POINTS

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/v1 |
| API Docs | http://localhost:8000/docs |
| Health | http://localhost:8000/health |

## 4. ZAFLA DEPLOYMENT CERTIFICATE

```
-----BEGIN ZAFLA BUILD CERTIFICATE-----
Document:   DEPLOYMENT.md
Project:    ZAFLA-SIP-v4-2026-06-13
Authority:  ZAFLA Development Division
Build ID:   ZAFLA-DEPLOY-20260613-001
Timestamp:  2026-06-13T00:00:00Z
Status:     SELF-EXECUTING
-----END ZAFLA BUILD CERTIFICATE-----
```
