import requests, os, json, re
from .role_templates import ROLES

HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

SYNONYMS = {
  "node": "node.js",
  "nodejs": "node.js",
  "postgres": "postgresql",
  "aws": "amazon web services",
  "reactjs": "react",
  "native": "react native",
  "tf": "tensorflow",
  "keras": "tensorflow",
  "ml": "machine learning",
  "ai": "artificial intelligence",
  "nlp": "natural language processing",
  "k8s": "kubernetes",
  "git": "version control",
  "github": "version control",
  "rest": "rest api",
  "ts": "typescript",
}

SKILL_BANK = [
    "Python","Java","JavaScript","TypeScript","C++","C#","C","Go","Rust","Ruby","PHP","Kotlin","Swift","Dart","Scala","R",
    "React","Angular","Vue","Next.js","Node.js","Express","Django","Flask","FastAPI","Spring Boot","Laravel","Rails",
    "Flutter","React Native","SwiftUI","Jetpack Compose",
    "HTML","CSS","Tailwind","Bootstrap","SASS",
    "PostgreSQL","MySQL","MongoDB","Redis","Elasticsearch","SQLite","SQL Server","DynamoDB","Cassandra","Snowflake","BigQuery",
    "Docker","Kubernetes","AWS","GCP","Azure","Terraform","Jenkins","Ansible","Helm","ArgoCD",
    "Git","GitHub","GitLab","CI/CD","Linux","Bash","Nginx",
    "REST API","GraphQL","gRPC","WebSocket","Kafka","RabbitMQ",
    "Machine Learning","Deep Learning","TensorFlow","PyTorch","Scikit-learn","NLP","LLM","Computer Vision","OpenCV",
    "Pandas","NumPy","Matplotlib","Jupyter","Spark","Airflow","dbt","MLflow",
    "Figma","Adobe XD","Photoshop","Illustrator",
    "Jira","Agile","Scrum","Confluence",
    "Firebase","Supabase","Vercel","Render","Heroku","Netlify",
    "SQL","NoSQL","ORM","API","Microservices","Serverless","Lambda",
    "Selenium","Cypress","Jest","Playwright","Postman",
    "SEO","Google Analytics","Tableau","Power BI","Excel",
    "Network Security", "OWASP", "Encryption", "TCP/IP", "SIEM", "Penetration Testing", "IAM", "Wireshark", "SOC", "Compliance"
]

def norm(x):
    x = x.lower().strip().replace(".", "").replace("-", "").replace(" ", "")
    return SYNONYMS.get(x, x)

def match_skills(resume_text, target_skills):
    t = resume_text.lower()
    matched = []
    missing = []
    for skill in target_skills:
        # Check for direct match or normalized match
        n_skill = norm(skill)
        if skill.lower() in t or n_skill in t.replace(".", "").replace("-", "").replace(" ", ""):
            matched.append(skill)
        else:
            missing.append(skill)
    return matched, missing

def score_role(resume_text, role_key):
    role = ROLES[role_key]
    core_m, core_miss = match_skills(resume_text, role["core"])
    imp_m, imp_miss   = match_skills(resume_text, role["important"])
    opt_m, opt_miss   = match_skills(resume_text, role["optional"])

    core_w, imp_w, opt_w = 0.6, 0.3, 0.1
    
    # Calculate weighted score
    s_core = (len(core_m) / max(1, len(role["core"]))) * core_w
    s_imp = (len(imp_m) / max(1, len(role["important"]))) * imp_w
    s_opt = (len(opt_m) / max(1, len(role["optional"]))) * opt_w
    
    final_score = int((s_core + s_imp + s_opt) * 100)
    return final_score, core_m, core_miss, imp_m, imp_miss, opt_m, opt_miss

def best_fit_role(resume_text):
    best = None
    best_score = -1
    for name in ROLES:
        sc, *_ = score_role(resume_text, name)
        if sc > best_score:
            best_score = sc
            best = name
    return best, best_score

def detect_shift(selected_role, resume_text):
    best, best_sc = best_fit_role(resume_text)
    sel_sc, *_ = score_role(resume_text, selected_role)
    # Trigger shift if best is different AND significantly better
    is_shift = (best != selected_role) and (best_sc - sel_sc >= 15)
    return {
        "is_shift": is_shift,
        "best_role": best,
        "best_score": best_sc,
        "selected_score": sel_sc
    }

def generate_roadmap(core_missing, important_missing):
    steps = []
    for s in core_missing[:3]:
        steps.append(f"Master {s} (Core Requirement). Build a project demonstrating deep implementation of {s}.")
    for s in important_missing[:2]:
        steps.append(f"Gain hands-on experience with {s} in a real-world scenario (add to your projects).")
    
    if not steps:
        steps = [
            "Quantify your achievements with metrics (e.g., 'Reduced latency by 30%').",
            "Optimize your professional summary to include target keywords.",
            "Add detailed technical documentation or blog posts for your top projects.",
            "Contribute to open-source tools related to this role's ecosystem."
        ]
    return steps[:4]

def query_llm(prompt):
    headers = {"Authorization": f"Bearer {HF_API_KEY}", "Content-Type": "application/json"}
    try:
        resp = requests.post(API_URL, headers=headers, json={
            "inputs": prompt, "parameters": {"max_new_tokens": 800, "temperature": 0.1, "return_full_text": False}
        }, timeout=30)
        return resp.json()
    except Exception as e:
        print("HF Error:", e)
        return None

def extract_jd_skills(jd_text):
    """Dynamically extracts known technical skills from a raw JD string."""
    if not jd_text: return [], []
    t = jd_text.lower()
    found = []
    for s in SKILL_BANK:
        n = norm(s)
        if s.lower() in t or n in t.replace(".", "").replace("-", "").replace(" ", ""):
            found.append(s)
    
    # Split into 'must-have' (Core) and 'nice-to-have' (Preferred) based on common JD phrasing
    core = []
    pref = []
    # Simple heuristic: terms near "required", "must", "experience in" are core
    # For now, let's treat the first 60% of found skills as core, rest as preferred
    split_idx = int(len(found) * 0.6)
    core = found[:split_idx]
    pref = found[split_idx:]
    
    return core, pref

def analyze_with_llm(resume_text, jd_text, role_key=None):
    # MODE 1: Skill Gap Finder (JD-driven)
    if jd_text and not role_key:
        core_jd, pref_jd = extract_jd_skills(jd_text)
        # If JD is too thin, fallback to best role detection
        if len(core_jd) < 3:
            role_key, _ = best_fit_role(jd_text or resume_text)
        else:
            core_m, core_miss = match_skills(resume_text, core_jd)
            pref_m, pref_miss = match_skills(resume_text, pref_jd)
            
            # JD-based scoring
            score = int(((len(core_m) * 0.7) + (len(pref_m) * 0.3)) / max(1, (len(core_jd)*0.7 + len(pref_jd)*0.3)) * 100)
            
            return {
                "role": "Custom Job Description",
                "match_score": min(100, score),
                "ats_status": "Optimized" if score >= 75 else "Needs Alignment",
                "strengths": core_m + pref_m,
                "missing_core": core_miss,
                "missing_important": pref_miss,
                "alignment": {"is_shift": False},
                "roadmap": generate_roadmap(core_miss, pref_miss),
                "recommendations": [], # JD-specific recs would need a heavier prompt
                "summary": f"Matched {len(core_m)} core and {len(pref_m)} preferred skills from the JD."
            }

    # MODE 2: Resume Optimizer (Role-driven)
    if not role_key or role_key not in ROLES:
        role_key, _ = best_fit_role(resume_text)
    
    score, core_m, core_miss, imp_m, imp_miss, opt_m, opt_miss = score_role(resume_text, role_key)
    alignment = detect_shift(role_key, resume_text)
    roadmap = generate_roadmap(core_miss, imp_miss)
    
    # Still use LLM for smart rewrites (recommendations)
    prompt = f"""[INST] You are a senior technical recruiter. Suggest 4 specific impact-driven improvements for this resume based on the target role.
    
    RULES:
    1. 'original' must be EXACT text from the resume.
    2. 'improved' must be a professional rewrite with quantified impact.
    3. Return ONLY valid JSON in this format: 
    {{"recommendations": [{{"section": "Experience", "original": "text", "improved": "text", "reason": "why"}}]}}

    RESUME: {resume_text[:2000]}
    TARGET ROLE: {role_key} [/INST]"""
    
    recs = []
    try:
        raw = query_llm(prompt)
        if raw and isinstance(raw, list) and raw[0].get("generated_text"):
            content = raw[0]["generated_text"]
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                parsed = json.loads(match.group())
                recs = parsed.get("recommendations", [])
    except Exception as e:
        print("LLM Rec Error:", e)

    return {
        "role": role_key,
        "match_score": score,
        "ats_status": "Good" if score >= 70 else "Needs Improvement",
        "strengths": core_m + imp_m,
        "missing_core": core_miss,
        "missing_important": imp_miss,
        "alignment": alignment,
        "roadmap": roadmap,
        "recommendations": recs[:5],
        "summary": f"You match {len(core_m)}/{len(ROLES[role_key]['core'])} core skills for this role."
    }
