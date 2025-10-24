import re
from typing import List, Tuple

_WORD_BOUNDARY = r"(?<![A-Za-z0-9_]){term}(?![A-Za-z0-9_])"


def _normalize_text(text: str) -> str:
    """Lowercase and collapse whitespace"""
    return re.sub(r"\s+", " ", (text or "")).strip().lower()


def _parse_required_experience_years(req_str: str) -> float:
    """
    Parse experience strings like:
      "2–3 years", "2-3 years", "2 to 3 years", "2+ years", "3 years"
    Return midpoint for ranges, or the single value.
    """
    if not req_str:
        return 0.0
    
    s = _normalize_text(req_str)
    
    # Range: 2–3, 2-3, 2 to 3
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:–|-|to)\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)", s)
    if m:
        a = float(m.group(1))
        b = float(m.group(3))
        return (a + b) / 2.0
    
    # "2+ years" -> take the number
    m = re.search(r"(\d+(?:\.\d+)?)\s*\+\s*(?:years?|yrs?)", s)
    if m:
        return float(m.group(1))
    
    # Single number "3 years"
    m = re.search(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)", s)
    if m:
        return float(m.group(1))
    
    return 0.0


def _extract_years_from_text(text: str) -> float:
    """
    Extract the MAXIMUM experience mentioned in resume.
    Handles years and months (converts to years).
    """
    t = _normalize_text(text)
    
    years = [float(x) for x in re.findall(r"(\d+(?:\.\d+)?)\s*(?:years?|yrs?)", t)]
    months = [float(x) for x in re.findall(r"(\d+(?:\.\d+)?)\s*months?", t)]
    
    best_years = max(years) if years else 0.0
    best_months_years = max(months) / 12.0 if months else 0.0
    
    return max(best_years, best_months_years)


def _skill_hits(text: str, skills: List[str], debug=False) -> Tuple[int, List[str]]:
    """
    Count STRICT skill matches using word boundaries.
    Returns: (hit_count, list_of_matched_skills)
    
    ⚠️ STRICT MODE: Only exact matches, minimal synonyms
    """
    t = _normalize_text(text)
    hits = 0
    matched = []
    
    for raw in skills or []:
        term = (raw or "").strip().lower()
        if not term:
            continue
        
        # ✅ STRICT: Only add synonyms for ambiguous terms
        variants = {term}
        
        # Only allow VERY specific synonyms
        if term == "excel":
            variants.add("microsoft excel")
            variants.add("ms excel")
        elif term == "word":
            variants.add("microsoft word")
            variants.add("ms word")
        elif term == "powerpoint":
            variants.add("microsoft powerpoint")
            variants.add("ms powerpoint")
        # ❌ REMOVED: SQL synonyms (postgresql, mysql) - too generous
        # If job requires "SQL", resume must say "SQL"
        
        found = False
        for v in variants:
            safe = re.escape(v)
            pattern = _WORD_BOUNDARY.format(term=safe)
            if re.search(pattern, t):
                found = True
                matched.append(term)
                if debug:
                    print(f"  ✅ Matched: '{term}' (variant: '{v}')")
                break
        
        if not found and debug:
            print(f"  ❌ NOT found: '{term}'")
        
        if found:
            hits += 1
    
    return hits, matched


def compute_match_score(
    resume_text: str,
    required_skills: List[str],
    required_experience_str: str,
    debug: bool = False
) -> Tuple[int, str]:
    """
    Compute match score (0-100) and band label.
    
    🎯 WEIGHTS:
      - Skills coverage: 80% (increased from 70%)
      - Experience fit: 20% (decreased from 30%)
    
    🎯 SKILLS SCORING (Strict):
      - Each skill must match EXACTLY (word boundary)
      - No partial credit
      - Minimal synonyms (only MS Office variants)
    
    🎯 EXPERIENCE SCORING:
      - If candidate has < 70% of required years -> penalty
      - If candidate has >= required years -> full credit
    
    🏆 BANDS:
      - Strong Match: >= 75% (raised from 70%)
      - Medium Match: 50-74% (raised from 40%)
      - Weak Match: < 50%
    """
    text = resume_text or ""
    skills = [s.strip() for s in (required_skills or []) if s and s.strip()]
    
    if debug:
        print("\n" + "="*60)
        print("🔍 DEBUG: MATCH SCORING")
        print("="*60)
        print(f"Required skills: {skills}")
        print(f"Required experience: {required_experience_str}")
        print()
    
    # ========================================
    # 1️⃣ SKILLS SCORE (80% weight)
    # ========================================
    if skills:
        hits, matched_skills = _skill_hits(text, skills, debug=debug)
        coverage = hits / len(skills)
        skills_score = coverage * 100.0
        
        if debug:
            print(f"\n📊 Skills: {hits}/{len(skills)} matched ({coverage*100:.1f}%)")
            print(f"   Matched: {matched_skills}")
    else:
        # ⚠️ No skills required = 0 points (not 50!)
        skills_score = 0.0
        if debug:
            print("⚠️ No skills specified in job requirements")
    
    skills_weighted = skills_score * 0.80  # 80% weight
    
    # ========================================
    # 2️⃣ EXPERIENCE SCORE (20% weight)
    # ========================================
    req_years = _parse_required_experience_years(required_experience_str or "")
    has_years = _extract_years_from_text(text)
    
    if debug:
        print(f"\n📊 Experience: Required={req_years:.1f} yrs, Found={has_years:.1f} yrs")
    
    if req_years <= 0.0:
        # No experience required = 0 points (not 60!)
        exp_score = 0.0
        if debug:
            print("   No experience requirement specified")
    else:
        ratio = has_years / req_years
        
        if ratio < 0.7:
            # Candidate has < 70% of required experience -> penalty
            exp_score = ratio * 70.0  # Max 49% if they have 70% of req
            if debug:
                print(f"   ⚠️ Below threshold (ratio={ratio:.2f}) -> penalty")
        elif ratio >= 1.0:
            # Meets or exceeds requirement
            exp_score = 100.0
            if debug:
                print(f"   ✅ Meets requirement (ratio={ratio:.2f})")
        else:
            # Between 70-100% of required
            exp_score = 70.0 + (ratio - 0.7) * 100.0
            if debug:
                print(f"   📈 Partial match (ratio={ratio:.2f})")
    
    exp_weighted = exp_score * 0.20  # 20% weight
    
    # ========================================
    # 3️⃣ FINAL SCORE
    # ========================================
    raw = skills_weighted + exp_weighted
    score = int(round(max(0.0, min(raw, 100.0))))
    
    if debug:
        print(f"\n🎯 FINAL CALCULATION:")
        print(f"   Skills: {skills_score:.1f}% × 0.80 = {skills_weighted:.1f}")
        print(f"   Experience: {exp_score:.1f}% × 0.20 = {exp_weighted:.1f}")
        print(f"   Total: {score}%")
    
    # ========================================
    # 4️⃣ BANDING (Stricter thresholds)
    # ========================================
    if score >= 75:
        band = "Strong Match"
    elif score >= 50:
        band = "Medium Match"
    else:
        band = "Weak Match"
    
    if debug:
        print(f"   Band: {band}")
        print("="*60 + "\n")
    
    return score, band


# ========================================
# 🧪 TEST FUNCTION
# ========================================
def test_scoring():
    """Run test cases to verify scoring logic"""
    
    print("\n" + "🧪 RUNNING TEST CASES ".center(70, "=") + "\n")
    
    # Test 1: Strong candidate (all skills + experience)
    strong_resume = """
    John Doe - Senior Data Analyst
    Email: john@example.com
    
    EXPERIENCE:
    5 years of experience in data analysis and business intelligence.
    
    SKILLS:
    - Python (NumPy, Pandas, Matplotlib)
    - SQL (PostgreSQL, MySQL)
    - Excel (Advanced formulas, Pivot tables, VBA)
    - Tableau, Power BI
    - Statistical analysis
    """
    
    score, band = compute_match_score(
        strong_resume,
        ["Python", "SQL", "Excel"],
        "3-5 years",
        debug=True
    )
    print(f"✅ Test 1 (Strong): {score}% - {band}\n")
    
    # Test 2: Weak candidate (no skills, less experience)
    weak_resume = """
    Jane Smith - Junior Developer
    Email: jane@example.com
    
    EXPERIENCE:
    1 year of web development experience
    
    SKILLS:
    - HTML, CSS, JavaScript
    - React, Node.js
    - Git, GitHub
    """
    
    score, band = compute_match_score(
        weak_resume,
        ["Python", "SQL", "Excel"],
        "3-5 years",
        debug=True
    )
    print(f"✅ Test 2 (Weak): {score}% - {band}\n")
    
    # Test 3: Medium candidate (some skills, ok experience)
    medium_resume = """
    Bob Johnson - Data Analyst
    Email: bob@example.com
    
    EXPERIENCE:
    3 years of data analysis experience
    
    SKILLS:
    - Python (Pandas, NumPy)
    - Excel (Pivot tables, VLOOKUP)
    - Basic SQL
    - Data visualization
    """
    
    score, band = compute_match_score(
        medium_resume,
        ["Python", "SQL", "Excel"],
        "3-5 years",
        debug=True
    )
    print(f"✅ Test 3 (Medium): {score}% - {band}\n")
    
    # Test 4: Database specialist (MySQL but no "SQL" keyword)
    db_specialist = """
    Alice Wong - Database Administrator
    
    EXPERIENCE:
    4 years managing MySQL and PostgreSQL databases
    
    SKILLS:
    - MySQL, PostgreSQL
    - Database design
    - Query optimization
    """
    
    score, band = compute_match_score(
        db_specialist,
        ["SQL", "Python", "Excel"],
        "3-5 years",
        debug=True
    )
    print(f"✅ Test 4 (DB Specialist - should score LOWER now): {score}% - {band}\n")


if __name__ == "__main__":
    test_scoring()