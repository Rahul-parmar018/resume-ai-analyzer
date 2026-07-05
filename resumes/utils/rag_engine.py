import os
import json
import logging
import pickle
from abc import ABC, abstractmethod
from typing import List, Dict, Tuple
from .ml_intelligence import get_embedding, calculate_cosine_similarity

logger = logging.getLogger(__name__)

# ─── 1. VECTOR STORE ABSTRACTION ───
class BaseVectorStore(ABC):
    """Abstract interface for RAG vector database storage."""
    
    @abstractmethod
    def add_documents(self, documents: List[dict]):
        pass

    @abstractmethod
    def similarity_search(self, query_vector: list, top_k: int = 3) -> List[dict]:
        pass


class LocalVectorStore(BaseVectorStore):
    """Lightweight in-memory vector store persisting to a pickle file for local development."""
    
    def __init__(self, persist_path: str = "rag_store.pkl"):
        self.persist_path = persist_path
        self.index = [] # Holds list of {"vector": np.ndarray, "metadata": dict, "text": str}
        self.load()

    def load(self):
        if os.path.exists(self.persist_path):
            try:
                with open(self.persist_path, "rb") as f:
                    self.index = pickle.load(f)
                logger.info(f"[RAG Store] Loaded {len(self.index)} chunks from persistent storage.")
            except Exception as e:
                logger.error(f"[RAG Store] Failed to load index: {e}")
                self.index = []

    def save(self):
        try:
            with open(self.persist_path, "wb") as f:
                pickle.dump(self.index, f)
            logger.info(f"[RAG Store] Persisted {len(self.index)} chunks successfully.")
        except Exception as e:
            logger.error(f"[RAG Store] Failed to persist index: {e}")

    def add_documents(self, documents: List[dict]):
        for doc in documents:
            text = doc["text"]
            metadata = doc["metadata"]
            vector = get_embedding(text)
            self.index.append({
                "vector": vector,
                "metadata": metadata,
                "text": text
            })
        self.save()

    def similarity_search(self, query_vector: list, top_k: int = 3) -> List[dict]:
        if not self.index:
            return []
            
        scored_docs = []
        for doc in self.index:
            score = calculate_cosine_similarity(query_vector, doc["vector"])
            scored_docs.append((score, doc))
            
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        results = []
        for score, doc in scored_docs[:top_k]:
            results.append({
                "score": score,
                "text": doc["text"],
                "metadata": doc["metadata"]
            })
        return results


# ─── 2. DOCUMENT PROCESSOR & RETRIEVAL ENGINE ───
class DocumentProcessor:
    """Chunks source files, extracts metadata, and compiles indices."""
    
    def __init__(self, doc_dir: str = "knowledge_base"):
        self.doc_dir = doc_dir
        os.makedirs(self.doc_dir, exist_ok=True)

    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Simple sliding window text chunker."""
        words = text.split()
        chunks = []
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if chunk:
                chunks.append(chunk)
        return chunks

    def process_and_index(self, vector_store: BaseVectorStore):
        """Scans doc_dir and indexes text files into the vector store."""
        if not os.path.exists(self.doc_dir):
            return
            
        docs_to_index = []
        for filename in os.listdir(self.doc_dir):
            filepath = os.path.join(self.doc_dir, filename)
            if not os.path.isfile(filepath):
                continue
                
            ext = os.path.splitext(filename)[1].lower()
            text = ""
            if ext == ".txt" or ext == ".md":
                with open(filepath, "r", encoding="utf-8") as f:
                    text = f.read()
            elif ext == ".json":
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        text = json.dumps(data)
                except Exception as e:
                    logger.error(f"[RAG Processor] Failed parsing JSON file {filename}: {e}")

            if text.strip():
                chunks = self.chunk_text(text)
                for idx, chunk in enumerate(chunks):
                    docs_to_index.append({
                        "text": chunk,
                        "metadata": {
                            "title": filename,
                            "chunk_id": idx,
                            "category": "Guide" if ext == ".md" else "Internal"
                        }
                    })
                    
        if docs_to_index:
            vector_store.add_documents(docs_to_index)
            logger.info(f"[RAG Processor] Indexed {len(docs_to_index)} chunks.")
