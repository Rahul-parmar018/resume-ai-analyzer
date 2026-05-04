"""
Structured role templates for the Candidex Hiring OS.
Roles use weighted scoring categories: core (60%), important (30%), optional (10%).

─── Custom Role Support ────────────────────────────────────────────────
Users can define their own roles using a JSON object with this format:

{
    "title": "Backend Go Developer",
    "core": ["Go", "PostgreSQL", "REST API", "Microservices", "Docker"],
    "important": ["Kubernetes", "gRPC", "Redis", "CI/CD", "Testing"],
    "optional": ["AWS", "Terraform", "GraphQL", "Monitoring", "Linux"]
}

Rules:
  - "title" (required): Human-readable role name (max 100 chars)
  - "core" (required): 3-8 must-have skills. These carry 60% weight.
  - "important" (required): 3-8 strong-preference skills. 30% weight.
  - "optional" (required): 3-8 nice-to-have skills. 10% weight.
  - Each skill should be a short phrase (1-4 words).

Pass this JSON as the "custom_role" field in the /api/recruiter/rank/ POST
body alongside your resume files. The engine will score against your
custom definition using the same ML-powered matching as built-in roles.
"""

import json
from typing import Dict, List, Optional, Tuple


# ─── Built-in Roles ──────────────────────────────────────────────────
ROLES = {
    "AI/ML Engineer": {
        "title": "AI/ML Engineer",
        "core": ["Python", "Machine Learning", "NLP", "Linear Algebra", "Calculus"],
        "important": ["PyTorch", "TensorFlow", "Scikit-learn", "Deep Learning", "Transformers"],
        "optional": ["Docker", "AWS", "FastAPI", "Pandas", "NumPy"]
    },
    "Cybersecurity Engineer": {
        "title": "Cybersecurity Engineer",
        "core": ["Network Security", "OWASP", "Linux", "Encryption", "TCP/IP"],
        "important": ["SIEM", "Penetration Testing", "Python", "IAM", "Wireshark"],
        "optional": ["Cloud Security", "SOC", "Compliance", "Docker", "AWS"]
    },
    "Full Stack Developer": {
        "title": "Full Stack Developer",
        "core": ["JavaScript", "React", "Node.js", "HTML", "CSS"],
        "important": ["TypeScript", "REST API", "SQL", "Git", "PostgreSQL"],
        "optional": ["Docker", "AWS", "Testing", "Next.js", "Express"]
    },
    "DevOps Engineer": {
        "title": "DevOps Engineer",
        "core": ["Docker", "CI/CD", "Linux", "Bash", "Git"],
        "important": ["Kubernetes", "AWS", "Terraform", "Jenkins", "Ansible"],
        "optional": ["Prometheus", "Grafana", "Python", "Helm", "CloudFormation"]
    },
    "Data Scientist": {
        "title": "Data Scientist",
        "core": ["Python", "Statistics", "Machine Learning", "SQL", "Calculus"],
        "important": ["Pandas", "Scikit-learn", "SQL", "R", "Jupyter"],
        "optional": ["Tableau", "Deep Learning", "NLP", "Spark", "Airflow"]
    }
}

CATEGORIES = ["Engineering", "Data & AI", "Cloud & Infra", "Cybersecurity"]


# ─── Custom Role Validation ──────────────────────────────────────────
def validate_custom_role(data) -> Tuple[Optional[Dict], Optional[str]]:
    """
    Validate a user-provided custom role JSON.

    Args:
        data: Either a dict (already parsed) or a JSON string.

    Returns:
        (validated_role, None) on success
        (None, error_message) on failure
    """
    # Parse if string
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except json.JSONDecodeError as e:
            return None, f"Invalid JSON: {str(e)}"

    if not isinstance(data, dict):
        return None, "Role must be a JSON object."

    # Validate title
    title = data.get('title', '').strip()
    if not title:
        return None, "Missing 'title' field. Example: \"Backend Go Developer\""
    if len(title) > 100:
        return None, "Title too long (max 100 characters)."

    # Validate skill arrays
    for field in ['core', 'important', 'optional']:
        skills = data.get(field)
        if not skills or not isinstance(skills, list):
            return None, f"Missing or invalid '{field}' field. Must be a list of 3-8 skills."
        if len(skills) < 3:
            return None, f"'{field}' must have at least 3 skills (got {len(skills)})."
        if len(skills) > 8:
            return None, f"'{field}' must have at most 8 skills (got {len(skills)})."

        # Validate each skill
        for i, skill in enumerate(skills):
            if not isinstance(skill, str) or not skill.strip():
                return None, f"'{field}[{i}]' must be a non-empty string."
            if len(skill.strip()) > 50:
                return None, f"'{field}[{i}]' too long (max 50 chars): '{skill[:30]}...'"

    # Build the validated role
    validated = {
        "title": title,
        "core": [s.strip() for s in data['core']],
        "important": [s.strip() for s in data['important']],
        "optional": [s.strip() for s in data['optional']],
    }

    return validated, None


# ─── Custom Role JSON Schema (for API documentation) ─────────────────
CUSTOM_ROLE_SCHEMA = {
    "description": "Custom role definition for resume scoring",
    "example": {
        "title": "Backend Go Developer",
        "core": ["Go", "PostgreSQL", "REST API", "Microservices", "Docker"],
        "important": ["Kubernetes", "gRPC", "Redis", "CI/CD", "Testing"],
        "optional": ["AWS", "Terraform", "GraphQL", "Monitoring", "Linux"]
    },
    "rules": {
        "title": "Required. Human-readable role name (max 100 chars)",
        "core": "Required. 3-8 must-have skills. Weighted 60% of the final score.",
        "important": "Required. 3-8 strong-preference skills. Weighted 30%.",
        "optional": "Required. 3-8 nice-to-have skills. Weighted 10%.",
    }
}
