import os
import logging

os.environ["USE_TF"] = "0"

logger = logging.getLogger(__name__)

_model = None

def get_model():
    """Lazy loader for the SentenceTransformer model.
    ALL heavy imports happen inside this function to prevent startup crashes."""
    global _model
    if _model is None:
        is_render = os.getenv("RENDER", "False").lower() == "true"
        mem_opt = os.getenv("MEMORY_OPTIMIZED", "False").lower() == "true"
        
        if mem_opt or is_render:
            logger.warning(f"[ML] Memory Optimized mode enabled (Render: {is_render}) — Skipping SentenceTransformer load.")
            return None
            
        from sentence_transformers import SentenceTransformer
        logger.info("Initializing SentenceTransformer: all-MiniLM-L6-v2 (Lazy Load)...")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Language Model loaded successfully.")
    return _model
