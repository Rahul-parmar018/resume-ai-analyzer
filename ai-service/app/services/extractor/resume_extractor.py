"""
Main Resume Extractor
Combines all extraction modules into a single interface
"""

from .skills_extractor import extract_skills, extract_skills_with_context
from .education_extractor import extract_education, format_education
from .experience_extractor import extract_experience, format_experience
from .projects_extractor import extract_projects, format_projects


def extract_all(text: str) -> dict:
    """
    Extract all structured information from resume text

    Args:
        text: Raw resume text

    Returns:
        Dictionary with all extracted information:
        {
            "skills": {...},
            "education": [...],
            "experience": [...],
            "projects": [...]
        }
    """
    return {
        "skills": extract_skills(text),
        "education": extract_education(text),
        "experience": extract_experience(text),
        "projects": extract_projects(text),
    }


def extract_summary(text: str) -> dict:
    """
    Extract a summary/overview of the resume

    Args:
        text: Raw resume text

    Returns:
        Summary dictionary with:
        - total_skills: count
        - experience_years: estimated
        - education_level: highest degree
        - top_categories: most used skill categories
    """
    skills = extract_skills(text)
    education = extract_education(text)
    experience = extract_experience(text)

    # Count total skills
    total_skills = len(skills.get("all", []))

    # Estimate experience years
    experience_years = estimate_experience_years(experience)

    # Determine education level
    education_level = "Not specified"
    if education:
        degrees = [e.get("degree") for e in education if e.get("degree")]
        if "phd" in degrees:
            education_level = "PhD"
        elif "masters" in degrees:
            education_level = "Master's"
        elif "bachelors" in degrees:
            education_level = "Bachelor's"

    # Top skill categories
    top_categories = []
    category_counts = {k: len(v) for k, v in skills.items() if k != "all"}
    sorted_categories = sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
    top_categories = [cat for cat, count in sorted_categories[:3] if count > 0]

    return {
        "total_skills": total_skills,
        "experience_years": experience_years,
        "education_level": education_level,
        "top_skill_categories": top_categories,
        "skill_count_by_category": {k: len(v) for k, v in skills.items() if k != "all"},
    }


def estimate_experience_years(experience: list) -> int:
    """Estimate total years of experience from work history"""
    if not experience:
        return 0

    total_years = 0

    for exp in experience:
        duration = exp.get("duration", "")

        # Parse duration patterns
        if not duration:
            continue

        # Look for year ranges
        years_match = duration.lower()
        if "present" in years_match or "current" in years_match:
            # Assume current year minus 2020 as default start
            import re
            year_match = re.search(r"(20\d{2})", years_match)
            if year_match:
                start_year = int(year_match.group(1))
                # Current year (hardcoded for now)
                current_year = 2026
                total_years += current_year - start_year
        else:
            # Try to extract year range
            import re
            year_range = re.findall(r"(20\d{2})", years_match)
            if len(year_range) >= 2:
                total_years += int(year_range[1]) - int(year_range[0])

    return min(total_years, 20)  # Cap at 20 years