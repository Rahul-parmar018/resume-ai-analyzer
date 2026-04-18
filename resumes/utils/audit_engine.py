import re
import textstat
from collections import Counter

_nlp = None

def _get_nlp():
    """Lazy loader for the Spacy NLP model."""
    global _nlp
    if _nlp is None:
        import spacy
        try:
            _nlp = spacy.load("en_core_web_sm")
        except:
            # Fallback if model isn't downloaded
            _nlp = None
    return _nlp

class ResumeAuditEngine:
    def __init__(self):
        # Action Verbs (Strong)
        self.strong_verbs = {
            "orchestrated", "pioneered", "engineered", "synthesized", "accelerated",
            "spearheaded", "capitalized", "centralized", "leveraged", "maximized",
            "restructured", "optimized", "implemented", "developed", "executed",
            "managed", "built", "created", "navigated", "standardized", "mentored"
        }
        
        # Weak Verbs to avoid
        self.weak_verbs = {
            "worked", "did", "helper", "helped", "assisted", "involved", "responsible",
            "duty", "duties", "tasked", "participated", "contributed"
        }

        # Section Headers (Standard)
        self.sections_map = {
            "summary": r"\b(summary|objective|profile|about)\b",
            "experience": r"\b(experience|history|employment|work)\b",
            "projects": r"\b(projects?|accomplishments?|highlights?)\b",
            "skills": r"\b(skills?|technologies?|stack|expertise|competencies)\b",
            "education": r"\b(education|academics?|certifications?)\b"
        }

    def _analyze_structure(self, text):
        found = []
        score = 0
        text_lower = text.lower()
        
        for section, pattern in self.sections_map.items():
            if re.search(pattern, text_lower):
                found.append(section)
        
        # Basic scoring: 20 points per core section
        score = (len(found) / len(self.sections_map)) * 100
        
        critical_missing = [s for s in ["experience", "skills", "education"] if s not in found]
        
        return {
            "score": int(score),
            "found_sections": found,
            "missing_sections": critical_missing,
            "issues": [f"Missing critical section: {s}" for s in critical_missing]
        }

    def _analyze_language(self, text):
        nlp = _get_nlp()
        if not nlp:
            # Fallback regex-only verb check if spacy model is missing
            return self._analyze_language_fallback(text)
            
        doc = nlp(text[:10000]) # Cap for speed
        verbs = [token.lemma_.lower() for token in doc if token.pos_ == "VERB"]
        
        strong_count = sum(1 for v in verbs if v in self.strong_verbs)
        weak_count = sum(1 for v in verbs if v in self.weak_verbs)
        
        # Readiness proxy: Density of strong verbs
        verb_ratio = (strong_count / max(1, len(verbs))) * 100
        lang_score = max(20, min(95, 50 + (strong_count * 5) - (weak_count * 10)))
        
        issues = []
        if weak_count > 3:
            issues.append("Found multiple passive/weak verbs (e.g., 'worked', 'helped'). Transform to action-led phrases.")
        if strong_count < 2:
            issues.append("Lack of strong action verbs. Use words like 'Orchestrated' or 'Spearheaded'.")
            
        return {
            "score": int(lang_score),
            "strong_verbs_found": list(set([v for v in verbs if v in self.strong_verbs])),
            "issues": issues,
            "readability": textstat.flesch_reading_ease(text)
        }

    def _analyze_language_fallback(self, text):
        # Basic word-list checking if NLP model fails
        text_low = text.lower()
        words = text_low.split()
        strong_count = sum(1 for v in self.strong_verbs if v in text_low)
        weak_count = sum(1 for v in self.weak_verbs if v in text_low)
        
        lang_score = max(20, min(95, 50 + (strong_count * 5) - (weak_count * 10)))
        return {
            "score": int(lang_score),
            "issues": ["Advanced NLP Audit downgraded to heuristic mode."],
            "readability": textstat.flesch_reading_ease(text)
        }

    def _analyze_impact(self, text):
        # Look for percentages, numbers, currencies
        numbers = re.findall(r"\d+[\%\$]|(?:\d+,)?\d+", text)
        impact_keywords = re.findall(r"\b(increased|decreased|saved|earned|grew|reduced|revenue|profit|growth|scale)\b", text.lower())
        
        # Scoring: High density of metrics = high score
        metric_score = (len(numbers) * 5) + (len(impact_keywords) * 10)
        final_score = max(10, min(98, 20 + metric_score))
        
        issues = []
        if not numbers:
            issues.append("No measurable metrics detected (% or $). Recruiter rejection risk high.")
        if not impact_keywords:
            issues.append("No result-oriented language found (e.g., 'increased', 'saved').")
            
        return {
            "score": int(final_score),
            "metrics_detected": len(numbers),
            "impact_words": list(set(impact_keywords)),
            "issues": issues
        }

    def _analyze_ats(self, text):
        # Check for non-standard characters and readability
        readability = textstat.flesch_reading_ease(text)
        
        # Simple penalty for non-standard chars that break parsers
        forbidden = len(re.findall(r"[\u2022\u25CF\u25A0\u25AA]", text)) # dots/squares
        
        ats_score = max(30, min(95, readability - (forbidden * 2)))
        
        issues = []
        if readability < 40:
            issues.append("Complexity too high. ATS may struggle to parse sentence logic.")
        if forbidden > 10:
            issues.append("Excessive bullet symbols detected. Use standard circles or simple dashes.")

        return {
            "score": int(ats_score),
            "issues": issues
        }

    def run_full_audit(self, text):
        struct = self._analyze_structure(text)
        lang = self._analyze_language(text)
        impact = self._analyze_impact(text)
        ats = self._analyze_ats(text)
        
        # Weighted Final Score
        final_score = (
            (struct['score'] * 0.25) +
            (lang['score'] * 0.25) +
            (impact['score'] * 0.35) +
            (ats['score'] * 0.15)
        )
        
        # Readiness Logic
        readiness = "POOR"
        if final_score > 80: readiness = "EXCELLENT"
        elif final_score > 60: readiness = "GOOD"
        elif final_score > 40: readiness = "FAIR"
        
        return {
            "overall_score": int(final_score),
            "readiness": readiness,
            "breakdown": {
                "structure": struct['score'],
                "language": lang['score'],
                "impact": impact['score'],
                "ats": ats['score']
            },
            "critical_issues": struct['issues'] + lang['issues'] + impact['issues'] + ats['issues'],
            "summary": f"Your resume health is {readiness}. " + \
                       (lang['issues'][0] if lang['issues'] else "Language quality is professional.")
        }
