import re
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load skills database
SKILLS_FILE = os.path.join(os.path.dirname(__file__), "skills.json")
try:
    with open(SKILLS_FILE, "r") as f:
        SKILLS_DB = json.load(f)
except FileNotFoundError:
    SKILLS_DB = ["python", "django", "react", "javascript", "sql"]

def extract_skills(text):
    """Extraction using regex to find technical skills (Normalized and Punctuation-safe)."""
    # 1. Normalize text (Remove special chars that break regex/match)
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
    found = []

    for skill in SKILLS_DB:
        # 2. Improved regex pattern for better handling of punctuation/boundaries
        pattern = r'(?<!\w)' + re.escape(skill.lower()) + r'(?!\w)'
        if re.search(pattern, text):
            found.append(skill.lower())

    return list(set(found))

def compute_similarity(resume, job_desc):
    """Enhanced TF-IDF Cosine Similarity with n-gram support (1,2)."""
    try:
        # Pre-process inputs
        resume_clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', resume.lower())
        job_clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', job_desc.lower())

        # Support bigrams for better contextual matching (e.g. "Data Science")
        vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1,2))
        vectors = vectorizer.fit_transform([resume_clean, job_clean])
        similarity = cosine_similarity(vectors[0:1], vectors[1:2])[0][0]
        
        return similarity if similarity > 0 else 0.1
    except Exception:
        return 0.1

from .scoring import (
    calculate_skills_score, 
    calculate_experience_score, 
    calculate_education_score, 
    calculate_ats_score,
    get_final_score
)
from .text_extract import extract_contacts

def calculate_score_details(resume_text, matched_skills, job_skills):
    """Hybrid scoring using the centralized scoring engine."""
    
    # 1. Skills (40%)
    skills_score = calculate_skills_score(matched_skills, job_skills)
    
    # 2. Experience (30%)
    # Using a default of 3 years if not specified in JD for now
    exp_score = calculate_experience_score(resume_text, target_years=3)
    
    # 3. Education (15%)
    edu_score = calculate_education_score(resume_text)
    
    # 4. ATS Format (15%)
    contacts = extract_contacts(resume_text)
    ats_score = calculate_ats_score(
        resume_text, 
        has_email=bool(contacts.get("email")), 
        has_phone=bool(contacts.get("phone"))
    )
    
    final_score = get_final_score(skills_score, exp_score, edu_score, ats_score)
    
    return {
        "final": final_score,
        "sections": {
            "skills": int(skills_score),
            "experience": int(exp_score),
            "education": int(edu_score),
            "ats": int(ats_score)
        }
    }

def analyze_resume(resume_text, job_desc, manual_job_skills=None):
    """Upgraded orchestration with AI rewrites and section scoring."""
    skills_found = extract_skills(resume_text)
    
    if manual_job_skills:
        job_skills = list(set([s.lower() for s in manual_job_skills]))
    else:
        job_skills = extract_skills(job_desc)

    matched_skills = list(set([s for s in skills_found if s in job_skills]))
    missing_skills = list(set([s for s in job_skills if s not in skills_found]))

    score_details = calculate_score_details(resume_text, matched_skills, job_skills)
    score = score_details["final"]

    # Actionable Suggestions
    suggestions = []
    if len(missing_skills) > 3:
        suggestions.append({
            "type": "missing_skill",
            "message": f"Critical skills missing: Consider adding {', '.join(missing_skills[:3])}.",
            "priority": "high"
        })
    
    # AI Feedback based on standardized scoring
    if score > 75:
        feedback = "Elite Profile: Your background is a top match for this role."
    elif score >= 50:
        feedback = "Strong Professional: Core foundation is solid, but surface missing skills."
    else:
        feedback = "Foundation Needed: Focus on acquiring missing technical keywords."

    return {
        "score": score,
        "section_scores": score_details["sections"],
        "skills_found": list(set(skills_found)), 
        "matched_skills": matched_skills, 
        "missing_skills": missing_skills, 
        "suggestions": suggestions,
        "feedback": feedback
    }
