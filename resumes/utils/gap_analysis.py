"""
ML-Powered Resume Analysis Engine.
Uses SentenceTransformer (all-MiniLM-L6-v2) for semantic skill matching.
Replaces simple string matching with contextual cosine similarity.
"""
import os, json, re, logging
import numpy as np
from typing import List, Dict, Optional, Tuple
from .role_templates import ROLES, validate_custom_role

logger = logging.getLogger(__name__)

# Lazy-load the ML model
_model = None

def _get_model():
    """Get the SentenceTransformer model (lazy loaded, singleton)."""
    global _model
    if _model is None:
        from .ml_model import get_model
        _model = get_model()
    return _model


# ─── Synonym Expansion ───────────────────────────────────────────────
SYNONYMS = {
    "node": ["node.js", "nodejs"],
    "nodejs": ["node.js"],
    "postgres": ["postgresql"],
    "aws": ["amazon web services", "amazon aws"],
    "reactjs": ["react"],
    "tf": ["tensorflow"],
    "keras": ["tensorflow", "keras"],
    "ml": ["machine learning"],
    "ai": ["artificial intelligence"],
    "nlp": ["natural language processing"],
    "k8s": ["kubernetes"],
    "git": ["version control", "github", "gitlab"],
    "rest": ["rest api", "restful"],
    "ts": ["typescript"],
    "js": ["javascript"],
    "gcp": ["google cloud"],
    "ci/cd": ["cicd", "continuous integration", "continuous deployment"],
    "devops": ["dev ops", "site reliability"],
    "golang": ["go language", "go programming"],
    "go": ["golang"],
}

SKILL_CATEGORIES = {
    "frontend": ["react", "html", "css", "javascript", "typescript", "angular", "vue", "nextjs", "tailwind", "sass", "bootstrap", "svelte"],
    "backend": ["node.js", "python", "java", "express", "django", "flask", "fastapi", "spring boot", "laravel", "rails", "golang", "rust", "go"],
    "database": ["sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "sqlite", "dynamodb", "cassandra", "snowflake", "firebase"],
    "cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ansible", "linux", "cicd", "ci/cd"],
    "ai_ml": ["machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "nlp", "transformers", "neural network", "computer vision"],
    "mobile": ["flutter", "react native", "swift", "kotlin", "android", "ios"],
}


# ─── Email Extraction (Real, Not Static) ──────────────────────────────
FAKE_EMAIL_DOMAINS = {
    "example.com", "test.com", "email.com", "noreply.com",
    "candidex.ai", "placeholder.com", "yourmail.com", "domain.com"
}

def extract_real_email(text: str) -> Optional[str]:
    """
    Extract the actual candidate email from resume text.
    Filters out false positives like noreply@, example.com, etc.
    Returns None if no real email found (NOT a fake placeholder).
    """
    if not text:
        return None

    # Find all email-like patterns
    pattern = r'\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b'
    all_emails = re.findall(pattern, text)

    if not all_emails:
        return None

    # Filter out obviously fake/system emails
    real_emails = []
    for email in all_emails:
        email_lower = email.lower()
        domain = email_lower.split('@')[1] if '@' in email_lower else ''

        # Skip fake domains
        if domain in FAKE_EMAIL_DOMAINS:
            continue
        # Skip system-like prefixes
        if any(email_lower.startswith(p) for p in ['noreply', 'no-reply', 'donotreply', 'admin@', 'info@', 'support@']):
            continue
        # Skip very short local parts (likely false positives)
        local_part = email_lower.split('@')[0]
        if len(local_part) < 3:
            continue

        real_emails.append(email)

    if not real_emails:
        return None

    # Return the first real email found (typically at the top of the resume)
    return real_emails[0]


# ─── Experience Extraction (Date Range Based) ────────────────────────
def extract_experience_years(text: str) -> Optional[int]:
    """
    Extract years of experience by analyzing date ranges in the resume.
    Strategy:
    1. Look for explicit "X years experience" patterns
    2. Parse date ranges like "Jan 2019 - Present" or "2018 – 2023"
    3. Calculate total span from earliest to latest year found
    """
    if not text:
        return None

    text_lower = text.lower()

    # Strategy 1: Explicit patterns like "5+ years", "8 years of experience"
    explicit_patterns = [
        r'(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)',
        r'(?:experience|exp)\s*(?:of\s+)?(\d{1,2})\+?\s*(?:years?|yrs?)',
        r'(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:in\s+(?:the\s+)?(?:industry|field|software|tech))',
    ]
    for pattern in explicit_patterns:
        match = re.search(pattern, text_lower)
        if match:
            val = int(match.group(1))
            if 1 <= val <= 40:
                return val

    # Strategy 2: Extract all 4-digit years and compute span
    year_pattern = r'\b(19[89]\d|20[0-2]\d)\b'
    years_found = [int(y) for y in re.findall(year_pattern, text)]

    # Also detect "Present" / "Current" which implies current year
    if re.search(r'\b(?:present|current|now|ongoing)\b', text_lower):
        from datetime import datetime
        years_found.append(datetime.now().year)

    if len(years_found) >= 2:
        span = max(years_found) - min(years_found)
        if 1 <= span <= 40:
            return span

    return None


# ─── Semantic Skill Matching (ML-Powered) ─────────────────────────────
def _keyword_match(skill: str, text_lower: str) -> bool:
    """Fast keyword check with synonym expansion. Used as first pass."""
    skill_lower = skill.lower().strip()

    # Direct substring match
    if skill_lower in text_lower:
        return True

    # Normalized match (remove dots, hyphens, spaces)
    normalized_skill = re.sub(r'[.\-\s/]', '', skill_lower)
    normalized_text = re.sub(r'[.\-\s/]', '', text_lower)
    if normalized_skill in normalized_text:
        return True

    # Synonym expansion
    for key, synonyms in SYNONYMS.items():
        if skill_lower == key:
            if any(syn in text_lower for syn in synonyms):
                return True
        if skill_lower in synonyms:
            if key in text_lower:
                return True

    return False


def _semantic_match(skill: str, resume_chunks: List[str], model, threshold: float = 0.45) -> Tuple[bool, float]:
    """
    Use SentenceTransformer to compute cosine similarity between
    a skill phrase and resume text chunks. Returns (is_match, best_score).
    """
    if model is None:
        return False, 0.0

    try:
        from sklearn.metrics.pairwise import cosine_similarity

        # Encode the skill as a query
        skill_vec = model.encode(f"proficiency in {skill}")

        # Encode resume chunks
        chunk_vecs = model.encode(resume_chunks)

        # Compute similarity with each chunk, take the max
        similarities = cosine_similarity(
            skill_vec.reshape(1, -1),
            chunk_vecs
        )[0]

        best_score = float(np.max(similarities))
        return best_score >= threshold, best_score

    except Exception as e:
        logger.warning(f"[ML] Semantic match failed for '{skill}': {e}")
        return False, 0.0


def _chunk_resume(text: str, chunk_size: int = 800, overlap: int = 200) -> List[str]:
    """Split resume into overlapping chunks for semantic matching."""
    cleaned = re.sub(r'\s+', ' ', text.replace('\n', ' ')).strip()
    if len(cleaned) <= chunk_size:
        return [cleaned]

    chunks = []
    start = 0
    while start < len(cleaned):
        end = start + chunk_size
        chunks.append(cleaned[start:end])
        start += (chunk_size - overlap)
    return chunks


def match_skills_ml(resume_text: str, skills: List[str], use_semantic: bool = True) -> Tuple[List[str], List[str], Dict[str, float]]:
    """
    Match skills against resume using a two-pass strategy:
    Pass 1: Fast keyword + synonym matching
    Pass 2: Semantic ML matching for skills not found by keywords

    Returns: (matched_skills, missing_skills, confidence_scores)
    """
    text_lower = resume_text.lower()
    model = _get_model() if use_semantic else None
    chunks = _chunk_resume(resume_text) if model else []

    matched = []
    missing = []
    scores = {}

    # Pass 1: Keyword matching (fast)
    keyword_unmatched = []
    for skill in skills:
        if _keyword_match(skill, text_lower):
            matched.append(skill)
            scores[skill] = 1.0  # Perfect keyword match
        else:
            keyword_unmatched.append(skill)

    # Pass 2: Semantic matching for remaining skills (ML)
    if model and keyword_unmatched and chunks:
        for skill in keyword_unmatched:
            is_match, score = _semantic_match(skill, chunks, model)
            scores[skill] = round(score, 3)
            if is_match:
                matched.append(skill)
            else:
                missing.append(skill)
    else:
        # No ML available, all unmatched are missing
        missing.extend(keyword_unmatched)

    return matched, missing, scores


# ─── Category Scoring ─────────────────────────────────────────────────
def compute_categories(matched_skills: List[str]) -> Dict[str, int]:
    """
    Compute category-level scores based on which skills were matched.
    Only includes categories where at least 1 skill was detected.
    """
    categories = {}
    matched_lower = {s.lower() for s in matched_skills}

    for cat_name, cat_skills in SKILL_CATEGORIES.items():
        hits = sum(1 for s in cat_skills if s in matched_lower)
        if hits > 0:
            # Score = percentage of category covered, capped at 100
            categories[cat_name] = min(100, round((hits / min(3, len(cat_skills))) * 100))

    return categories


# ─── Recommendation Generator (Data-Driven, Not Template) ────────────
def generate_recommendation(
    matched_core: List[str],
    missing_core: List[str],
    matched_imp: List[str],
    missing_imp: List[str],
    experience: Optional[int],
    score: int,
    scores: Dict[str, float]
) -> str:
    """
    Generate a specific, data-driven recommendation for this candidate.
    Each sentence is based on actual analysis data, not templates.
    """
    parts = []

    # Core skill assessment
    total_core = len(matched_core) + len(missing_core)
    if total_core > 0:
        core_pct = round(len(matched_core) / total_core * 100)
        if core_pct >= 80:
            parts.append(f"Strong core alignment ({len(matched_core)}/{total_core} core skills verified).")
        elif core_pct >= 50:
            parts.append(f"Partial core match ({len(matched_core)}/{total_core}). Missing: {', '.join(missing_core[:3])}.")
        else:
            parts.append(f"Weak core fit ({len(matched_core)}/{total_core}). Critical gaps: {', '.join(missing_core[:3])}.")

    # Experience assessment
    if experience is not None:
        if experience >= 5:
            parts.append(f"Senior-level tenure detected (~{experience} years).")
        elif experience >= 2:
            parts.append(f"Mid-level experience (~{experience} years).")
        else:
            parts.append(f"Early-career profile (~{experience} year{'s' if experience != 1 else ''}).")
    else:
        parts.append("Experience duration could not be determined from the resume.")

    # Semantic insight — highlight any skills that matched semantically but not by keyword
    semantic_matches = [s for s, v in scores.items() if 0.45 <= v < 1.0 and s in matched_core + matched_imp]
    if semantic_matches:
        parts.append(f"Contextual match detected for: {', '.join(semantic_matches[:2])} (not explicitly listed but semantically present).")

    # Action suggestion
    if missing_core:
        parts.append(f"Priority upskill: {missing_core[0]}.")

    return " ".join(parts)


# ─── Main Analysis Function ──────────────────────────────────────────
def analyze_resume_text(text: str, role_template: Dict) -> Dict:
    """
    ML-powered resume analysis against a role template.

    Uses SentenceTransformer for semantic skill matching.
    Extracts real email and experience from the resume text.

    Returns a complete analysis dict with score, skills, categories,
    experience, email, and data-driven recommendation.
    """
    # 1. Extract real email (not static)
    email = extract_real_email(text)

    # 2. Extract real experience
    experience = extract_experience_years(text)

    # 3. Parse role template skills
    core_skills = [s.strip() for s in role_template.get('core', []) if s.strip()]
    imp_skills = [s.strip() for s in role_template.get('important', []) if s.strip()]
    opt_skills = [s.strip() for s in role_template.get('optional', []) if s.strip()]

    # 4. ML-powered skill matching (two-pass: keyword + semantic)
    matched_core, missing_core, scores_core = match_skills_ml(text, core_skills)
    matched_imp, missing_imp, scores_imp = match_skills_ml(text, imp_skills)
    matched_opt, missing_opt, scores_opt = match_skills_ml(text, opt_skills)

    all_matched = matched_core + matched_imp + matched_opt
    all_missing = missing_core + missing_imp + missing_opt
    all_scores = {**scores_core, **scores_imp, **scores_opt}

    # 5. Weighted score calculation
    core_score = (len(matched_core) / max(1, len(core_skills)))
    imp_score = (len(matched_imp) / max(1, len(imp_skills)))
    opt_score = (len(matched_opt) / max(1, len(opt_skills)))

    base_score = (core_score * 0.60 + imp_score * 0.30 + opt_score * 0.10) * 100

    # Experience bonus
    exp_bonus = 0
    if experience is not None:
        if experience >= 5:
            exp_bonus = 10
        elif experience >= 2:
            exp_bonus = 5

    # Quality signals
    quality_bonus = 0
    text_lower = text.lower()
    if re.search(r'\d+%', text):
        quality_bonus += 5  # Has quantified metrics
    if any(word in text_lower for word in ['improved', 'reduced', 'increased', 'optimized', 'built', 'led', 'managed']):
        quality_bonus += 3  # Action-oriented language
    if len(text) > 1000:
        quality_bonus += 2  # Substantial resume

    final_score = min(100, int(base_score + exp_bonus + quality_bonus))

    # 6. Category breakdown
    categories = compute_categories(all_matched)

    # 7. Data-driven recommendation
    recommendation = generate_recommendation(
        matched_core, missing_core,
        matched_imp, missing_imp,
        experience, final_score, all_scores
    )

    return {
        "email": email,
        "experience": experience,
        "score": final_score,
        "skills": all_matched,
        "matched": all_matched,
        "missing": all_missing,
        "categories": categories if categories else None,
        "recommendation": recommendation,
        "confidence_scores": all_scores,
        "scoring_breakdown": {
            "core": f"{len(matched_core)}/{len(core_skills)}",
            "important": f"{len(matched_imp)}/{len(imp_skills)}",
            "optional": f"{len(matched_opt)}/{len(opt_skills)}",
            "experience_bonus": exp_bonus,
            "quality_bonus": quality_bonus,
        }
    }


# ─── Legacy-Compatible Functions ──────────────────────────────────────
def score_role(resume_text: str, role_key: str):
    """Legacy interface for scoring against a named role."""
    if role_key not in ROLES:
        raise ValueError(f"Unknown role: {role_key}")

    role = ROLES[role_key]
    result = analyze_resume_text(resume_text, role)

    matched_core = [s for s in role.get('core', []) if s in result['matched']]
    missing_core = [s for s in role.get('core', []) if s in result['missing']]
    matched_imp = [s for s in role.get('important', []) if s in result['matched']]
    missing_imp = [s for s in role.get('important', []) if s in result['missing']]
    matched_opt = [s for s in role.get('optional', []) if s in result['matched']]
    missing_opt = [s for s in role.get('optional', []) if s in result['missing']]

    confidence = "High" if result['score'] >= 75 else "Medium" if result['score'] >= 50 else "Low"

    return result['score'], matched_core, missing_core, matched_imp, missing_imp, matched_opt, missing_opt, {
        "rationale": [result['recommendation']],
        "confidence": confidence,
        "exp_level": f"{result['experience'] or 0}yr+"
    }


def best_fit_role(resume_text: str):
    """Find the best matching role for a resume."""
    best = None
    best_score = -1
    for name in ROLES:
        result = analyze_resume_text(resume_text, ROLES[name])
        if result['score'] > best_score:
            best_score = result['score']
            best = name
    return best, best_score


def analyze_with_llm(resume_text: str, jd_text: str, role_key: str = None):
    """Legacy LLM analysis interface."""
    if not role_key or role_key not in ROLES:
        role_key, _ = best_fit_role(resume_text)

    result = analyze_resume_text(resume_text, ROLES[role_key])

    return {
        "role": role_key,
        "match_score": result['score'],
        "ats_status": "Good" if result['score'] >= 70 else "Needs Improvement",
        "strengths": result['matched'],
        "missing_core": [s for s in ROLES[role_key].get('core', []) if s in result['missing']],
        "missing_important": [s for s in ROLES[role_key].get('important', []) if s in result['missing']],
        "roadmap": [f"Master {s}" for s in result['missing'][:3]] or ["Optimize summary", "Add metrics"],
        "recommendations": [result['recommendation']],
        "summary": result['recommendation'],
        "meta": result.get('scoring_breakdown', {})
    }
