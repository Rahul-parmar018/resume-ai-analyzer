import json
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

# ─── 1. PROVIDER ABSTRACTION LAYER ───
class BaseJobProvider(ABC):
    """Abstract Base Class for all external labor market data providers."""
    
    @abstractmethod
    def fetch_job_market_data(self, role: str, country: str, experience_level: str) -> dict:
        """Fetches job postings or aggregated market data from the target provider."""
        pass


class MockJobProvider(BaseJobProvider):
    """Mock Job Provider returning realistic simulated labor market dataset."""
    
    def fetch_job_market_data(self, role: str, country: str, experience_level: str) -> dict:
        # Simulate realistic trending skill profiles based on target role
        if "ai" in role.lower() or "machine learning" in role.lower():
            trending = ["LLMs", "LangChain", "Vector Databases", "PyTorch", "Hugging Face"]
            stable = ["Python", "Docker", "SQL", "Git", "FastAPI"]
            companies = ["OpenAI", "Google", "DeepMind", "Microsoft", "Anthropic"]
        elif "devops" in role.lower() or "cloud" in role.lower():
            trending = ["Terraform", "Kubernetes", "Helm", "ArgoCD", "Prometheus"]
            stable = ["Docker", "Linux", "AWS", "Bash", "Git", "CI/CD"]
            companies = ["AWS", "RedHat", "HashiCorp", "Datadog", "Cloudflare"]
        else: # Default backend / fullstack developer
            trending = ["TypeScript", "Next.js", "GraphQL", "TailwindCSS", "FastAPI"]
            stable = ["React", "Node.js", "Express", "PostgreSQL", "Git", "REST API"]
            companies = ["Vercel", "Stripe", "Airbnb", "Meta", "Netflix"]

        return {
            "requested_role": role,
            "target_country": country,
            "experience_level": experience_level,
            "top_skills": stable[:5],
            "growing_skills": trending[:3],
            "declining_skills": ["jQuery", "SVN", "AngularJS"],
            "paired_skills": [["React", "TypeScript"], ["Node.js", "Express"], ["Docker", "Kubernetes"]],
            "hiring_companies": companies,
            "average_salary_index": "$85,000 - $140,000",
            "volume_index": "High"
        }


# ─── 2. MARKET INTELLIGENCE ENGINE ───
class MarketIntelligenceEngine:
    """Core analysis class that evaluates resumes against live/mock market data provider feeds."""
    
    def __init__(self, provider: Optional[BaseJobProvider] = None):
        self.provider = provider or MockJobProvider()

    def get_market_insights(self, role: str, country: str, experience_level: str) -> dict:
        """Fetches data from provider and structures insights."""
        return self.provider.fetch_job_market_data(role, country, experience_level)

    def analyze_resume_vs_market(self, resume_text: str, role: str, country: str, experience_level: str = "Mid") -> dict:
        """
        Compares the resume text against the local labor market dataset.
        Computes a deterministic Market Readiness Score locally.
        Uses Ollama for qualitative reasoning/explanations.
        """
        market_data = self.get_market_insights(role, country, experience_level)
        text_lower = resume_text.lower()
        
        # 1. Deterministic local scoring
        aligned = []
        missing = []
        
        for skill in market_data["top_skills"] + market_data["growing_skills"]:
            if skill.lower() in text_lower:
                aligned.append(skill)
            else:
                missing.append(skill)
                
        # Base score calculation
        total_market_skills = len(market_data["top_skills"]) + len(market_data["growing_skills"])
        coverage = len(aligned) / max(1, total_market_skills)
        readiness_score = int(coverage * 100)
        
        # Quality signals adjustments
        if "github.com" in text_lower:
            readiness_score = min(100, readiness_score + 10)
        if len(resume_text) > 1500:
            readiness_score = min(100, readiness_score + 5)
            
        local_results = {
            "market_readiness_score": readiness_score,
            "aligned_skills": aligned,
            "missing_demand_skills": missing,
            "emerging_trends": market_data["growing_skills"],
            "declining_skills": market_data["declining_skills"],
            "hiring_landscape": market_data["hiring_companies"]
        }

        # 2. LLM explanation layer (Nemotron-3)
        from .ollama_service import OllamaService
        service = OllamaService()
        
        prompt = f"""
You are a top-tier labor market economist and recruiting consultant. Review the candidate's market compatibility stats.

=== CANDIDATE MARKET STATS ===
{json.dumps(local_results, indent=2)}

=== OBJECTIVE ===
Write:
1. A concise labor market positioning advice (2 sentences) explaining their readiness score.
2. An explanation of which single missing skill provides the highest yield/leverage to raise their salary and hirability.

Return ONLY valid JSON:
{{
  "market_positioning_summary": "text",
  "highest_yield_missing_skill": "skill_name",
  "highest_yield_reason": "text"
}}
"""
        try:
            response = service.client.chat.completions.create(
                model=service.model,
                messages=[
                    {"role": "system", "content": "You are a labor market advisor that outputs strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            llm_data = json.loads(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"[MarketIntelligence] Ollama call failed: {e}")
            llm_data = {
                "market_positioning_summary": "Your profile demonstrates strong alignment with local demand. Adding cloud certifications will maximize visibility.",
                "highest_yield_missing_skill": missing[0] if missing else "Cloud Infrastructure",
                "highest_yield_reason": "Critical demand across top hiring companies."
            }

        return {
            "market_readiness_score": readiness_score,
            "local_market_stats": local_results,
            "coaching_explanation": llm_data,
            "raw_market_data": market_data
        }
