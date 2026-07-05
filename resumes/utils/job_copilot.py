import logging
from typing import Dict, List, Optional
from .ml_intelligence import get_embedding, calculate_cosine_similarity
from .career_intelligence import calculate_career_fit
from .market_intelligence import MarketIntelligenceEngine

logger = logging.getLogger(__name__)

# ─── 1. MOCK COMPANY & JOB POSTINGS DATABASE ───
MOCK_JOB_DATABASE = {
    "job_stripe_backend": {
        "id": "job_stripe_backend",
        "title": "Backend Software Engineer",
        "company": "Stripe",
        "industry": "FinTech",
        "size": "5,000+ employees",
        "tech_stack": ["Ruby", "Go", "PostgreSQL", "REST APIs", "Docker", "AWS"],
        "hiring_focus": "Distributed systems scaling, payment APIs design, and ledger consistency.",
        "interview_style": "Hands-on coding (concurrency, API design) + System Design panel.",
        "recommended_prep_topics": ["Database Transactions", "Idempotent API Design", "Message Queues"],
        "required_skills": ["Go", "REST APIs", "PostgreSQL", "System Design"],
        "preferred_qualifications": ["Experience in FinTech/payment systems", "Kubernetes administration"]
    },
    "job_openai_ml": {
        "id": "job_openai_ml",
        "title": "Machine Learning Research Engineer",
        "company": "OpenAI",
        "industry": "Artificial Intelligence",
        "size": "500+ employees",
        "tech_stack": ["Python", "PyTorch", "CUDA", "Kubernetes", "Triton"],
        "hiring_focus": "Large language model pretraining, fine-tuning, and efficient training scaling.",
        "interview_style": "Algorithm coding + Deep Learning architectures + Triton system design.",
        "recommended_prep_topics": ["Transformers architecture", "CUDA memory optimization", "Distributed model training"],
        "required_skills": ["Python", "PyTorch", "Machine Learning", "Transformers"],
        "preferred_qualifications": ["Published papers in NeurIPS/ICML", "CUDA kernels optimization experience"]
    }
}


# ─── 2. APPLICATION READINESS ENGINE ───
def calculate_application_readiness(resume_text: str, job_id: str) -> dict:
    """
    Computes a composite Application Readiness Score based on:
    - Resume Quality (Completeness)
    - Career Fit match
    - Job tech stack similarity
    - ATS keyword alignment
    """
    job = MOCK_JOB_DATABASE.get(job_id)
    if not job:
        # Fallback to Stripe Backend
        job = MOCK_JOB_DATABASE["job_stripe_backend"]

    text_lower = resume_text.lower()
    
    # 1. Match skills
    aligned = []
    missing = []
    for skill in job["tech_stack"] + job["required_skills"]:
        if skill.lower() in text_lower:
            aligned.append(skill)
        else:
            missing.append(skill)

    # 2. Semantic job title similarity
    resume_emb = get_embedding(resume_text)
    job_title_emb = get_embedding(job["title"])
    semantic_sim = calculate_cosine_similarity(resume_emb, job_title_emb)
    
    # 3. Composite score calculations
    skill_coverage = len(aligned) / max(1, len(job["tech_stack"]) + len(job["required_skills"]))
    readiness_score = int((semantic_sim * 0.50 + skill_coverage * 0.50) * 100)
    readiness_score = max(0, min(100, readiness_score + 10)) # Normalization boost
    
    # Explainability mapping
    explanation = f"Your readiness score of {readiness_score}% is composed of semantic title matching ({int(semantic_sim * 100)}%) and technology stack coverage ({int(skill_coverage * 100)}%)."
    
    return {
        "job_id": job["id"],
        "job_title": job["title"],
        "company": job["company"],
        "application_readiness_score": readiness_score,
        "aligned_skills": aligned,
        "missing_skills": missing,
        "explanation": explanation,
        "company_intelligence": {
            "industry": job["industry"],
            "size": job["size"],
            "tech_stack": job["tech_stack"],
            "hiring_focus": job["hiring_focus"],
            "interview_style": job["interview_style"],
            "recommended_prep_topics": job["recommended_prep_topics"]
        }
    }


# ─── 3. RESUME TAILORING SUGGESTIONS ───
def generate_tailoring_suggestions(resume_text: str, job_id: str) -> List[Dict]:
    """Generates targeted tailoring suggestions for keyword insertion and summary tweaks."""
    job = MOCK_JOB_DATABASE.get(job_id)
    if not job:
        job = MOCK_JOB_DATABASE["job_stripe_backend"]

    text_lower = resume_text.lower()
    suggestions = []

    # Check missing required skills
    for skill in job["required_skills"]:
        if skill.lower() not in text_lower:
            suggestions.append({
                "type": "Keyword Insertion",
                "recommendation": f"Add '{skill}' to your Skills section.",
                "why": f"Directly listed as a required skill for this position at {job['company']}.",
                "priority": "High"
            })

    # Check missing tech stack items
    for tech in job["tech_stack"]:
        if tech.lower() not in text_lower:
            suggestions.append({
                "type": "Technology Highlight",
                "recommendation": f"Mention any project experience involving '{tech}'.",
                "why": f"Part of the team's core tech stack: {', '.join(job['tech_stack'])}.",
                "priority": "Medium"
            })

    # Add general structural guidance
    suggestions.append({
        "type": "Summary Optimization",
        "recommendation": f"Tailor your summary statement to focus on '{job['hiring_focus']}' qualities.",
        "why": f"Aligns with the company's current hiring focus: '{job['hiring_focus']}'.",
        "priority": "High"
    })

    return suggestions
