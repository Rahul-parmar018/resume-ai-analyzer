from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import FirebaseUser

class ResumeAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = FirebaseUser.objects.create(
            firebase_uid="test-firebase-uid",
            email="test@candidex.com",
            role="candidate",
            role_onboarding_done=False
        )

    def test_get_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("user_profile_api")
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["email"], "test@candidex.com")
        self.assertEqual(response.data["role"], "candidate")

    def test_get_profile_unauthenticated(self):
        url = reverse("user_profile_api")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401) # DRF returns 401 for unauthenticated requests

    def test_update_role_valid(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("update_role_api")
        response = self.client.post(url, {"role": "recruiter"}, format="json")
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["role"], "recruiter")
        self.assertTrue(response.data["role_onboarding_done"])
        
        # Verify db state
        self.user.refresh_from_db()
        self.assertEqual(self.user.role, "recruiter")
        self.assertTrue(self.user.role_onboarding_done)

    def test_update_role_invalid(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("update_role_api")
        response = self.client.post(url, {"role": "hacker_role"}, format="json")
        
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.data)


class MLIntelligenceTests(TestCase):
    def test_skill_normalization(self):
        from .utils.ml_intelligence import normalize_skill
        self.assertEqual(normalize_skill("aws"), "amazon web services")
        self.assertEqual(normalize_skill("reactjs"), "react")
        self.assertEqual(normalize_skill("unknown_tech"), "unknown_tech")

    def test_embedding_cache(self):
        from .utils.ml_intelligence import EmbeddingCache
        import numpy as np
        
        cache = EmbeddingCache()
        cache.clear()
        
        test_text = "Experienced Python developer"
        test_vector = np.array([0.1, 0.2, 0.3])
        
        self.assertIsNone(cache.get(test_text))
        
        cache.set(test_text, test_vector)
        cached_val = cache.get(test_text)
        self.assertTrue(np.array_equal(cached_val, test_vector))

    def test_cosine_similarity(self):
        from .utils.ml_intelligence import calculate_cosine_similarity
        import numpy as np
        
        v1 = np.array([1.0, 0.0])
        v2 = np.array([1.0, 0.0])
        self.assertAlmostEqual(calculate_cosine_similarity(v1, v2), 1.0)
        
        v3 = np.array([0.0, 1.0])
        self.assertAlmostEqual(calculate_cosine_similarity(v1, v3), 0.0)

    def test_skill_gap_ranking(self):
        from .utils.ml_intelligence import rank_missing_skills
        
        missing = ["FastAPI", "Terraform", "Django"]
        jd_text = "We are seeking a FastAPI backend developer with strong python experience"
        
        ranked = rank_missing_skills(missing, jd_text)
        self.assertIn("FastAPI", ranked["Critical"])
        self.assertIn("Terraform", ranked["Medium"])


class CareerIntelligenceTests(TestCase):
    def test_career_fit_analysis(self):
        from .utils.career_intelligence import calculate_career_fit
        resume_text = "Experienced Backend Engineer with Python, Django, PostgreSQL, Docker experience"
        
        matches = calculate_career_fit(resume_text)
        self.assertEqual(len(matches), 5) # Returns top 5 career paths
        # Confirm fit fields exist
        self.assertIn("career_title", matches[0])
        self.assertIn("fit_score", matches[0])

    def test_career_roadmap_generation(self):
        from .utils.career_intelligence import generate_career_roadmap
        resume_text = "React Javascript developer"
        
        roadmap = generate_career_roadmap(resume_text, "Full Stack Developer")
        self.assertEqual(roadmap["selected_career"], "Full Stack Developer")
        self.assertTrue(len(roadmap["recommended_projects"]) > 0)
        self.assertIn("coaching_insights", roadmap)


class MarketIntelligenceTests(TestCase):
    def test_provider_mock(self):
        from .utils.market_intelligence import MockJobProvider
        provider = MockJobProvider()
        
        data = provider.fetch_job_market_data("AI Engineer", "Germany", "Mid")
        self.assertEqual(data["requested_role"], "AI Engineer")
        self.assertEqual(data["target_country"], "Germany")
        self.assertTrue(len(data["top_skills"]) > 0)

    def test_market_scoring(self):
        from .utils.market_intelligence import MarketIntelligenceEngine
        engine = MarketIntelligenceEngine()
        
        resume_text = "Experienced AI Engineer with Python, LLMs, PyTorch, and Docker skills"
        analysis = engine.analyze_resume_vs_market(resume_text, "AI Engineer", "Germany", "Mid")
        
        self.assertTrue(analysis["market_readiness_score"] > 0)
        self.assertIn("aligned_skills", analysis["local_market_stats"])
        self.assertIn("coaching_explanation", analysis)


class CareerAgentTests(TestCase):
    def test_intent_detection(self):
        from .utils.career_agent import CareerAgent
        agent = CareerAgent()
        
        # Test market intent keywords
        intents_market = agent.detect_intent("What is the salary for DevOps in Germany?")
        self.assertIn("market", intents_market)
        
        # Test career intent keywords
        intents_career = agent.detect_intent("Can I become a Backend Engineer?")
        self.assertIn("career", intents_career)
        
        # Test general query defaults to resume analysis
        intents_default = agent.detect_intent("Check my resume score")
        self.assertIn("resume", intents_default)

    def test_agent_run_execution(self):
        from .utils.career_agent import CareerAgent
        agent = CareerAgent()
        
        resume_text = "Experienced Backend Developer with Python and Django experience"
        response = agent.run("Am I a good match for a Backend role?", resume_text)
        
        self.assertIn("agent_response", response)
        self.assertTrue(len(response["suggested_actions"]) > 0)
        self.assertTrue(len(response["sources_used"]) > 0)


class RAGEngineTests(TestCase):
    def test_chunking_sliding_window(self):
        from .utils.rag_engine import DocumentProcessor
        proc = DocumentProcessor()
        
        text = "This is a very simple sample text to verify that the chunking sliding window mechanism operates correctly."
        chunks = proc.chunk_text(text, chunk_size=5, overlap=1)
        self.assertTrue(len(chunks) > 1)

    def test_vector_store_retrieval(self):
        from .utils.rag_engine import LocalVectorStore
        store = LocalVectorStore()
        
        # Index document mock
        store.add_documents([{
            "text": "AWS and cloud system guidelines specify using IAM roles for access.",
            "metadata": {"title": "aws_guide.md", "category": "Guide"}
        }])
        
        from .utils.ml_intelligence import get_embedding
        query_vec = get_embedding("cloud security")
        results = store.similarity_search(query_vec, top_k=1)
        
        self.assertTrue(len(results) > 0)
        self.assertIn("aws_guide", results[0]["metadata"]["title"])

    def test_agent_rag_intent(self):
        from .utils.career_agent import CareerAgent
        agent = CareerAgent()
        
        intents = agent.detect_intent("Where can I find resume writing guidelines?")
        self.assertIn("knowledge", intents)


class AIEvaluationTests(TestCase):
    def test_evaluation_engine_metrics(self):
        from .utils.evaluation.eval_engine import AIEvaluationEngine
        engine = AIEvaluationEngine()
        
        report = engine.evaluate_all()
        self.assertIn("overall_score", report)
        self.assertIn("metrics", report)
        self.assertIn("resume_skill_f1", report["metrics"])
        self.assertIn("rag_precision", report["metrics"])
        self.assertIn("agent_intent_accuracy", report["metrics"])


class AIOobservabilityTests(TestCase):
    def test_request_logging_metrics(self):
        from .utils.observability import AIObservabilityLogger, get_ai_performance_metrics
        import os
        
        LOG_FILE = "ai_observability_logs.jsonl"
        if os.path.exists(LOG_FILE):
            os.remove(LOG_FILE)
            
        AIObservabilityLogger.log_request("Test Tool", 120.5, True, False)
        AIObservabilityLogger.log_request("Test Tool 2", 80.0, True, True)
        
        metrics = get_ai_performance_metrics()
        self.assertEqual(metrics["total_requests"], 2)
        self.assertEqual(metrics["average_response_time_ms"], 100.25)
        self.assertEqual(metrics["success_rate"], 1.0)
        self.assertEqual(metrics["fallback_rate"], 0.5)

    def test_feedback_logging(self):
        from .utils.observability import AIObservabilityLogger
        import os
        
        FEEDBACK_FILE = "ai_feedback_logs.jsonl"
        if os.path.exists(FEEDBACK_FILE):
            os.remove(FEEDBACK_FILE)
            
        AIObservabilityLogger.log_feedback("msg_123", "thumbs_up", "Great insights!")
        self.assertTrue(os.path.exists(FEEDBACK_FILE))


class JobCopilotTests(TestCase):
    def test_readiness_calculation(self):
        from .utils.job_copilot import calculate_application_readiness
        resume_text = "Experienced developer with Python, PyTorch and Transformers experience"
        
        # Test OpenAI ML target
        res = calculate_application_readiness(resume_text, "job_openai_ml")
        self.assertEqual(res["company"], "OpenAI")
        self.assertTrue(res["application_readiness_score"] > 0)
        self.assertIn("Python", res["aligned_skills"])

    def test_tailoring_suggestions(self):
        from .utils.job_copilot import generate_tailoring_suggestions
        resume_text = "Python developer"
        
        suggestions = generate_tailoring_suggestions(resume_text, "job_stripe_backend")
        self.assertTrue(len(suggestions) > 0)
        self.assertEqual(suggestions[0]["type"], "Keyword Insertion")

    def test_agent_job_intent(self):
        from .utils.career_agent import CareerAgent
        agent = CareerAgent()
        
        intents = agent.detect_intent("am I ready to apply at Stripe?")
        self.assertIn("job", intents)








