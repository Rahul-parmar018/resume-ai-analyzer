import os, json, logging
from django.shortcuts import render, redirect
import io, re
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from PyPDF2 import PdfReader
from docx import Document
import textstat
from django.core.files.storage import FileSystemStorage
from .utils.dynamic_resume_analyzer import DynamicResumeAnalyzer
from .utils.rate_limiter import rate_limit
from django.conf import settings

logger = logging.getLogger(__name__)

def react_app(request):
    try:
        with open(os.path.join(settings.BASE_DIR, 'frontend', 'dist', 'index.html')) as f:
            return HttpResponse(f.read())
    except FileNotFoundError:
        return HttpResponse("React build not found. Please run 'npm run build' in the frontend folder.", status=501)

# ────────── STEP 1 Home ──────────
def home(request):
    return render(request, "resumes/home.html")

def examples(request):
    return render(request, "resumes/examples.html")

def resume_examples(request):
    return render(request, "resume_examples.html")

# ────────── STEP 2 Requirements ──────────
@csrf_exempt
def requirements_view(request):
    if request.method == "POST":
        try:
            if "json_file" in request.FILES:
                data = json.load(request.FILES["json_file"])
            else:
                data = {
                    "company": request.POST.get("company"),
                    "role": request.POST.get("role"),
                    "experience": request.POST.get("experience"),
                    "location": request.POST.get("location"),
                    "skills": [s.strip() for s in request.POST.get("skills", "").split(",") if s.strip()],
                    "description": request.POST.get("description", ""),
                }
            request.session["job"] = data
            return redirect("upload")
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return render(request, "resumes/requirements.html")

# ────────── STEP 3 Upload ──────────
def upload_view(request):
    job = request.session.get("job")
    if not job:
        return redirect("requirements")
    if request.method == "POST":
        files = request.FILES.getlist("resumes")
        fs = FileSystemStorage()
        stored = [fs.save(f.name, f) for f in files]
        request.session["files"] = stored
        return redirect("results")
    return render(request, "resumes/upload.html", {"job": job})

# ────────── STEP 4 Results (AI analysis) ──────────
def results_view(request):
    job = request.session.get("job")
    paths = request.session.get("files", [])
    if not paths:
        return redirect("upload")

    analyzer = DynamicResumeAnalyzer()
    results = []

    for file_path in paths:
        try:
            text = open(os.path.join("media", file_path),
                        "r", encoding="utf‑8", errors="ignore").read()
        except Exception:
            text = "Resume text not readable."
        score = analyzer.analyze(text, job.get("description", ""), job.get("role",""))
        score["name"] = os.path.splitext(os.path.basename(file_path))[0]
        results.append(score)

    results.sort(key=lambda x: x.get("total_score", 0), reverse=True)
    avg = sum(r.get("total_score",0) for r in results)/len(results)
    request.session["results"] = results
    return render(request, "resumes/results.html", {"job": job, "results": results, "avg": avg})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from firebase_admin import auth
from .auth_utils import verify_token
@api_view(['POST'])
def analyze_resume(request):
    try:
        # 🔐 Verify token
        token = request.headers.get('Authorization').split('Bearer ')[1]
        decoded = auth.verify_id_token(token)

        # 📄 Get file
        file = request.FILES.get('resume')

        if not file:
            return Response({"error": "No file"}, status=400)

        # 🧠 TEMP (replace later with ML)
        result = {
            "score": 80,
            "feedback": "Working API"
        }

        return Response(result)

    except Exception as e:
        return Response({"error": str(e)}, status=401)

# ────────── AI API ENDPOINTS ──────────
@api_view(['POST'])
@rate_limit(max_requests=10, window=60)
def analyze_resume_api(request):
    try:
        # 1. Enforce Token Verification
        user = verify_token(request)

        # 2. Extract File
        file = request.FILES.get('resume')
        if not file:
            return Response({"error": "No file uploaded. Please provide a PDF or DOCX."}, status=400)

        # 3. Parse Document
        text = _extract_text(file)
        if not text.strip():
            return Response({"error": "Failed to extract text from the document."}, status=400)

        # 4. Standard AI Processing (Using existing logic)
        jd = request.POST.get("job_description", "")
        title = request.POST.get("job_title", "General Applicant")
        
        analyzer = DynamicResumeAnalyzer()
        data = analyzer.analyze(text, jd, title)

        return Response(data)

    except Exception as e:
        return Response({"error": str(e)}, status=401)

def check_api_status(request):
    usable = bool(os.getenv("OPENAI_API_KEY"))
    return JsonResponse({"status": "online" if usable else "offline"})

def upload_resume_gpt(request):   # redirects wrapper
    return redirect("upload")

def resume_results_gpt(request):
    return redirect("results")

def batch_analyze_resumes(request):
    return HttpResponse("<h3>Batch analysis coming soon 🚀</h3>")

def download_results(request, format="json"):
    data = request.session.get("results")
    if not data:
        return redirect("results")
    if format == "json":
        resp = JsonResponse(data, safe=False, json_dumps_params={"indent":2})
        resp["Content-Disposition"] = "attachment; filename=results.json"
        return resp
    return HttpResponse("Unsupported format")

def clear_session_data(request):
    for key in ["job","files","results"]:
        request.session.pop(key, None)
    return JsonResponse({"status":"cleared"})

# ────────── SCORE CHECKER PAGE ──────────
def score_checker(request):
    # UI-only page for resume scoring
    return render(request, "score_checker.html")

# Scoring constants and functions
SECTION_HEADS = [
    "experience","work experience","summary","profile","skills",
    "education","projects","certifications","achievements","awards"
]
DEFAULT_KEYWORDS = [
    "SQL","Python","Tableau","Excel","A/B Testing","ETL","dbt","Looker",
    "Power BI","Dashboards","Kubernetes","AWS"
]

def _extract_text(upload):
    name = (upload.name or "").lower()
    data = upload.read()
    try:
        if name.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(data))
            return "\n".join((p.extract_text() or "") for p in reader.pages)
        if name.endswith(".docx"):
            doc = Document(io.BytesIO(data))
            return "\n".join(p.text for p in doc.paragraphs)
        # crude fallback for .doc/.txt
        return data.decode(errors="ignore")
    except Exception:
        try:
            return data.decode(errors="ignore")
        except Exception:
            return ""

def _score_resume(text, keywords=None):
    text_raw = text or ""
    text_low = text_raw.lower()

    # ATS readiness: headings, bullets, length sanity
    heads = sum(1 for h in SECTION_HEADS if re.search(rf"\b{re.escape(h)}\b", text_low))
    bullets = len(re.findall(r"(^[\-\•\▪\●\*]\s)|•", text_raw, flags=re.MULTILINE))
    length_ok = 800 <= len(text_raw) <= 12000
    ats = min(100, heads * 10 + min(30, bullets * 2) + (20 if length_ok else 0) + 20)

    # Readability (Flesch) mapped 40–95
    try:
        fre = textstat.flesch_reading_ease(text_raw)
        read = int(max(40, min(95, fre)))
    except Exception:
        read = 70

    # Structure: bullets + rough tense balance
    past = len(re.findall(r"\b(ed)\b", text_low))
    present = len(re.findall(r"\b(s)\b", text_low))
    struct_base = 60 + min(25, bullets * 2)
    struct = int(max(55, min(95, struct_base - abs(past - present) * 0.02)))

    # Keywords & match
    kws = [k.strip() for k in (keywords or DEFAULT_KEYWORDS) if k.strip()]
    present_kw = [k for k in kws if re.search(rf"\b{re.escape(k.lower())}\b", text_low)]
    missing_kw = [k for k in kws if k not in present_kw]
    skills = int(min(100, (len(present_kw) / max(1, len(kws))) * 100))
    match = int(min(100, (skills * 0.7 + (heads >= 5) * 15 + (bullets >= 10) * 15)))

    total = int(round(0.25*ats + 0.25*match + 0.20*skills + 0.15*read + 0.15*struct))
    return {
        "total": total, "ats": ats, "match": match, "skills": skills,
        "read": read, "struct": struct,
        "present": ";".join(present_kw),
        "missing": ";".join(missing_kw),
    }

@csrf_exempt
@rate_limit(max_requests=20, window=60)  # 20 requests per minute
def api_score(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    up = request.FILES.get("resume")
    if not up:
        return HttpResponseBadRequest("Missing file field 'resume'")
    # Optional: accept custom keywords (comma/semicolon)
    raw_k = request.POST.get("keywords", "")
    try:
        key_list = [k.strip() for k in re.split(r"[;,]", raw_k)] if raw_k else None
        text = _extract_text(up)
        result = _score_resume(text, key_list)
        return JsonResponse(result)
    except Exception as e:
        return HttpResponseBadRequest(f"Score error: {e}")
