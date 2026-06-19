#!/bin/bash
set -e

echo "=== ZAFLA SIP v4 Setup ==="

command -v docker >/dev/null 2>&1 || { echo "Docker required"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose required"; exit 1; }

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env from template"
fi

docker compose build
docker compose up -d

for i in {1..30}; do
    if docker compose exec db pg_isready -U zafla -d zafla_sip; then
        break
    fi
    sleep 2
done

docker compose exec backend alembic upgrade head

echo "=== ZAFLA SIP v4 Deployed ==="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
