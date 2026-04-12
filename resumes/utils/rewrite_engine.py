import re
import json
import logging
import time
from django.conf import settings
from openai import OpenAI

logger = logging.getLogger(__name__)

class ResumeRewriteEngine:
    def __init__(self):
        self.api_key = getattr(settings, "OPENAI_API_KEY", None)
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None
        self.model = "gpt-3.5-turbo"
        self.max_retries = 3

    def extract_bullets(self, resume_text):
        """
        Extracts bullet points from resume text.
        Detects common bullet characters and newlines.
        """
        if not resume_text:
            return []
            
        # Split by newlines and filter for lines starting with bullet indicators
        lines = resume_text.split('\n')
        bullets = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Detect -, •, *, or simple short lines that look like bullets
            if re.match(r'^[\-\•\*\u2022\u2023\u25E6\u2043\u2219]\s*', line):
                # Remove the bullet character
                clean_bullet = re.sub(r'^[\-\•\*\u2022\u2023\u25E6\u2043\u2219]\s*', '', line)
                if clean_bullet:
                    bullets.append(clean_bullet)
            elif 5 < len(line) < 200: # Heuristic for potential bullets without symbols
                # If it's a relatively short line and doesn't end with a period, 
                # or is in a list context, consider it a potential bullet
                bullets.append(line)
                
        return bullets

    def classify_bullet(self, bullet):
        """
        Classifies bullet type for context-aware rewriting.
        """
        bullet_lower = bullet.lower()
        if any(kw in bullet_lower for kw in ['api', 'database', 'sql', 'backend', 'server', 'django', 'node']):
            return "backend"
        if any(kw in bullet_lower for kw in ['react', 'vue', 'frontend', 'ui', 'ux', 'css', 'html', 'javascript']):
            return "frontend"
        if any(kw in bullet_lower for kw in ['lead', 'managed', 'coordinated', 'mentored', 'team']):
            return "leadership"
        return "general"

    def rewrite_batch_with_llm(self, bullets):
        """
        Rewrites a batch of bullets using the LLM for efficiency.
        """
        if not self.client:
            return self._mock_rewrite_batch(bullets)

        prompt = f"""
        You are a professional resume optimizer. 
        Rewrite the following resume bullet points to be stronger, action-driven, and recruiter-ready.

        Rules:
        - Start with a strong action verb.
        - Add measurable impact (if possible, use realistic safe phrases like 'improving efficiency', 'enhancing scalability').
        - Mention technologies if missing.
        - Keep each bullet concise (max 20 words).
        - Do NOT exaggerate or add unrealistic numbers.
        - Return the results as a JSON array of objects with keys: "original", "improved", and "improvements" (list of strings).

        Bullets to rewrite:
        {json.dumps(bullets)}

        Output format:
        {{"results": [{{"original": "...", "improved": "...", "improvements": ["..."]}}]}}
        """

        for attempt in range(self.max_retries):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a professional resume writer and career coach."},
                        {"role": "user", "content": prompt},
                    ],
                    response_format={ "type": "json_object" },
                    temperature=0.3,
                    max_tokens=1500,
                )
                
                content = response.choices[0].message.content
                data = json.loads(content)
                return data.get("results", [])
                
            except Exception as e:
                logger.error(f"LLM Rewrite Error (Attempt {attempt+1}): {str(e)}")
                if attempt == self.max_retries - 1:
                    return self._mock_rewrite_batch(bullets)
                time.sleep(1)

        return self._mock_rewrite_batch(bullets)

    def _mock_rewrite_batch(self, bullets):
        """Fallback mock logic if API fails or is missing."""
        results = []
        for bullet in bullets:
            results.append({
                "original": bullet,
                "improved": f"Enhanced: {bullet} with improved action verbs and measurable impact.",
                "improvements": ["Added action verb", "Safe metric inclusion", "Technical clarity"]
            })
        return results

    def run_rewrite_engine(self, resume_text):
        """
        Main entry point: extracts, batches, and rewrites.
        """
        all_bullets = self.extract_bullets(resume_text)
        if not all_bullets:
            return {"results": [], "status": "no_bullets_found"}
            
        # Batching (max 5-10 bullets per LLM call to keep it coherent)
        batch_size = 10
        final_results = []
        
        for i in range(0, len(all_bullets), batch_size):
            batch = all_bullets[i:i+batch_size]
            rewritten_batch = self.rewrite_batch_with_llm(batch)
            final_results.extend(rewritten_batch)
            
        return {"results": final_results}
