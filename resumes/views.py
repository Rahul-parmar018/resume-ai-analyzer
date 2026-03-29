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
from .models import FirebaseUser, AnalysisRecord, ExtractedData, AnalysisEmbedding
from django.db.models import Avg, Count
from collections import Counter
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .utils.ml_model import model as semantic_model

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

        # 🗄️ ORM Save: SaaS Data Lifecycle
        # 1. Sync User
        firebase_user, _ = FirebaseUser.objects.get_or_create(
            firebase_uid=decoded['uid'],
            defaults={'email': decoded.get('email', '')}
        )
        
        # 2. Save Analysis
        analysis_record = AnalysisRecord.objects.create(
            user=firebase_user,
            resume_name=file.name,
            job_description=job_desc,
            score=result['score']
        )
        
        # 3. Save Extracted Data Details
        ExtractedData.objects.create(
            analysis=analysis_record,
            skills=result['skills_found'],
            missing_skills=result['missing_skills'],
            suggestions=result['suggestions']
        )
        
        # 4. Phase 3: High-Dimension Semantic Embedding Generation
        # Construct a dense, token-efficient string 
        skills_str = ", ".join(result['skills_found'])
        clean_text = f"Capabilities: {skills_str}. Profile context: {resume_text[:500]}"
        
        # Encode to vector (Runs locally and instantly via our pre-loaded MiniLM Singleton)
        vector = semantic_model.encode(clean_text).tolist()
        
        AnalysisEmbedding.objects.create(
            analysis=analysis_record,
            vector=vector
        )
        
        # Hydrate result with internal DB ID so frontend can ref it
        result['id'] = analysis_record.id

        return Response(result)

    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return Response({"error": str(e)}, status=401)

# ────────── NEW SAAS ENDPOINTS ──────────

@api_view(['GET'])
def get_history_view(request):
    """Returns all SaaS analyses for the authenticated user"""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return Response({"error": "Unauthorized"}, status=401)
        
        token = auth_header.split('Bearer ')[1]
        decoded = auth.verify_id_token(token)
        uid = decoded['uid']
        
        user = FirebaseUser.objects.filter(firebase_uid=uid).first()
        if not user:
            return Response([], status=200)
            
        history = AnalysisRecord.objects.filter(user=user).order_by('-created_at')
        
        data = []
        for h in history:
            ext = h.extracted_data
            data.append({
                "id": h.id,
                "resume_name": h.resume_name,
                "score": h.score,
                "date": h.created_at.strftime("%m/%d/%Y"),
                "matched_skills": list(set(ext.skills)) if ext else [],
                "missing_skills": ext.missing_skills if ext else [],
                "suggestions": ext.suggestions if ext else [],
            })
            
        return Response(data, status=200)
    except Exception as e:
        logger.error(f"History Fetch error: {str(e)}")
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def get_dashboard_analytics_view(request):
    """
    Dashboard Intelligence Layer: Returns scaled KPI aggregations,
    score distributions, and JSON-parsed Top Skills frequencies.
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return Response({"error": "Unauthorized"}, status=401)
        
        token = auth_header.split('Bearer ')[1]
        decoded = auth.verify_id_token(token)
        user = FirebaseUser.objects.filter(firebase_uid=decoded['uid']).first()
        
        if not user:
            return Response({"error": "User sync failed"}, status=404)

        # 1. CORE KPIs (Fast DB Level Aggregations)
        # Limit to 1000 for scalability as per Phase 2 requirements
        records_query = AnalysisRecord.objects.filter(user=user).order_by('-created_at')[:1000]
        
        total_resumes = records_query.count()
        if total_resumes == 0:
            return Response({
                "total_resumes": 0, "average_score": 0,
                "score_distribution": {"low": 0, "medium": 0, "high": 0},
                "top_skills": [], "top_missing_skills": [],
                "recent_activity": [], "insight": "No candidates analyzed yet."
            }, status=200)

        # Re-fetch without slice for standard aggregations 
        base_query = AnalysisRecord.objects.filter(user=user)
        
        avg_score_raw = base_query.aggregate(avg=Avg('score'))['avg']
        average_score = round(avg_score_raw, 1) if avg_score_raw else 0
        
        # 2. SCORE DISTRIBUTION (Fast Bucket Queries)
        score_dist = {
            "low": base_query.filter(score__lt=40).count(),
            "medium": base_query.filter(score__gte=40, score__lt=70).count(),
            "high": base_query.filter(score__gte=70).count()
        }
        
        # 3. JSON SKILL MINING (In-Memory Processing on limited set)
        skills_counter = Counter()
        missing_counter = Counter()

        # Optimize by getting only the fields we need using select_related
        extracted_subset = ExtractedData.objects.filter(analysis__in=records_query).values('skills', 'missing_skills')
        
        for data in extracted_subset:
            skills = data.get('skills', [])
            missing = data.get('missing_skills', [])
            # Defend against None or stringified JSON edge cases
            if isinstance(skills, list):
                skills_counter.update(skills)
            if isinstance(missing, list):
                missing_counter.update(missing)
                
        # Format Top 5 Arrays: [["Python", 320], ["React", 280]]
        top_skills = skills_counter.most_common(5)
        top_missing = missing_counter.most_common(5)

        # 4. DYNAMIC BUSINESS INTELLIGENCE (AI String Illusion)
        formatted_missing = ", ".join([skill[0].title() for skill in top_missing[:2]]) if top_missing else "core"
        insight_string = f"Pipeline alert: High frequency of candidates lack {formatted_missing} expertise." if formatted_missing != "core" else "Pipeline looks healthy based on historical parsing."

        # 5. RECENT ACTIVITY LIST
        recent_activity = [
            {
                "resume": rec.resume_name,
                "score": rec.score,
                "date": rec.created_at.strftime("%Y-%m-%d"),
                "id": rec.id
            } for rec in records_query[:5]
        ]
        
        return Response({
            "total_resumes": total_resumes,
            "average_score": average_score,
            "score_distribution": score_dist,
            "top_skills": top_skills,
            "top_missing_skills": top_missing,
            "recent_activity": recent_activity,
            "insight": insight_string
        }, status=200)

    except Exception as e:
        logger.error(f"Dashboard aggregation error: {str(e)}")
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def semantic_search_view(request):
    """
    Phase 3: Natural Language AI Finder
    Computes query embeddings, strikes fast nearest-neighbors search via numpy,
    and returns dynamically ranked candidates utilizing Hybrid Scoring.
    """
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return Response({"error": "Unauthorized"}, status=401)
            
        token = auth_header.split('Bearer ')[1]
        decoded = auth.verify_id_token(token)
        user = FirebaseUser.objects.filter(firebase_uid=decoded['uid']).first()
        if not user:
            return Response({"error": "User sync failed"}, status=404)
            
        query_text = request.data.get('query', '').strip()
        if not query_text:
            return Response({"error": "Query required"}, status=400)
            
        # 1. Fetch Top 500 Embeddings (Dynamic limit to prevent O(N) blowup)
        # Using select_related to quickly pull the root AnalysisRecord and its ExtractedData skills
        embeddings = list(AnalysisEmbedding.objects.select_related('analysis', 'analysis__extracted_data')
                               .filter(analysis__user=user)
                               .exclude(vector__isnull=True)
                               .order_by('-id')[:500])
                               
        if not embeddings:
            return Response({"error": "No indexed candidates found in pipeline."}, status=404)
            
        # 2. Extract raw vector arrays and original baseline scores
        stored_vectors = np.array([e.vector for e in embeddings])
        
        # 3. Compute Query Embedding & Similarity Matrix
        query_vector = np.array(semantic_model.encode(query_text)).reshape(1, -1)
        sim_scores = cosine_similarity(query_vector, stored_vectors)[0]
        
        # 4. Sort Top-5 utilizing numpy argsort
        top_k = min(5, len(stored_vectors))
        top_indices = sim_scores.argsort()[-top_k:][::-1]
        
        # 5. Build Hybrid Result Matrix
        results = []
        for idx in top_indices:
            embedding_record = embeddings[idx]
            analysis_rec = embedding_record.analysis
            semantic_score = sim_scores[idx]
            
            # Normalize DB Score to 0.0 - 1.0 logic, assuming original score is 0-100
            db_score_normalized = analysis_rec.score / 100.0
            
            # Hybrid Calculation (70% Semantic Focus, 30% Keyword Focus)
            raw_hybrid = (0.7 * semantic_score) + (0.3 * db_score_normalized)
            final_hybrid_percent = round(raw_hybrid * 100)
            semantic_percent = round(semantic_score * 100)
            
            extracted = getattr(analysis_rec, 'extracted_data', None)
            skills = extracted.skills if extracted else []
            
            # Dynamic Output Explainability (Explainable AI)
            matched_skills = [s for s in skills if s.lower() in query_text.lower()]
            if matched_skills:
                reason = f"Strong multi-dimensional match. Evaluated skills aligned to query: {', '.join(matched_skills[:3])}."
            elif semantic_score > 0.4:
                reason = "Identified strong generalized conceptual alignment despite missing precise keyword matches."
            else:
                reason = "Partial contextual connection to requirements."
                
            results.append({
                "id": analysis_rec.id,
                "candidate": analysis_rec.resume_name,
                "score": final_hybrid_percent,
                "semantic_score": semantic_percent,
                "skills": skills[:5],  # Just top 5 to keep UI clean
                "reason": reason
            })
            
        return Response(results, status=200)
        
    except Exception as e:
        logger.error(f"Semantic Search error: {str(e)}")
        return Response({"error": str(e)}, status=400)

@api_view(['GET', 'DELETE'])
def analysis_detail_view(request, pk):
    """GET detailed record or DELETE it entirely."""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or 'Bearer ' not in auth_header:
            return Response({"error": "Unauthorized"}, status=401)
            
        token = auth_header.split('Bearer ')[1]
        decoded = auth.verify_id_token(token)
        user = FirebaseUser.objects.filter(firebase_uid=decoded['uid']).first()
        
        if not user:
            return Response({"error": "User sync failed"}, status=404)
            
        record = AnalysisRecord.objects.filter(id=pk, user=user).first()
        if not record:
            return Response({"error": "Record not found"}, status=404)
            
        if request.method == 'DELETE':
            record.delete()
            return Response({"status": "deleted"}, status=200)
            
        if request.method == 'GET':
            ext = record.extracted_data
            return Response({
                "id": record.id,
                "score": record.score,
                "resume_name": record.resume_name,
                "job_description": record.job_description,
                "skills_found": ext.skills if ext else [],
                "missing_skills": ext.missing_skills if ext else [],
                "suggestions": ext.suggestions if ext else [],
                "date": record.created_at.strftime("%m/%d/%Y"),
            })
            
    except Exception as e:
        return Response({"error": str(e)}, status=400)

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
