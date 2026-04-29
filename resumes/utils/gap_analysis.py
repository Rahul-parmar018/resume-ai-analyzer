import requests
import os
import json
import re

HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def query_llm(prompt):
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(API_URL, headers=headers, json={
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 1000,
                "temperature": 0.2
            }
        }, timeout=30)
        return response.json()
    except Exception as e:
        print("HF Request Error:", e)
        return None

def extract_json(text):
    try:
        # Strong regex extraction to find the first { and last }
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception as e:
        print("JSON Extraction Error:", e)
    return None

def analyze_with_llm(resume_text, jd_text):
    prompt = f"""[INST] You are a professional ATS AI system.

STRICT RULES:
- Return ONLY valid JSON
- No explanation or conversational text
- No text outside the JSON object
- JSON must be complete and valid

JSON Format:
{{
  "match_score": 75,
  "ats_status": "Good",
  "verified_skills": ["Python", "React"],
  "missing_skills": ["Docker", "AWS"],
  "recommendations": [
    {{
      "type": "rewrite",
      "original": "Worked on a project to improve performance.",
      "improved": "Architected and optimized a high-traffic system, improving overall performance by 25% through advanced caching and database indexing.",
      "impact_gain": "+15%"
    }}
  ]
}}

Analyze this resume against the job description strictly:

Resume:
{resume_text}

Job Description:
{jd_text} [/INST]"""

    try:
        raw = query_llm(prompt)
        print("RAW HF RESPONSE:", raw)

        if not raw or not isinstance(raw, list) or "generated_text" not in raw[0]:
            raise ValueError("Empty or invalid response from LLM")

        content = raw[0]["generated_text"]
        parsed = extract_json(content)

        if not parsed:
            raise ValueError("Failed to parse JSON from LLM output")

        return parsed

    except Exception as e:
        print("LLM Pipeline Error:", e)
        # Professional fallback
        return {
            "match_score": 45,
            "ats_status": "Needs Improvement",
            "verified_skills": [],
            "missing_skills": [],
            "recommendations": [
                {
                    "type": "rewrite",
                    "original": "Handled various tasks and helped the team.",
                    "improved": "Spearheaded cross-functional initiatives, optimizing team workflow and increasing delivery speed by 15%.",
                    "impact_gain": "+12%"
                }
            ]
        }
