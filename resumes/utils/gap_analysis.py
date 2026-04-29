import requests
import os
import json

HF_API_KEY = os.getenv("HF_API_KEY")
API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

def query_llm(prompt):
    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(API_URL, headers=headers, json={
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 800,
            "temperature": 0.3
        }
    })
    return response.json()

def analyze_with_llm(resume_text, jd_text):
    prompt = f"""[INST] You are an elite ATS AI system and expert technical recruiter.

Analyze the resume against the job description. Be strict. Give concise, professional, recruiter-level output.

Return ONLY a valid JSON object matching exactly this schema:

{{
"match_score": number (0-100),
"ats_status": "Optimized" or "Needs Improvement",
"verified_skills": ["skill1", "skill2"],
"missing_skills": ["skill1", "skill2"],
"recommendations": [
  {{
    "type": "rewrite",
    "original": "...",
    "improved": "...",
    "impact_gain": "+10%"
  }}
]
}}

Resume:
{resume_text}

Job Description:
{jd_text} [/INST]"""

    try:
        raw = query_llm(prompt)
        content = raw[0]["generated_text"]

        # Extract JSON safely
        json_start = content.find("{")
        json_end = content.rfind("}") + 1
        clean_json = content[json_start:json_end]

        return json.loads(clean_json)

    except Exception as e:
        print("LLM Error:", e)
        return {
            "match_score": 50,
            "ats_status": "Needs Improvement",
            "verified_skills": [],
            "missing_skills": [],
            "recommendations": []
        }
