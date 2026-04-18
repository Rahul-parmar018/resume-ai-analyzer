import re
import json
import textstat
from .ml_analyzer import compute_similarity, extract_skills
from .scoring import calculate_experience_score

ACTION_VERBS = ["managed", "led", "developed", "built", "designed", "implemented", "increased", "decreased", "saved", "improved", "optimized", "streamlined", "architected", "launched", "executed", "collaborated", "pioneered", "mentored", "negotiated"]
WEAK_VERBS = ["helped", "teamed", "worked", "handled", "assisted", "responsible", "regularly", "duties"]

def calculate_readability(text):
    try:
        score = textstat.flesch_reading_ease(text)
        # Flesch: 30-50 is difficult (professional), 60+ is easy.
        # Professional resumes should be around 40-60.
        if 40 <= score <= 60: return 100
        if 60 < score <= 80: return 80
        return 50
    except:
        return 70

def analyze_verbs(text):
    text_low = text.lower()
    strong = sum(1 for v in ACTION_VERBS if re.search(rf"\b{v}\b", text_low))
    weak = sum(1 for v in WEAK_VERBS if re.search(rf"\b{v}\b", text_low))
    
    # Target: At least 15-20 strong verbs for a full resume
    # We'll normalize to a score out of 100
    score = min(100, (strong * 8) - (weak * 5))
    return max(0, score), strong, weak

def analyze_metrics(text):
    # Regex: 10%, $5M, 20+, 5x, etc.
    metrics = re.findall(r"\d+%|\$\d+|[\d,]+\+?|[\d.]+[kx] ", text)
    # Target: At least 5-10 metrics
    score = min(100, len(metrics) * 15)
    return score, metrics

def analyze_formatting(text):
    text_low = text.lower()
    SECTIONS = ["experience", "education", "skills", "projects", "summary", "contact", "languages"]
    found = sum(1 for s in SECTIONS if re.search(rf"\b{s}\b", text_low))
    score = min(100, (found / 5) * 100)
    return score, found

def extract_jd_requirements(jd_text):
    text = jd_text.lower()
    exp_patterns = [r"(\d+)\s*\+?\s*(?:years|yrs)\b"]
    min_years = 0
    for p in exp_patterns:
        matches = re.findall(p, text)
        if matches:
            min_years = max(min_years, max([int(m) for m in matches]))
    
    all_skills = extract_skills(jd_text)
    return {
        "required_skills": sorted(list(set(all_skills))),
        "experience_required": min_years,
        "raw_text": jd_text
    }

def run_gap_analysis(resume_text, jd_text):
    # 1. Extraction & Core ML
    jd_reqs = extract_jd_requirements(jd_text)
    resume_skills = extract_skills(resume_text)
    semantic = compute_similarity(resume_text, jd_text)
    
    # 2. Detailed Metrics Analysis
    verb_score, strong_cnt, weak_cnt = analyze_verbs(resume_text)
    metric_score, found_metrics = analyze_metrics(resume_text)
    format_score, section_cnt = analyze_formatting(resume_text)
    readability_score = calculate_readability(resume_text)
    
    # 3. Keyword/Skill Score
    matched = [s for s in resume_skills if s in jd_reqs['required_skills']]
    missing = [s for s in jd_reqs['required_skills'] if s not in resume_skills]
    skill_match_score = (len(matched) / max(1, len(jd_reqs['required_skills']))) * 100
    
    # 4. FINAL WEIGHTED SCORING (Spec: 30-25-20-15-10)
    # Combining Skill Match & Semantic into the 30% Keyword Bucket
    keyword_bucket = (0.7 * skill_match_score) + (0.3 * semantic * 100)
    
    final_score = int(
        (0.30 * keyword_bucket) +
        (0.25 * verb_score) +
        (0.20 * metric_score) +
        (0.15 * format_score) +
        (0.10 * readability_score)
    )

    # 5. REAL SUGGESTION ENGINE (Rewrites)
    recommendations = []
    
    # Detect weak sentences and generate improvements
    sentences = re.split(r"(?<=[.!?])\s+", resume_text)
    weak_sentences = [s for s in sentences if any(w in s.lower() for w in WEAK_VERBS) and len(s.split()) < 15]
    
    for ws in weak_sentences[:3]:
        # Simple rule-based "improvement" for logic check
        # In prod, this would call a fine-tuned GPT model
        improved = ws
        for w in WEAK_VERBS:
            if w in ws.lower():
                verb = "Optimized" if w == "worked" else "Led"
                improved = ws.replace(w, f"{verb} and increased efficiency by 20% using")
                break
        
        recommendations.append({
            "type": "rewrite",
            "original": ws.strip(),
            "improved": improved.strip(),
            "message": "Weak impact detected. quantify this achievement.",
            "impact_gain": "+12%"
        })

    # Add skill suggestions if needed
    for s in missing[:2]:
        recommendations.append({
            "type": "missing_skill",
            "message": f"Add {s} to your skills section.",
            "impact_gain": "+5%"
        })

    return {
        "match_score": min(100, final_score),
        "ats_status": "High Risk" if final_score < 60 else "Optimized",
        "visibility": "Low" if final_score < 70 else "High",
        "metrics": {
            "keyword_match": round(keyword_bucket, 1),
            "action_verbs": verb_score,
            "quantified_results": metric_score,
            "formatting": format_score,
            "readability": readability_score
        },
        "stats": {
            "strong_verbs": strong_cnt,
            "weak_verbs": weak_cnt,
            "metrics_detected": len(found_metrics),
            "sections_found": section_cnt
        },
        "skills": {
            "matched": matched,
            "missing_required": missing
        },
        "recommendations": recommendations,
        "extracted_text": resume_text
    }
