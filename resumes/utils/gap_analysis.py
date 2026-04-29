import requests
import os
import json
import re

HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

# ─────────────────────────────────────────────────────
# Pre-built JD templates for common roles
# Eliminates the "bad JD typing" problem entirely
# ─────────────────────────────────────────────────────
ROLE_TEMPLATES = {
    "frontend_developer": {
        "title": "Frontend Developer",
        "jd": "We are looking for a Frontend Developer proficient in React, Next.js, TypeScript, HTML5, CSS3, and responsive design. Experience with state management (Redux/Zustand), REST/GraphQL APIs, testing (Jest/Cypress), performance optimization, accessibility (WCAG), and CI/CD pipelines is required. Strong understanding of UI/UX principles, design systems, and cross-browser compatibility.",
        "key_skills": ["React", "TypeScript", "Next.js", "CSS3", "Redux", "Jest", "GraphQL", "Webpack", "Figma", "Git"]
    },
    "backend_developer": {
        "title": "Backend Developer",
        "jd": "We are hiring a Backend Developer with expertise in Python, Django/FastAPI, Node.js, RESTful API design, PostgreSQL/MongoDB, Redis caching, Docker, and cloud services (AWS/GCP). Must have experience with microservices architecture, message queues (RabbitMQ/Kafka), authentication systems (OAuth/JWT), automated testing, CI/CD, and production monitoring. Strong system design and scalability knowledge required.",
        "key_skills": ["Python", "Django", "Node.js", "PostgreSQL", "Docker", "AWS", "Redis", "REST APIs", "Microservices", "CI/CD"]
    },
    "fullstack_developer": {
        "title": "Full Stack Developer",
        "jd": "Seeking a Full Stack Developer skilled in both frontend (React/Next.js, TypeScript) and backend (Python/Node.js, Django/Express) development. Must have experience with databases (PostgreSQL, MongoDB), cloud deployment (AWS/Vercel/Render), Docker, CI/CD pipelines, REST/GraphQL APIs, authentication, and agile methodologies. Ability to architect and deliver end-to-end features independently.",
        "key_skills": ["React", "Python", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "REST APIs", "Git", "Agile"]
    },
    "data_scientist": {
        "title": "Data Scientist",
        "jd": "Looking for a Data Scientist with strong expertise in Python, machine learning (scikit-learn, TensorFlow/PyTorch), statistical analysis, SQL, data visualization (Matplotlib/Tableau), and big data tools (Spark/Hadoop). Experience with NLP, deep learning, A/B testing, feature engineering, model deployment (MLflow/SageMaker), and communicating insights to stakeholders is required.",
        "key_skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics", "Pandas", "Deep Learning", "NLP", "Tableau", "AWS SageMaker"]
    },
    "devops_engineer": {
        "title": "DevOps Engineer",
        "jd": "Hiring a DevOps Engineer experienced with AWS/GCP/Azure, Docker, Kubernetes, Terraform/Ansible, CI/CD (Jenkins/GitHub Actions), Linux administration, monitoring (Prometheus/Grafana/Datadog), and security best practices. Must have experience with infrastructure as code, container orchestration, log management, incident response, and high-availability architecture.",
        "key_skills": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Jenkins", "Prometheus", "Ansible", "Python"]
    },
    "mobile_developer": {
        "title": "Mobile Developer",
        "jd": "Seeking a Mobile Developer with expertise in React Native or Flutter for cross-platform development, or Swift/Kotlin for native iOS/Android. Must have experience with mobile UI/UX patterns, state management, REST/GraphQL APIs, push notifications, app store deployment, performance profiling, and testing. Knowledge of Firebase, CI/CD for mobile, and accessibility standards.",
        "key_skills": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "REST APIs", "Git", "App Store", "CI/CD", "TypeScript"]
    },
    "product_manager": {
        "title": "Product Manager",
        "jd": "Looking for a Product Manager with experience in product strategy, roadmap planning, user research, data-driven decision making, A/B testing, agile/scrum methodologies, stakeholder management, and go-to-market strategy. Must have strong analytical skills with tools like Amplitude/Mixpanel, ability to write PRDs, and experience collaborating with engineering and design teams.",
        "key_skills": ["Product Strategy", "Agile", "User Research", "Data Analysis", "Roadmap", "Stakeholder Management", "A/B Testing", "Jira", "SQL", "Communication"]
    },
    "ui_ux_designer": {
        "title": "UI/UX Designer",
        "jd": "Hiring a UI/UX Designer proficient in Figma, Adobe Creative Suite, user research, wireframing, prototyping, design systems, usability testing, and responsive design. Must have a strong portfolio demonstrating information architecture, interaction design, accessibility compliance, and ability to translate business requirements into intuitive user experiences.",
        "key_skills": ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing", "HTML/CSS", "Accessibility", "Typography"]
    },
    "general_sde": {
        "title": "Software Development Engineer",
        "jd": "We need a Software Development Engineer with strong problem-solving skills, proficiency in at least one programming language (Python/Java/C++), data structures and algorithms, system design, database design, version control (Git), testing methodologies, and agile development practices. Experience with cloud services, API development, and production debugging is a plus.",
        "key_skills": ["Data Structures", "Algorithms", "System Design", "Python", "Java", "SQL", "Git", "REST APIs", "Testing", "Cloud Services"]
    }
}


def query_llm(prompt):
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(API_URL, headers=headers, json={
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 1200,
                "temperature": 0.15,
                "return_full_text": False
            }
        }, timeout=45)
        return response.json()
    except Exception as e:
        print("HF Request Error:", e)
        return None


def extract_json(text):
    """Robust JSON extraction from noisy LLM output"""
    try:
        # Try direct parse first
        return json.loads(text.strip())
    except:
        pass
    
    try:
        # Find the outermost JSON object
        depth = 0
        start = None
        for i, c in enumerate(text):
            if c == '{':
                if depth == 0:
                    start = i
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0 and start is not None:
                    candidate = text[start:i+1]
                    try:
                        return json.loads(candidate)
                    except:
                        # Try fixing common LLM JSON issues
                        fixed = candidate.replace("'", '"')
                        fixed = re.sub(r',\s*}', '}', fixed)
                        fixed = re.sub(r',\s*]', ']', fixed)
                        try:
                            return json.loads(fixed)
                        except:
                            pass
    except Exception as e:
        print("JSON Extraction Error:", e)
    return None


def get_role_template(role_key):
    """Get a pre-built JD template by role key"""
    return ROLE_TEMPLATES.get(role_key, ROLE_TEMPLATES["general_sde"])


def analyze_with_llm(resume_text, jd_text, role_key=None):
    """
    Production-grade resume analysis using Hugging Face LLM.
    Supports both pre-built role templates and custom JD text.
    """
    # Use role template if provided, otherwise use raw JD text
    if role_key and role_key in ROLE_TEMPLATES:
        template = ROLE_TEMPLATES[role_key]
        jd_text = template["jd"]
        key_skills = template["key_skills"]
    else:
        key_skills = []

    # Ensure JD is never empty
    if not jd_text or len(jd_text.strip()) < 20:
        jd_text = ROLE_TEMPLATES["general_sde"]["jd"]
        key_skills = ROLE_TEMPLATES["general_sde"]["key_skills"]

    # Truncate inputs to stay within token limits
    resume_trimmed = resume_text[:3000]
    jd_trimmed = jd_text[:1500]

    prompt = f"""[INST] You are a senior technical recruiter with 15 years of experience analyzing resumes for top tech companies.

TASK: Analyze this resume against the job description. Find REAL sentences from the resume that need improvement. Be specific — quote actual text from the resume.

CRITICAL RULES:
1. "original" field MUST contain REAL text copied from the resume — never make up sentences
2. "improved" field must be a professional rewrite with metrics and impact
3. Return EXACTLY 5 recommendations minimum
4. Return ALL skills you find in the resume under verified_skills
5. Return skills from the JD that are NOT in the resume under missing_skills
6. match_score must reflect actual JD alignment (0-100)
7. Return ONLY valid JSON, nothing else

OUTPUT FORMAT:
{{
  "match_score": 62,
  "ats_status": "Needs Improvement",
  "summary": "Brief 1-line assessment of the candidate",
  "verified_skills": ["Python", "React", "Django"],
  "missing_skills": ["Docker", "AWS", "Kubernetes"],
  "issues": [
    "No quantified achievements",
    "Missing action verbs",
    "No relevant certifications"
  ],
  "recommendations": [
    {{
      "section": "Experience",
      "original": "exact sentence from resume",
      "improved": "professional rewrite with metrics",
      "reason": "why this change matters"
    }},
    {{
      "section": "Summary",
      "original": "exact sentence from resume",
      "improved": "professional rewrite with metrics",
      "reason": "why this change matters"
    }}
  ]
}}

RESUME:
{resume_trimmed}

JOB DESCRIPTION:
{jd_trimmed} [/INST]"""

    try:
        raw = query_llm(prompt)
        print("RAW HF RESPONSE:", raw)

        if not raw or not isinstance(raw, list) or not raw[0].get("generated_text"):
            raise ValueError("Empty or invalid LLM response")

        content = raw[0]["generated_text"]
        parsed = extract_json(content)

        if not parsed:
            raise ValueError("JSON extraction failed from LLM output")

        # ── Quality enforcement ──────────────────────────
        
        # Ensure recommendations exist and have required fields
        recs = parsed.get("recommendations", [])
        valid_recs = []
        for r in recs:
            if isinstance(r, dict) and r.get("original") and r.get("improved"):
                if not r.get("section"):
                    r["section"] = "General"
                if not r.get("reason"):
                    r["reason"] = "Improves ATS compatibility and professional impact"
                valid_recs.append(r)
        parsed["recommendations"] = valid_recs

        # Pad recommendations if too few
        if len(parsed["recommendations"]) < 3:
            parsed["recommendations"] = _generate_smart_fallback(resume_trimmed, key_skills)

        # Ensure skills arrays exist
        if not parsed.get("verified_skills"):
            parsed["verified_skills"] = _extract_skills_from_text(resume_trimmed)
        if not parsed.get("missing_skills"):
            parsed["missing_skills"] = key_skills[:5] if key_skills else ["Docker", "CI/CD", "Cloud Services"]

        # Ensure issues exist
        if not parsed.get("issues"):
            parsed["issues"] = _detect_resume_issues(resume_trimmed)

        # Ensure summary exists
        if not parsed.get("summary"):
            parsed["summary"] = f"Resume shows {len(parsed['verified_skills'])} relevant skills. {len(parsed['missing_skills'])} key skills missing from JD requirements."

        # Ensure score is valid
        if not isinstance(parsed.get("match_score"), (int, float)):
            parsed["match_score"] = 50

        if not parsed.get("ats_status"):
            parsed["ats_status"] = "Good" if parsed["match_score"] > 70 else "Needs Improvement"

        return parsed

    except Exception as e:
        print("LLM Pipeline Error:", e)
        # Smart fallback using actual resume content
        return _build_fallback_response(resume_text, key_skills)


def _extract_skills_from_text(text):
    """Extract common tech skills from resume text"""
    skill_bank = [
        "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "Go", "Rust", "Ruby", "PHP",
        "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask", "FastAPI",
        "Spring Boot", "Laravel", "Rails", "Flutter", "React Native", "Swift", "Kotlin",
        "HTML", "CSS", "Tailwind", "Bootstrap", "SASS",
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
        "Docker", "Kubernetes", "AWS", "GCP", "Azure", "Terraform", "Jenkins",
        "Git", "GitHub", "GitLab", "CI/CD", "Linux",
        "REST API", "GraphQL", "gRPC", "WebSocket",
        "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP",
        "Pandas", "NumPy", "Scikit-learn", "Matplotlib",
        "Figma", "Adobe XD", "Photoshop",
        "Jira", "Agile", "Scrum", "Kanban",
        "Firebase", "Supabase", "Vercel", "Render", "Heroku",
        "SQL", "NoSQL", "ORM", "API"
    ]
    text_lower = text.lower()
    found = [s for s in skill_bank if s.lower() in text_lower]
    return found[:15] if found else ["Problem Solving", "Communication"]


def _detect_resume_issues(text):
    """Detect common resume issues from text analysis"""
    issues = []
    text_lower = text.lower()
    
    # Check for quantified achievements
    if not re.search(r'\d+%|\d+x|\$\d+', text):
        issues.append("No quantified achievements or metrics found")
    
    # Check for action verbs
    action_verbs = ["led", "developed", "architected", "optimized", "implemented", "designed", "built", "delivered", "managed", "automated"]
    found_verbs = sum(1 for v in action_verbs if v in text_lower)
    if found_verbs < 3:
        issues.append("Weak action verbs — use 'Led', 'Architected', 'Optimized' instead of 'Worked on'")
    
    # Check resume length
    word_count = len(text.split())
    if word_count < 150:
        issues.append("Resume too short — add more detail about projects and impact")
    elif word_count > 800:
        issues.append("Resume too long — condense to most relevant experience")
    
    # Check for common weak phrases
    weak_phrases = ["responsible for", "worked on", "helped with", "assisted in", "various tasks", "team player"]
    found_weak = [p for p in weak_phrases if p in text_lower]
    if found_weak:
        issues.append(f"Contains weak phrases: '{', '.join(found_weak[:3])}' — replace with impact-driven language")
    
    # Check for professional summary
    if not any(kw in text_lower for kw in ["summary", "objective", "profile", "about"]):
        issues.append("Missing professional summary section")
    
    if not issues:
        issues.append("Resume structure looks solid — focus on tailoring content to the specific role")
    
    return issues[:6]


def _generate_smart_fallback(resume_text, key_skills):
    """Generate contextual fallback recommendations based on actual resume content"""
    lines = [l.strip() for l in resume_text.split('\n') if len(l.strip()) > 20]
    recs = []
    
    # Find weak sentences to improve
    weak_indicators = ["worked on", "responsible for", "helped", "assisted", "managed", "handled", "did", "made"]
    
    for line in lines[:15]:
        line_lower = line.lower()
        for indicator in weak_indicators:
            if indicator in line_lower and len(recs) < 5:
                recs.append({
                    "section": "Experience",
                    "original": line[:120],
                    "improved": _strengthen_sentence(line),
                    "reason": f"Replace '{indicator}' with impact-driven language showing measurable results"
                })
                break
    
    # If still not enough, pick generic sentences to improve
    if len(recs) < 3:
        for line in lines[:10]:
            if len(recs) < 5 and len(line) > 25 and not any(r["original"] == line[:120] for r in recs):
                recs.append({
                    "section": "General",
                    "original": line[:120],
                    "improved": _strengthen_sentence(line),
                    "reason": "Add quantified impact and professional action verbs"
                })
    
    # Absolute minimum fallback
    if len(recs) < 3:
        recs.extend([
            {
                "section": "Summary",
                "original": "Seeking a position to grow my career.",
                "improved": "Results-driven engineer with expertise in full-stack development, delivering scalable solutions that improved system performance by 40%.",
                "reason": "Replace vague objective with quantified value proposition"
            },
            {
                "section": "Experience",
                "original": "Worked on various projects using different technologies.",
                "improved": "Architected and shipped 5+ production applications using React and Django, serving 10K+ monthly active users.",
                "reason": "Quantify scope and impact of work"
            },
            {
                "section": "Skills",
                "original": "Skills: Python, Java, HTML, CSS",
                "improved": f"Technical Skills: {', '.join(key_skills[:6]) if key_skills else 'Python, React, Docker, AWS, PostgreSQL, Git'} | Proficient in agile methodologies and CI/CD pipelines.",
                "reason": "Align skill keywords with JD requirements for ATS optimization"
            }
        ])
    
    return recs[:5]


def _strengthen_sentence(sentence):
    """Improve a weak sentence with professional language"""
    replacements = {
        "worked on": "Developed and delivered",
        "responsible for": "Spearheaded",
        "helped": "Collaborated with cross-functional teams to",
        "assisted": "Partnered with stakeholders to",
        "managed": "Led and optimized",
        "handled": "Orchestrated",
        "did": "Executed",
        "made": "Engineered"
    }
    result = sentence
    for old, new in replacements.items():
        if old in result.lower():
            idx = result.lower().index(old)
            result = result[:idx] + new + result[idx + len(old):]
            break
    
    if not re.search(r'\d+%|\d+x|\$\d+', result):
        result += ", achieving a 25% improvement in efficiency"
    
    return result


def _build_fallback_response(resume_text, key_skills):
    """Build a complete fallback response using local analysis"""
    skills_found = _extract_skills_from_text(resume_text)
    issues = _detect_resume_issues(resume_text)
    recs = _generate_smart_fallback(resume_text, key_skills)
    
    missing = [s for s in key_skills if s.lower() not in resume_text.lower()] if key_skills else ["Docker", "CI/CD", "Cloud"]
    
    # Calculate a rough score
    if key_skills:
        matched = len([s for s in key_skills if s.lower() in resume_text.lower()])
        score = min(95, max(20, int((matched / max(len(key_skills), 1)) * 100)))
    else:
        score = 50
    
    return {
        "match_score": score,
        "ats_status": "Good" if score > 70 else "Needs Improvement",
        "summary": f"Found {len(skills_found)} relevant skills. {len(missing)} key requirements missing.",
        "verified_skills": skills_found,
        "missing_skills": missing[:8],
        "issues": issues,
        "recommendations": recs
    }
