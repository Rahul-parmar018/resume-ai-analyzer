import io, re, hashlib, csv
from django.core.paginator import Paginator
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.forms.models import model_to_dict
import json
from .models import Requisition, Candidate, STATUS_CHOICES
from PyPDF2 import PdfReader
from docx import Document
import textstat

# --- helpers ---
def _hash_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def _extract_text(upload):
    name = (upload.name or "").lower()
    data = upload.read()
    try:
        if name.endswith(".pdf"):
            reader = PdfReader(io.BytesIO(data))
            return "\n".join((p.extract_text() or "") for p in reader.pages), data
        if name.endswith(".docx"):
            doc = Document(io.BytesIO(data))
            return "\n".join(p.text for p in doc.paragraphs), data
        return data.decode(errors="ignore"), data
    except Exception:
        try:
            return data.decode(errors="ignore"), data
        except Exception:
            return "", data

def parse_contacts(text):
    t = text
    tl = t.lower()
    email = (re.search(r"[A-Za-z0-9.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", t) or [None])[0]
    phone = (re.search(r"(\+?\d[\d\s\-]{7,}\d)", t) or [None])[0]
    linkedin = None
    m = re.search(r"(https?://(www\.)?linkedin\.com/[A-Za-z0-9/\-_.%]+)", t)
    if m: linkedin = m.group(1)
    # name (very rough): take first line with > 2 words before contact lines
    lines = [ln.strip() for ln in t.splitlines() if ln.strip()]
    name = ""
    for ln in lines[:8]:
        if email and email in ln: break
        if 'linkedin.com' in ln: break
        if len(ln.split()) >= 2 and len(ln) < 80:
            name = ln; break
    # years experience: count "X years" patterns
    years = 0
    ym = re.findall(r"(\b\d{1,2})\s+years?", tl)
    if ym:
        years = max([int(y) for y in ym if y.isdigit()] + [years])
    return name, email or "", phone or "", linkedin or "", years

def _tokenize(text):
    return re.findall(r"[A-Za-z+#.]+", text)

def _present_missing(tokens_lower, must, nice):
    present, missing = [], []
    for k in must:
        if k.lower() in tokens_lower: present.append(k)
        else: missing.append(k)
    present_n = []
    for k in nice:
        if k.lower() in tokens_lower: present_n.append(k)
    return present + present_n, missing

def _summary(text):
    # Take top bullet-like lines or sentences with numbers
    lines = [ln.strip(" •-*–\u2022\t ") for ln in text.splitlines()]
    picks = [ln for ln in lines if len(ln) > 30 and (re.search(r"\d+%|\d{4}|\$\d", ln) or ln.lower().startswith(("led","managed","built","created","improved")))]
    if not picks:
        # fallback: first meaningful lines
        picks = [ln for ln in lines if 30 < len(ln) < 200][:5]
    bullets = picks[:5]
    return "• " + "\n• ".join(bullets) if bullets else ""

def _readability(text):
    try:
        fre = textstat.flesch_reading_ease(text)
        return int(max(40, min(95, fre)))
    except Exception:
        return 70

def _structure_score(text):
    bullets = len(re.findall(r"(^[\-\•\*\u2022]\s)|•", text, flags=re.MULTILINE))
    base = 60 + min(25, bullets*2)
    return int(max(55, min(95, base)))

def _match_score(tokens_lower, years, req: Requisition):
    must = [m.strip() for m in req.must_have or [] if m.strip()]
    nice = [n.strip() for n in req.nice_to_have or [] if n.strip()]
    present_must = sum(1 for k in must if k.lower() in tokens_lower)
    present_nice = sum(1 for k in nice if k.lower() in tokens_lower)
    must_score = (present_must / max(1, len(must))) * 100 if must else 100
    nice_score = (present_nice / max(1, len(nice))) * 100 if nice else 100
    exp_bonus = 10 if years >= (req.min_exp or 0) else -10 if (req.min_exp or 0)>0 else 0
    match = round(0.70*must_score + 0.30*nice_score + exp_bonus)
    return max(0, min(100, match)), must, nice

# --- pages ---
def finder_list(request):
    qs = Requisition.objects.order_by('-created_at')
    return render(request, "finder_list.html", { "items": qs })

def finder_detail(request, req_id):
    req = get_object_or_404(Requisition, pk=req_id)
    return render(request, "finder_detail.html", { "req": req, "status_choices": STATUS_CHOICES })

# --- APIs ---
@require_http_methods(["POST"])
def api_requisition_create(request):
    data = json.loads(request.body.decode() or "{}")
    min_exp = int(data.get('min_exp') or 0)
    min_exp = max(0, min_exp)
    req = Requisition.objects.create(
        title = data.get('title',''),
        must_have = data.get('must_have',[]) or [],
        nice_to_have = data.get('nice_to_have',[]) or [],
        min_exp = min_exp,
        location = data.get('location',''),
        notes = data.get('notes',''),
        shortlist_threshold = int(data.get('shortlist_threshold') or 75),
    )
    return JsonResponse({ "id": req.id })

def api_requisition_get(request, req_id):
    if request.method == "GET":
        req = get_object_or_404(Requisition, pk=req_id)
        d = model_to_dict(req)
        return JsonResponse(d)
    if request.method == "PATCH":
        req = get_object_or_404(Requisition, pk=req_id)
        data = json.loads(request.body.decode() or "{}")
        for f in ['title','must_have','nice_to_have','location','notes','shortlist_threshold']:
            if f in data: setattr(req, f, data[f])
        if 'min_exp' in data:
            try:
                req.min_exp = max(0, int(data['min_exp']))
            except Exception:
                req.min_exp = 0
        req.save()
        return JsonResponse({ "ok": True })
    if request.method == "DELETE":
        get_object_or_404(Requisition, pk=req_id).delete()
        return JsonResponse({ "ok": True })
    return HttpResponseNotAllowed(["GET","PATCH","DELETE"])

@csrf_exempt
def api_upload_analyze(request, req_id):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    req = get_object_or_404(Requisition, pk=req_id)
    files = request.FILES.getlist('files')
    out = []
    for f in files:
        text, raw = _extract_text(f)
        fh = _hash_bytes(raw)
        # dup check
        existing = Candidate.objects.filter(requisition=req, file_hash=fh).first()
        if existing:
            out.append({ "id": existing.id, "dup": True })
            continue
        name, email, phone, linkedin, years = parse_contacts(text)
        tokens_lower = [t.lower() for t in _tokenize(text)]
        match, must, nice = _match_score(tokens_lower, years, req)
        present, missing = _present_missing(tokens_lower, must, nice)
        read = _readability(text)
        struct = _structure_score(text)
        # skills score ~ must/nice coverage
        skills = int(min(100, (len(present)/max(1, len(must)+len(nice)))*100)) if (must or nice) else 80
        ats = int(min(100, 60 + (len(text) > 800)*15 + (struct-55)))  # rough proxy
        total = int(round(0.25*ats + 0.25*match + 0.20*skills + 0.15*read + 0.15*struct))
        summ = _summary(text)

        cand = Candidate.objects.create(
            requisition=req,
            file=f,
            file_name=f.name,
            file_hash=fh,
            name=name, email=email, phone=phone, linkedin=linkedin,
            years_experience=years,
            summary=summ,
            insights="",
            match_score=match, total_score=total,
            ats_score=ats, skills_score=skills,
            readability_score=read, structure_score=struct,
            present_keywords=";".join(present),
            missing_keywords=";".join(missing),
            status="shortlisted" if match >= req.shortlist_threshold else "new",
        )
        out.append({ "id": cand.id })
    return JsonResponse({ "created": out })

def api_candidates_list(request, req_id):
    req = get_object_or_404(Requisition, pk=req_id)
    qs = Candidate.objects.filter(requisition=req)
    
    # Filters (only apply if parameter provided and not empty)
    min_match_raw = request.GET.get('min_match', '')
    if str(min_match_raw).strip() != '':
        try:
            min_match = int(min_match_raw)
            qs = qs.filter(match_score__gte=min_match)
        except ValueError:
            pass

    status = request.GET.get('status', '')
    if status and status.lower() != 'all':
        qs = qs.filter(status=status)

    # Pagination
    from django.core.paginator import Paginator
    page = int(request.GET.get('page') or 1)
    pg = Paginator(qs.order_by('-match_score','-total_score','-id'), 25)
    p = pg.get_page(page)

    rows = []
    for c in p.object_list:
        rows.append({
            "id": c.id,
            "file_name": c.file_name,
            "name": c.name, "email": c.email, "phone": c.phone,
            "linkedin": c.linkedin, "location": c.location,
            "years_experience": c.years_experience,
            "match_score": c.match_score, "total_score": c.total_score,
            "ats_score": c.ats_score, "skills_score": c.skills_score,
            "readability_score": c.readability_score, "structure_score": c.structure_score,
            "present": c.present_keywords, "missing": c.missing_keywords,
            "summary": c.summary, "status": c.status, "notes": c.notes,
            "file_url": c.file.url if c.file else "",
        })
    return JsonResponse({
        "results": rows,
        "page": p.number,
        "pages": pg.num_pages,
        "count": pg.count
    })

@require_http_methods(["PATCH","DELETE"])
def api_candidate_update(request, cand_id):
    c = get_object_or_404(Candidate, pk=cand_id)
    if request.method == "PATCH":
        data = json.loads(request.body.decode() or "{}")
        for f in ["status","notes","name","email","phone","linkedin","location"]:
            if f in data: setattr(c, f, data[f])
        c.save()
        return JsonResponse({ "ok": True })
    # DELETE
    c.delete()
    return JsonResponse({ "ok": True })

def api_export_csv(request, req_id):
    req = get_object_or_404(Requisition, pk=req_id)
    qs = Candidate.objects.filter(requisition=req)
    min_match = int(request.GET.get('min_match') or 0)
    if min_match: qs = qs.filter(match_score__gte=min_match)
    status = request.GET.get('status')
    if status: qs = qs.filter(status=status)
    resp = HttpResponse(content_type='text/csv; charset=utf-8')
    resp['Content-Disposition'] = f'attachment; filename="requisition_{req.id}_candidates.csv"'
    w = csv.writer(resp)
    headers = ["candidate_id","file_name","name","email","phone","linkedin","location",
               "years_experience","match_score","total_score","ats_score","skills_score",
               "readability_score","structure_score","keywords_present","keywords_missing",
               "status","notes"]
    w.writerow(headers)
    for c in qs:
        w.writerow([
            c.id, c.file_name, c.name, c.email, c.phone, c.linkedin, c.location,
            c.years_experience, c.match_score, c.total_score, c.ats_score, c.skills_score,
            c.readability_score, c.structure_score, c.present_keywords, c.missing_keywords,
            c.status, c.notes
        ])
    return resp

def finder_compare(request, req_id):
    # ids=1,2,3
    req = get_object_or_404(Requisition, pk=req_id)
    ids = [int(x) for x in (request.GET.get('ids') or "").split(",") if x.isdigit()]
    qs = Candidate.objects.filter(requisition=req, id__in=ids)
    out = []
    for c in qs:
        out.append({
            "id": c.id, "name": c.name, "match_score": c.match_score,
            "ats": c.ats_score, "skills": c.skills_score,
            "read": c.readability_score, "struct": c.structure_score,
            "years_experience": c.years_experience,
            "present": c.present_keywords, "missing": c.missing_keywords,
            "summary": c.summary, "file_url": c.file.url if c.file else ""
        })
    return JsonResponse({ "items": out })


def _percentile(values, p):
    if not values: return 0
    vals = sorted(int(v) for v in values)
    k = (len(vals)-1) * (p/100)
    f = int(k); c = min(f+1, len(vals)-1)
    if f == c: return vals[f]
    return int(round(vals[f] + (k-f)*(vals[c]-vals[f])))

def _tokens_from_text(text: str):
    return [t.lower() for t in re.findall(r"[A-Za-z0-9+#.]+", text or "")]

def _tokens_from_candidate(cand):
    # Try existing present keywords first (cheap), otherwise re-extract
    present = [x.strip().lower() for x in (cand.present_keywords or "").split(';') if x.strip()]
    if present:
        return set(present)
    # Fallback: read file and tokenize
    try:
        if cand.file:
            text, raw = _extract_text(cand.file)
            return set(_tokens_from_text(text))
    except Exception:
        pass
    return set() # no known tokens


def api_requisition_metrics(request, req_id):
    req = get_object_or_404(Requisition, pk=req_id)
    qs = Candidate.objects.filter(requisition=req)
    
    # basic counts
    total = int(qs.count())
    shortlisted = int(qs.filter(status='shortlisted').count())
    matches = [int(m or 0) for m in qs.values_list('match_score', flat=True)]
    avg_match = int(round(sum(matches)/len(matches))) if matches else 0
    p90 = _percentile(matches, 90)
    
    # histogram bins (0-100 step 10): 0-9, 10-19, ..., 90-100
    bins = [0]*11
    for m in matches:
        idx = min(10, int(m)//10)
        bins[idx] += 1
    
    # must-have coverage
    must = [m.strip() for m in (req.must_have or []) if m.strip()]
    cover = []
    if must:
        for k in must:
            present = int(qs.filter(present_keywords__icontains=k).count())
            missing = max(0, total - present)
            cover.append({ "key": k, "present": present, "missing": missing })
    
    # missing keyword ranking (top 15)
    from collections import Counter
    counter = Counter()
    for s in qs.values_list('missing_keywords', flat=True):
        if not s: continue
        for k in [x.strip() for x in s.split(';') if x.strip()]:
            counter[k]+=1
    missing_rank = [{"key":k, "count":int(c)} for k,c in counter.most_common(15)]
    
    # scatter points
    points = []
    for c in qs.only('id','years_experience','match_score','ats_score','status'):
        points.append({
            "id": c.id,
            "x": int(c.years_experience or 0),
            "y": int(c.match_score or 0),
            "r": max(4, int((c.ats_score or 60)/12)),   # bubble ~ ATS
            "status": c.status or 'new'
        })
    
    return JsonResponse({
        "kpi": { "total": total, "shortlisted": shortlisted, "avg_match": avg_match, "p90": p90 },
        "histogram": { "bins": bins, "labels": ["0-9","10-19","20-29","30-39","40-49","50-59","60-69","70-79","80-89","90-99","100"] },
        "coverage": cover,
        "missing_rank": missing_rank,
        "scatter": points,
        "threshold": req.shortlist_threshold,
    })


@csrf_exempt
def api_requisition_rescore(request, req_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    req = get_object_or_404(Requisition, pk=req_id)
    must = [m.strip() for m in (req.must_have or []) if m.strip()]
    nice = [n.strip() for n in (req.nice_to_have or []) if n.strip()]

    updated = 0
    to_short = 0
    to_new = 0
    qs = Candidate.objects.filter(requisition=req)
    for c in qs:
        tokens = _tokens_from_candidate(c)

        present_must = [k for k in must if k.lower() in tokens]
        missing_must = [k for k in must if k.lower() not in tokens]
        present_nice = [k for k in nice if k.lower() in tokens]
        # Update present/missing fields
        present_all = present_must + present_nice
        c.present_keywords = ";".join(present_all)
        c.missing_keywords = ";".join(missing_must)

        # Match score
        must_score = (len(present_must)/max(1, len(must)))*100 if must else 100
        nice_score = (len(present_nice)/max(1, len(nice)))*100 if nice else 100
        exp_bonus = 10 if (c.years_experience or 0) >= (req.min_exp or 0) else (-10 if (req.min_exp or 0) > 0 else 0)
        match = int(round(0.70*must_score + 0.30*nice_score + exp_bonus))
        match = max(0, min(100, match))
        c.match_score = match

        # Skills score from coverage
        total_expected = (len(must) + len(nice)) or 1
        c.skills_score = int(min(100, (len(present_all)/total_expected)*100))

        # Total: reuse ATS/Readability/Structure as-is
        c.total_score = int(round(
            0.25*(c.ats_score or 0) + 0.25*match + 0.20*(c.skills_score or 0) +
            0.15*(c.readability_score or 0) + 0.15*(c.structure_score or 0)
        ))

        # Status (preserve hired/rejected)
        if c.status not in ('hired','rejected'):
            if match >= (req.shortlist_threshold or 75):
                c.status = 'shortlisted'; to_short += 1
            else:
                c.status = 'new'; to_new += 1

        c.save(); updated += 1

    return JsonResponse({ "updated": updated, "shortlisted": to_short, "new": to_new })


@csrf_exempt
def api_requisition_reset(request, req_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    req = get_object_or_404(Requisition, pk=req_id)
    try:
        payload = json.loads(request.body.decode() or "{}")
    except Exception:
        payload = {}
    delete_files = bool(payload.get('delete_files', True))

    qs = Candidate.objects.filter(requisition=req)
    deleted = 0
    files_deleted = 0
    for c in qs:
        try:
            if delete_files and c.file:
                # delete file from storage
                c.file.delete(save=False)
                files_deleted += 1
        except Exception:
            pass
        c.delete()
        deleted += 1

    return JsonResponse({ "deleted": deleted, "files_deleted": files_deleted })
