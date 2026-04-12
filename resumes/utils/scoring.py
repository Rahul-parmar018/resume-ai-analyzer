import re
import json
import os

# ========================================
# 🎯 SINGLE SOURCE OF TRUTH: SCORING WEIGHTS
# ========================================
SCORING_WEIGHTS = {
    "skills": 0.40,
    "experience": 0.30,
    "education": 0.15,
    "ats": 0.15
}

def calculate_skills_score(matched_skills, job_skills):
    """
    Calculates a normalized 0-100 score for skills.
    """
    if not job_skills:
        return 80  # Default if no JD skills provided
    
    unique_matched = set([s.lower() for s in matched_skills])
    unique_job = set([s.lower() for s in job_skills])
    
    if not unique_job:
        return 100
        
    match_count = len(unique_matched.intersection(unique_job))
    score = (match_count / len(unique_job)) * 100
    return min(100, score)

def calculate_experience_score(resume_text, target_years=3):
    """
    Extracts years and calculates a normalized 0-100 score.
    """
    # Extract years using regex
    patterns = [
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years|yrs)\s*(?:of\s*)?(?:experience|exp)",
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years|yrs)\b",
    ]
    
    extracted_years = 0
    for p in patterns:
        matches = re.findall(p, resume_text.lower())
        if matches:
            try:
                # Take the maximum found years
                years = max([float(m) for m in matches])
                extracted_years = max(extracted_years, years)
            except:
                continue
                
    if target_years == 0:
        return 100
        
    # Scoring logic: 
    # If match target, 100. If 0 exp, 0. Linear scaling.
    score = (extracted_years / target_years) * 100
    return min(100, score)

def calculate_education_score(resume_text):
    """
    Detects education levels and returns a 0-100 score.
    """
    text = resume_text.lower()
    score = 0
    
    levels = {
        "phd": 100,
        "doctorate": 100,
        "master": 85,
        "m.tech": 85,
        "msc": 85,
        "mba": 85,
        "bachelor": 70,
        "b.tech": 70,
        "bsc": 70,
        "graduate": 60,
        "degree": 50,
        "college": 40,
        "high school": 30
    }
    
    for level, s in levels.items():
        if level in text:
            score = max(score, s)
            
    # Bonus for mentioning "GPA" or "Honors"
    if "gpa" in text or "honors" in text:
        score += 5
        
    return min(100, score)

def calculate_ats_score(resume_text, has_email=False, has_phone=False):
    """
    Checks for ATS compatibility factors (formatting, sections, contact info).
    """
    text = resume_text.lower()
    score = 0
    
    # 1. Contact Info (30 points)
    if has_email: score += 15
    if has_phone: score += 15
    
    # 2. Section Headings (40 points)
    sections = ["experience", "education", "skills", "projects", "summary", "objective"]
    found_sections = 0
    for section in sections:
        if section in text:
            found_sections += 1
    
    score += (found_sections / len(sections)) * 40
    
    # 3. Content Length & Density (30 points)
    word_count = len(text.split())
    if 200 <= word_count <= 800:
        score += 30
    elif 100 <= word_count <= 1000:
        score += 15
        
    return min(100, score)

def get_final_score(skills_score, exp_score, edu_score, ats_score):
    """
    Computes weighted final score.
    """
    final = (
        skills_score * SCORING_WEIGHTS["skills"] +
        exp_score * SCORING_WEIGHTS["experience"] +
        edu_score * SCORING_WEIGHTS["education"] +
        ats_score * SCORING_WEIGHTS["ats"]
    )
    return int(round(final))

def get_score_color(score):
    """
    Utility for color consistency (matches frontend logic).
    """
    if score > 75: return "green"
    if score >= 50: return "yellow"
    return "red"

def _normalize_weights(weights):
    """
    Standardizes weights based on the v1 Spec:
    Skills (40%), Experience (30%), Education (15%), ATS Format (15%)
    """
    default = {"skills": 0.40, "experience": 0.30, "education": 0.15, "ats": 0.15}
    if not isinstance(weights, dict):
        return default
    try:
        s = float(weights.get("skills", default["skills"]))
        e = float(weights.get("experience", default["experience"]))
        edu = float(weights.get("education", default["education"]))
        ats = float(weights.get("ats", default["ats"]))
    except Exception:
        return default

    # Normalize to ensure sum is 1.0
    total = s + e + edu + ats
    if total <= 0:
        return default
    return {
        "skills": s / total, 
        "experience": e / total, 
        "education": edu / total, 
        "ats": ats / total
    }
