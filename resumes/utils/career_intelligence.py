import json
import logging
from typing import List, Dict
from .ml_intelligence import calculate_cosine_similarity, get_embedding

logger = logging.getLogger(__name__)

# ─── 1. CAREER KNOWLEDGE BASE ───
CAREER_KNOWLEDGE_BASE = {
    "AI Engineer": {
        "title": "AI Engineer",
        "core_skills": ["Python", "NLP", "LLMs", "LangChain", "Vector Databases"],
        "frameworks": ["PyTorch", "TensorFlow", "Hugging Face"],
        "tools": ["Prompt Engineering", "OpenAI API", "Ollama"],
        "cloud": ["AWS", "GCP"],
        "databases": ["Pinecone", "ChromaDB", "PostgreSQL"],
        "soft_skills": ["Problem Solving", "System Design", "Research"],
        "certifications": ["AWS Certified Machine Learning", "NVIDIA Deep Learning Institute"],
        "projects": [
            {
                "name": "RAG-based Document Q&A System",
                "difficulty": "Intermediate",
                "skills_learned": ["ChromaDB", "LangChain", "OpenAI"],
                "time_estimate": "3 weeks",
                "value": "High - Demonstrates modern generative AI architecture application."
            }
        ]
    },
    "Machine Learning Engineer": {
        "title": "Machine Learning Engineer",
        "core_skills": ["Python", "Machine Learning", "Scikit-Learn", "Feature Engineering", "Math"],
        "frameworks": ["PyTorch", "TensorFlow", "Keras"],
        "tools": ["MLflow", "DVC", "Jupyter Notebooks"],
        "cloud": ["AWS SageMaker", "GCP Vertex AI"],
        "databases": ["PostgreSQL", "MongoDB"],
        "soft_skills": ["Analytical Thinking", "Math", "Collaboration"],
        "certifications": ["Google Cloud Professional ML Engineer", "AWS Certified Machine Learning"],
        "projects": [
            {
                "name": "End-to-End MLOps Pipeline",
                "difficulty": "Advanced",
                "skills_learned": ["MLflow", "SageMaker", "Docker"],
                "time_estimate": "4 weeks",
                "value": "Critical - Verifies capabilities to deploy and monitor models in production."
            }
        ]
    },
    "Data Scientist": {
        "title": "Data Scientist",
        "core_skills": ["Python", "Statistics", "Data Mining", "Hypothesis Testing", "SQL"],
        "frameworks": ["Scikit-Learn", "Pandas", "NumPy", "Statsmodels"],
        "tools": ["Jupyter", "Tableau", "PowerBI"],
        "cloud": ["AWS", "Snowflake"],
        "databases": ["MySQL", "PostgreSQL", "Redshift"],
        "soft_skills": ["Storytelling", "Business Acumen", "Curiosity"],
        "certifications": ["Microsoft Certified: Azure Data Scientist Associate"],
        "projects": [
            {
                "name": "Customer Churn Prediction Dashboard",
                "difficulty": "Intermediate",
                "skills_learned": ["Pandas", "Logistic Regression", "Tableau"],
                "time_estimate": "2 weeks",
                "value": "Medium - Useful for business intelligence role demonstration."
            }
        ]
    },
    "Data Analyst": {
        "title": "Data Analyst",
        "core_skills": ["SQL", "Excel", "Data Cleaning", "Data Visualization"],
        "frameworks": ["Pandas"],
        "tools": ["Tableau", "PowerBI", "SAS"],
        "cloud": ["AWS", "Google BigQuery"],
        "databases": ["SQL Server", "MySQL"],
        "soft_skills": ["Attention to Detail", "Communication"],
        "certifications": ["Google Data Analytics Professional Certificate"],
        "projects": [
            {
                "name": "E-Commerce Cohort Retention Analysis",
                "difficulty": "Beginner",
                "skills_learned": ["SQL", "Cohort Analysis", "PowerBI"],
                "time_estimate": "1 week",
                "value": "Medium - Proves competency in core business growth metrics."
            }
        ]
    },
    "Backend Engineer": {
        "title": "Backend Engineer",
        "core_skills": ["API Design", "Restful API", "System Architecture", "Algorithms"],
        "frameworks": ["Django", "Express", "FastAPI", "Spring Boot", "Go"],
        "tools": ["Docker", "Git", "Postman"],
        "cloud": ["AWS", "Heroku"],
        "databases": ["PostgreSQL", "Redis", "MySQL"],
        "soft_skills": ["System Design", "Security Focus"],
        "certifications": ["AWS Certified Developer - Associate"],
        "projects": [
            {
                "name": "High-Throughput Distributed API Gateway",
                "difficulty": "Advanced",
                "skills_learned": ["Go", "Redis", "Docker", "Rate Limiting"],
                "time_estimate": "3 weeks",
                "value": "High - Demonstrates scale and system performance concepts."
            }
        ]
    },
    "Full Stack Developer": {
        "title": "Full Stack Developer",
        "core_skills": ["HTML", "CSS", "JavaScript", "TypeScript", "REST API"],
        "frameworks": ["React", "Node.js", "Express", "Next.js"],
        "tools": ["Git", "Webpack", "TailwindCSS"],
        "cloud": ["Vercel", "AWS"],
        "databases": ["PostgreSQL", "MongoDB"],
        "soft_skills": ["Adaptability", "Multi-tasking"],
        "certifications": ["Meta Full-Stack Developer Certificate"],
        "projects": [
            {
                "name": "Collaborative Real-time Project Management Tool",
                "difficulty": "Intermediate",
                "skills_learned": ["React", "Node.js", "Socket.io", "MongoDB"],
                "time_estimate": "3 weeks",
                "value": "High - Showcases complete client-server coordination."
            }
        ]
    },
    "DevOps Engineer": {
        "title": "DevOps Engineer",
        "core_skills": ["CI/CD Pipelines", "Linux Administration", "Infrastructure as Code", "Bash"],
        "frameworks": ["Terraform", "Ansible"],
        "tools": ["Docker", "Jenkins", "GitLab CI", "GitHub Actions"],
        "cloud": ["AWS", "Kubernetes", "k8s"],
        "databases": ["Prometheus Timeseries"],
        "soft_skills": ["Automation Mindset", "Reliability Engineering"],
        "certifications": ["AWS Certified DevOps Engineer - Professional", "Certified Kubernetes Administrator (CKA)"],
        "projects": [
            {
                "name": "Multi-region Kubernetes GitOps Deployment",
                "difficulty": "Advanced",
                "skills_learned": ["ArgoCD", "Kubernetes", "Terraform", "AWS"],
                "time_estimate": "4 weeks",
                "value": "Critical - Verifies enterprise-grade cloud automation skills."
            }
        ]
    },
    "Cloud Engineer": {
        "title": "Cloud Engineer",
        "core_skills": ["Cloud Architecture", "Networking", "Virtualization", "Security"],
        "frameworks": ["Terraform", "CloudFormation"],
        "tools": ["AWS CLI", "Docker"],
        "cloud": ["AWS", "Azure", "GCP"],
        "databases": ["RDS", "DynamoDB"],
        "soft_skills": ["Security Mindset", "Cost Optimization"],
        "certifications": ["AWS Certified Solutions Architect - Associate"],
        "projects": [
            {
                "name": "Serverless Data Pipeline Infrastructure",
                "difficulty": "Intermediate",
                "skills_learned": ["AWS Lambda", "S3", "DynamoDB", "Terraform"],
                "time_estimate": "2 weeks",
                "value": "High - Demonstrates serverless scaling and infrastructure administration."
            }
        ]
    },
    "Cybersecurity Engineer": {
        "title": "Cybersecurity Engineer",
        "core_skills": ["Network Security", "Vulnerability Management", "Cryptography", "Identity Access Management"],
        "frameworks": ["OWASP Top 10", "NIST Framework"],
        "tools": ["Wireshark", "Nmap", "Metasploit", "Splunk"],
        "cloud": ["AWS CloudTrail", "Cloud Security"],
        "databases": ["Elasticsearch"],
        "soft_skills": ["Risk Assessment", "Ethical Mindset"],
        "certifications": ["CompTIA Security+", "Certified Information Systems Security Professional (CISSP)"],
        "projects": [
            {
                "name": "Vulnerability Scanner and Automated Audit Dashboard",
                "difficulty": "Intermediate",
                "skills_learned": ["Python", "Nmap API", "OWASP", "Splunk"],
                "time_estimate": "3 weeks",
                "value": "High - Demonstrates hands-on auditing and security mitigation."
            }
        ]
    },
    "Mobile Developer": {
        "title": "Mobile Developer",
        "core_skills": ["Mobile UI/UX", "State Management", "API Consumption", "Offline Storage"],
        "frameworks": ["Flutter", "React Native", "SwiftUI", "Kotlin Jetpack Compose"],
        "tools": ["Xcode", "Android Studio", "Git"],
        "cloud": ["Firebase", "AWS Amplify"],
        "databases": ["SQLite", "Realm"],
        "soft_skills": ["User Empathy", "Performance Tuning"],
        "certifications": ["Google Associate Android Developer", "Meta Android/iOS Developer Certificate"],
        "projects": [
            {
                "name": "Offline-First Location-based Delivery App",
                "difficulty": "Intermediate",
                "skills_learned": ["Flutter", "SQLite", "Google Maps API"],
                "time_estimate": "3 weeks",
                "value": "High - Highlights complex native storage and location handling."
            }
        ]
    }
}


# ─── 2. CAREER FIT ANALYSIS ALGORITHM ───
def calculate_career_fit(resume_text: str) -> List[dict]:
    """
    Compares the resume text against all 10 roles in the CAREER_KNOWLEDGE_BASE.
    Computes fit score, skill coverage, missing items, and returns top 5 matching careers.
    """
    matches = []
    text_lower = resume_text.lower()
    
    # Precompute resume embedding once for efficiency
    resume_embedding = get_embedding(resume_text)

    for role_id, spec in CAREER_KNOWLEDGE_BASE.items():
        all_skills = (
            spec["core_skills"] + 
            spec["frameworks"] + 
            spec["tools"] + 
            spec["cloud"] + 
            spec["databases"] + 
            spec["soft_skills"]
        )
        
        # 1. Match skills using local SentenceTransformer/keyword matching
        from .ml_model import get_model
        model = get_model()
        
        matched = []
        missing = []
        
        # Simple scan
        for s in all_skills:
            if s.lower() in text_lower:
                matched.append(s)
            else:
                missing.append(s)
                
        # Calculate scores
        base_coverage = len(matched) / max(1, len(all_skills))
        
        # Semantic mapping score (role title embedding compared to resume)
        role_embedding = get_embedding(spec["title"])
        semantic_sim = calculate_cosine_similarity(resume_embedding, role_embedding)
        
        # Composite score calculation (60% semantic similarity + 40% exact skill match)
        fit_score = int((semantic_sim * 0.60 + base_coverage * 0.40) * 100)
        fit_score = max(0, min(100, fit_score + 10)) # Boost threshold normalization
        
        matches.append({
            "career_title": spec["title"],
            "fit_score": fit_score,
            "skills_coverage_percentage": int(base_coverage * 100),
            "strengths": matched[:4],
            "weaknesses": missing[:4],
            "confidence_score": int(semantic_sim * 100)
        })
        
    # Sort matches by fit score descending, slice top 5
    matches.sort(key=lambda x: x["fit_score"], reverse=True)
    return matches[:5]


# ─── 3. ROADMAP & RECOMMENDATION GENERATOR ───
def generate_career_roadmap(resume_text: str, selected_role: str) -> dict:
    """
    Generates a structured career roadmap to help a candidate transition to the selected role.
    Uses deterministic databases for projects/certifications and calls Ollama for coaching guidance.
    """
    spec = CAREER_KNOWLEDGE_BASE.get(selected_role)
    if not spec:
        # Fallback to a default career spec
        spec = CAREER_KNOWLEDGE_BASE["Backend Engineer"]

    text_lower = resume_text.lower()
    
    # Deterministic missing skills determination
    all_skills = spec["core_skills"] + spec["frameworks"] + spec["tools"] + spec["cloud"] + spec["databases"]
    missing = [s for s in all_skills if s.lower() not in text_lower]
    
    # Deterministic projects/certifications recommendations
    suggested_projects = spec["projects"]
    suggested_certs = spec["certifications"]
    
    # ─── LLM PERSONALIZATION LAYER ───
    from .ollama_service import OllamaService
    service = OllamaService()
    
    local_info = {
        "career_target": selected_role,
        "missing_skills": missing,
        "suggested_certs": suggested_certs
    }
    
    prompt = f"""
You are an expert career coach. Personalize this transition roadmap for a candidate who wants to become a "{selected_role}".

=== RESUME CONTEXT ===
{resume_text[:2000]}

=== TARGET PROFILE GAPS ===
{json.dumps(local_info, indent=2)}

=== OBJECTIVE ===
Write:
1. A 2-sentence coaching motivation summarizing their transition difficulty level.
2. 4 specific interview system design/coding prep topics for "{selected_role}".
3. An estimated learning timeline (e.g., "3-6 months, studying 10 hrs/week").

Return ONLY valid JSON:
{{
  "personalized_motivation": "text",
  "interview_topics": ["topic1", "topic2"],
  "estimated_learning_time": "text"
}}
"""
    try:
        response = service.client.chat.completions.create(
            model=service.model,
            messages=[
                {"role": "system", "content": "You are a helpful career advisor that outputs strict JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        llm_data = json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"[CareerIntelligence] Ollama call failed: {e}")
        llm_data = {
            "personalized_motivation": "Your profile shows strong foundations. Focus on backend APIs and deployment.",
            "interview_topics": ["System Design", "Concurrency", "Database Scaling"],
            "estimated_learning_time": "2-3 months"
        }

    return {
        "selected_career": selected_role,
        "roadmap_goals": [f"Learn {s}" for s in missing[:4]] or ["Build a deployment pipeline"],
        "recommended_projects": suggested_projects,
        "recommended_certifications": suggested_certs,
        "coaching_insights": llm_data
    }
