from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
import io, re
from PyPDF2 import PdfReader
from docx import Document
import textstat

def review_resume(request):
    """Render the resume review page."""
    return render(request, 'review_resume.html')

def improve_resume(request):
    """Render the improve resume page."""
    return render(request, 'improve_resume.html')

def extract_text(upload):
    """Extract text from uploaded file (PDF or DOCX)."""
    name = (upload.name or "").lower()
    data = upload.read()
    try:
        if name.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(data))
            return "\n".join((p.extract_text() or "") for p in reader.pages)
        if name.endswith(".docx"):
            doc = Document(io.BytesIO(data))
            return "\n".join(p.text for p in doc.paragraphs)
        return data.decode(errors="ignore")
    except Exception:
        try: 
            return data.decode(errors="ignore")
        except: 
            return ""

def generate_improvement_tips(readability_score, sections):
    """Generate constructive improvement suggestions when no major issues are detected."""
    # Hard/technical skills suggestions
    hard_skills = [
        "AWS cloud fundamentals", "SQL optimization", "Power BI", 
        "data visualization", "agile project tracking", "REST API integration"
    ]
    
    # Soft skills suggestions  
    soft_skills = [
        "leadership", "collaboration", "cross-functional communication", "accountability"
    ]
    
    # Template enhancement suggestions
    template_tips = [
        "increase white space", "add subtle color headers for section clarity", 
        "balance text density per page"
    ]
    
    # Readability improvement suggestions
    readability_tips = [
        "shorten bullets", "start each with strong verbs like 'Led' or 'Designed'", 
        "quantify outcomes ('Improved efficiency by 30%')"
    ]
    
    # Build the improvement message
    message = "Nice progress — your resume covers all the key sections well, but you can still strengthen it further.\n\n"
    
    message += "**Consider adding these hard skills:** " + ", ".join(hard_skills[:6]) + ".\n\n"
    message += "**Build complementary soft skills:** " + ", ".join(soft_skills) + ".\n\n"
    message += "**Template enhancements:** " + ", ".join(template_tips) + ".\n\n"
    message += "**Improve readability:** " + ", ".join(readability_tips) + ".\n\n"
    message += "Keep refining — a polished resume evolves through continuous tweaks."
    
    return message

def ai_summary(text, mistakes, fixes, health, level, emoji, readability_score=None, sections=None):
    if not text or not health: return "Could not extract enough text for a review."
    if any("missing" in h.lower() for h in health):
        return f"{emoji} Level {level}: Your resume is missing some key sections. Add them for a stronger first impression."
    if not mistakes:
        # Use the new improvement tips function when no major issues are detected
        return generate_improvement_tips(readability_score, sections)
    if fixes:
        return f"{emoji} Level {level}: Your resume is solid, but the most urgent fix is: {fixes[0]}"
    return f"{emoji} Level {level}: Your resume is clear, but could be improved with more metrics and stronger verbs."

def readability_meter(score):
    if score >= 90: return ("Easy to read", "success")
    if score >= 60: return ("Good", "info")
    if score >= 30: return ("Hard to read—shorten sentences, use simpler words", "warning")
    return ("Very hard—rewrite for clarity", "danger")


@csrf_exempt
def api_review_resume(request):
    """API endpoint for resume review analysis."""
    if request.method != "POST":
        return HttpResponseBadRequest("POST only")
    
    f = request.FILES.get("resume")
    if not f:
        return HttpResponseBadRequest("No file")
    
    text = extract_text(f)
    
    # Health checklist
    checklist = []
    if re.search(r"contact|email|phone|linkedin", text, re.I): 
        checklist.append("Contact info found")
    else: 
        checklist.append("⚠️ Contact info missing")
    
    if re.search(r"experience|work history", text, re.I): 
        checklist.append("Experience section found")
    else: 
        checklist.append("⚠️ Experience section missing")
    
    if re.search(r"education", text, re.I): 
        checklist.append("Education section found")
    else: 
        checklist.append("⚠️ Education section missing")
    
    if re.search(r"skills", text, re.I): 
        checklist.append("Skills section found")
    else: 
        checklist.append("⚠️ Skills section missing")
    
    if len(text) < 800: 
        checklist.append("⚠️ Resume is very short")
    if len(text) > 12000: 
        checklist.append("⚠️ Resume is very long")
    
    if re.search(r"\.(jpg|png|gif|bmp)", text, re.I): 
        checklist.append("⚠️ Images detected (ATS blocker)")
    
    if re.search(r"table|cellpadding|cellspacing", text, re.I): 
        checklist.append("⚠️ Tables detected (ATS blocker)")
    
    # Mistakes and fixes
    mistakes = []
    fixes = []
    if re.search(r"\b(responsible for|duties include|tasked with)\b", text, re.I):
        mistakes.append({"what":"Passive phrases detected", "why":"Active voice is clearer and more impactful.", "fix":"Rewrite: 'Responsible for data entry' → 'Entered 1,000+ records/week with 99.9% accuracy'"})
        fixes.append("Rewrite passive phrases to active voice.")
    if re.search(r"\b(help|assist|support|participate|involved)\b", text, re.I):
        mistakes.append({"what":"Weak verbs detected", "why":"Strong verbs show leadership and results.", "fix":"Replace 'helped' with 'led', 'delivered', etc."})
        fixes.append("Replace weak verbs with strong action verbs.")
    if not re.search(r"\d+%|\d{4}|\$\d", text):
        mistakes.append({"what":"No metrics or numbers found", "why":"Recruiters look for measurable results.", "fix":"Add numbers: 'Increased sales by 20%'."})
        fixes.append("Add at least one metric to your most recent job.")
    if re.search(r"\b(I|my|we|our)\b", text):
        mistakes.append({"what":"First person pronouns detected", "why":"Resumes should be written in implied first person.", "fix":"Remove 'I', 'my', 'we', 'our'."})
        fixes.append("Remove first person pronouns.")
    
    # Readability
    try:
        flesch = textstat.flesch_reading_ease(text)
    except Exception:
        flesch = 60
    meter, meter_class = readability_meter(flesch)
    
    # Section-by-section
    sections = []
    for sec in ["Summary", "Experience", "Skills", "Education"]:
        found = re.search(sec, text, re.I)
        if found:
            sections.append({"section": sec, "status": "ok", "suggestion": f"{sec}: Good. Consider grouping or adding more detail if possible." if sec != "Summary" else "Summary: Good. Keep it concise and tailored."})
        else:
            sections.append({"section": sec, "status": "missing", "suggestion": f"Add a {sec} section. List 8–12 relevant items as keywords."})
    
    # Fix first
    fix_first = fixes[:3] if fixes else ["Add a LinkedIn link to your contact info.", "Add more detail to your most recent job.", "Use strong action verbs."]
    
    
    # Health emoji/level
    if len(fixes) == 0 and all("found" in h for h in checklist):
        health_emoji = "😃"
        health_label = "Level 3 – Resume Pro"
        health_level = 3
        confetti = True
    elif len(fixes) <= 2:
        health_emoji = "🙂"
        health_label = "Level 2 – Resume Rookie"
        health_level = 2
        confetti = False
    else:
        health_emoji = "😬"
        health_label = "Level 1 – Needs Work"
        health_level = 1
        confetti = False
    
    # ATS parse (simplified version)
    ats_parse = f"ATS Parse for: {f.name}\n"
    ats_parse += "=" * 50 + "\n"
    ats_parse += f"Contact Info: {'✓ Found' if re.search(r'contact|email|phone|linkedin', text, re.I) else '✗ Missing'}\n"
    ats_parse += f"Experience: {'✓ Found' if re.search(r'experience|work history', text, re.I) else '✗ Missing'}\n"
    ats_parse += f"Education: {'✓ Found' if re.search(r'education', text, re.I) else '✗ Missing'}\n"
    ats_parse += f"Skills: {'✓ Found' if re.search(r'skills', text, re.I) else '✗ Missing'}\n"
    ats_parse += f"Length: {len(text)} characters ({'Good' if 800 <= len(text) <= 12000 else 'Too short/long'})\n"
    ats_parse += f"Readability: {flesch} (Flesch Reading Ease)\n"
    ats_blockers = re.search(r'\.(jpg|png|gif|bmp)|table|cellpadding', text, re.I)
    ats_parse += f"ATS Blockers: {'None detected' if not ats_blockers else 'Images/tables detected'}\n"
    
    # What to do next
    next_steps = [
        "Download your reviewed resume",
        "Try our AI rewrite tool",
        "See top resume examples",
        "Or click below to improve your resume with AI"
    ]
    
    # If no major mistakes, add suggestions
    suggestions = []
    if not mistakes:
        suggestions = [
            "Add in-demand skills like Python, SQL, or Data Visualization.",
            "Try a modern, ATS-optimized resume template for better impact.",
            "Add or enhance your Summary section to be concise and tailored.",
            "Include measurable results and strong action verbs in your bullets."
        ]
    
    return JsonResponse({
        "summary": ai_summary(text, mistakes, fixes, checklist, health_level, health_emoji, flesch, sections),
        "health_emoji": health_emoji,
        "health_label": health_label,
        "health_level": health_level,
        "confetti": confetti,
        "checklist": checklist,
        "mistakes": mistakes,
        "readability": flesch,
        "readability_meter": meter,
        "readability_class": meter_class,
        "sections": sections,
        "fix_first": fix_first,
        "ats_parse": ats_parse,
        "next_steps": next_steps,
        "suggestions": suggestions
    })