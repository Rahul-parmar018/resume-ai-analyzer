"""
Education Extractor
Extracts education details from resume text
"""

import re
from typing import List, Dict, Optional


# Degree patterns
DEGREE_PATTERNS = {
    "phd": r"(?i)(ph\.?d\.?|doctorate|doctoral)",
    "masters": r"(?i)(m\.?s\.?|m\.?sc\.?|master'?s?|m\.?tech\.?|mba)",
    "bachelors": r"(?i)(b\.?s\.?|b\.?sc\.?|b\.?tech\.?|b\.?e\.?|b\.?a\.?|bachelor'?s?)",
    "associate": r"(?i)(associate|diploma|certificate)",
    "high_school": r"(?i)(high school|gce|gcse|ssc|hsc)",
}

# Field keywords
FIELD_KEYWORDS = [
    "computer science", "information technology", "software engineering",
    "data science", "artificial intelligence", "machine learning",
    "information systems", "computer engineering", "electrical engineering",
    "electronics", "communication", "mathematics", "physics",
    "business", "economics", "finance", "marketing", "management",
    "psychology", "sociology", "philosophy", "literature", "history",
]


def extract_education(text: str) -> List[Dict]:
    """
    Extract education information from resume text

    Returns:
        List of education entries with:
        - degree
        - field
        - institution
        - year/period
        - grade (if found)
    """
    education = []

    # Split text into sections
    lines = text.split('\n')

    # Find education section
    education_section = find_education_section(text)

    if not education_section:
        # Fallback: scan entire text for education patterns
        education_section = text

    # Extract education entries
    entries = parse_education_entries(education_section)

    return entries


def find_education_section(text: str) -> Optional[str]:
    """Find the education section in resume text"""
    text_lower = text.lower()

    # Common section headers
    education_headers = [
        "education", "academic", "qualification", "degrees",
        "educational background", "academic background"
    ]

    # Find the section
    for header in education_headers:
        pattern = rf"(?i){header}[\s:]*\n"
        match = re.search(pattern, text)

        if match:
            # Extract section content (until next major section)
            start = match.end()
            # Find next section header
            next_section = re.search(
                r"(?i)(\nexperience|\nprojects|\nskills|\nemployment|\nwork history)",
                text[start:]
            )

            if next_section:
                end = start + next_section.start()
            else:
                end = min(start + 1000, len(text))

            return text[start:end]

    return None


def parse_education_entries(section: str) -> List[Dict]:
    """Parse education entries from section text"""
    entries = []

    # Split by common delimiters (newlines, bullets)
    lines = [line.strip() for line in section.split('\n') if line.strip()]

    for line in lines:
        entry = parse_single_education(line)
        if entry:
            entries.append(entry)

    return entries


def parse_single_education(text: str) -> Optional[Dict]:
    """Parse a single education entry"""
    text_lower = text.lower()

    # Extract degree
    degree = None
    for level, pattern in DEGREE_PATTERNS.items():
        if re.search(pattern, text):
            degree = level
            break

    if not degree:
        return None

    # Extract field of study
    field = None
    for keyword in FIELD_KEYWORDS:
        if keyword in text_lower:
            field = keyword.title()
            break

    # Extract institution
    institution = extract_institution(text)

    # Extract year/date
    year = extract_year(text)

    # Extract grade/GPA
    grade = extract_grade(text)

    return {
        "degree": degree,
        "field": field,
        "institution": institution,
        "year": year,
        "grade": grade,
        "raw_text": text
    }


def extract_institution(text: str) -> Optional[str]:
    """Extract institution name from text"""
    # Common university patterns
    university_patterns = [
        r"(?i)(university|institute|college|school)[\s\w,]+",
    ]

    for pattern in university_patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).strip()

    # Known institutions
    known = [
        "MIT", "Stanford", "Harvard", "Oxford", "Cambridge",
        "IIT", "IIIT", "NIT", "BITS", "LJ University",
        "UC Berkeley", "UCLA", "CMU", "Georgia Tech",
    ]

    for inst in known:
        if inst.lower() in text.lower():
            return inst

    return None


def extract_year(text: str) -> Optional[str]:
    """Extract graduation year or date range"""
    # Pattern: 2020-2024, 2020 - 2024, 2020 Present, etc.
    patterns = [
        r"(?i)(20\d{2})\s*[-–]\s*(20\d{2}|present|current)",
        r"(?i)(20\d{2})\s*[-–]\s*(now)",
        r"(?i)(20\d{2})",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).strip()

    return None


def extract_grade(text: str) -> Optional[str]:
    """Extract GPA or percentage"""
    patterns = [
        r"(?i)gpa[:\s]*(\d+\.?\d*)/?(\d+\.?\d*)",
        r"(?i)(\d+\.?\d*)\s*%",
        r"(?i)cgpa[:\s]*(\d+\.?\d*)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).strip()

    return None


def format_education(education: List[Dict]) -> str:
    """Format education list for display"""
    if not education:
        return "No education details found"

    formatted = []
    for edu in education:
        parts = []

        if edu.get("degree"):
            degree_name = {
                "phd": "PhD",
                "masters": "Master's",
                "bachelors": "Bachelor's",
                "associate": "Associate",
            }.get(edu["degree"], edu["degree"].title())
            parts.append(degree_name)

        if edu.get("field"):
            parts.append(f"in {edu['field']}")

        if edu.get("institution"):
            parts.append(f"at {edu['institution']}")

        if edu.get("year"):
            parts.append(f"({edu['year']})")

        if parts:
            formatted.append(" ".join(parts))

    return ", ".join(formatted) if formatted else "No education details"