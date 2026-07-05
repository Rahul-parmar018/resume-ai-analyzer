# Candidex AI - Public Beta Launch & Validation Guide

This guide details the launch metrics, production risk mitigations, and user validation frameworks.

---

## 📋 Beta Launch Checklist
- [x] **Production Settings:** Configure `DEBUG=False` and setup `ALLOWED_HOSTS` domain rules.
- [x] **LLM Connections:** Verify that Ollama `nemotron-3-super:cloud` routes over secure environment endpoint protocols.
- [x] **Memory Constraints:** Deploy with `MEMORY_OPTIMIZED=True` settings if hosting constraints dictate memory optimizations for local SentenceTransformers.
- [x] **RAG Index Status:** Execute `python rebuild_rag_index.py` during deployment setup to initialize vector store pkl indexes.
- [x] **Evaluation Checks:** Verify that `python run_ai_eval.py` has run successfully.

---

## 📊 Portfolio Summary Metrics

- **AI Engine Architectures:** Hybrid Pipeline (Deterministic Heuristics + ML Cosine Similarity + Ollama LLM Reasoning).
- **Core AI Modules:**
  1. Heuristic Completeness Analyzer
  2. SentenceTransformer Semantic Matcher
  3. Career Path DB Taxonomy Engine
  4. Region-based Market Intelligence Engine
  5. Agentic AI Career Coach (Intent Router)
  6. Persistence-backed RAG Vector Store
- **Active Code MLOps & Observability:**
  - Automated request latency timers and file logging recorders.
  - User feedback loggers (thumbs up/down) tracking ratings per feature module.
  - Standardized benchmark suite tracking F1 Precision/Recall statistics over time.
- **Backend Quality Assurance:** **23 Django backend tests** executing unit and integration test routines successfully.

---

## ⚠️ Remaining Production Risks
1. **Ollama Cloud Latency:** Under heavy concurrent beta traffic, remote LLM queries may latency spike.
   * *Mitigation:* The local heuristics rule-engine is offline/deterministic, and `OllamaService` has instant fallbacks returning mock recommendations safely if queries time out.
2. **Persistent RAG Store Lockings:** High concurrent writing requests to `rag_store.pkl` could lead to write collisions.
   * *Mitigation:* RAG vector store pkl is read-only in production; indexing is run as a separate admin command (`rebuild_rag_index.py`).
