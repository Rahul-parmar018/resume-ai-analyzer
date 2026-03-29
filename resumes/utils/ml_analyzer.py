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

def calculate_score(matched_skills, job_skills, similarity):
    """Hybrid scoring logic based on matching relevant skills and text similarity."""
    if not job_skills:
        skill_match = 0
    else:
        # Only count skills matched against the job description for scoring (Unique sets)
        skill_match = len(list(set(matched_skills))) / max(1, len(list(set(job_skills))))

    # Final Weights: 85% skills, 15% text similarity (Skill-heavy ATS model)
    score = (0.85 * skill_match) + (0.15 * similarity)

    # Core Skill Bonuses (Extra boost for critical technologies)
    bonus = 0
    matched_set = set([s.lower() for s in matched_skills])
    if "python" in matched_set:
        bonus += 0.05
    if "django" in matched_set:
        bonus += 0.05

    final_score = min(1.0, score + bonus)
    return int(final_score * 100)

def analyze_resume(resume_text, job_desc, manual_job_skills=None):
    """The final orchestration function for ATS-like scoring and analysis."""
    # 1. Normalize and Extract Skills (Using improved extraction)
    skills_found = extract_skills(resume_text)
    
    # 2. Key Analysis: Use manual job skills if provided, else extract from JD
    if manual_job_skills:
        job_skills = list(set([s.lower() for s in manual_job_skills]))
    else:
        job_skills = extract_skills(job_desc)

    # 3. Intersection and Difference (Ensuring uniqueness)
    matched_skills = list(set([s for s in skills_found if s in job_skills]))
    missing_skills = list(set([s for s in job_skills if s not in skills_found]))

    # 4. Calculate Similarity Score (Enhanced with n-grams)
    similarity = compute_similarity(resume_text, job_desc)
    
    # 5. Final Hybrid Score
    score = calculate_score(matched_skills, job_skills, similarity)

    # 6. Actionable Suggestions (New logic for value-add)
    suggestions = []
    if "react" in missing_skills:
        suggestions.append("Add a frontend project using React to showcase UI/UX expertise.")
    if "docker" in missing_skills:
        suggestions.append("Mention experience with Docker and containerization for better ranking.")
    if "aws" in missing_skills:
        suggestions.append("Detail your hands-on cloud experience or certifications in AWS.")

    # 7. Dynamic Feedback (Refined)
    if score > 80:
        feedback = "Excellent match! Your profile aligns perfectly with the technical requirements."
    elif score > 60:
        feedback = "Good match, some minor improvements needed in highlighting key skills."
    elif score > 40:
        feedback = "Moderate match, missing key technical skills needed for this role."
    else:
        feedback = "Low match, significant improvement required to meet core requirements."

    return {
        "score": score,
        "skills_found": list(set(skills_found)), 
        "matched_skills": matched_skills, 
        "missing_skills": missing_skills, 
        "suggestions": suggestions,
        "feedback": feedback
    }
