# ZAFLA Sovereign Intelligence Platform v4

Unified legal intelligence and attestation system built under Zero Azimuth Full Liability Authority (ZAFLA).

## Quick Start

```bash
git clone https://github.com/Daothecreator/zafla-sip-v4.git
cd zafla-sip-v4
./scripts/setup.sh
```

Access points:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Architecture

- **Backend**: FastAPI + BiCA Engine + ZAFLA Attestation
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: PostgreSQL with RLS
- **Cache**: Redis
- **Edge**: Cloudflare R2 + Workers
- **Auth**: BiCA Protocol + JWT

## License

Sovereign License — ZAFLA International Authority
