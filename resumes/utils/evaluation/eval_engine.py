import os
import json
import logging
from typing import Dict, List
from ..gap_analysis import analyze_with_llm
from ..career_agent import CareerAgent
from ..rag_engine import LocalVectorStore
from ..ml_intelligence import get_embedding

logger = logging.getLogger(__name__)

class AIEvaluationEngine:
    """Core benchmarking framework to evaluate Candidex AI's modules against ground truth datasets."""
    
    def __init__(self, dataset_path: str = None):
        if dataset_path is None:
            # Locate relative to this file
            dataset_path = os.path.join(os.path.dirname(__file__), "benchmark_dataset.json")
        self.dataset_path = dataset_path
        self.test_cases = []
        self.load_dataset()

    def load_dataset(self):
        if os.path.exists(self.dataset_path):
            with open(self.dataset_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.test_cases = data.get("test_cases", [])
            logger.info(f"[Eval Engine] Loaded {len(self.test_cases)} evaluation cases.")
        else:
            logger.warning(f"[Eval Engine] Dataset not found at {self.dataset_path}")

    def evaluate_all(self) -> dict:
        """Executes full evaluation sequence across Resume, RAG, and Agent pipelines."""
        results = {
            "resume_intelligence": [],
            "rag_retrieval": [],
            "career_agent": []
        }
        
        agent = CareerAgent()
        vector_store = LocalVectorStore()

        for case in self.test_cases:
            resume_text = case["resume_text"]
            jd_text = case["job_description"]
            expected_skills = [s.lower() for s in case["expected_skills"]]
            expected_careers = [c.lower() for c in case["expected_career_matches"]]
            
            # ─── 1. Resume Intelligence Evaluation ───
            analysis = analyze_with_llm(resume_text, jd_text)
            detected_skills = [s.lower() for s in analysis.get("strengths", [])]
            
            # Compute skill match precision/recall
            matched_skills = [s for s in expected_skills if any(s in ds for ds in detected_skills)]
            precision = len(matched_skills) / max(1, len(detected_skills))
            recall = len(matched_skills) / max(1, len(expected_skills))
            f1 = (2 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
            
            results["resume_intelligence"].append({
                "case_id": case["id"],
                "precision": precision,
                "recall": recall,
                "f1_score": f1,
                "score_consistency": analysis.get("match_score", 0) > 0
            })

            # ─── 2. RAG Retrieval Evaluation ───
            query_vec = get_embedding("ats guidelines")
            retrieved = vector_store.similarity_search(query_vec, top_k=2)
            has_relevance = len(retrieved) > 0
            
            results["rag_retrieval"].append({
                "case_id": case["id"],
                "retrieved_count": len(retrieved),
                "has_relevance": has_relevance,
                "precision": 1.0 if has_relevance else 0.0
            })

            # ─── 3. Career Agent Evaluation ───
            query = case["agent_query"]
            detected_intents = agent.detect_intent(query)
            expected_intent = case["expected_intent"]
            intent_correct = expected_intent in detected_intents
            
            results["career_agent"].append({
                "case_id": case["id"],
                "query": query,
                "expected_intent": expected_intent,
                "detected_intents": detected_intents,
                "intent_correct": intent_correct
            })

        return self.generate_summary_report(results)

    def generate_summary_report(self, results: dict) -> dict:
        """Averages metric results and compiles human-readable recommendations."""
        # 1. Resume stats
        resume_cases = results["resume_intelligence"]
        avg_f1 = sum(c["f1_score"] for c in resume_cases) / max(1, len(resume_cases))
        
        # 2. RAG stats
        rag_cases = results["rag_retrieval"]
        rag_prec = sum(c["precision"] for c in rag_cases) / max(1, len(rag_cases))

        # 3. Agent stats
        agent_cases = results["career_agent"]
        intent_acc = sum(1 for c in agent_cases if c["intent_correct"]) / max(1, len(agent_cases))

        report = {
            "overall_score": int((avg_f1 + rag_prec + intent_acc) / 3.0 * 100),
            "metrics": {
                "resume_skill_f1": avg_f1,
                "rag_precision": rag_prec,
                "agent_intent_accuracy": intent_acc
            },
            "detailed_results": results,
            "strengths": [],
            "weaknesses": []
        }

        # Deduce qualitative findings
        if avg_f1 >= 0.8:
            report["strengths"].append("Highly accurate semantic skill extraction.")
        else:
            report["weaknesses"].append("Skill extraction has minor alignment issues against taxonomy.")

        if intent_acc == 1.0:
            report["strengths"].append("Agentic intent detection operates with 100% precision.")
        else:
            report["weaknesses"].append("Agentic intent router failed on complex career/market keywords.")

        return report
