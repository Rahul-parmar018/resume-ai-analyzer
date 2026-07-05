import json
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from .gap_analysis import analyze_with_llm
from .career_intelligence import calculate_career_fit, generate_career_roadmap
from .market_intelligence import MarketIntelligenceEngine
from .rag_engine import LocalVectorStore
from .ml_intelligence import get_embedding
from .ollama_service import OllamaService

logger = logging.getLogger(__name__)

# ─── 1. TOOL INTERFACE FOR AGENT ───
class CareerAgentTool(ABC):
    """Base class for all tools accessible by the Career Agent."""
    
    @abstractmethod
    def get_name(self) -> str:
        pass

    @abstractmethod
    def get_description(self) -> str:
        pass

    @abstractmethod
    def execute(self, resume_text: str, args: dict) -> dict:
        pass


class ResumeAnalysisTool(CareerAgentTool):
    def get_name(self) -> str:
        return "Resume Analysis Tool"

    def get_description(self) -> str:
        return "Analyzes the resume structure, completeness, action verbs, and extracts core details."

    def execute(self, resume_text: str, args: dict) -> dict:
        return analyze_with_llm(resume_text, args.get("job_description", ""))


class CareerFitTool(CareerAgentTool):
    def get_name(self) -> str:
        return "Career Fit Tool"

    def get_description(self) -> str:
        return "Calculates compatibility matches across 10 core career profiles and returns top fits."

    def execute(self, resume_text: str, args: dict) -> dict:
        return {
            "career_matches": calculate_career_fit(resume_text)
        }


class MarketReadinessTool(CareerAgentTool):
    def get_name(self) -> str:
        return "Market Readiness Tool"

    def get_description(self) -> str:
        return "Evaluates competencies against real labor market demand, salary index, and trending skills."

    def execute(self, resume_text: str, args: dict) -> dict:
        engine = MarketIntelligenceEngine()
        role = args.get("role", "AI Engineer")
        country = args.get("country", "Global")
        return engine.analyze_resume_vs_market(resume_text, role, country)


class KnowledgeBaseTool(CareerAgentTool):
    def get_name(self) -> str:
        return "Knowledge Base Tool"

    def get_description(self) -> str:
        return "Retrieves matching chunks from trusted documents like ATS optimization guides or interview tips."

    def execute(self, resume_text: str, args: dict) -> dict:
        query = args.get("query", "ATS optimization")
        store = LocalVectorStore()
        query_vector = get_embedding(query)
        results = store.similarity_search(query_vector, top_k=2)
        return {
            "matched_documents": results
        }


class JobCopilotTool(CareerAgentTool):
    def get_name(self) -> str:
        return "Job Copilot Tool"

    def get_description(self) -> str:
        return "Compares resume against specific company job postings and outputs custom tailoring advice."

    def execute(self, resume_text: str, args: dict) -> dict:
        from .job_copilot import calculate_application_readiness, generate_tailoring_suggestions
        job_id = args.get("job_id", "job_stripe_backend")
        return {
            "readiness": calculate_application_readiness(resume_text, job_id),
            "tailoring": generate_tailoring_suggestions(resume_text, job_id)
        }


# ─── 2. AGENT ORCHESTRATOR ───
class CareerAgent:
    """Agentic AI Orchestrator that detects intent, selects tools, builds context, and routes queries."""
    
    def __init__(self):
        self.tools = {
            "resume": ResumeAnalysisTool(),
            "career": CareerFitTool(),
            "market": MarketReadinessTool(),
            "knowledge": KnowledgeBaseTool(),
            "job": JobCopilotTool()
        }
        self.service = OllamaService()

    def detect_intent(self, message: str) -> List[str]:
        """Classifies user intent and selects which tools to call."""
        msg_lower = message.lower()
        selected = []
        
        # 1. Job Copilot keywords
        if any(w in msg_lower for w in ["am i ready", "job match", "stripe", "openai", "apply", "hiring focus"]):
            selected.append("job")
        # 2. Knowledge Base keywords
        if any(w in msg_lower for w in ["guide", "how to write", "ats guidelines", "rules", "preparation", "materials", "documents"]):
            selected.append("knowledge")
        # 3. Market analysis keywords
        if any(w in msg_lower for w in ["market", "germany", "india", "canada", "demand", "salary", "hiring", "countries"]):
            selected.append("market")
        # 4. Career match keywords
        if any(w in msg_lower for w in ["role", "career", "become", "fit", "match", "transition", "engineer", "analyst"]):
            selected.append("career")
        # 5. Default to general analysis
        if not selected or any(w in msg_lower for w in ["resume", "score", "ats", "strengths", "weakness", "review"]):
            selected.append("resume")
            
        return selected

    def run(self, user_message: str, resume_text: str, session_context: Optional[dict] = None) -> dict:
        """Runs the orchestrator loops: detects intent, executes tools, and generates reasoned answers."""
        import time
        from .observability import AIObservabilityLogger
        
        start_time = time.time()
        fallback_triggered = False
        success = True

        if not session_context:
            session_context = {}

        # 1. Detect Intent
        intents = self.detect_intent(user_message)
        
        # Extract metadata from query if present
        country = "Global"
        for c in ["germany", "india", "canada", "usa", "uk"]:
            if c in user_message.lower():
                country = c.capitalize()
                
        role = "AI Engineer"
        for r in ["data scientist", "backend engineer", "devops engineer", "full stack developer", "cybersecurity engineer"]:
            if r in user_message.lower():
                role = r.title()

        job_id = "job_stripe_backend"
        if "openai" in user_message.lower() or "ai/ml" in user_message.lower():
            job_id = "job_openai_ml"

        # 2. Execute selected tools
        tool_outputs = {}
        for intent in intents:
            tool = self.tools.get(intent)
            if tool:
                args = {
                    "role": session_context.get("preferred_role", role),
                    "country": session_context.get("preferred_country", country),
                    "query": user_message,
                    "job_id": job_id
                }
                tool_outputs[tool.get_name()] = tool.execute(resume_text, args)

        # 3. Generate Agentic Answer using Nemotron-3
        prompt = f"""
You are Candidex AI's primary Career Agent. Answer the candidate's question based on their resume profile, session context, and pre-computed tool metrics, including trusted knowledge base document matches.

=== USER MESSAGE ===
"{user_message}"

=== CONVERSATION SESSION CONTEXT ===
{json.dumps(session_context, indent=2)}

=== EXECUTED TOOL OUTPUTS ===
{json.dumps(tool_outputs, indent=2)}

=== OBJECTIVE ===
Provide a highly personalized, structured answer addressing their question. 
Always include:
1. "agent_response": A detailed, professional, and friendly response.
2. "suggested_actions": A list of 3-4 clear, actionable next steps.
3. "sources_used": A list indicating which of the tool data was used.

Return ONLY valid JSON:
{{
  "agent_response": "Detailed text answering the user's question.",
  "suggested_actions": ["Action 1", "Action 2"],
  "sources_used": ["Resume Analysis", "Knowledge Base"]
}}
"""
        try:
            response = self.service.client.chat.completions.create(
                model=self.service.model,
                messages=[
                    {"role": "system", "content": "You are a professional Career Agent that output strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            data = json.loads(response.choices[0].message.content)
            if "offline" in data.get("agent_response", "").lower():
                fallback_triggered = True
        except Exception as e:
            success = False
            fallback_triggered = True
            logger.error(f"[CareerAgent] Nemotron query failed: {e}")
            data = {
                "agent_response": "I ran your profile details, but my LLM layer is currently offline. Based on local analysis, please verify your skills match the target market.",
                "suggested_actions": ["Review target job description", "Verify missing competencies"],
                "sources_used": list(tool_outputs.keys())
            }

        duration = (time.time() - start_time) * 1000
        AIObservabilityLogger.log_request("AI Career Agent", duration, success, fallback_triggered)
        return data
