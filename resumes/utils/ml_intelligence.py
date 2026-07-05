import hashlib
import numpy as np
import logging
from typing import Dict, List, Tuple
from .ml_model import get_model

logger = logging.getLogger(__name__)

# ─── 1. RESUME EMBEDDING CACHE ───
class EmbeddingCache:
    """In-memory singleton cache to store and reuse generated embeddings by text hash."""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingCache, cls).__new__(cls)
            cls._instance.cache = {}
        return cls._instance

    def _get_hash(self, text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()

    def get(self, text: str) -> np.ndarray:
        h = self._get_hash(text)
        return self.cache.get(h)

    def set(self, text: str, embedding: np.ndarray):
        h = self._get_hash(text)
        self.cache[h] = embedding

    def clear(self):
        self.cache.clear()


# ─── 2. SKILL ONTOLOGY & TAXONOMY ───
SKILL_TAXONOMY = {
    "languages": {
        "python": ["django", "flask", "fastapi", "numpy", "pandas", "pytorch", "tensorflow"],
        "javascript": ["node.js", "nodejs", "react", "vue", "angular", "express", "nextjs"],
        "typescript": ["angular", "react", "nest.js", "nextjs"],
        "java": ["spring boot", "hibernate", "maven"],
        "c#": [".net", "asp.net", "entity framework"]
    },
    "frameworks": {
        "react": ["reactjs", "nextjs", "javascript"],
        "django": ["python", "drf", "django rest framework"],
        "express": ["node.js", "nodejs", "javascript", "backend"],
        "fastapi": ["python", "rest api", "backend"]
    },
    "databases": {
        "postgresql": ["sql", "rdbms", "postgres"],
        "mongodb": ["nosql", "document database", "mgo"],
        "redis": ["caching", "nosql", "key-value store"]
    },
    "cloud": {
        "aws": ["amazon web services", "ec2", "s3", "rds", "lambda"],
        "docker": ["containers", "kubernetes", "k8s", "devops"],
        "terraform": ["iac", "infrastructure as code", "devops"]
    }
}


def normalize_skill(skill_name: str) -> str:
    """Normalizes skill aliases to a standard canonical name."""
    s_lower = skill_name.lower().strip()
    # Normalize typical aliases
    alias_map = {
        "reactjs": "react",
        "nodejs": "node.js",
        "postgres": "postgresql",
        "aws": "amazon web services",
        "k8s": "kubernetes",
        "ts": "typescript",
        "js": "javascript",
        "drf": "django rest framework"
    }
    return alias_map.get(s_lower, s_lower)


# ─── 3. SEMANTIC SIMILARITY ENGINE ───
def get_embedding(text: str) -> np.ndarray:
    """Generates embedding for a given text using the lazy-loaded SentenceTransformer model."""
    if not text:
        return np.zeros(384) # Default size for all-MiniLM-L6-v2

    cache = EmbeddingCache()
    cached = cache.get(text)
    if cached is not None:
        return cached

    model = get_model()
    if model is None:
        return np.zeros(384)

    try:
        embedding = model.encode(text, show_progress_bar=False)
        cache.set(text, embedding)
        return embedding
    except Exception as e:
        logger.error(f"[ML Intelligence] Embedding generation failed: {e}")
        return np.zeros(384)


def calculate_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Calculates cosine similarity between two embedding vectors."""
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(vec1, vec2) / (norm1 * norm2))


def analyze_semantic_match(resume_text: str, jd_text: str) -> dict:
    """
    Computes semantic similarity match metrics between resume and job description.
    Identifies related/similar technologies even without keyword direct match.
    """
    resume_embedding = get_embedding(resume_text)
    jd_embedding = get_embedding(jd_text)
    
    similarity = calculate_cosine_similarity(resume_embedding, jd_embedding)
    match_percentage = int(similarity * 100)
    
    # Simple semantic context detection
    tech_relationships = []
    text_lower = resume_text.lower()
    jd_lower = jd_text.lower()
    
    # Check taxonomy matches
    for category, skills in SKILL_TAXONOMY.items():
        for primary, related in skills.items():
            if primary in jd_lower:
                matched_related = [r for r in related if r in text_lower]
                if matched_related:
                    tech_relationships.append({
                        "jd_requirement": primary,
                        "resume_competency": matched_related[0],
                        "relationship": "Semantically related via taxonomy"
                    })

    return {
        "semantic_match_percentage": match_percentage,
        "fit_level": "Strong Match" if match_percentage >= 70 else "Moderate Match" if match_percentage >= 50 else "Weak Match",
        "related_competencies": tech_relationships
    }


# ─── 4. SKILL GAP RANKING ───
def rank_missing_skills(missing_skills: List[str], jd_text: str) -> Dict[str, List[str]]:
    """
    Ranks missing skills into Critical, High, Medium, or Low importance
    based on semantic relevance within the Job Description context.
    """
    jd_lower = jd_text.lower()
    ranked = {
        "Critical": [],
        "High": [],
        "Medium": [],
        "Low": []
    }
    
    for skill in missing_skills:
        skill_norm = normalize_skill(skill)
        # 1. Critical: Directly stated in the job description text
        if skill_norm in jd_lower or skill.lower() in jd_lower:
            ranked["Critical"].append(skill)
            continue
            
        # 2. High: Related to items in the job description based on taxonomy
        is_high = False
        for category, skills in SKILL_TAXONOMY.items():
            for primary, related in skills.items():
                if primary in jd_lower and skill_norm in related:
                    ranked["High"].append(skill)
                    is_high = True
                    break
            if is_high:
                break
        if is_high:
            continue
            
        # 3. Medium: Standard skill but not matching target taxonomy directly
        if len(skill) <= 15:
            ranked["Medium"].append(skill)
        else:
            # 4. Low: Long descriptors/optional items
            ranked["Low"].append(skill)
            
    return ranked
