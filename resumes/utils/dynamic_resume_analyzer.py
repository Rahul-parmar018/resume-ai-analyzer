import re, json, time
from django.conf import settings
from openai import OpenAI
import logging

logger = logging.getLogger(__name__)

class DynamicResumeAnalyzer:
    """Wrapper for GPT‑based resume analysis with rate limiting."""

    def __init__(self):
        self.api_key = getattr(settings, "OPENAI_API_KEY", None)
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        self.model = "gpt-3.5-turbo"
        self.rate_limit_delay = 1  # seconds between requests
        self.max_retries = 3
        self.last_request_time = 0

    def _rate_limit(self):
        """Simple rate limiting to avoid hitting API limits."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            time.sleep(self.rate_limit_delay - time_since_last)
        self.last_request_time = time.time()

    def analyze(self, resume_text, job_desc, job_title):
        """Compare resume and job; return structured JSON."""
        # Use mock scoring if no API key
        if not self.client:
            return self._mock_analysis(resume_text, job_title)

        prompt = f"""
Compare this resume to the {job_title} position.

Resume:
{resume_text[:2000]}

Job Description:
{job_desc}

Respond ONLY as JSON:
{{"total_score":0-100,"match_level":"Weak|Moderate|Strong",
"summary":"text","skills_found":["skill1"],"missing_skills":["skill2"]}}
"""
        
        for attempt in range(self.max_retries):
            try:
                self._rate_limit()  # Apply rate limiting
                
                result = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a recruiter scoring resumes."},
                        {"role": "user", "content": prompt},
                    ],
                    temperature=0.3,
                    max_tokens=500,
                )
                raw = result.choices[0].message.content
                m = re.search(r"\{.*\}", raw, re.DOTALL)
                return json.loads(m.group()) if m else {"summary": raw, "total_score": 0}
                
            except Exception as e:
                error_msg = str(e)
                logger.warning(f"OpenAI API attempt {attempt + 1} failed: {error_msg}")
                
                # Handle rate limiting specifically
                if "rate limit" in error_msg.lower() or "429" in error_msg:
                    if attempt < self.max_retries - 1:
                        wait_time = (2 ** attempt) * 2  # Exponential backoff
                        logger.info(f"Rate limited, waiting {wait_time} seconds before retry")
                        time.sleep(wait_time)
                        continue
                
                # For other errors, return immediately
                return {"error": error_msg, "summary": "GPT API failed.", "total_score": 0}
        
        return {"error": "Max retries exceeded", "summary": "GPT API failed.", "total_score": 0}

    def _mock_analysis(self, text, title):
        """Fallback local random scoring if API key missing."""
        import random
        return {
            "total_score": random.randint(40, 95),
            "match_level": random.choice(["Weak", "Moderate", "Strong"]),
            "summary": f"Offline mock analysis for {title}.",
            "skills_found": ["Python","SQL"],
            "missing_skills": ["Communication"],
        }