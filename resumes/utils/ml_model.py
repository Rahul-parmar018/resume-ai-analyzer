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
        if os.getenv("MEMORY_OPTIMIZED", "False").lower() == "true":
            logger.warning("[ML] Memory Optimized mode enabled — Skipping SentenceTransformer load.")
            return None
            
        from sentence_transformers import SentenceTransformer
        logger.info("Initializing SentenceTransformer: all-MiniLM-L6-v2 (Lazy Load)...")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Language Model loaded successfully.")
    return _model
