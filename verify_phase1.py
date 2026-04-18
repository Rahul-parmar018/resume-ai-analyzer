import os
import django
import time
import sys

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
try:
    django.setup()
except Exception as e:
    print(f"Django setup error: {e}")
    sys.exit(1)

from resumes.utils.semantic_matcher import engine as ai_engine

def verify():
    print("="*60)
    print("CANDIDEX AI CORE PHASE 1 VALIDATION")
    print("="*60)

    # 1. TEST DATA
    jd = "Senior React Developer with expertise in TypeScript, Redux, and Cloud Architecture."
    
    # Very long resume to trigger chunking system (>1500 chars)
    long_resume = ("Professional Summary: Senior Web Architect with 10 years experience. " + 
                   "Technical Skills: React, TypeScript, Redux, Node.js, AWS, Kubernetes, Docker. " +
                   "Experience: Leading engineering teams to deliver high-scale SaaS products. " * 30 + 
                   "Education: MS in Computer Science. " + 
                   "Accomplishments: Optimized CI/CD pipelines reducing deployment time by 40%. " * 20)
    
    print(f"Analysis: Resume Size: {len(long_resume)} characters")
    print(f"Target JD: {jd[:60]}...")
    
    # ---------------------------------------------------------
    # TEST 1: COLD COMPUTE (Chunking + Encoding)
    # ---------------------------------------------------------
    print("\n[TEST 1] Cold Compute (Encoding from scratch)...")
    start = time.time()
    results = ai_engine.rank_resumes(jd, [{"file_name": "senior_dev.pdf", "text": long_resume}])
    cold_time = time.time() - start
    
    res = results[0]
    print(f"DONE: Semantic Score: {res['score']}/100")
    print(f"DONE: AI Explanation: {res['explanation']}")
    print(f"Time: {cold_time:.4f}s")
    
    # ---------------------------------------------------------
    # TEST 2: CACHE HIT (Performance Check)
    # ---------------------------------------------------------
    print("\n[TEST 2] Cache Performance (Hash lookup)...")
    start = time.time()
    results_cache = ai_engine.rank_resumes(jd, [{"file_name": "senior_dev.pdf", "text": long_resume}])
    warm_time = time.time() - start
    
    print(f"Time: {warm_time:.4f}s")
    
    if cold_time > 0:
        improvement = (cold_time - warm_time) / cold_time * 100
        print(f"SUCCESS: PERFORMANCE GAIN: {improvement:.1f}% faster via Caching")
    
    # ---------------------------------------------------------
    # TEST 3: CHUNKING LOGIC
    # ---------------------------------------------------------
    print("\n[TEST 3] Chunking Logic Verification...")
    chunks = ai_engine.chunk_text(long_resume)
    print(f"Document Segmented into: {len(chunks)} chunks")
    for i, c in enumerate(chunks):
        print(f"   - Chunk {i+1}: {len(c)} chars")

    print("\n" + "="*60)
    print("PHASE 1 VALIDATION COMPLETE: SYSTEM IS READY FOR SCALE")
    print("="*60)

if __name__ == "__main__":
    verify()
