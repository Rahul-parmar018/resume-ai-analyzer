import os
import logging
os.environ["USE_TF"] = "0"
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

logger.info("Initializing SentenceTransformer: all-MiniLM-L6-v2...")
# This runs once on Django boot, caching the model globally in RAM.
model = SentenceTransformer('all-MiniLM-L6-v2')
logger.info("Language Model loaded successfully.")
