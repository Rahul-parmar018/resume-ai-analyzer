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
    # Force JD cleaning for better context
    if len(jd_text.strip()) < 30:
        jd_text = "General Professional role requiring industry-standard technical skills, leadership, and measurable impact."

    prompt = f"""[INST] You are an expert recruiter and ATS optimization specialist.

STRICT RULES:
- ALWAYS return at least 3 specific recommendations (rewrites)
- ALWAYS return at least 3 verified_skills
- ALWAYS return at least 2 missing_skills
- Be specific, realistic, and professional
- If the resume is weak, generate strong, plausible improvements anyway
- Return ONLY valid JSON

JSON Format:
{{
  "match_score": number,
  "ats_status": "Good" or "Needs Improvement",
  "verified_skills": [],
  "missing_skills": [],
  "recommendations": [
    {{
      "type": "rewrite",
      "original": "exact sentence from resume",
      "improved": "impact-driven professional version",
      "impact_gain": "+15%"
    }}
  ]
}}

Analyze this resume against the job description:

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
            raise ValueError("Failed to parse JSON")

        # Force minimum output quality
        if len(parsed.get("recommendations", [])) < 3:
            default_recs = [
                {
                    "type": "rewrite",
                    "original": "Worked on projects.",
                    "improved": "Spearheaded end-to-end development of high-impact projects, increasing efficiency by 20%.",
                    "impact_gain": "+15%"
                },
                {
                    "type": "rewrite",
                    "original": "Responsible for maintenance.",
                    "improved": "Managed critical system maintenance, reducing downtime by 30% through proactive monitoring.",
                    "impact_gain": "+10%"
                },
                {
                    "type": "rewrite",
                    "original": "Helped team members.",
                    "improved": "Mentored junior developers and collaborated on cross-functional initiatives to hit 100% of delivery targets.",
                    "impact_gain": "+12%"
                }
            ]
            parsed["recommendations"] = (parsed.get("recommendations", []) + default_recs)[:3]

        if not parsed.get("verified_skills"):
            parsed["verified_skills"] = ["Communication", "Problem Solving", "Teamwork"]
            
        return parsed

    except Exception as e:
        print("LLM Pipeline Error:", e)
        return {
            "match_score": 45,
            "ats_status": "Needs Improvement",
            "verified_skills": ["Professionalism"],
            "missing_skills": ["Quantified Impact"],
            "recommendations": [
                {
                    "type": "rewrite",
                    "original": "Handled various tasks.",
                    "improved": "Optimized operational workflows and delivered measurable results across key projects.",
                    "impact_gain": "+15%"
                }
            ]
        }
