import os
import sys
import json

# Setup Django path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "resumes"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
import django
django.setup()

from resumes.utils.evaluation.eval_engine import AIEvaluationEngine

def run_eval():
    print("Initializing Candidex AI Evaluation Engine...")
    engine = AIEvaluationEngine()
    
    print("Running evaluation suite...")
    report = engine.evaluate_all()
    
    print("\n==================================================")
    print("            AI EVALUATION SUMMARY REPORT          ")
    print("==================================================")
    print(f"Overall AI Score: {report['overall_score']}%")
    print(f"Resume Skill Match (F1-score): {report['metrics']['resume_skill_f1']:.2f}")
    print(f"RAG Retrieval Precision: {report['metrics']['rag_precision']:.2f}")
    print(f"Agent Intent Detection Accuracy: {report['metrics']['agent_intent_accuracy']:.2f}")
    print("\nStrengths:")
    for s in report["strengths"]:
        print(f"  [OK] {s}")
    print("Weaknesses:")
    for w in report["weaknesses"]:
        print(f"  [FAIL] {w}")
    print("==================================================")

    # Persist report
    with open("ai_eval_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print("Saved detailed report to 'ai_eval_report.json'.\n")

if __name__ == "__main__":
    run_eval()
