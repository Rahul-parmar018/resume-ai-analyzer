import re
import json
from .ml_analyzer import compute_similarity, extract_skills
from .scoring import calculate_experience_score

def extract_jd_requirements(jd_text):
    """
    Step 1: Extract Required Skills, Preferred Skills, and Experience from JD.
    """
    text = jd_text.lower()
    
    # 1. Experience Extraction
    exp_patterns = [
        r"(\d+)\s*\+?\s*(?:years|yrs)\s*(?:of\s*)?(?:experience|exp)",
        r"(\d+)\s*\+?\s*(?:years|yrs)\b",
    ]
    min_years = 0
    for p in exp_patterns:
        matches = re.findall(p, text)
        if matches:
            try:
                # Take the highest number mentioned as the "Required" floor if multiple exist
                # (e.g., "3-5 years" -> 3 is often the floor)
                years = [int(m) for m in matches]
                min_years = max(min_years, min(years))
            except:
                continue

    # 2. Skill Extraction (Context-Aware)
    all_skills = extract_skills(jd_text)
    
    # Differentiation Logic: Look for section headers
    # Divide text by "preferred" or "nice to have"
    parts = re.split(r"(preferred|nice to have|plus|bonus|advantage|optional|ideally)", text, flags=re.IGNORECASE)
    
    required_skills = []
    preferred_skills = []
    
    if len(parts) == 1:
        # All assumed required if no split found
        required_skills = all_skills
    else:
        # First part is usually required
        required_skills = extract_skills(parts[0])
        # Remaining parts are preferred
        for i in range(1, len(parts), 2):
            context = parts[i] + (parts[i+1] if i+1 < len(parts) else "")
            preferred_skills.extend(extract_skills(context))
            
    # Clean up overlaps (Required wins)
    preferred_skills = [s for s in list(set(preferred_skills)) if s not in required_skills]

    return {
        "required_skills": sorted(list(set(required_skills))),
        "preferred_skills": sorted(list(set(preferred_skills))),
        "experience_required": min_years,
        "raw_text": jd_text
    }

def calculate_experience_delta(resume_text, required_years):
    """
    Step 2: Compare actual vs required years with pro-level structure.
    """
    # Use our existing calculator to get years from resume
    # Passing 1 because we just want the 'actual' years extracted
    actual = calculate_experience_score(resume_text, target_years=1) 
    # calculate_experience_score returns 100 if actual >= target. 
    # Wait, scoring utility returns a SCORE, not years. 
    # Let's extract years directly here or improve scoring.py to expose it.
    
    # Direct extraction for actual years
    patterns = [
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years|yrs)\s*(?:of\s*)?(?:experience|exp)",
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years|yrs)\b",
    ]
    actual_years = 0
    for p in patterns:
        matches = re.findall(p, resume_text.lower())
        if matches:
            actual_years = max(actual_years, max([float(m) for m in matches]))

    if required_years == 0:
        match_pct = 100
        message = "No specific experience requirement identified."
    else:
        match_pct = int(min(100, (actual_years / required_years) * 100))
        if actual_years >= required_years:
            message = f"Exceptional: You exceed the required {required_years} years."
        elif match_pct >= 70:
            message = f"Near Match: You have {actual_years} of the required {required_years} years."
        else:
            message = f"Gap Identified: You meet {match_pct}% of the required {required_years} years."

    return {
        "actual": actual_years,
        "required": required_years,
        "gap": round(actual_years - required_years, 1),
        "match_percentage": match_pct,
        "message": message
    }

def get_semantic_analysis(resume_text, jd_text):
    """
    Step 3: Strategic Semantic alignment check.
    """
    score = compute_similarity(resume_text, jd_text)
    
    if score > 0.85:
        label = "Exceptional Contextual Alignment"
    elif score > 0.70:
        label = "Strong Domain Match"
    elif score > 0.50:
        label = "Moderate Alignment"
    else:
        label = "Significant Intent Gap"
        
    return {
        "score": round(score, 2),
        "label": label,
        "confidence": "high" if score > 0.6 else "medium"
    }

def generate_ai_insight(semantic_label, matched_skills, missing_required, exp_delta):
    """
    Step 5: Human-readable AI Insight.
    """
    insight = f"{semantic_label}. "
    
    if matched_skills:
        top_skills = matched_skills[:3]
        insight += f"Your profile strongly demonstrates core competence in {', '.join(top_skills)}. "
        
    if missing_required:
        insight += f"However, there's a technical gap in {', '.join(missing_required[:2])} which are critical for this role. "
        
    if exp_delta['gap'] < -1:
        insight += f"The {abs(exp_delta['gap'])} year experience gap may require highlighting specific high-impact projects."
        
    return insight.strip()

def run_gap_analysis(resume_text, jd_text):
    """
    Step 4: The Orchestrator.
    Returns the 10/10 production-ready payload.
    """
    # 1. Extraction
    jd_reqs = extract_jd_requirements(jd_text)
    resume_skills = extract_skills(resume_text)
    
    # 2. Skill Comparison
    matched = sorted(list(set([s for s in resume_skills if s in jd_reqs['required_skills'] or s in jd_reqs['preferred_skills']])))
    missing_req = sorted(list(set([s for s in jd_reqs['required_skills'] if s not in resume_skills])))
    missing_pref = sorted(list(set([s for s in jd_reqs['preferred_skills'] if s not in resume_skills])))
    
    # 3. Experience & Semantic
    exp = calculate_experience_delta(resume_text, jd_reqs['experience_required'])
    semantic = get_semantic_analysis(resume_text, jd_text)
    
    # 4. Impact Scoring (Weighted)
    skill_score = (len(matched) / max(1, len(jd_reqs['required_skills']) + 0.5 * len(jd_reqs['preferred_skills']))) * 100
    final_score = int((0.4 * skill_score) + (0.4 * semantic['score'] * 100) + (0.2 * exp['match_percentage']))
    
    # 5. Recommendation Engine
    recommendations = []
    for s in missing_req[:3]:
        recommendations.append({
            "type": "missing_skill",
            "message": f"Critical: Acquire or showcase {s.upper()} to meet core requirements.",
            "priority": "high"
        })
    if exp['gap'] < 0:
        recommendations.append({
            "type": "experience_gap",
            "message": f"Bridge the {abs(exp['gap'])}yr gap by quantifying impact in your current role.",
            "priority": "medium"
        })

    # 6. Generate Explainability Reasoning (PHASE 4)
    reasoning = []
    if semantic['score'] > 0.7:
        reasoning.append("Strong semantic alignment with role context.")
    else:
        reasoning.append("Partial intent gap identified in industry-specific keywords.")
        
    if len(missing_req) > 0:
        reasoning.append(f"Missing {len(missing_req)} core required technical skills.")
    else:
        reasoning.append("Met all core technical skill requirements.")
        
    if exp['gap'] >= 0:
        reasoning.append("Experience level meets or exceeds target threshold.")
    else:
        reasoning.append(f"Falling short of targeted experience by {abs(exp['gap'])} years.")
    
    # Calculate confidence based on data completeness
    confidence = round(0.7 + (min(1.0, len(resume_text)/2000) * 0.1) + (min(1.0, len(jd_text)/1000) * 0.1) + (0.1 if len(matched) > 5 else 0), 2)

    # 7. Final Pack
    return {
        "match_score": min(100, final_score),
        "semantic": semantic,
        "skills": {
            "matched": matched,
            "missing_required": missing_req,
            "missing_preferred": missing_pref
        },
        "experience": exp,
        "insight": generate_ai_insight(semantic['label'], matched, missing_req, exp),
        "recommendations": recommendations,
        "reasoning": reasoning,
        "confidence": min(1.0, confidence)
    }
