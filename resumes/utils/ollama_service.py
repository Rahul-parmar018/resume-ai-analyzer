import os
import json
import time
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)

class OllamaService:
    """Service class to handle communication with the Ollama Cloud service."""

    def __init__(self):
        self.base_url = os.getenv("OLLAMA_API_URL", "http://localhost:11434/v1")
        self.model = "nemotron-3-super:cloud"
        self.client = OpenAI(base_url=self.base_url, api_key="ollama")
        self.max_retries = 2

    def query_nemotron(self, resume_text: str, local_results: dict, target_jd: str = "") -> dict:
        """
        Sends resume text and local rule-based intelligence results to nemotron-3-super:cloud
        to extract qualitative improvements, bullet rewrites, and prioritized recommendations.
        """
        prompt = f"""
You are an expert ATS optimization agent and technical recruiter. Analyze the candidate's resume and target job description (if provided), supplemented by the pre-computed local structural metrics.

=== RESUME TEXT ===
{resume_text[:4000]}

=== TARGET JOB DESCRIPTION ===
{target_jd[:2000]}

=== LOCAL STRUCTURAL METRICS ===
{json.dumps(local_results, indent=2)}

=== OBJECTIVE ===
Provide advanced, high-level qualitative analysis. Do NOT recalculate scores. Suggest real action items, better formatting improvements, bullet point enhancements with business impacts, and career alignment.

Return ONLY a valid JSON object matching the schema below. No conversational text or markdown blocks outside the JSON:
{{
  "personalized_feedback": "A summary paragraph addressing the candidate's core positioning.",
  "strengths_reasoning": [
    "Identify why certain items are strengths."
  ],
  "weaknesses_reasoning": [
    "Identify specific gaps in positioning, sections, or profiles."
  ],
  "experience_bullet_rewrites": [
    {{
      "original": "Original experience bullet from resume",
      "rewrite": "Upgraded bullet point with action verbs, metrics, and business impact",
      "reason": "Why the change makes the candidate look stronger"
    }}
  ],
  "project_improvement_suggestions": [
    "Specific technical or architectural enhancements to listed projects."
  ],
  "interview_prep_tips": [
    "Questions or architectural topics they should prepare for based on this profile."
  ],
  "prioritized_action_plan": [
    {{
      "priority": 1,
      "task": "Add a GitHub link and include open source contributions.",
      "impact": "High - crucial for technical validation."
    }},
    {{
      "priority": 2,
      "task": "Quantify experience in the first bullet under project lead.",
      "impact": "Medium - adds measurable business value."
    }}
  ]
}}
"""
        for attempt in range(self.max_retries):
            try:
                logger.info(f"[OllamaService] Dispatching request to {self.model} (Attempt {attempt+1})")
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a professional resume analyst that outputs strict JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    response_format={"type": "json_object"}
                )
                
                content = response.choices[0].message.content
                return json.loads(content)
            except Exception as e:
                logger.warning(f"[OllamaService] Attempt {attempt+1} failed: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(1)
                else:
                    logger.error("[OllamaService] Max retries exhausted. Yielding empty fallback payload.")
                    return self.get_fallback_payload()

    def get_fallback_payload(self) -> dict:
        """Returns standard fallback schema when Ollama service is unavailable."""
        return {
            "personalized_feedback": "Offline analysis. Connect your Ollama server to unlock advanced reasoning features.",
            "strengths_reasoning": ["Structured resume formatting"],
            "weaknesses_reasoning": ["Could benefit from deeper metric quantification"],
            "experience_bullet_rewrites": [],
            "project_improvement_suggestions": [],
            "interview_prep_tips": ["Prepare system design and basic programming concepts."],
            "prioritized_action_plan": [
                {
                    "priority": 1,
                    "task": "Add quantitative metrics and business outcome percentages.",
                    "impact": "High"
                }
            ]
        }
