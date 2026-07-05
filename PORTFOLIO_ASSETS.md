# Candidex AI - Portfolio Assets & Deployment Guide

This document contains packaging assets, pitches, demo scripts, and deployment checklists to prepare Candidex AI for public launch.

---

## 🎙️ Elevator Pitch & Technical Summaries

### 30-Second Elevator Pitch
> "Candidex AI is a premium AI Career Copilot built to move beyond simple keyword scanners. By combining local rule checkers, SentenceTransformer semantic matches, live market indices, and a searchable RAG knowledge base inside an agentic chat window, it acts as an intelligent career coach. It doesn't just score your resume; it maps your competencies to 10 distinct career paths, scores your readiness for mock job openings, and tells you exactly how to optimize your bullet points to land the interview."

### 2-Minute Technical Summary
> "Architecturally, Candidex AI utilizes a hybrid pipeline. High-precision heuristics (like parsing sections or counting action verbs) run locally to minimize LLM overhead. When comparing resumes against job descriptions, we use a local SentenceTransformer model (`all-MiniLM-L6-v2`) to compute cosine similarity, recognizing semantic alignment even without keyword matching. For qualitative reasoning, we call Ollama Cloud running `nemotron-3-super:cloud`. 
> To enable conversational coaching, we built an AI Career Agent. The agent runs an intent-detection layer to route queries to specialized sub-tools: a resume scanner, a career taxonomy matcher, and a custom RAG vector database. 
> On the MLOps side, we implemented a request telemetry layer that logs execution time, success rates, fallback triggers, and prompt versions without storing sensitive candidate resume texts. We also built an evaluation framework that scores the system's Precision and Recall against ground-truth profiles, ensuring all updates are scientifically verified."

---

## 🎬 5-7 Minute Demo Script

### 1. Introduction (0:00 - 1:00)
- Present the landing page and state the problem: ATS platforms look for keywords, leaving candidates guessing what skills they lack.
- Introduce Candidex AI as the comprehensive career copilot.

### 2. Resume Scan & ML Results (1:00 - 2:30)
- Onboard as a candidate, select a target role, and upload a sample resume.
- Highlight the **ATS Score Card** and **Resume Health** indicators (completeness, action verbs, density).
- Showcase the **Career Fit Matches** and **Market Readiness** panels, explaining how semantic mapping links related technologies.
- Demonstrate the **Neural Bullet Refactor** (STAR method optimization).

### 3. Agentic Chat & RAG Retrieval (2:30 - 4:30)
- Open the **Career Agent** view.
- Type: *"Am I ready to apply at Stripe as a Backend Developer?"* or *"Tell me the formatting guidelines for ATS."*
- Highlight the **Tool Execution Indicator** showing the agent executing the `Job Copilot Tool` or the `Knowledge Base Tool` under the hood.
- Point out the **Sources Used** badge, proving the grounding relevance of our RAG documents database.

### 4. MLOps & AI Research Lab (4:30 - 6:00)
- Run `python run_ai_eval.py` to show the active quality benchmarking scores.
- Run `python run_ai_experiment.py` to compare baseline Nemotron configs with experimental templates.
- Open `ai_eval_report.json` to verify metrics.

---

## 🚀 Production Deployment Checklist

1. **Environment Configs:** Keep `RENDER`, `MEMORY_OPTIMIZED`, `DEBUG=False`, `ALLOWED_HOSTS`, and `SECRET_KEY` correctly set in production settings.
2. **Offline Embeddings Fallback:** If hosting memory is constrained, set `MEMORY_OPTIMIZED=True` to prevent SentenceTransformer initialization memory overruns.
3. **LLM Connection Settings:** Keep the Ollama endpoint configurations mapped to `nemotron-3-super:cloud` with appropriate connection timeout parameters.
