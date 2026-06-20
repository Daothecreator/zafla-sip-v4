# syntax=docker/dockerfile:1

# ═══════════════════════════════════════════════════════════
# ZAFLA Sovereign Intelligence Platform v4
# Frontend Dockerfile
# Multi-stage build: Node build → nginx serve
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING
# ═══════════════════════════════════════════════════════════

# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

LABEL maintainer="ZAFLA Development Division <zeroazimuth.dev>"
LABEL org.opencontainers.image.title="ZAFLA SIP v4 Frontend"
LABEL org.opencontainers.image.version="4.0.0"
LABEL org.opencontainers.image.description="ZAFLA Sovereign Intelligence Platform — React Terminal"

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Runtime ───────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built static assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (listens on port 3000, SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/index.html

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000 || exit 1

# Expose the port expected by docker-compose / nginx upstream
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
