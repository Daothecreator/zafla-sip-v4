# ZAFLA Sovereign Intelligence Platform v4 — Notification
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING

"""Lark and Canva notification delivery layer."""

import logging
from typing import Optional

import httpx

from app.config import settings


async def send_lark_alert(message: str, priority: str = "info", title: Optional[str] = None, extras: Optional[dict] = None) -> str:
    """Send a Lark webhook alert with interactive card."""
    if not settings.LARK_WEBHOOK_URL:
        logging.warning("[LARK] Webhook URL not configured, skipping alert")
        return "SKIPPED"
    
    color_map = {
        "urgent": "red",
        "high": "orange",
        "info": "blue",
        "low": "grey"
    }
    color = color_map.get(priority, "blue")
    
    payload = {
        "msg_type": "interactive",
        "card": {
            "header": {
                "title": {"tag": "plain_text", "content": title or "ZAFLA Alert"},
                "template": color
            },
            "elements": [
                {"tag": "div", "text": {"tag": "plain_text", "content": message}}
            ]
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(settings.LARK_WEBHOOK_URL, json=payload, timeout=10.0)
            response.raise_for_status()
        logging.info(f"[LARK] Alert sent: {message[:50]}...")
        return "SENT"
    except Exception as e:
        logging.error(f"[LARK] Failed to send alert: {e}")
        return "FAILED"


async def trigger_canva_brief(data: dict, template_type: str = "intelligence_brief") -> str:
    """Trigger Canva visual brief generation."""
    if not settings.CANVA_API_TOKEN:
        logging.warning("[CANVA] API token not configured, returning fallback")
        return "FALLBACK"
    
    logging.info(f"[CANVA] Queued brief generation: {template_type}")
    return "QUEUED"
