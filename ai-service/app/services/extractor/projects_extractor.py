"""
Projects Extractor
Extracts project information from resume text
"""

import re
from typing import List, Dict, Optional


# Project indicators
PROJECT_KEYWORDS = [
    "project", "built", "developed", "created", "implemented", "designed",
    "constructed", "developed", "created", "built", "made",
]

# Tech stack patterns to look for in projects
TECH_STACK_PATTERNS = [
    r"(?i)(using|with|through|via)\s+([A-Za-z#\+\.]+)",
    r"(?i)(tech|technology|stack)[:\s]*([A-Za-z,\s]+)",
]


def extract_projects(text: str) -> List[Dict]:
    """
    Extract project information from resume text

    Returns:
        List of project entries with:
        - name
        - description
        - technologies
        - role
    """
    projects = []

    # Find projects section
    projects_section = find_projects_section(text)

    if projects_section:
        entries = parse_projects_section(projects_section)
        projects.extend(entries)

    # Also scan for project mentions in other sections
    if not projects:
        projects = scan_for_projects(text)

    return projects


def find_projects_section(text: str) -> Optional[str]:
    """Find the projects section in resume text"""
    text_lower = text.lower()

    project_headers = [
        "projects", "personal projects", "academic projects",
        "project work", "key projects", "featured projects",
    ]

    for header in project_headers:
        pattern = rf"(?i){header}[\s:]*\n"
        match = re.search(pattern, text)

        if match:
            start = match.end()
            # Find next section
            next_section = re.search(
                r"(?i)(\nexperience|\nskills|\neducation|\nawards)",
                text[start:]
            )

            if next_section:
                end = start + next_section.start()
            else:
                end = min(start + 2000, len(text))

            return text[start:end]

    return None


def parse_projects_section(section: str) -> List[Dict]:
    """Parse project entries from section text"""
    projects = []

    # Split by newlines and look for project patterns
    lines = [line.strip() for line in section.split('\n') if line.strip()]

    current_project = {}

    for line in lines:
        # Check if this looks like a new project
        if is_project_start(line):
            if current_project and current_project.get("name"):
                projects.append(current_project)

            current_project = parse_project_line(line)

        elif current_project:
            # Add to current project description
            if "description" not in current_project:
                current_project["description"] = []
            current_project["description"].append(line)

            # Try to extract tech from this line
            tech = extract_tech_from_line(line)
            if tech and "technologies" not in current_project:
                current_project["technologies"] = tech

    # Don't forget the last project
    if current_project and current_project.get("name"):
        projects.append(current_project)

    return projects


def is_project_start(line: str) -> bool:
    """Check if line starts a new project"""
    line_lower = line.lower()

    # Project title patterns
    for keyword in PROJECT_KEYWORDS:
        if keyword in line_lower:
            return True

    # Or starts with bullet/number
    if line.startswith(('•', '-', '*', '1.', '2.', '3.')):
        return True

    return False


def parse_project_line(line: str) -> Dict:
    """Parse a single project line"""
    project = {"raw": line}

    # Extract project name (usually first part before dash or colon)
    name_match = re.match(r"^([A-Za-z\s]+)[\-:]", line)
    if name_match:
        project["name"] = name_match.group(1).strip()
    else:
        # Use first few words as name
        words = line.split()[:5]
        project["name"] = " ".join(words)

    # Extract technologies
    tech = extract_tech_from_line(line)
    if tech:
        project["technologies"] = tech

    return project


def extract_tech_from_line(text: str) -> List[str]:
    """Extract technology names from project description"""
    techs = []

    # Look for common tech patterns
    tech_patterns = [
        r"\b(Python|JavaScript|TypeScript|Java|C\+\+|Go|Rust)\b",
        r"\b(React|Angular|Vue|Node\.js|Django|Flask)\b",
        r"\b(TensorFlow|PyTorch|Keras)\b",
        r"\b(AWS|GCP|Azure|Docker|Kubernetes)\b",
        r"\b(MongoDB|PostgreSQL|MySQL|Redis)\b",
    ]

    for pattern in tech_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        techs.extend(matches)

    # Also check for "using X" patterns
    using_pattern = r"(?i)(using|with|built using)[:\s]*([A-Za-z,\s]+)"
    match = re.search(using_pattern, text)
    if match:
        techs.append(match.group(2).strip())

    # Remove duplicates
    return list(set(techs)) if techs else []


def scan_for_projects(text: str) -> List[Dict]:
    """Fallback: scan entire text for project mentions"""
    projects = []

    lines = text.split('\n')
    for line in lines:
        if any(kw in line.lower() for kw in ["built", "developed", "created"]):
            if len(line) > 20 and len(line) < 200:
                project = parse_project_line(line)
                if project.get("name"):
                    projects.append(project)

    return projects[:5]  # Limit to 5 projects


def format_projects(projects: List[Dict]) -> str:
    """Format projects list for display"""
    if not projects:
        return "No projects found"

    formatted = []
    for proj in projects:
        if proj.get("name"):
            tech_str = ""
            if proj.get("technologies"):
                tech_str = f" ({', '.join(proj['technologies'])})"
            formatted.append(f"{proj['name']}{tech_str}")

    return ", ".join(formatted) if formatted else "No projects found"