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
from .models import FirebaseUser, AnalysisRecord, ExtractedData, AnalysisEmbedding, JobSession
from django.db.models import Avg, Count, F
from collections import Counter
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .utils.ml_model import model as semantic_model

logger = logging.getLogger(__name__)


def _get_firebase_user(request):
    """Helper to verify token and return Django FirebaseUser model"""
    auth_header = request.headers.get('Authorization')
    if not auth_header or 'Bearer ' not in auth_header:
        return None
    
    try:
        token = auth_header.split('Bearer ')[1]
        decoded = auth.verify_id_token(token)
        uid = decoded['uid']
        email = decoded.get('email')
        
        user, created = FirebaseUser.objects.get_or_create(
            firebase_uid=uid,
            defaults={'email': email}
        )
        return user
    except Exception as e:
        logger.error(f"Auth verification failed: {str(e)}")
        return None


def _check_usage_limit(user, count_to_add=1):
    """Enforces SaaS usage limits based on role"""
    if user.role == 'candidate':
        if user.optimization_count + count_to_add > 20:
            return False, "Optimization limit reached (20/20). Upgrade to Pro to continue.", "LIMIT_EXCEEDED"
    elif user.role == 'recruiter':
        if user.scan_count + count_to_add > 500:
            return False, "Scan limit reached (500/500). Upgrade to Enterprise for unlimited scanning.", "LIMIT_EXCEEDED"
    else:
        return False, "No role assigned. Please complete onboarding.", "ROLE_REQUIRED"
    
    return True, None, None


@api_view(['GET'])
def get_user_profile_view(request):
    """Fetch the source-of-truth user profile from Django"""
    user = _get_firebase_user(request)
    if not user:
        return Response({"error": "Unauthorized"}, status=401)
    
    return Response({
        "uid": user.firebase_uid,
        "email": user.email,
        "role": user.role,
        "role_locked": user.role_locked,
        "optimization_count": user.optimization_count,
        "scan_count": user.scan_count,
        "limits": {
            "candidate": 20,
            "recruiter": 500
        }
    })


@api_view(['POST'])
def update_user_role_view(request):
    """SaaS Role Onboarding with Locking Logic"""
    user = _get_firebase_user(request)
    if not user:
        return Response({"error": "Unauthorized"}, status=401)
    
    if user.role_locked:
        return Response({
            "error": "Role is already locked for this account.",
            "code": "ROLE_LOCKED"
        }, status=403)
    
    new_role = request.data.get('role')
    if new_role not in ['candidate', 'recruiter']:
        return Response({"error": "Invalid role selected"}, status=400)
    
    user.role = new_role
    user.role_locked = True
    user.save()
    
    logger.info(f"[AUTH] User {user.firebase_uid} locked role as {new_role}")
    
    return Response({
        "message": f"Account successfully set to {new_role} mode.",
        "role": user.role
    })


logger = logging.getLogger(__name__)

# ------------------ Structured Hiring Profile Helpers ------------------

def _safe_json_loads(value):
    if value is None:
        return None
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except Exception:
        return None


def _normalize_list(value):
    if not value:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return [str(value).strip()] if str(value).strip() else []


def _parse_job_profile(request):
    raw = request.data.get("job_profile")
    profile = _safe_json_loads(raw)
    return profile if isinstance(profile, dict) else None


def _build_query_text(job_profile):
    job_title = (job_profile.get("job_title") or "").strip()
    exp = (job_profile.get("experience_level") or "").strip()
    required = ", ".join(_normalize_list(job_profile.get("required_skills")))
    optional = ", ".join(_normalize_list(job_profile.get("optional_skills")))
    tools = ", ".join(_normalize_list(job_profile.get("tools")))
    notes = (job_profile.get("notes") or "").strip()

    parts = [
        f"Role: {job_title}" if job_title else "",
        f"Experience: {exp}" if exp else "",
        f"Required Skills: {required}" if required else "",
        f"Optional Skills: {optional}" if optional else "",
        f"Tools: {tools}" if tools else "",
        f"Notes: {notes}" if notes else "",
    ]
    return "\n".join([p for p in parts if p])


def _normalize_weights(weights):
    default = {"skills": 0.5, "experience": 0.3, "semantic": 0.2}
    if not isinstance(weights, dict):
        return default
    try:
        s = float(weights.get("skills", default["skills"]))
        e = float(weights.get("experience", default["experience"]))
        m = float(weights.get("semantic", default["semantic"]))
    except Exception:
        return default

    s = max(0.0, min(1.0, s))
    e = max(0.0, min(1.0, e))
    m = max(0.0, min(1.0, m))
    total = s + e + m
    if total <= 0:
        return default
    return {"skills": s / total, "experience": e / total, "semantic": m / total}


def _normalize_text_for_match(text):
    return re.sub(r"[^a-zA-Z0-9\\s]", " ", (text or "").lower())


def _match_terms(text, terms):
    base = _normalize_text_for_match(text)
    matched = set()
    for term in _normalize_list(terms):
        clean = _normalize_text_for_match(term).strip()
        if not clean:
            continue
        tokens = [t for t in clean.split() if t]
        if not tokens:
            continue
        pattern = r"(?<!\\w)" + r"\\s+".join([re.escape(t) for t in tokens]) + r"(?!\\w)"
        if re.search(pattern, base):
            matched.add(term.strip())
    return matched


def _extract_years_of_experience(text):
    t = (text or "").lower()
    candidates = []
    patterns = [
        r"(\\d+(?:\\.\\d+)?)\\s*\\+?\\s*(?:years|yrs)\\s*(?:of\\s*)?(?:experience|exp)",
        r"(\\d+(?:\\.\\d+)?)\\s*\\+?\\s*(?:years|yrs)\\b",
        r"(\\d+)\\s*[-–]\\s*(\\d+)\\s*(?:years|yrs)",
    ]
    for p in patterns:
        for m in re.finditer(p, t):
            try:
                if m.lastindex == 2:
                    candidates.append(float(m.group(2)))
                else:
                    candidates.append(float(m.group(1)))
            except Exception:
                continue
    if not candidates:
        return None
    years = max(candidates)
    return max(0.0, min(60.0, years))


def _experience_component(years, level):
    if years is None:
        return 0.5

    level = (level or "").lower().strip()
    if level == "intern":
        return 1.0 if years <= 1.0 else 0.7
    if level == "junior":
        return 1.0
    if level == "mid":
        return 1.0 if years >= 2.0 else max(0.0, years / 2.0)
    if level == "senior":
        return 1.0 if years >= 5.0 else max(0.0, years / 5.0)
    return 0.5


def _cosine(a, b):
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)

# ────────── MODERN API ENDPOINTS ──────────

@api_view(['POST'])
@parser_classes([MultiPartParser])
def optimize_resume_view(request):
    """
    Candidate Mode: Resume AI Optimizer.
    Handles personal resume optimization against a target JD.
    """
    try:
        user = _get_firebase_user(request)
        if not user:
            return Response({"error": "Unauthorized", "code": "AUTH_REQUIRED"}, status=401)
        
        # 🛡️ RBAC: Candidate Only
        if user.role != 'candidate':
            return Response({
                "error": "Recruiters cannot use the personal Optimizer. Use the Ranking Engine instead.",
                "code": "ACCESS_DENIED"
            }, status=403)
        
        # 📊 Limit Check (Pre-computation)
        can_proceed, err_msg, err_code = _check_usage_limit(user, count_to_add=1)
        if not can_proceed:
            return Response({
                "error": err_msg,
                "code": err_code,
                "upgrade": True
            }, status=403)

        # 📄 Get file
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file Provided"}, status=400)

        # 📖 Read text using our upgraded utility
        resume_text = _extract_text(file)
        
        # 🎯 Job description extraction (Dynamic vs. Default)
        job_profile = _parse_job_profile(request)
        user_jd = request.data.get("job_description", "").strip()

        if job_profile:
            job_desc = _build_query_text(job_profile)
            manual_job_skills = (
                _normalize_list(job_profile.get("required_skills"))
                + _normalize_list(job_profile.get("optional_skills"))
                + _normalize_list(job_profile.get("tools"))
            )
        elif user_jd:
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

        # Structured Scoring Override (HR-controlled weights)
        if job_profile:
            required = _normalize_list(job_profile.get("required_skills"))
            optional = _normalize_list(job_profile.get("optional_skills"))
            tools = _normalize_list(job_profile.get("tools"))

            matched_required = _match_terms(resume_text, required)
            matched_optional = _match_terms(resume_text, optional + tools)

            req_ratio = (len(matched_required) / max(1, len(required))) if required else 0.0
            opt_ratio = (len(matched_optional) / max(1, len(optional + tools))) if (optional or tools) else 0.0
            skills_component = (0.8 * req_ratio) + (0.2 * opt_ratio)

            years = _extract_years_of_experience(resume_text)
            exp_component = _experience_component(years, job_profile.get("experience_level"))

            query_vec = semantic_model.encode(job_desc).tolist()
            matched_all = sorted(list(set(list(matched_required) + list(matched_optional))))
            dense_context = f"Capabilities: {', '.join(matched_all)}. Profile context: {resume_text[:500]}"
            cand_vec = semantic_model.encode(dense_context).tolist()
            sem = _cosine(query_vec, cand_vec)
            semantic_component = max(0.0, min(1.0, (sem + 1.0) / 2.0))

            w = _normalize_weights(job_profile.get("weights"))
            final = (w["skills"] * skills_component) + (w["experience"] * exp_component) + (w["semantic"] * semantic_component)
            result["score"] = int(round(max(0.0, min(1.0, final)) * 100))
            result["skills_found"] = matched_all
            result["missing_skills"] = [s for s in required if s not in matched_required]

        # 🗄️ ORM Save: SaaS Data Lifecycle
        # 1. Atomic Usage Increment (Elite Logic)
        FirebaseUser.objects.filter(id=user.id).update(
            optimization_count=F('optimization_count') + 1
        )
        user.refresh_from_db()
        
        logger.info(f"[USAGE] Candidate {user.firebase_uid} performed Resume AI Optimization ({user.optimization_count}/20)")
        
        # 2. Save Analysis
        analysis_record = AnalysisRecord.objects.create(
            user=firebase_user,
            resume_name=file.name,
            job_description=job_desc,
            job_profile=job_profile,
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


@api_view(['POST'])
@parser_classes([MultiPartParser])
def bulk_analyze_view(request):
    """
    Recruiter Mode: Candidate Ranking Engine.
    Processes batches and performs structured ranking for HR.
    """
    try:
        user = _get_firebase_user(request)
        if not user:
            return Response({"error": "Unauthorized", "code": "AUTH_REQUIRED"}, status=401)
        
        # 🛡️ RBAC: Recruiter Only
        if user.role != 'recruiter':
            return Response({
                "error": "Candidates cannot use the Ranking Engine. Use the Resume Optimizer instead.",
                "code": "ACCESS_DENIED"
            }, status=403)
        
        # 🗄️ Validation Limits
        files = request.FILES.getlist('files')
        
        # 📊 Limit Check (Pre-computation with Overflow Protection)
        can_proceed, err_msg, err_code = _check_usage_limit(user, count_to_add=len(files))
        if not can_proceed:
            return Response({
                "error": err_msg,
                "code": err_code,
                "upgrade": True
            }, status=403)

        # 2. 🗄️ Validation Limits
        files = request.FILES.getlist('files')
        job_profile = _parse_job_profile(request)
        job_desc = request.data.get('job_description', '').strip()
        if job_profile:
            job_desc = _build_query_text(job_profile)
        
        if not files:
            return Response({"error": "No resumes uploaded."}, status=400)
        
        MAX_FILES = 150
        if len(files) > MAX_FILES:
            return Response({"error": f"Upload limit exceeded ({MAX_FILES} max for now)."}, status=400)
            
        if not job_desc:
            return Response({"error": "Job profile is required to calibrate scoring."}, status=400)

        # 3. 📝 Initialize Grouping Context
        job_session = JobSession.objects.create(
            user=user,
            job_description=job_desc,
            job_profile=job_profile
        )
        
        parsed_batch = []
        clean_texts = []

        required = _normalize_list(job_profile.get("required_skills")) if job_profile else []
        optional = _normalize_list(job_profile.get("optional_skills")) if job_profile else []
        tools = _normalize_list(job_profile.get("tools")) if job_profile else []
        weights = _normalize_weights(job_profile.get("weights")) if job_profile else None
        query_vec = semantic_model.encode(job_desc).tolist() if job_profile else None
        
        # 4. 🧠 Parsing & Extraction Loop
        for file in files:
            try:
                resume_text = _extract_text(file)

                manual_job_skills = (required + optional + tools) if job_profile else None
                result = analyze_resume(resume_text, job_desc, manual_job_skills=manual_job_skills)

                if job_profile:
                    matched_required = _match_terms(resume_text, required)
                    matched_optional = _match_terms(resume_text, optional + tools)
                    matched_all = sorted(list(set(list(matched_required) + list(matched_optional))))
                    missing_required = [s for s in required if s not in matched_required]

                    req_ratio = (len(matched_required) / max(1, len(required))) if required else 0.0
                    opt_ratio = (len(matched_optional) / max(1, len(optional + tools))) if (optional or tools) else 0.0
                    skills_component = (0.8 * req_ratio) + (0.2 * opt_ratio)

                    years = _extract_years_of_experience(resume_text)
                    exp_component = _experience_component(years, job_profile.get("experience_level"))
                else:
                    matched_all = result['skills_found']
                    missing_required = result['missing_skills']
                    skills_component = None
                    exp_component = None

                # Format our structured text for Embedding
                skills_str = ", ".join(matched_all)
                dense_context = f"Capabilities: {skills_str}. Profile context: {resume_text[:500]}"

                parsed_batch.append({
                    "file_name": file.name,
                    "score": result['score'],
                    "skills": matched_all,
                    "missing": missing_required,
                    "suggestions": result['suggestions'],
                    "_skills_component": skills_component,
                    "_exp_component": exp_component,
                })
                clean_texts.append(dense_context)
                
            except Exception as e:
                logger.warning(f"Failed to parse inner document {file.name}: {e}")
                continue
                
        if not parsed_batch:
            return Response({"error": "Failed to parse content from the uploaded documents."}, status=400)

        # 5. 🔥 BATCH ENCODE (The Key 3-5x Performance Speedup)
        # SentenceTransformers fundamentally processes array batches magnitudes faster than loops
        embeddings_matrix = semantic_model.encode(clean_texts).tolist()

        # Structured semantic + weighted scoring
        if job_profile:
            for i in range(len(parsed_batch)):
                sem = _cosine(query_vec, embeddings_matrix[i])
                semantic_component = max(0.0, min(1.0, (sem + 1.0) / 2.0))
                skills_component = float(parsed_batch[i].get("_skills_component") or 0.0)
                exp_component = float(parsed_batch[i].get("_exp_component") or 0.5)
                final = (
                    (weights["skills"] * skills_component)
                    + (weights["experience"] * exp_component)
                    + (weights["semantic"] * semantic_component)
                )
                parsed_batch[i]["score"] = int(round(max(0.0, min(1.0, final)) * 100))

        # 6. 🏆 Ranking & Data Commits
        # Sort candidates descending by literal score
        sorted_indices = sorted(range(len(parsed_batch)), key=lambda k: parsed_batch[k]['score'], reverse=True)
        
        db_records = []
        leaderboard_response = []
        
        # We index the parsed_batch correctly mapping back to the sorted array
        for rank_1_based, idx_mapping in enumerate(sorted_indices, start=1):
            candidate = parsed_batch[idx_mapping]
            vector = embeddings_matrix[idx_mapping]
            
            # Commit main record
            ar = AnalysisRecord.objects.create(
                user=user,
                job_session=job_session,
                resume_name=candidate['file_name'],
                job_description=job_desc,
                job_profile=job_profile,
                score=candidate['score'],
                rank=rank_1_based
            )
            
            # Commit dependencies
            ExtractedData.objects.create(
                analysis=ar,
                skills=candidate['skills'],
                missing_skills=candidate['missing'],
                suggestions=candidate['suggestions']
            )
            
            AnalysisEmbedding.objects.create(
                analysis=ar,
                vector=vector
            )
            
            # Front End Visual Payload mapping
            candidate_payload = {
                "id": ar.id,
                "name": candidate['file_name'],
                "score": candidate['score'],
                "rank": rank_1_based,
                "skills": candidate['skills'],
                "missing": candidate['missing']
            }
            
            leaderboard_response.append(candidate_payload)

        # 7. 🔥 Auto Shortlist Isolation
        auto_shortlist = [c for c in leaderboard_response[:10] if c['score'] >= 60]

        # 8. 📊 Atomic Usage Increment (Elite Logic)
        FirebaseUser.objects.filter(id=user.id).update(
            scan_count=F('scan_count') + len(leaderboard_response)
        )
        user.refresh_from_db()
        
        logger.info(f"[USAGE] Recruiter {user.firebase_uid} performed Candidate Ranking ({user.scan_count}/500)")

        return Response({
            "session_id": job_session.id,
            "total_candidates": len(leaderboard_response),
            "top_candidates": leaderboard_response,
            "auto_shortlist": auto_shortlist
        }, status=200)

    except Exception as e:
        logger.error(f"Bulk Analysis exception: {str(e)}")
        return Response({"error": str(e)}, status=400)


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
    Allows recruiters to search through their candidate pool using plain English.
    Computes query embeddings, strikes fast nearest-neighbors search via numpy,
    and returns dynamically ranked candidates utilizing Hybrid Scoring.
    """
    try:
        user = _get_firebase_user(request)
        if not user:
            return Response({"error": "Unauthorized", "code": "AUTH_REQUIRED"}, status=401)
            
        # 🛡️ RBAC: Recruiter Only
        if user.role != 'recruiter':
            return Response({
                "error": "AI Talent Search is only available for Recruiters.",
                "code": "ACCESS_DENIED"
            }, status=403)
            
        query_text = request.data.get('query', '').strip()
        if not query_text:
            return Response({"error": "Query required"}, status=400)
            
        # 1. Fetch Top 500 Embeddings
        embeddings = list(AnalysisEmbedding.objects.select_related('analysis', 'analysis__extracted_data')
                               .filter(analysis__user=user)
                               .exclude(vector__isnull=True)
                               .order_by('-id')[:500])
                               
        if not embeddings:
            return Response({"error": "No indexed candidates found in pipeline."}, status=404)
            
        # 2. Extract raw vector arrays
        stored_vectors = np.array([e.vector for e in embeddings])
        
        # 3. Compute Query Embedding & Similarity Matrix
        query_vector = np.array(semantic_model.encode(query_text)).reshape(1, -1)
        sim_scores = cosine_similarity(query_vector, stored_vectors)[0]
        
        # 4. Sort Top-5
        top_k = min(5, len(stored_vectors))
        top_indices = sim_scores.argsort()[-top_k:][::-1]
        
        # 5. Build Hybrid Result Matrix
        results = []
        for idx in top_indices:
            embedding_record = embeddings[idx]
            analysis_rec = embedding_record.analysis
            semantic_score = float(sim_scores[idx])
            
            db_score_normalized = (analysis_rec.score or 0) / 100.0
            raw_hybrid = (0.7 * semantic_score) + (0.3 * db_score_normalized)
            
            final_hybrid_percent = round(raw_hybrid * 100)
            semantic_percent = round(semantic_score * 100)
            
            extracted = getattr(analysis_rec, 'extracted_data', None)
            skills = extracted.skills if extracted else []
            
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
                "skills": skills[:5],
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
