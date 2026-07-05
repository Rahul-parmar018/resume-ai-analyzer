import os
import time
import json
import logging
from typing import Dict, List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

# ─── 1. PROMPT REGISTRY & VERSIONING ───
PROMPT_REGISTRY = {
    "career_agent_v1": {
        "name": "career_agent",
        "version": "1.0.0",
        "model": "nemotron-3-super:cloud",
        "created_at": "2026-07-04"
    },
    "market_advisor_v1": {
        "name": "market_advisor",
        "version": "1.0.0",
        "model": "nemotron-3-super:cloud",
        "created_at": "2026-07-04"
    }
}

# ─── 2. EXPERIMENT CONFIGURATION ───
EXPERIMENT_CONFIG = {
    "active_experiment": "default_nemotron",
    "experiments": {
        "default_nemotron": {
            "llm_model": "nemotron-3-super:cloud",
            "embedding_model": "all-MiniLM-L6-v2",
            "retrieval_strategy": "top_k_similarity"
        },
        "experimental_gpt": {
            "llm_model": "gpt-4o-mini",
            "embedding_model": "text-embedding-3-small",
            "retrieval_strategy": "hybrid_search"
        }
    }
}

LOG_FILE = "ai_observability_logs.jsonl"
FEEDBACK_FILE = "ai_feedback_logs.jsonl"


# ─── 3. REQUEST LOGGER ───
class AIObservabilityLogger:
    """Handles logging of AI component executions, performance metrics, and fallback details."""
    
    @staticmethod
    def log_request(
        tool: str,
        execution_time_ms: float,
        success: bool,
        fallback_triggered: bool,
        model: str = "nemotron-3-super:cloud",
        prompt_version: str = "career_agent_v1",
        tokens_used: int = 0
    ):
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "model": model,
            "tool": tool,
            "execution_time_ms": execution_time_ms,
            "tokens_used": tokens_used,
            "success": success,
            "fallback_triggered": fallback_triggered,
            "prompt_version": prompt_version
        }
        
        try:
            with open(LOG_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(log_entry) + "\n")
        except Exception as e:
            logger.error(f"[Observability] Failed to write log entry: {e}")

    @staticmethod
    def log_feedback(message_id: str, rating: str, comment: Optional[str] = None):
        """Captures candidate thumbs up/down feedback for quality audits."""
        feedback_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "message_id": message_id,
            "rating": rating, # "thumbs_up" or "thumbs_down"
            "comment": comment or ""
        }
        
        try:
            with open(FEEDBACK_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(feedback_entry) + "\n")
        except Exception as e:
            logger.error(f"[Observability] Failed to write feedback: {e}")


# ─── 4. METRICS AGGREGATOR ───
def get_ai_performance_metrics() -> dict:
    """Aggregates logged executions to calculate system performance benchmarks."""
    if not os.path.exists(LOG_FILE):
        return {
            "average_response_time_ms": 0.0,
            "total_requests": 0,
            "success_rate": 0.0,
            "fallback_rate": 0.0
        }
        
    times = []
    successes = 0
    fallbacks = 0
    total = 0
    
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if not line.strip():
                    continue
                entry = json.loads(line)
                times.append(entry.get("execution_time_ms", 0.0))
                if entry.get("success", False):
                    successes += 1
                if entry.get("fallback_triggered", False):
                    fallbacks += 1
                total += 1
    except Exception as e:
        logger.error(f"[Observability] Error reading metrics: {e}")

    return {
        "average_response_time_ms": sum(times) / max(1, len(times)),
        "total_requests": total,
        "success_rate": float(successes / max(1, total)),
        "fallback_rate": float(fallbacks / max(1, total))
    }
