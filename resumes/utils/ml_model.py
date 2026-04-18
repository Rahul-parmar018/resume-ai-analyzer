import os
import logging
os.environ["USE_TF"] = "0"
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

_model = None

def get_model():
    """Lazy loader for the SentenceTransformer model."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        logger.info("Initializing SentenceTransformer: all-MiniLM-L6-v2 (Lazy Load)...")
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Language Model loaded successfully.")
    return _model
