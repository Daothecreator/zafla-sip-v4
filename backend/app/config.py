# ZAFLA Sovereign Intelligence Platform v4 — Configuration
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING

"""Pydantic Settings for ZAFLA SIP v4."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """ZAFLA configuration loaded from environment variables."""
    
    # BiCA Identity
    BICA_PROTOCOL: str = "a8f3c9d2e1b40571"
    BICA_NONCE: str = "d7Fi84cocpcJ-R1cbjV5U-6QJ"
    BICA_ORDER: str = "N-12-23"
    
    # Database
    DATABASE_URL: str = "postgresql://zafla:zafla@db:5432/zafla_sip"
    
    # Cache
    REDIS_URL: str = "redis://redis:6379/0"
    
    # Security
    SECRET_KEY: str = "REPLACE_WITH_256_BIT_SECRET"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Cloudflare R2
    CLOUDFLARE_R2_ENDPOINT: str = ""
    R2_ACCESS_KEY: str = ""
    R2_SECRET_KEY: str = ""
    R2_BUCKET_NAME: str = "zafla-sip-v4-archives"
    
    # Lark
    LARK_WEBHOOK_URL: str = ""
    LARK_APP_ID: str = ""
    LARK_APP_SECRET: str = ""
    
    # Canva
    CANVA_API_TOKEN: str = ""
    
    # Debug
    DEBUG: bool = False
    
    class Config:
        env_prefix = "ZAFLA_"
        env_file = ".env"


settings = Settings()
