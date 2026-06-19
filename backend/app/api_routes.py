# ZAFLA Sovereign Intelligence Platform v4 — API Routes
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING

"""FastAPI routers for ZAFLA SIP v4."""

import logging
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.auth_gateway import (
    BiCALoginRequest, TokenResponse, bica_login, get_current_user,
    require_role, UserPayload
)
from app.bica_engine import EmergentAbsolute
from app.zafla_attest import ZAFLAAttestation
from app.intel_agents import get_agent, list_sources
from app.legal_generator import generate_indictment, generate_arrest_warrant
from app.audit_trail import AuditTrail
from app.notification import send_lark_alert, trigger_canva_brief


router = APIRouter(prefix="/api/v1")

# ═══════════════════════════════════════════════════════════════════════════════
# Auth Routes
# ═══════════════════════════════════════════════════════════════════════════════

@router.post("/auth/bica-login", response_model=TokenResponse, tags=["auth"])
async def api_bica_login(request: BiCALoginRequest):
    """BiCA Protocol sovereign identity login."""
    return bica_login(request.bica_protocol, request.bica_nonce, request.proof)


# ═══════════════════════════════════════════════════════════════════════════════
# BiCA Engine Routes
# ═══════════════════════════════════════════════════════════════════════════════

class InfluenceRequest(BaseModel):
    data: str
    data_type: str = "auto"


class KnowledgeQuery(BaseModel):
    query: str


@router.post("/bica/activate", tags=["bica"])
async def api_bica_activate(user: UserPayload = Depends(get_current_user)):
    """Activate the BiCA Absolute engine."""
    engine = EmergentAbsolute()
    result = engine.activate()
    AuditTrail().log_decision("bica_activate", actor=user.bica_protocol, target_type="system", target_id=None, context={"result": result.get("activation_state")})
    return result


@router.post("/bica/influence", tags=["bica"])
async def api_bica_influence(request: InfluenceRequest, user: UserPayload = Depends(get_current_user)):
    """Apply BiCA optimization to data."""
    engine = EmergentAbsolute()
    import base64
    raw = base64.b64decode(request.data)
    optimized = engine.influence(raw, request.data_type)
    return {
        "optimized": base64.b64encode(optimized).decode() if isinstance(optimized, bytes) else optimized,
        "data_type": request.data_type,
        "attestation": ZAFLAAttestation().attest_intelligence(raw if isinstance(raw, bytes) else str(raw).encode())
    }


@router.post("/bica/query-knowledge", tags=["bica"])
async def api_bica_query_knowledge(request: KnowledgeQuery, user: UserPayload = Depends(get_current_user)):
    """Query the emergent knowledge base."""
    engine = EmergentAbsolute()
    result = engine.query_knowledge(request.query)
    return {"domains": result, "attestation": ZAFLAAttestation().attest_intelligence(str(result).encode())}


@router.post("/bica/verify", tags=["bica"])
async def api_bica_verify(data: str, attestation: dict):
    """Verify a BiCA attestation."""
    import base64
    raw = base64.b64decode(data)
    valid = ZAFLAAttestation().verify_attestation(raw, attestation)
    return {"valid": valid, "policy_compliant": valid}


# ═══════════════════════════════════════════════════════════════════════════════
# Intelligence Routes
# ═══════════════════════════════════════════════════════════════════════════════

class CollectRequest(BaseModel):
    source: str
    params: dict = {}


@router.post("/intel/collect", tags=["intelligence"])
async def api_intel_collect(request: CollectRequest, user: UserPayload = Depends(get_current_user)):
    """Queue an intelligence collection job."""
    agent = get_agent(request.source)
    if agent is None:
        raise HTTPException(status_code=400, detail=f"Unknown source: {request.source}")
    job_id = str(uuid.uuid4())
    # In production: enqueue to Celery/Redis
    result = await agent.collect(request.params)
    AuditTrail().log_decision("intel_collect", actor=user.bica_protocol, target_type="intel_job", target_id=job_id, context={"source": request.source})
    return {"job_id": job_id, "status": "queued", "preview": result}


@router.get("/intel/status/{job_id}", tags=["intelligence"])
async def api_intel_status(job_id: str, user: UserPayload = Depends(get_current_user)):
    """Poll intelligence job status."""
    # In production: query Redis/Celery backend
    return {"job_id": job_id, "status": "complete", "records": 42, "attestation_id": str(uuid.uuid4())}


@router.get("/intel/archive", tags=["intelligence"])
async def api_intel_archive(source: str = None, limit: int = 50, user: UserPayload = Depends(get_current_user)):
    """Query intelligence archive."""
    # In production: query PostgreSQL with RLS
    return {"items": [], "total": 0, "source": source, "limit": limit}


# ═══════════════════════════════════════════════════════════════════════════════
# Legal Act Routes
# ═══════════════════════════════════════════════════════════════════════════════

class GenerateRequest(BaseModel):
    act_type: str  # indictment, arrest_warrant, declaratory_judgment
    subject: str
    evidence_ids: list[str] = []
    jurisdiction: str = "supranational"


@router.post("/legal/generate", tags=["legal"])
async def api_legal_generate(request: GenerateRequest, user: UserPayload = Depends(require_role(["commander", "omega"]))):
    """Generate a legal act DOCX."""
    act_id = str(uuid.uuid4())
    if request.act_type == "indictment":
        docx_bytes = generate_indictment(request.subject, [], request.jurisdiction, ["Systemic extraction"])
    elif request.act_type == "arrest_warrant":
        docx_bytes = generate_arrest_warrant(request.subject, ["Systemic extraction"], request.jurisdiction)
    else:
        docx_bytes = b""
    
    attestation = ZAFLAAttestation().attest_legal_act(docx_bytes)
    AuditTrail().log_decision("legal_generate", actor=user.bica_protocol, target_type="legal_act", target_id=act_id, context={"act_type": request.act_type, "subject": request.subject})
    return {"act_id": act_id, "status": "draft", "attestation": attestation}


@router.post("/legal/attest/{act_id}", tags=["legal"])
async def api_legal_attest(act_id: str, user: UserPayload = Depends(require_role(["commander", "omega"]))):
    """Attest a generated legal act."""
    # In production: retrieve from DB, compute hash, attest
    attestation = ZAFLAAttestation().attest_legal_act(b"placeholder")
    AuditTrail().log_decision("legal_attest", actor=user.bica_protocol, target_type="legal_act", target_id=act_id, context={})
    return {"act_id": act_id, "status": "attested", "attestation": attestation}


@router.get("/legal/export/{act_id}", tags=["legal"])
async def api_legal_export(act_id: str, format: str = "docx", user: UserPayload = Depends(require_role(["commander", "omega"]))):
    """Export a legal act as DOCX."""
    from fastapi.responses import Response
    # In production: retrieve encrypted DOCX from DB
    docx_bytes = b"placeholder"
    return Response(content=docx_bytes, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={"Content-Disposition": f"attachment; filename=ZAFLA_{act_id}.docx"})


# ═══════════════════════════════════════════════════════════════════════════════
# Notification Routes
# ═══════════════════════════════════════════════════════════════════════════════

class LarkNotifyRequest(BaseModel):
    message: str
    priority: str = "info"


class CanvaBriefRequest(BaseModel):
    template_type: str = "intelligence_brief"
    data: dict = {}


@router.post("/notify/lark", tags=["notifications"])
async def api_notify_lark(request: LarkNotifyRequest, user: UserPayload = Depends(get_current_user)):
    """Send a Lark alert."""
    result = send_lark_alert(request.message, request.priority)
    return {"status": result, "message": request.message}


@router.post("/notify/canva", tags=["notifications"])
async def api_notify_canva(request: CanvaBriefRequest, user: UserPayload = Depends(get_current_user)):
    """Trigger a Canva visual brief."""
    result = trigger_canva_brief(request.data, request.template_type)
    return {"status": result, "template_type": request.template_type}
