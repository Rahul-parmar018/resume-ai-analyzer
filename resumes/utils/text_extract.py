import re
from typing import Dict, Optional

# ========================================
# 📧 REGEX PATTERNS
# ========================================

# Email: Standard RFC-compliant pattern
EMAIL_RE = re.compile(
    r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b',
    re.IGNORECASE
)

# Phone: International and US formats
PHONE_RE = re.compile(
    r'(?:\+\d{1,3}[-.\s]?)?'           # Optional country code
    r'(?:KATEX_INLINE_OPEN?\d{1,4}KATEX_INLINE_CLOSE?[-.\s]?)?'       # Optional area code
    r'\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}',  # Main number
    re.VERBOSE
)

# LinkedIn: Multiple URL formats
LINKEDIN_RE = re.compile(
    r'(?:https?://)?'                   # Optional protocol
    r'(?:www\.)?'                        # Optional www
    r'linkedin\.com/'
    r'(?:in|pub|company|school)/'       # Profile types
    r'[A-Za-z0-9_-]+/?',                 # Username/ID
    re.IGNORECASE
)

# Alternative LinkedIn pattern (just linkedin.com/in/username)
LINKEDIN_SHORT_RE = re.compile(
    r'linkedin\.com/in/[A-Za-z0-9_-]+',
    re.IGNORECASE
)


# ========================================
# 📇 CONTACT EXTRACTION
# ========================================

def extract_contacts(text: str) -> Dict[str, str]:
    """
    Extract email, phone, and LinkedIn from resume text.
    
    Args:
        text: Raw resume text
        
    Returns:
        Dictionary with 'email', 'phone', 'linkedin' keys
    """
    if not text:
        return {"email": "", "phone": "", "linkedin": ""}
    
    # Email extraction (take first match)
    email_match = EMAIL_RE.search(text)
    email = email_match.group(0).strip() if email_match else ""
    
    # Phone extraction (take first match, clean it up)
    phone_match = PHONE_RE.search(text)
    phone = ""
    if phone_match:
        phone = phone_match.group(0).strip()
        # Remove common resume labels
        phone = re.sub(r'^(phone|tel|mobile|cell)[:\s]*', '', phone, flags=re.IGNORECASE)
        phone = phone.strip()
    
    # LinkedIn extraction
    linkedin_match = LINKEDIN_RE.search(text) or LINKEDIN_SHORT_RE.search(text)
    linkedin = ""
    if linkedin_match:
        linkedin = linkedin_match.group(0).strip()
        # Ensure it has protocol
        if not linkedin.startswith('http'):
            linkedin = 'https://' + linkedin
    
    return {
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
    }


# ========================================
# 👤 NAME EXTRACTION
# ========================================

def guess_name(text: str) -> str:
    """
    Attempt to extract candidate name from resume.
    
    Strategy:
    1. Check first line (most common)
    2. Look for "Name:" label
    3. Filter out non-name patterns
    
    Args:
        text: Raw resume text
        
    Returns:
        Candidate name or empty string
    """
    if not text or not text.strip():
        return ""
    
    lines = text.strip().splitlines()
    
    # Skip empty lines at start
    non_empty_lines = [line.strip() for line in lines if line.strip()]
    if not non_empty_lines:
        return ""
    
    # Strategy 1: Look for "Name:" pattern
    for line in non_empty_lines[:5]:  # Check first 5 lines
        name_match = re.search(r'(?:name|candidate)[:\s]+([A-Za-z\s.]+)', line, re.IGNORECASE)
        if name_match:
            candidate = name_match.group(1).strip()
            if _is_valid_name(candidate):
                return candidate
    
    # Strategy 2: Use first line if it looks like a name
    first_line = non_empty_lines[0]
    
    # Skip if it contains common resume headers
    skip_keywords = [
        'resume', 'curriculum', 'vitae', 'cv', 'profile',
        'contact', 'email', 'phone', 'address', 'objective'
    ]
    
    if any(keyword in first_line.lower() for keyword in skip_keywords):
        # Try second line instead
        if len(non_empty_lines) > 1:
            first_line = non_empty_lines[1]
        else:
            return ""
    
    # Clean and validate
    candidate = _clean_name_line(first_line)
    
    if _is_valid_name(candidate):
        return candidate
    
    return ""


def _clean_name_line(text: str) -> str:
    """Remove common resume artifacts from name line"""
    # Remove email addresses
    text = EMAIL_RE.sub('', text)
    
    # Remove phone numbers
    text = PHONE_RE.sub('', text)
    
    # Remove URLs
    text = re.sub(r'https?://\S+', '', text)
    
    # Remove special characters (keep letters, spaces, periods, hyphens)
    text = re.sub(r'[^A-Za-z\s.\'-]', ' ', text)
    
    # Collapse multiple spaces
    text = re.sub(r'\s+', ' ', text)
    
    return text.strip()


def _is_valid_name(text: str) -> bool:
    """
    Check if text looks like a valid name.
    
    Rules:
    - Length between 2-50 characters
    - Contains only letters, spaces, periods, hyphens, apostrophes
    - Has at least one letter
    - Doesn't contain numbers
    - Not all caps (unless short)
    - Contains at least one space (first + last name)
    """
    if not text or len(text) < 2 or len(text) > 50:
        return False
    
    # Must contain at least one letter
    if not any(c.isalpha() for c in text):
        return False
    
    # Must not contain numbers
    if any(c.isdigit() for c in text):
        return False
    
    # Check for valid name characters only
    if not re.match(r"^[A-Za-z\s.\'-]+$", text):
        return False
    
    # Prefer names with spaces (first + last)
    # But allow single names (common in some cultures)
    word_count = len(text.split())
    if word_count == 0:
        return False
    
    # If all caps and long, probably not a name
    if text.isupper() and len(text) > 10:
        return False
    
    # Check for too many repeated characters (like "-----")
    if re.search(r'(.)\1{3,}', text):
        return False
    
    return True


# ========================================
# 🎯 SKILL EXTRACTION (Bonus Function)
# ========================================

def extract_skills_mentioned(text: str, skill_list: list) -> list:
    """
    Find which skills from skill_list are mentioned in text.
    
    Args:
        text: Resume text
        skill_list: List of skills to search for
        
    Returns:
        List of skills found in text
    """
    text_lower = text.lower()
    found_skills = []
    
    for skill in skill_list:
        skill_lower = skill.lower().strip()
        # Use word boundary for exact matches
        pattern = r'\b' + re.escape(skill_lower) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    
    return found_skills


# ========================================
# 🧪 TEST FUNCTION
# ========================================

def test_extraction():
    """Test the extraction functions"""
    
    test_resume = """
    JOHN DOE
    Senior Data Analyst
    
    Contact Information:
    Email: john.doe@example.com
    Phone: +1 (555) 123-4567
    LinkedIn: https://www.linkedin.com/in/johndoe
    
    EXPERIENCE:
    5 years of experience in data analysis
    
    SKILLS:
    Python, SQL, Excel, Tableau
    """
    
    print("📄 Test Resume:")
    print(test_resume)
    print("\n" + "="*60 + "\n")
    
    # Test contact extraction
    contacts = extract_contacts(test_resume)
    print("📧 Extracted Contacts:")
    print(f"  Email: {contacts['email']}")
    print(f"  Phone: {contacts['phone']}")
    print(f"  LinkedIn: {contacts['linkedin']}")
    
    # Test name extraction
    name = guess_name(test_resume)
    print(f"\n👤 Extracted Name: {name}")
    
    # Test skill extraction
    skills = extract_skills_mentioned(test_resume, ["Python", "SQL", "Excel", "Java"])
    print(f"\n🎯 Found Skills: {skills}")
    
    print("\n" + "="*60)


if __name__ == "__main__":
    test_extraction()