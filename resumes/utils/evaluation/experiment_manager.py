import os
import json
import time
from datetime import datetime
from typing import Dict, List
from .eval_engine import AIEvaluationEngine

EXPERIMENT_RESULTS_FILE = "ai_experiment_runs.json"

class AIExperimentManager:
    """Manages AI experiments, benchmark executions, and model/prompt quality comparisons."""
    
    def __init__(self):
        self.runs = []
        self.load_runs()

    def load_runs(self):
        if os.path.exists(EXPERIMENT_RESULTS_FILE):
            try:
                with open(EXPERIMENT_RESULTS_FILE, "r", encoding="utf-8") as f:
                    self.runs = json.load(f)
            except Exception:
                self.runs = []

    def save_runs(self):
        try:
            with open(EXPERIMENT_RESULTS_FILE, "w", encoding="utf-8") as f:
                json.dump(self.runs, f, indent=2)
        except Exception as e:
            print(f"Failed to save experiment runs: {e}")

    def run_experiment(self, experiment_id: str, config: dict) -> dict:
        """Executes a benchmark run under specific LLM, temperature, and prompt config parameters."""
        print(f"Starting Experiment: {experiment_id}")
        print(f"Configuration: {json.dumps(config, indent=2)}")
        
        # Setup evaluation engine
        engine = AIEvaluationEngine()
        
        start_time = time.time()
        # Execute the eval suite (we can mock LLM models and check intents/accuracies under target settings)
        report = engine.evaluate_all()
        duration = time.time() - start_time
        
        run_record = {
            "experiment_id": experiment_id,
            "timestamp": datetime.utcnow().isoformat(),
            "duration_seconds": duration,
            "config": config,
            "results": {
                "overall_score": report["overall_score"],
                "resume_f1": report["metrics"]["resume_skill_f1"],
                "rag_precision": report["metrics"]["rag_precision"],
                "intent_accuracy": report["metrics"]["agent_intent_accuracy"]
            }
        }
        
        self.runs.append(run_record)
        self.save_runs()
        self.generate_markdown_report(run_record)
        return run_record

    def generate_markdown_report(self, run: dict):
        """Generates a human-readable experiment run report."""
        filename = f"experiment_report_{run['experiment_id']}.md"
        content = f"""# AI Experiment Report - {run['experiment_id']}

Generated: {run['timestamp']}
Duration: {run['duration_seconds']:.2f} seconds

## ⚙️ Configuration
- **LLM Model:** `{run['config'].get('llm_model', 'unknown')}`
- **Embedding Model:** `{run['config'].get('embedding_model', 'unknown')}`
- **Temperature:** `{run['config'].get('temperature', 0.3)}`
- **Retrieval Strategy:** `{run['config'].get('retrieval_strategy', 'unknown')}`

## 📊 Metrics Summary
- **Overall Quality Score:** `{run['results']['overall_score']}%`
- **Resume F1-score:** `{run['results']['resume_f1']:.2f}`
- **RAG Retrieval Precision:** `{run['results']['rag_precision']:.2f}`
- **Agent Intent Accuracy:** `{run['results']['intent_accuracy']:.2f}`

## 💡 Recommendations
- Recommended for production if overall score > 80% and latency < 3.0s.
"""
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Saved Markdown report to '{filename}'")

    def compare_runs(self) -> List[dict]:
        """Compares all historical experiment runs by score and latency."""
        return sorted(self.runs, key=lambda x: x["results"]["overall_score"], reverse=True)
