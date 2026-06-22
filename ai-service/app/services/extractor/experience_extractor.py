"""
Experience Extractor
Extracts work experience and job history from resume text
"""

import re
from typing import List, Dict, Optional


# Job title patterns
JOB_TITLE_KEYWORDS = [
    "intern", "trainee", "junior", "senior", "lead", "manager", "director",
    "engineer", "developer", "designer", "analyst", "architect", "consultant",
    "specialist", "coordinator", "administrator", "associate", "executive",
]

# Company indicators
COMPANY_INDICATORS = [
    r"(?i)(at|@|in|with)\s+([A-Z][A-Za-z\s&]+(?:Inc|LLC|Ltd|Corp|Pvt|Private|Company|Co\.?))",
    r"(?i)(at|@|in|with)\s+([A-Z][A-Za-z\s]+)",
]


def extract_experience(text: str) -> List[Dict]:
    """
    Extract work experience from resume text

    Returns:
        List of experience entries with:
        - title
        - company
        - duration
        - description
    """
    experience = []

    # Find experience section
    experience_section = find_experience_section(text)

    if experience_section:
        entries = parse_experience_entries(experience_section)
        experience.extend(entries)

    # Also scan for job mentions outside experience section
    # (some resumes don't have clear sections)
    if not experience:
        experience = scan_for_experience(text)

    return experience


def find_experience_section(text: str) -> Optional[str]:
    """Find the experience section in resume text"""
    text_lower = text.lower()

    # Common section headers
    experience_headers = [
        "experience", "work experience", "employment", "work history",
        "professional experience", "career", "employment history",
    ]

    for header in experience_headers:
        pattern = rf"(?i){header}[\s:]*\n"
        match = re.search(pattern, text)

        if match:
            start = match.end()
            # Find next section
            next_section = re.search(
                r"(?i)(\nprojects|\nskills|\neducation|\ncertifications)",
                text[start:]
            )

            if next_section:
                end = start + next_section.start()
            else:
                end = min(start + 2000, len(text))

            return text[start:end]

    return None


def parse_experience_entries(section: str) -> List[Dict]:
    """Parse experience entries from section text"""
    entries = []

    # Split by common delimiters
    # Look for patterns like "Company - Date" or bullet points
    lines = [line.strip() for line in section.split('\n') if line.strip()]

    current_entry = {}

    for line in lines:
        # Check if this is a new entry (has company or date)
        if is_new_entry(line):
            if current_entry and (current_entry.get("title") or current_entry.get("company")):
                entries.append(current_entry)

            current_entry = parse_entry_line(line)

        elif current_entry:
            # Add to current entry's description
            if "description" not in current_entry:
                current_entry["description"] = []
            current_entry["description"].append(line)

    # Don't forget the last entry
    if current_entry and (current_entry.get("title") or current_entry.get("company")):
        entries.append(current_entry)

    return entries


def is_new_entry(line: str) -> bool:
    """Check if line starts a new experience entry"""
    # Check for date patterns
    date_patterns = [
        r"(?i)(20\d{2}|20\d{2})\s*[-–]\s*(present|current|20\d{2})",
        r"(?i)(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*20\d{2}",
    ]

    for pattern in date_patterns:
        if re.search(pattern, line):
            return True

    # Check for company pattern
    if re.search(COMPANY_INDICATORS[0], line):
        return True

    return False


def parse_entry_line(line: str) -> Dict:
    """Parse a single experience entry line"""
    entry = {"raw": line}

    # Extract job title
    title = extract_job_title(line)
    if title:
        entry["title"] = title

    # Extract company
    company = extract_company(line)
    if company:
        entry["company"] = company

    # Extract duration
    duration = extract_duration(line)
    if duration:
        entry["duration"] = duration

    return entry


def extract_job_title(text: str) -> Optional[str]:
    """Extract job title from text"""
    # Look for common job title patterns
    for keyword in JOB_TITLE_KEYWORDS:
        pattern = rf"(?i)\b{keyword}\b"
        if re.search(pattern, text):
            # Extract the full title
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                # Get surrounding context
                start = max(0, match.start() - 20)
                end = min(len(text), match.end() + 30)
                return text[start:end].strip()

    return None


def extract_company(text: str) -> Optional[str]:
    """Extract company name from text"""
    for pattern in COMPANY_INDICATORS:
        match = re.search(pattern, text)
        if match and len(match.group(2)) > 2:
            return match.group(2).strip()

    return None


def extract_duration(text: str) -> Optional[str]:
    """Extract duration/date range from text"""
    patterns = [
        r"(?i)(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*20\d{2}\s*[-–]\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|present|current)",
        r"(?i)(20\d{2})\s*[-–]\s*(20\d{2}|present|current)",
    ]

    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(0).strip()

    return None


def scan_for_experience(text: str) -> List[Dict]:
    """Fallback: scan entire text for experience mentions"""
    experience = []

    # Look for work-related keywords
    work_keywords = ["intern", "worked at", "employed", "job", "role"]

    lines = text.split('\n')
    for line in lines:
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in work_keywords):
            entry = parse_entry_line(line)
            if entry.get("title") or entry.get("company"):
                experience.append(entry)

    return experience


def format_experience(experience: List[Dict]) -> str:
    """Format experience list for display"""
    if not experience:
        return "No experience details found"

    formatted = []
    for exp in experience:
        parts = []

        if exp.get("title"):
            parts.append(exp["title"])

        if exp.get("company"):
            parts.append(f"at {exp['company']}")

        if exp.get("duration"):
            parts.append(f"({exp['duration']})")

        if parts:
            formatted.append(" ".join(parts))

    return ", ".join(formatted) if formatted else "No experience details"