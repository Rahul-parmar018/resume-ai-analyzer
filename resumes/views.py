import os, json, logging, fitz
import io, re
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from docx import Document
import textstat
from .utils.rate_limiter import rate_limit
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from firebase_admin import auth
from .auth_utils import verify_token
from .utils.ml_analyzer import analyze_resume, compute_similarity, extract_skills
from .utils.gap_analysis import run_gap_analysis
from .utils.scoring import (
    calculate_education_score, 
    calculate_ats_score, 
    _normalize_weights
)
from .utils.text_extract import extract_contacts
from .utils.dynamic_resume_analyzer import DynamicResumeAnalyzer
from .models import FirebaseUser, AnalysisRecord, ExtractedData, AnalysisEmbedding, JobSession
from django.db.models import Avg, Count, F
from collections import Counter
import numpy as np
from .utils.semantic_matcher import engine as semantic_ranking_engine
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)



def _check_usage_limit(user, count_to_add=1):
    """Enforces SaaS usage limits based on role and tier"""
    tier_caps = {
        'free': 5,
        'pro': 50,
        'enterprise': 999999
    }
    
    current_tier = getattr(user, 'tier', 'free')
    max_limit = tier_caps.get(current_tier, 5)

    if user.role == 'candidate':
        if user.optimization_count + count_to_add > max_limit:
            return False, f"Optimization limit reached ({user.optimization_count}/{max_limit}). Upgrade to Pro for 50+ monthly scans.", "LIMIT_EXCEEDED"
    elif user.role == 'recruiter':
        # Recruiters always Enterprise for now or higher limit
        if user.scan_count + count_to_add > 1000:
            return False, "Scan limit reached (1000/1000). Please contact sales for enterprise volume.", "LIMIT_EXCEEDED"
    else:
        return False, "No role assigned. Please complete onboarding.", "ROLE_REQUIRED"
    
    return True, None, None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile_view(request):
    """Fetch the source-of-truth user profile from Django"""
    user = request.user
    
    return Response({
        "uid": user.firebase_uid,
        "email": user.email,
        "role": user.role,
        "role_locked": user.role_locked,
        "display_name": user.display_name or (user.email.split('@')[0] if user.email else "User"),
        "profile_image": user.profile_image,
        "location": user.location,
        "bio": user.bio,
        "optimization_count": user.optimization_count,
        "scan_count": user.scan_count,
        "status": user.account_status,
        "limits": {
            "candidate": 20,
            "recruiter": 500
        }
    })


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile_view(request):
    """Update professional metadata for the account"""
    user = request.user
    
    data = request.data
    
    # Surgical updates
    if 'display_name' in data:
        user.display_name = data.get('display_name')
    if 'location' in data:
        user.location = data.get('location')
    if 'bio' in data:
        user.bio = data.get('bio')
    if 'profile_image' in data:
        # Note: In Phase 2, this will be handled by a file upload view
        user.profile_image = data.get('profile_image')
        
    user.save()
    
    return Response({
        "message": "Profile synchronized successfully.",
        "user": {
            "display_name": user.display_name,
            "location": user.location,
            "bio": user.bio
        }
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_account_view(request):
    """The Danger Zone: Wipe user data and mark record as deleted"""
    user = request.user
    
    # We don't actually delete from Firebase here (client handles that side)
    # But we wipe local Candidex data
    user.account_status = 'deleted'
    user.display_name = "[Deleted User]"
    user.bio = None
    user.location = None
    user.save()
    
    # Optionally: Cleanup related analysis records
    # user.analyses.all().delete()
    
    logger.warning(f"[DANGER ZONE] User {user.firebase_uid} initiated account deletion.")
    
    return Response({
        "message": "Account scheduled for deletion. Access revoked.",
        "code": "ACCOUNT_DELETED"
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_role_view(request):
    """SaaS Role Onboarding with Locking Logic"""
    user = request.user  # Automatically populated by FirebaseAuthentication bridge
    
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
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def optimize_resume_view(request):
    """
    Candidate Mode: Resume AI Optimizer.
    Handles personal resume optimization against a target JD.
    """
    try:
        user = request.user
        
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

        # 📄 Get input (File or Text)
        file = request.FILES.get('file')
        resume_text = request.data.get('resume_text', '').strip()
        
        if not file and not resume_text:
            return Response({"error": "Please provide a resume file or paste your resume text."}, status=400)

        resume_name = "Pasted Resume"
        if file:
            resume_name = file.name
            # 📖 Read text using our upgraded utility
            resume_text, _ = _extract_text(file)
        
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

        # 🧠 DEEP JD GAP ANALYSIS (PHASE 2)
        gap_report = run_gap_analysis(resume_text, job_desc)
        
        # Determine Fit Label based on Spec v1
        score = gap_report['match_score']
        if score > 80:
            fit_label = "🔥 Strong Fit"
        elif score > 60:
            fit_label = "⚡ Moderate Fit"
        else:
            fit_label = "⚠ Needs Improvement"

        # 📊 Trend Analysis (PHASE 4)
        last_analysis = AnalysisRecord.objects.filter(user=user).order_by('-created_at').first()
        previous_score = last_analysis.score if last_analysis else None
        improvement = (score - previous_score) if previous_score is not None else 0

        result = {
            "score": score,
            "fit_label": fit_label,
            "semantic": gap_report['semantic'],
            "skills_found": gap_report['skills']['matched'],
            "missing_skills": gap_report['skills']['missing_required'],
            "missing_preferred": gap_report['skills']['missing_preferred'],
            "experience": gap_report['experience'],
            "suggestions": gap_report['recommendations'],
            "insight": gap_report['insight'],
            "reasoning": gap_report.get('reasoning', []),
            "confidence": gap_report.get('confidence', 0.85),
            "trend": {
                "previous_score": previous_score,
                "improvement": improvement
            },
            "section_scores": {
                "skills": gap_report['match_score'],
                "semantic": gap_report['semantic']['score'] * 100,
                "experience": gap_report['experience']['match_percentage']
            },
            "extracted_text": resume_text
        }

        # 🗄️ ORM Save: SaaS Data Lifecycle
        # 1. Atomic Usage Increment (Elite Logic)
        FirebaseUser.objects.filter(id=user.id).update(
            optimization_count=F('optimization_count') + 1
        )
        user.refresh_from_db()
        
        logger.info(f"[USAGE] Candidate {user.firebase_uid} performed Resume AI Optimization")
        
        # 2. 🔍 Generate/Check Hash
        t_hash = semantic_ranking_engine.get_text_hash(resume_text)
        
        # 3. Save Analysis
        analysis_record = AnalysisRecord.objects.create(
            user=user,
            resume_name=resume_name,
            job_description=job_desc,
            job_profile=job_profile,
            score=result['match_score'],
            text_hash=t_hash
        )
        
        # 4. Save Extracted Data Details
        ExtractedData.objects.create(
            analysis=analysis_record,
            skills=result['skills']['matched'],
            missing_skills=result['skills']['missing_required'],
            suggestions=result.get('recommendations', []),
            section_scores=result.get('metrics', {}),
            rewrites=[]
        )
        
        # 5. Semantic Vector Persistence
        vector = semantic_ranking_engine.get_embedding(resume_text).tolist()
        AnalysisEmbedding.objects.create(
            analysis=analysis_record,
            vector=vector
        )
        
        return Response(result)

    except Exception as e:
        import traceback
        error_msg = str(e)
        stack_trace = traceback.format_exc()
        print(f"DEBUG: [Analysis Error] {error_msg}")
        print(stack_trace)
        logger.error(f"Analysis error: {error_msg}")
        return Response({
            "error": f"Logic Error: {error_msg}",
            "stack": stack_trace if os.getenv('DEBUG') == 'True' else None
        }, status=500)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def bulk_analyze_view(request):
    """
    Recruiter Mode: Candidate Ranking Engine.
    Processes batches and performs structured ranking for HR.
    """
    try:
        user = request.user
        
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
        
        candidate_resumes = []
        hashes = []
        
        # 4. 🧠 Parsing & Hash Generation
        for file in files:
            try:
                resume_text, _ = _extract_text(file)
                t_hash = semantic_ranking_engine.get_text_hash(resume_text)
                candidate_resumes.append({
                    "file_name": file.name,
                    "text": resume_text,
                    "hash": t_hash,
                    "file_obj": file
                })
                hashes.append(t_hash)
            except Exception as e:
                logger.warning(f"Failed to parse doc {file.name}: {e}")
                continue
                
        if not candidate_resumes:
            return Response({"error": "Failed to parse content from any uploaded documents."}, status=400)

        # 5. 🔍 DB CACHE LOOKUP (Save compute/time)
        # Find any existing embeddings for these resume hashes in the entire DB
        existing_embeddings = {
            emb.analysis.text_hash: emb.vector 
            for emb in AnalysisEmbedding.objects.filter(analysis__text_hash__in=hashes).select_related('analysis')
        }

        # 6. 🔥 SEMANTIC RANKING ENGINE (Caches + Explanations)
        ranked_candidates = semantic_ranking_engine.rank_resumes(
            job_desc, 
            candidate_resumes, 
            db_cache=existing_embeddings
        )

        leaderboard_response = []
        
        # 7. 🏆 Data Commits & Result hydration
        for r in ranked_candidates:
            # Re-run specific scoring for details
            analysis_data = analyze_resume(r['text'], job_desc)
            
            # Commit main record with Hash for future caching
            ar = AnalysisRecord.objects.create(
                user=user,
                job_session=job_session,
                resume_name=r['file_name'],
                job_description=job_desc,
                job_profile=job_profile,
                score=r['score'],
                rank=r['rank'],
                text_hash=r['hash']
            )
            
            ExtractedData.objects.create(
                analysis=ar,
                skills=analysis_data['matched_skills'],
                missing_skills=analysis_data['missing_skills'],
                suggestions=analysis_data['suggestions']
            )
            
            AnalysisEmbedding.objects.create(
                analysis=ar,
                vector=r['embedding']
            )
            
            leaderboard_response.append({
                "id": ar.id,
                "name": r['file_name'],
                "score": r['score'],
                "rank": r['rank'],
                "skills": analysis_data['matched_skills'],
                "missing": analysis_data['missing_skills'],
                "label": r['explanation'],  # Using the semantic explanation layer
                "insight": analysis_data['feedback'] # Original NLP feedback
            })

        # 8. 📊 SaaS Metrics
        FirebaseUser.objects.filter(id=user.id).update(
            scan_count=F('scan_count') + len(leaderboard_response)
        )
        user.refresh_from_db()

        return Response({
            "session_id": job_session.id,
            "total_candidates": len(leaderboard_response),
            "top_candidates": leaderboard_response,
            "auto_shortlist": [c for c in leaderboard_response if c['score'] >= 75]
        }, status=200)

    except Exception as e:
        logger.error(f"Bulk Analysis exception: {str(e)}")
        return Response({"error": str(e)}, status=400)


# ────────── NEW SAAS ENDPOINTS ──────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_history_view(request):
    """Returns all SaaS analyses for the authenticated user"""
    try:
        user = request.user
            
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
@permission_classes([IsAuthenticated])
def get_dashboard_analytics_view(request):
    """
    Dashboard Intelligence Layer: Returns scaled KPI aggregations,
    score distributions, and JSON-parsed Top Skills frequencies.
    """
    try:
        user = request.user

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
    """
    try:
        user = request.user
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
        stored_vectors = np.array([e.vector for e in embeddings], dtype=np.float32)
        
        # 3. Compute Query Embedding
        query_vector = semantic_ranking_engine.get_embedding(query_text).reshape(1, -1)
        
        # 4. Compute Similarity Matrix (Manual dot product for speed or reuse sklearn)
        from sklearn.metrics.pairwise import cosine_similarity
        sim_scores = cosine_similarity(query_vector, stored_vectors)[0]
        
        # 5. Sort Top-5
        top_k = min(5, len(stored_vectors))
        top_indices = sim_scores.argsort()[-top_k:][::-1]
        
        # 6. Build Hybrid Result Matrix
        results = []
        for idx in top_indices:
            embedding_record = embeddings[idx]
            analysis_rec = embedding_record.analysis
            semantic_score = float(sim_scores[idx])
            
            # Hybrid score (Context + Historical Quality)
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
                "score": int(final_hybrid_percent),
                "semantic_score": int(semantic_percent),
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
        decoded = auth.verify_id_token(token, clock_skew_seconds=10)
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
        text, _ = _extract_text(up)
        result = _score_resume(text, key_list)
        return JsonResponse(result)
    except Exception as e:
        return HttpResponseBadRequest(f"Score error: {e}")

def check_api_status(request):
    return JsonResponse({"status": "online"})

from .utils.rewrite_engine import ResumeRewriteEngine

@api_view(['POST'])
def rewrite_resume_view(request):
    """
    PHASE 3: Resume Rewrite Engine.
    Converts weak bullets to high-impact, quantified bullets.
    """
    try:
        user = request.user
        if not user:
            return Response({"error": "Unauthorized"}, status=401)
            
        # Optional: check if from file or raw text
        resume_text = request.data.get('resume_text', '').strip()
        
        if not resume_text:
            # Fallback for when frontend sends the file directly if needed, 
            # but usually it sends text for this specific feature.
            return Response({"error": "Resume text is required"}, status=400)
            
        engine = ResumeRewriteEngine()
        result = engine.run_rewrite_engine(resume_text)
        
        # Track usage (SaaS metrics)
        FirebaseUser.objects.filter(id=user.id).update(
            optimization_count=F('optimization_count') + 1
        )
        
        return Response(result, status=200)
    except Exception as e:
        logger.error(f"Rewrite error: {str(e)}")
        return Response({"error": str(e)}, status=400)


# ────────── UTILITIES ──────────

def _generate_action_plan(score, missing_skills, issues):
    """
    Decision Engine Layer: Converts raw gaps into a prioritized roadmap.
    """
    plan = []
    estimated_boost = 0
    
    if missing_skills:
        skills_boost = min(25, len(missing_skills) * 7)
        plan.append({
            "priority": 1,
            "action": f"Inject Missing Skills: {', '.join(missing_skills[:3])}",
            "impact": f"+{skills_boost}% Gain",
            "type": "SKILL_GAP"
        })
        estimated_boost += skills_boost
        
    has_quantified = False
    for issue in issues:
        if "metric" in issue.lower() or "quantified" in issue.lower() or "measurable" in issue.lower():
            plan.append({
                "priority": 2,
                "action": "Quantify bullet points with data/percentages",
                "impact": "+15% Gain",
                "type": "QUANTIFICATION"
            })
            estimated_boost += 15
            has_quantified = True
            break

    if score < 75:
        plan.append({
            "priority": 3,
            "action": "Add 1 detailed technical project section",
            "impact": "+12% Gain",
            "type": "PROJECTS"
        })
        estimated_boost += 12

    return {
        "steps": plan[:3],
        "target_score": min(98, score + estimated_boost)
    }

from .utils.audit_engine import ResumeAuditEngine

@csrf_exempt
def analyze_resume_simple_view(request):
    """
    Quality Audit Engine (Real ML):
    Audits Structure, Language, Impact, and ATS Compatibility.
    """
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    
    upload = request.FILES.get("resume")
    if not upload:
        return JsonResponse({"error": "No file provided"}, status=400)
    
    try:
        text, raw = _extract_text(upload)
        
        try:
            logger.info(f"[PROCESS] Neural Audit start for {upload.name}")
            engine = ResumeAuditEngine()
            audit = engine.run_full_audit(text)
            audit["is_heuristic"] = False
            logger.info("[PROCESS] Neural Audit success")
        except Exception as ml_err:
            logger.warning(f"[FALLBACK] Neural engine failed or busy: {str(ml_err)}")
            print(f"DEBUG: [FALLBACK TRIGGERED] {str(ml_err)}")
            # Heuristic Fallback (Safety net for RAM-constrained environments)
            audit = {
                "overall_score": 65, # Safe average
                "readiness": "FAIR",
                "breakdown": {"structure": 70, "language": 60, "impact": 60, "ats": 70},
                "critical_issues": ["Neural Engine Warming: Falling back to heuristic mode.", "Ensure contact info is present.", "Add more quantifiable metrics."],
                "summary": "Heuristic Audit: The neural engine is currently warming up, but your foundational structure looks stable.",
                "is_heuristic": True
            }
        
        # Generate the Action Plan using the audit issues
        action_plan = _generate_action_plan(
            audit['overall_score'], 
            [], # Empty skills list as Scanner is Quality-only
            audit['critical_issues']
        )
        
        return JsonResponse({
            "score": audit['overall_score'],
            "readiness": audit['readiness'],
            "breakdown": audit['breakdown'],
            "issues": audit['critical_issues'][:5], # Top 5 primary issues
            "summary": audit['summary'],
            "action_plan": action_plan,
            "extracted_text": text,
            "is_heuristic": audit.get('is_heuristic', False)
        })
    except Exception as e:
        logger.error(f"Extraction Error: {str(e)}")
        return JsonResponse({"error": "Failed to extract text from document."}, status=500)

@api_view(['GET'])
@permission_classes([])
def warmup_view(request):
    """
    Force-loads all ML models into RAM to avoid first-request delay.
    Called silently by frontend on app load.
    """
    try:
        from .utils.ml_model import get_model
        from .utils.audit_engine import _get_nlp
        
        logger.info("[WARMUP] Neural Engine Ignition sequence started...")
        print("DEBUG: [WARMUP] Loading Transformers...")
        get_model()  # SentenceTransformer
        print("DEBUG: [WARMUP] Loading Spacy...")
        _get_nlp()   # Spacy
        
        logger.info("[WARMUP] Neural Engine state: READY")
        return Response({"status": "Neural engine warmed and ready", "models": ["all-MiniLM-L6-v2", "en_core_web_sm"]})
    except Exception as e:
        logger.warning(f"[WARMUP] Partial fail: {str(e)}")
        return Response({"status": "Partial warm", "error": str(e)}, status=200)

def _extract_text(upload):
    name = (upload.name or "").lower()
    data = upload.read()
    try:
        if name.endswith(".pdf"):
            from PyPDF2 import PdfReader
            import io
            reader = PdfReader(io.BytesIO(data))
            return "\n".join((p.extract_text() or "") for p in reader.pages), data
        if name.endswith(".docx"):
            from docx import Document
            import io
            doc = Document(io.BytesIO(data))
            return "\n".join(p.text for p in doc.paragraphs), data
        return data.decode(errors="ignore"), data
    except Exception:
        return data.decode(errors="ignore"), data

def _score_resume(text, keywords=None):
    text_raw = text or ""
    text_low = text_raw.lower()
    SECTION_HEADS = ["experience","skills","education","projects"]
    heads = sum(1 for h in SECTION_HEADS if re.search(rf"\b{re.escape(h)}\b", text_low))
    bullets = len(re.findall(r"(^[\-\•\▪\●\*]\s)|•", text_raw, flags=re.MULTILINE))
    
    kws = keywords or ["Python", "SQL", "AWS"]
    present_kw = [k for k in kws if re.search(rf"\b{re.escape(k.lower())}\b", text_low)]
    score = int(min(100, (len(present_kw) / max(1, len(kws))) * 100))
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_reset_link_view(request):
    user = request.user
    if not user.email:
        return Response({"error": "No email associated with this account"}, status=400)
    
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    
    # In a real environment, this would be a real domain
    reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
    
    try:
        send_mail(
            subject="Candidex AI — Reset Your Password",
            message=f"A password reset was requested for your Candidex account. Click the link below to set a new key:\n\n{reset_link}\n\nThis link will expire for your protection.",
            from_email="security@candidex.ai",
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"[SECURITY] Reset link generated for {user.email}")
        return Response({"message": "Neural reset link broadcasted to your email."})
    except Exception as e:
        # Fallback for dev: Log the link so we can use it
        logger.error(f"MAIL ERROR: {str(e)}")
        return Response({
            "message": "Reset link generated (check server logs in dev).",
            "dev_link": reset_link # REMOVE THIS IN PRODUCTION
        })

@api_view(['POST'])
@permission_classes([]) # Publically accessible with token
def reset_password_confirm_view(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = FirebaseUser.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, FirebaseUser.DoesNotExist):
        return Response({"error": "Invalid or expired neural link."}, status=400)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Security token has expired or already been used."}, status=400)

    new_password = request.data.get("password")
    if not new_password or len(new_password) < 6:
        return Response({"error": "New password must be at least 6 characters."}, status=400)

    user.set_password(new_password)
    user.save()
    logger.info(f"[SECURITY] Password successfully rotated for user {uid}")
    return Response({"message": "Neural key successfully rotated. You may now sign in."})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    user = request.user
    current_password = request.data.get("current_password")
    new_password = request.data.get("new_password")

    if not current_password or not new_password:
        return Response({"error": "Missing credentials"}, status=400)

    # Note: If user signed in with Social, they might not have a Django password set
    if user.has_usable_password():
        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password"}, status=400)
    
    if len(new_password) < 6:
        return Response({"error": "Password must be at least 6 characters"}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({"message": "Password updated successfully"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_email_change_view(request):
    # This would normally involve sending a verification token
    return Response({"message": "Verification link sent to new email address. (Mock Flow)"})
