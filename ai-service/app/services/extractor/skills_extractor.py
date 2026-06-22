"""
Skills Extractor
Extracts technical skills from resume text using rule-based matching
"""

import re
from typing import Dict, List, Set
from .skills_db import (
    ALL_SKILLS, SKILLS_CATEGORIES, normalize_skill
)


def extract_skills(text: str) -> Dict[str, List[str]]:
    """
    Extract all skills from resume text

    Args:
        text: Raw resume text

    Returns:
        Dictionary with categorized skills:
        {
            "technical": [...],
            "ai_ml": [...],
            "databases": [...],
            "devops": [...],
            "tools": [...],
            "other": [...]
        }
    """
    # Normalize the text
    text_lower = text.lower()

    # Extract skills by category
    found_skills = {
        "technical": [],
        "ai_ml": [],
        "databases": [],
        "devops": [],
        "data_engineering": [],
        "tools": [],
    }

    # Track found skills to avoid duplicates
    seen = set()

    # First, look for multi-word skills (longer phrases first)
    multi_word_skills = [
        "machine learning",
        "deep learning",
        "natural language processing",
        "large language model",
        "generative ai",
        "transfer learning",
        "neural networks",
        "computer vision",
        "reinforcement learning",
        "prompt engineering",
        "amazon web services",
    ]

    # Check each multi-word skill
    for skill in multi_word_skills:
        if skill in text_lower and skill not in seen:
            # Determine category
            if skill in SKILLS_CATEGORIES["ai_ml"]:
                found_skills["ai_ml"].append(format_skill(skill))
            else:
                found_skills["technical"].append(format_skill(skill))
            seen.add(skill)

    # Then check single-word and short skills
    for category, skills in SKILLS_CATEGORIES.items():
        for skill in skills:
            # Skip multi-word skills (already handled)
            if ' ' in skill:
                continue

            # Create patterns to find skill as whole word
            patterns = [
                rf'\b{re.escape(skill)}\b',  # exact word
                rf'{re.escape(skill)}[\s\.,\(\)]',  # followed by space/punctuation
            ]

            for pattern in patterns:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    if skill not in seen:
                        if category in found_skills:
                            found_skills[category].append(format_skill(skill))
                            seen.add(skill)
                    break

    # Remove empty categories
    result = {k: v for k, v in found_skills.items() if v}

    # Add "all" category for convenience
    result["all"] = []
    for category_skills in found_skills.values():
        result["all"].extend(category_skills)

    return result


def format_skill(skill: str) -> str:
    """Format skill name for display (title case)"""
    # Handle special cases
    special_cases = {
        "react": "React",
        "react.js": "React",
        "node.js": "Node.js",
        "next.js": "Next.js",
        "vue": "Vue.js",
        "angular": "Angular",
        "express": "Express.js",
        "django": "Django",
        "flask": "Flask",
        "fastapi": "FastAPI",
        "tensorflow": "TensorFlow",
        "pytorch": "PyTorch",
        "keras": "Keras",
        "scikit-learn": "Scikit-learn",
        "postgresql": "PostgreSQL",
        "mongodb": "MongoDB",
        "redis": "Redis",
        "docker": "Docker",
        "kubernetes": "Kubernetes",
        "aws": "AWS",
        "gcp": "GCP",
        "azure": "Azure",
        "mysql": "MySQL",
        "sqlite": "SQLite",
        "graphql": "GraphQL",
        "rest": "REST",
        "restful": "RESTful",
        "git": "Git",
        "github": "GitHub",
        "css": "CSS",
        "html": "HTML",
        "sass": "SASS",
        "scss": "SCSS",
        "nlp": "NLP",
        "ml": "ML",
        "ai": "AI",
        "llm": "LLM",
        "llms": "LLMs",
        "sql": "SQL",
        "api": "API",
        "ci/cd": "CI/CD",
        "cicd": "CI/CD",
    }

    if skill.lower() in special_cases:
        return special_cases[skill.lower()]

    # Default: title case
    return skill.title()


def extract_skills_with_context(text: str) -> Dict[str, List[Dict]]:
    """
    Extract skills along with their surrounding context

    Useful for understanding how skill is mentioned
    (e.g., in skills section vs in experience)
    """
    text_lower = text.lower()

    results = {
        "technical": [],
        "ai_ml": [],
        "databases": [],
        "devops": [],
        "tools": [],
    }

    seen = set()

    # Multi-word skills first
    multi_word_skills = [
        "machine learning", "deep learning", "natural language processing",
        "large language model", "generative ai", "neural networks",
        "computer vision", "reinforcement learning",
    ]

    for skill in multi_word_skills:
        if skill in text_lower and skill not in seen:
            # Find the position to get context
            pos = text_lower.find(skill)
            start = max(0, pos - 30)
            end = min(len(text), pos + len(skill) + 30)
            context = text[start:end].strip()

            category = "ai_ml" if skill in SKILLS_CATEGORIES.get("ai_ml", set()) else "technical"
            results[category].append({
                "skill": format_skill(skill),
                "context": context,
                "position": pos
            })
            seen.add(skill)

    # Single-word skills
    for category, skills in SKILLS_CATEGORIES.items():
        for skill in skills:
            if ' ' in skill:
                continue

            pattern = rf'\b{re.escape(skill)}\b'
            match = re.search(pattern, text_lower)

            if match and skill not in seen:
                pos = match.start()
                start = max(0, pos - 30)
                end = min(len(text), pos + len(skill) + 30)
                context = text[start:end].strip()

                if category in results:
                    results[category].append({
                        "skill": format_skill(skill),
                        "context": context,
                        "position": pos
                    })
                    seen.add(skill)

    # Remove empty categories
    return {k: v for k, v in results.items() if v}