# ZAFLA Sovereign Intelligence Platform v4 — Audit Trail
# Protocol: BiCA a8f3c9d2e1b40571
# Classification: SELF-EXECUTING

"""Immutable audit trail with SHA-3-256 entry hashes."""

import json
import logging
import time
import hashlib
from typing import Optional, Dict, Any


class AuditTrail:
    """Singleton audit trail engine."""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        self.entries = []
    
    def log_decision(self, action: str, actor: Optional[str], target_type: str, target_id: Optional[str], context: Dict[str, Any]) -> Dict[str, Any]:
        """Log an immutable decision entry."""
        entry = {
            "action": action,
            "actor": actor,
            "target_type": target_type,
            "target_id": target_id,
            "context": context,
            "timestamp": time.time(),
        }
        entry_hash = hashlib.sha3_256(json.dumps(entry, default=str, sort_keys=True).encode()).hexdigest()
        entry["entry_hash"] = entry_hash
        self.entries.append(entry)
        logging.info(f"[AUDIT] {action} | actor={actor} | hash={entry_hash[:16]}...")
        return entry
    
    def verify_entry(self, entry: Dict[str, Any]) -> bool:
        """Verify an entry's integrity by recomputing its hash."""
        expected = entry.get("entry_hash")
        if not expected:
            return False
        test_entry = {k: v for k, v in entry.items() if k != "entry_hash"}
        computed = hashlib.sha3_256(json.dumps(test_entry, default=str, sort_keys=True).encode()).hexdigest()
        return expected == computed
    
    def get_recent(self, limit: int = 100) -> list:
        return self.entries[-limit:]
