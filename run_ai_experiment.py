import os
import sys

# Setup Django path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "resumes"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
import django
django.setup()

from resumes.utils.evaluation.experiment_manager import AIExperimentManager

def main():
    manager = AIExperimentManager()
    
    # 1. Run Baseline Nemotron Experiment
    config_baseline = {
        "llm_model": "nemotron-3-super:cloud",
        "embedding_model": "all-MiniLM-L6-v2",
        "temperature": 0.3,
        "retrieval_strategy": "top_k_similarity"
    }
    manager.run_experiment("baseline_nemotron", config_baseline)
    
    # 2. Run Experimental GPT Configuration
    config_gpt = {
        "llm_model": "gpt-4o-mini",
        "embedding_model": "text-embedding-3-small",
        "temperature": 0.5,
        "retrieval_strategy": "hybrid_search"
    }
    manager.run_experiment("experimental_gpt", config_gpt)

    # 3. Output comparison table
    comparisons = manager.compare_runs()
    print("\n==================================================")
    print("           HISTORICAL RUNS COMPARISON             ")
    print("==================================================")
    for run in comparisons:
        print(f"ID: {run['experiment_id']} | Score: {run['results']['overall_score']}% | LLM: {run['config']['llm_model']}")
    print("==================================================\n")

if __name__ == "__main__":
    main()
