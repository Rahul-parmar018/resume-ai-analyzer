import requests, os, json, re
from .role_templates import ROLE_TEMPLATES

HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

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
]

def query_llm(prompt):
    headers = {"Authorization": f"Bearer {HF_API_KEY}", "Content-Type": "application/json"}
    try:
        resp = requests.post(API_URL, headers=headers, json={
            "inputs": prompt, "parameters": {"max_new_tokens": 1200, "temperature": 0.15, "return_full_text": False}
        }, timeout=45)
        return resp.json()
    except Exception as e:
        print("HF Error:", e)
        return None

def extract_json(text):
    try:
        return json.loads(text.strip())
    except: pass
    depth = start = 0
    s = None
    for i, c in enumerate(text):
        if c == '{':
            if depth == 0: s = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and s is not None:
                try: return json.loads(text[s:i+1])
                except:
                    fixed = re.sub(r',\s*[}\]]', lambda m: m.group().replace(',',''), text[s:i+1])
                    try: return json.loads(fixed)
                    except: pass
    return None

def extract_skills(text):
    t = text.lower()
    return [s for s in SKILL_BANK if s.lower() in t][:20]

def detect_issues(text):
    issues = []
    t = text.lower()
    if not re.search(r'\d+%|\d+x|\$\d+', text):
        issues.append("No quantified achievements — add metrics like '30% improvement' or '$1M revenue'")
    verbs = ["led","developed","architected","optimized","implemented","designed","built","delivered","automated","launched"]
    if sum(1 for v in verbs if v in t) < 3:
        issues.append("Weak action verbs — replace 'worked on', 'helped with' using 'Led', 'Architected', 'Delivered'")
    weak = [p for p in ["responsible for","worked on","helped with","assisted in","various tasks","team player"] if p in t]
    if weak:
        issues.append(f"Contains weak phrases: {', '.join(weak[:3])} — rewrite with impact language")
    wc = len(text.split())
    if wc < 150: issues.append("Resume too short — expand project descriptions with outcomes and scale")
    elif wc > 900: issues.append("Resume too long for ATS — condense to 1-2 pages of most relevant experience")
    if not any(k in t for k in ["summary","objective","profile","about me"]):
        issues.append("Missing professional summary — add a 2-3 line value proposition at the top")
    if not re.search(r'(github|linkedin|portfolio|website)', t):
        issues.append("No portfolio/LinkedIn links — add professional URLs for credibility")
    return issues[:7] if issues else ["Resume structure looks solid — tailor content to the specific role"]

def strengthen(s):
    for old, new in [("worked on","Developed and delivered"),("responsible for","Spearheaded"),("helped","Collaborated to"),("assisted","Partnered with stakeholders to"),("handled","Orchestrated"),("managed","Led and optimized")]:
        if old in s.lower():
            i = s.lower().index(old)
            s = s[:i] + new + s[i+len(old):]
            break
    if not re.search(r'\d+%|\d+x|\$\d+', s): s += ", achieving measurable improvement in efficiency and delivery"
    return s

def smart_fallback_recs(text, key_skills):
    lines = [l.strip() for l in text.split('\n') if len(l.strip()) > 20]
    recs = []
    for line in lines[:20]:
        ll = line.lower()
        for w in ["worked on","responsible for","helped","assisted","handled","managed","did","made","various"]:
            if w in ll and len(recs) < 5:
                recs.append({"section":"Experience","original":line[:150],"improved":strengthen(line[:150]),"reason":f"Replace '{w}' with impact-driven language"})
                break
    if len(recs) < 3:
        for line in lines[:12]:
            if len(recs) < 5 and not any(r["original"]==line[:150] for r in recs):
                recs.append({"section":"General","original":line[:150],"improved":strengthen(line[:150]),"reason":"Add quantified impact and action verbs"})
    if len(recs) < 3:
        sk = ', '.join(key_skills[:6]) if key_skills else "Docker, AWS, CI/CD, Kubernetes"
        recs.extend([
            {"section":"Summary","original":"Seeking a position to grow my career.","improved":"Results-driven engineer delivering scalable solutions with measurable business impact across full development lifecycle.","reason":"Replace vague objective with value proposition"},
            {"section":"Skills","original":"Skills: various technologies","improved":f"Technical: {sk} | Methodologies: Agile, CI/CD, TDD","reason":"Align skills with JD requirements for ATS"},
            {"section":"Experience","original":"Worked on projects","improved":"Architected and shipped 5+ production applications serving 10K+ users with 99.9% uptime.","reason":"Quantify scope and impact"},
        ])
    return recs[:5]

def analyze_with_llm(resume_text, jd_text, role_key=None):
    if role_key and role_key in ROLE_TEMPLATES:
        tmpl = ROLE_TEMPLATES[role_key]
        jd_text = tmpl["jd"]
        key_skills = tmpl["key_skills"]
    else:
        key_skills = []
    if not jd_text or len(jd_text.strip()) < 20:
        jd_text = ROLE_TEMPLATES.get("general_sde", list(ROLE_TEMPLATES.values())[0])["jd"]
        key_skills = ROLE_TEMPLATES.get("general_sde", list(ROLE_TEMPLATES.values())[0])["key_skills"]

    rt = resume_text[:3000]
    jt = jd_text[:1500]

    prompt = f"""[INST] You are a senior recruiter at a top tech company. Analyze this resume against the job description.

RULES:
1. "original" MUST be REAL text from the resume
2. Return 5+ recommendations with section, original, improved, reason
3. Return ALL matching skills and ALL missing skills
4. Be specific and realistic
5. Return ONLY valid JSON

FORMAT:
{{"match_score":62,"ats_status":"Needs Improvement","summary":"1-line assessment","verified_skills":[],"missing_skills":[],"issues":[],"recommendations":[{{"section":"Experience","original":"real resume text","improved":"better version","reason":"why"}}]}}

RESUME:
{rt}

JOB DESCRIPTION:
{jt} [/INST]"""

    try:
        raw = query_llm(prompt)
        print("RAW HF RESPONSE:", raw)
        if not raw or not isinstance(raw, list) or not raw[0].get("generated_text"):
            raise ValueError("Invalid LLM response")
        parsed = extract_json(raw[0]["generated_text"])
        if not parsed: raise ValueError("JSON parse failed")

        # Validate recs
        recs = [r for r in parsed.get("recommendations",[]) if isinstance(r,dict) and r.get("original") and r.get("improved")]
        for r in recs:
            r.setdefault("section","General")
            r.setdefault("reason","Improves ATS score and professional impact")
        if len(recs) < 3: recs = smart_fallback_recs(rt, key_skills)
        parsed["recommendations"] = recs[:6]

        if not parsed.get("verified_skills"): parsed["verified_skills"] = extract_skills(rt)
        if not parsed.get("missing_skills"):
            parsed["missing_skills"] = [s for s in key_skills if s.lower() not in resume_text.lower()][:8]
        if not parsed.get("issues"): parsed["issues"] = detect_issues(rt)
        if not parsed.get("summary"): parsed["summary"] = f"Found {len(parsed['verified_skills'])} matching skills. {len(parsed['missing_skills'])} key skills missing."
        if not isinstance(parsed.get("match_score"),(int,float)): parsed["match_score"] = 50
        if not parsed.get("ats_status"): parsed["ats_status"] = "Good" if parsed["match_score"]>70 else "Needs Improvement"
        return parsed
    except Exception as e:
        print("LLM Error:", e)
        return _fallback(resume_text, key_skills)

def _fallback(resume_text, key_skills):
    found = extract_skills(resume_text)
    missing = [s for s in key_skills if s.lower() not in resume_text.lower()][:8] if key_skills else ["Docker","CI/CD","Cloud","Kubernetes","Terraform"]
    issues = detect_issues(resume_text)
    recs = smart_fallback_recs(resume_text, key_skills)
    if key_skills:
        matched = len([s for s in key_skills if s.lower() in resume_text.lower()])
        score = min(95, max(15, int((matched/max(len(key_skills),1))*100)))
    else:
        score = 45
    return {
        "match_score": score,
        "ats_status": "Good" if score>70 else "Needs Improvement",
        "summary": f"Found {len(found)} skills. Missing {len(missing)} key requirements from the job description.",
        "verified_skills": found,
        "missing_skills": missing,
        "issues": issues,
        "recommendations": recs
    }
