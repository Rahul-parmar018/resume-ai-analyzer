# Candidex AI - Premium Hybrid Career Copilot

Candidex AI is a production-hardened AI career platform that integrates local rule engines, Machine Learning semantic matches, labor market intelligence, and conversational agent workflows to optimize resumes and coach candidates.

## 🚀 Key Capabilities
- **Hybrid AI Scanner:** Combines deterministic structural rules (for completeness, action verbs, and contact validation) with qualitative LLM optimizations.
- **Semantic ML Job Matching:** Uses local SentenceTransformers (`all-MiniLM-L6-v2`) to compare resume vectors with job descriptions, recognizing related technologies (e.g. mapping "Express" to "Node.js").
- **AI Career Agent:** Conversational coach powered by intent routing, capable of querying RAG guides, career path matrices, and job readiness tools.
- **RAG Knowledge Base:** Zero-dependency local vector store that indexes resume formatting guides, ATS tips, and interview checklists.
- **AI Research Lab:** Evaluates prompt revisions, LLM latencies, and retrieval precision mathematically against ground-truth benchmarks.

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS, Vite, Framer Motion
- **Backend:** Django Rest Framework (DRF)
- **ML/AI:** SentenceTransformers, Ollama Cloud (`nemotron-3-super:cloud`), Numpy
- **RAG/Vector:** Local vector storage (Persisted Pickle Index)

## 📦 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+

### 2. Backend Setup
```bash
# Clone the repository
git clone https://github.com/your-username/resume-ai-analyzer.git
cd resume-ai-analyzer

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations and start server
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Running Benchmarks & Indexing
```bash
# Rebuild the RAG index
python rebuild_rag_index.py

# Run the AI evaluation suite
python run_ai_eval.py

# Execute AI research experiments
python run_ai_experiment.py
```
