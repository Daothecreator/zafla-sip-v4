# ZAFLA Sovereign Intelligence Platform v4 — Auth Gateway
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING

"""BiCA Protocol JWT authentication gateway."""

import logging
import time
from typing import Dict, Optional

from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.config import settings
from app.bica_engine import BICA_PROTOCOL, BICA_NONCE


class BiCALoginRequest(BaseModel):
    bica_protocol: str
    bica_nonce: str
    proof: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str


class UserPayload(BaseModel):
    bica_protocol: str
    role: str
    exp: int


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def verify_bica_proof(protocol: str, nonce: str, proof: str) -> bool:
    """Verify BiCA sovereign identity proof via deterministic SHA-3 hash."""
    import hashlib
    seed_input = f"{protocol}:{nonce}:{BICA_PROTOCOL}".encode()
    expected = hashlib.sha3_256(seed_input).hexdigest()[:64]
    return proof == expected


def bica_login(protocol: str, nonce: str, proof: str) -> TokenResponse:
    if not verify_bica_proof(protocol, nonce, proof):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid BiCA credentials"
        )
    if protocol != BICA_PROTOCOL:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized protocol"
        )
    
    now = int(time.time())
    access_exp = now + (15 * 60)  # 15 minutes
    refresh_exp = now + (7 * 24 * 60 * 60)  # 7 days
    
    access_payload = {
        "bica_protocol": protocol,
        "role": "omega",
        "exp": access_exp,
        "iat": now,
        "type": "access"
    }
    refresh_payload = {
        "bica_protocol": protocol,
        "role": "omega",
        "exp": refresh_exp,
        "iat": now,
        "type": "refresh"
    }
    
    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    
    logging.info(f"[AUTH] BiCA login succeeded for protocol {protocol}")
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        role="omega"
    )


def verify_jwt(token: str) -> UserPayload:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        protocol = payload.get("bica_protocol")
        role = payload.get("role", "operative")
        exp = payload.get("exp", 0)
        if protocol is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return UserPayload(bica_protocol=protocol, role=role, exp=exp)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserPayload:
    token = credentials.credentials
    return verify_jwt(token)


def require_role(roles: list[str]):
    """Factory for role-based access control dependency."""
    def _check_role(user: UserPayload = Depends(get_current_user)) -> UserPayload:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Required role: {roles}"
            )
        return user
    return _check_role
