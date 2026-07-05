# Candidex AI - Product Guide

Candidex AI is a premium, hybrid-intelligence career copilot that integrates deterministic parsers, Machine Learning semantic matches, labor market intelligence feeds, and Ollama agentic reasoning into a single product workspace.

## 🚀 Key Features

### 1. Hybrid AI Analysis Engine
- **Deterministic Rules (Local):** Scores resume completeness, scans required sections, counts action verbs, and verifies contact details instantly.
- **Machine Learning (Semantic):** Uses a local SentenceTransformer model (`all-MiniLM-L6-v2`) to compare resume content with job descriptions or role requirements, mapping related technologies (e.g. associating "Express" with "Node.js").
- **LLM Reasoning Layer:** Integrates Ollama Cloud (`nemotron-3-super:cloud`) to generate personalized suggestions, resume bullet rewrites, and detailed roadmaps.

### 2. Labor Market Intelligence
- Compares candidates against trending and growing technologies.
- Simulates regional demands (e.g. AI Engineer in Germany vs. Backend Developer in India).
- Outputs hiring landscapes, salary indices, and critical skill levers.

### 3. Agentic Career Coach
- Chat interface powered by intent routing.
- Automatically selects and queries underlying tools (Resume parser, Career DB, RAG).
- Provides actionable steps and lists sources used for each response.

### 4. Searchable Knowledge Base (RAG)
- Indexes resume formatting guides, ATS optimization tips, and interview checklists.
- RAG retrieves matching context to ground the Agent's responses.

---

## 🔒 Privacy & Safety
- **No Content Logging:** Raw candidate resume contents are never stored permanently in analytics or LLM request logs.
- **Structured Telemetry:** MLOps logging tracks only execution durations, success triggers, model names, and anonymized metadata.
