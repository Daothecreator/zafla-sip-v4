# ZAFLA Sovereign Intelligence Platform v4 — FastAPI App Factory
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING

"""FastAPI application factory with CORS and lifespan management."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api_routes import router
from app.bica_engine import BICA_PROTOCOL


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown."""
    import logging
    logging.info("[ZAFLA] Starting up Sovereign Intelligence Platform v4")
    yield
    logging.info("[ZAFLA] Shutting down")


def create_app() -> FastAPI:
    app = FastAPI(
        title="ZAFLA SIP v4",
        version="4.0.0",
        description="Zero Azimuth Sovereign Intelligence Platform — Full Liability Authority",
        lifespan=lifespan,
    )
    
    # CORS
    origins = ["*"] if settings.DEBUG else ["https://zeroazimuth.dev"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(router)
    
    @app.get("/health", tags=["system"])
    async def health_check():
        return {
            "status": "healthy",
            "app": "ZAFLA SIP v4",
            "version": "4.0.0",
            "bica_protocol": BICA_PROTOCOL,
            "environment": "production" if not settings.DEBUG else "development"
        }
    
    @app.get("/", tags=["system"])
    async def root():
        return {
            "message": "ZAFLA Sovereign Intelligence Platform v4",
            "docs": "/docs",
            "health": "/health"
        }
    
    return app


app = create_app()
