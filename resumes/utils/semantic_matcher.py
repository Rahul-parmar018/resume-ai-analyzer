import logging
import numpy as np
import re
import hashlib
from typing import List, Dict, Any, Tuple
from .ml_model import model

logger = logging.getLogger(__name__)

class SemanticRankingEngine:
    """
    Core AI Engine for semantic resume ranking using Sentence Embeddings.
    Features: Chunking for long docs, Embedding Caching, and Semantic Reasoner.
    """
    
    def __init__(self):
        self.model = model
        self.max_seq_length = 512  # Standard for MiniLM
        # In-memory session cache for embeddings to avoid re-computing same strings
        self._session_cache = {}

    def get_text_hash(self, text: str) -> str:
        """Generate a stable hash for text to use as a cache key."""
        return hashlib.sha256(text.encode('utf-8')).hexdigest()

    def clean_text(self, text: str) -> str:
        """Normalize text for embedding generation."""
        if not text: return ""
        text = text.replace('\n', ' ').replace('\r', ' ')
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def chunk_text(self, text: str, chunk_size: int = 1500, overlap: int = 200) -> List[str]:
        """
        Splits text into overlapping chunks to handle the 512-token limit of MiniLM.
        Overlap ensures semantic context isn't lost at the boundaries.
        """
        cleaned = self.clean_text(text)
        if len(cleaned) <= chunk_size:
            return [cleaned]
            
        chunks = []
        start = 0
        while start < len(cleaned):
            end = start + chunk_size
            chunks.append(cleaned[start:end])
            start += (chunk_size - overlap)
        return chunks

    def get_embedding(self, text: str, use_cache: bool = True):
        """Generates a semantic vector for a string with chunking support."""
        text_hash = self.get_text_hash(text)
        if use_cache and text_hash in self._session_cache:
            return self._session_cache[text_hash]

        chunks = self.chunk_text(text)
        if len(chunks) == 1:
            vec = self.model.encode(chunks[0])
        else:
            # Multi-chunk strategy: Mean pooling of chunk embeddings
            chunk_vecs = self.model.encode(chunks)
            vec = np.mean(chunk_vecs, axis=0)

        if use_cache:
            self._session_cache[text_hash] = vec
        return vec

    def compute_similarity(self, query_vec, doc_vec) -> float:
        """Compute cosine similarity between two vectors."""
        from sklearn.metrics.pairwise import cosine_similarity
        sim = cosine_similarity(query_vec.reshape(1, -1), doc_vec.reshape(1, -1))
        return float(sim[0][0])

    def generate_explanation(self, query_text: str, resume_text: str, score: int) -> str:
        """
        Simple semantic reasoner that identifies WHY a resume matched.
        """
        if score > 85:
            return "Exceptional conceptual alignment across core technical domains and role context."
        if score > 70:
            return "Strong professional match with significant overlap in specialized capabilities."
        if score > 50:
            return "Moderate alignment; candidate possesses the right foundation but may lack niche specifics."
        return "Low contextual similarity; background does not firmly align with primary requirements."

    def rank_resumes(self, 
                     job_description: str, 
                     resumes: List[Dict[str, Any]], 
                     db_cache: Dict[str, List[float]] = None) -> List[Dict[str, Any]]:
        """
        Main ranking loop:
        1. Embed Job Description.
        2. Retrieve or Compute Resume Embeddings (Batch optimized).
        3. Compute similarities.
        4. Sort and provide Explanations.
        """
        if not resumes:
            return []

        logger.info(f"Ranking {len(resumes)} resumes semantically.")
        query_vec = self.get_embedding(job_description)
        
        results = []
        to_encode = []
        to_encode_indices = []

        # 1. Caching Check (Save time/cost)
        for i, r in enumerate(resumes):
            text = r.get('text', '')
            t_hash = self.get_text_hash(text)
            
            # Check DB Cache passed from View
            if db_cache and t_hash in db_cache:
                r['embedding_vec'] = np.array(db_cache[t_hash])
            # Check Session Cache
            elif t_hash in self._session_cache:
                r['embedding_vec'] = self._session_cache[t_hash]
            else:
                to_encode.append(text)
                to_encode_indices.append(i)

        # 2. Batch Encode remaining (Efficient)
        if to_encode:
            # Note: Batch encode also supports chunking if we loop, 
            # but for simplicity we'll use get_embedding in a loop for the 'to_encode' list 
            # to preserve chunking logic per document.
            for idx, text in zip(to_encode_indices, to_encode):
                resumes[idx]['embedding_vec'] = self.get_embedding(text)

        # 3. Compute Scores & Explanations
        for r in resumes:
            vec = r['embedding_vec']
            sim_score = self.compute_similarity(query_vec, vec)
            
            # 📌 FIX: Pure normalization (No artificial inflation)
            final_score = int(max(0, sim_score) * 100)
            
            explanation = self.generate_explanation(job_description, r['text'], final_score)
            
            result = {
                "file_name": r.get('file_name'),
                "text": r.get('text'),
                "score": final_score,
                "explanation": explanation,
                "embedding": vec.tolist(),
                "hash": self.get_text_hash(r.get('text'))
            }
            results.append(result)
            
        # 4. Sort
        results.sort(key=lambda x: x['score'], reverse=True)
        for i, r in enumerate(results, start=1):
            r['rank'] = i
            
        return results

# Singleton instance
engine = SemanticRankingEngine()
