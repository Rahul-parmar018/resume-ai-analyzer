import os, json, logging, fitz
import io, re
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from docx import Document
import textstat
from .utils.rate_limiter import rate_limit
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from firebase_admin import auth
from .auth_utils import verify_token
from .utils.ml_analyzer import analyze_resume
from .utils.dynamic_resume_analyzer import DynamicResumeAnalyzer

logger = logging.getLogger(__name__)

# ────────── MODERN API ENDPOINTS ──────────

@api_view(['POST'])
@parser_classes([MultiPartParser])
def analyze_resume_view(request):
    """
    Primary API for the React Frontend.
    Handles resume upload, token verification, and ML-based scoring.
    """
    try:
        # 🔐 Verify token
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return Response({"error": "Missing Authorization header"}, status=401)
            
        token = auth_header.split('Bearer ')[1]
        decoded = auth.verify_id_token(token)

        # 📄 Get file (using standard 'file' key)
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file Provided"}, status=400)

        # 📖 Read text using our upgraded utility
        resume_text = _extract_text(file)
        
        # 🎯 Job description extraction (Dynamic vs. Default)
        user_jd = request.data.get("job_description", "").strip()
        
        if user_jd:
            job_desc = user_jd
            manual_job_skills = None
        else:
            job_desc = """
            Looking for a Python Django developer with experience in:
            AWS, Docker, React, REST APIs
            """
            manual_job_skills = ["python", "django", "react", "docker", "aws"]

        # 🧠 ML Analysis (Refined 85/15 weight)
        result = analyze_resume(resume_text, job_desc, manual_job_skills=manual_job_skills)

        return Response(result)

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return Response({"error": str(e)}, status=401)

@api_view(['POST'])
@rate_limit(max_requests=10, window=60)
def analyze_resume_api(request):
    """Legacy/Alternative API endpoint for standard processing."""
    try:
        verify_token(request)
        file = request.FILES.get('resume')
        if not file:
            return Response({"error": "No file uploaded."}, status=400)

        text = _extract_text(file)
        jd = request.POST.get("job_description", "")
        title = request.POST.get("job_title", "General Applicant")
        
        analyzer = DynamicResumeAnalyzer()
        data = analyzer.analyze(text, jd, title)
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=401)

@csrf_exempt
@rate_limit(max_requests=20, window=60)
def api_score(request):
    """Basic scoring API for quick checks."""
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    up = request.FILES.get("resume")
    if not up:
        return HttpResponseBadRequest("Missing file field 'resume'")
    raw_k = request.POST.get("keywords", "")
    try:
        key_list = [k.strip() for k in re.split(r"[;,]", raw_k)] if raw_k else None
        text = _extract_text(up)
        result = _score_resume(text, key_list)
        return JsonResponse(result)
    except Exception as e:
        return HttpResponseBadRequest(f"Score error: {e}")

def check_api_status(request):
    return JsonResponse({"status": "online"})

# ────────── UTILITIES ──────────

def _extract_text(upload):
    name = (upload.name or "").lower()
    data = upload.read()
    try:
        if name.endswith(".pdf"):
            text = ""
            with fitz.open(stream=data, filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text()
            return text
        if name.endswith(".docx"):
            doc = Document(io.BytesIO(data))
            return "\n".join(p.text for p in doc.paragraphs)
        return data.decode(errors="ignore")
    except Exception:
        return data.decode(errors="ignore")

def _score_resume(text, keywords=None):
    text_raw = text or ""
    text_low = text_raw.lower()
    SECTION_HEADS = ["experience","skills","education","projects"]
    heads = sum(1 for h in SECTION_HEADS if re.search(rf"\b{re.escape(h)}\b", text_low))
    bullets = len(re.findall(r"(^[\-\•\▪\●\*]\s)|•", text_raw, flags=re.MULTILINE))
    
    kws = keywords or ["Python", "SQL", "AWS"]
    present_kw = [k for k in kws if re.search(rf"\b{re.escape(k.lower())}\b", text_low)]
    score = int(min(100, (len(present_kw) / max(1, len(kws))) * 100))
    
    return {
        "total": score,
        "present": ";".join(present_kw),
        "missing": ";".join([k for k in kws if k not in present_kw]),
    }
