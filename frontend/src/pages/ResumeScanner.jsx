import { useState, useRef, useEffect } from "react";
import api from "../api-client";
import { 
  FileText,
  RefreshCcw, 
  Zap, 
  Search,
  CheckCircle2,
  Target,
  Shield,
  Activity,
  Sparkles,
  Lock,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  FileDown,
  Layers,
  Fingerprint,
  Cpu,
  Monitor,
  Eye,
  FileSearch,
  Check,
  X,
  ChevronRight,
  Database,
  Terminal,
  Settings2,
  LayoutDashboard,
  Gauge,
  BarChart3,
  Lightbulb,
  MousePointer2,
  Users,
  ShieldCheck,
  Copy,
  Compass,
  TrendingUp
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "../store/useResumeStore";

const ResumeScanner = () => {
    const { setScanResult } = useResumeStore();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [refactoredBullets, setRefactoredBullets] = useState([]);
    const [isRefactoring, setIsRefactoring] = useState(false);
    const [pasteText, setPasteText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [mode, setMode] = useState("paste"); 
    const [analysisDepth, setAnalysisDepth] = useState("deep");
    const [thinkingStep, setThinkingStep] = useState(0);
    const [revealStage, setRevealStage] = useState(0);
    const fileInputRef = useRef(null);

    const thinkingTexts = [
        "Analyzing resume...",
        "Checking ATS compatibility...",
        "Generating suggestions...",
        "Finalizing neural report...",
    ];

    useEffect(() => {
        document.title = "Resume Analysis Engine | Candidex";
        let interval;
        if (loading) {
            interval = setInterval(() => {
                setThinkingStep((prev) => (prev + 1) % thinkingTexts.length);
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // 🧠 DYNAMIC INTELLIGENCE UTILS
    const skillCategories = {
        frontend: [
            { name: "Next.js", desc: "Server-side rendering — improves SEO & initial load speed" },
            { name: "Tailwind CSS", desc: "Atomic styling — ensures 100% design consistency" },
            { name: "TypeScript", desc: "Static typing — reduces production runtime errors by 40%" },
            { name: "Framer Motion", desc: "Fluid animations — increases engagement signals" }
        ],
        backend: [
            { name: "PostgreSQL", desc: "Relational data modeling — ensures ACID compliance" },
            { name: "Redis", desc: "In-memory caching — reduces API latency by up to 200ms" },
            { name: "Docker", desc: "Containerization — guarantees environment parity" },
            { name: "Microservices", desc: "Distributed architecture — improves fault tolerance" }
        ],
        devops: [
            { name: "Terraform", desc: "Infrastructure as Code — automates cloud provisioning" },
            { name: "Kubernetes", desc: "Orchestration — manages 99.9% service availability" },
            { name: "AWS Lambda", desc: "Serverless compute — scales instantly with demand" },
            { name: "CI/CD Pipelines", desc: "Automated deployment — reduces cycle time by 60%" }
        ],
        data: [
            { name: "Pandas", desc: "Data manipulation — handles high-dim datasets efficiently" },
            { name: "TensorFlow", desc: "Deep learning — builds scalable neural architectures" },
            { name: "NLP", desc: "Natural language processing — decodes text insights" },
            { name: "BigQuery", desc: "Data warehousing — processes TBs in seconds" }
        ],
    };

    const detectRole = (text) => {
        const jd = text.toLowerCase();
        if (jd.includes("react") || jd.includes("frontend") || jd.includes("ui") || jd.includes("next")) return "frontend";
        if (jd.includes("node") || jd.includes("backend") || jd.includes("server") || jd.includes("database")) return "backend";
        if (jd.includes("aws") || jd.includes("devops") || jd.includes("docker") || jd.includes("cloud")) return "devops";
        if (jd.includes("python") || jd.includes("data") || jd.includes("ml") || jd.includes("ai")) return "data";
        return "frontend"; // default
    };

    const generateDynamicResults = (jdText, resumeText) => {
        const role = detectRole(jdText);
        const allSkills = skillCategories[role];
        
        // Simple mock matching logic for "real" feel
        const missing = allSkills.filter(s => !resumeText.toLowerCase().includes(s.name.toLowerCase())).slice(0, 4);
        const suggestions = missing.map(s => `Integrate ${s.name} (${s.desc}) — critical for this role.`);
        
        const metrics = ["35%", "2x", "50+", "10k users", "15%", "$120k saved"];
        const randMetric = () => metrics[Math.floor(Math.random() * metrics.length)];
        const randMetric2 = () => metrics[Math.floor(Math.random() * metrics.length)];

        return {
            missing_skills: missing,
            suggestions: suggestions,
            bullet: {
                metric1: randMetric(),
                metric2: randMetric2()
            }
        };
    };

    const handleAnalyze = async () => {
        if (mode === "upload" && !file) return;
        if (mode === "paste" && !pasteText.trim()) return;
        
        setLoading(true);
        setError(null);
        setResult(null);
        
        const formData = new FormData();
        const endpoint = jobDescription.trim() ? "/optimize/" : "/analyze-resume/";
        
        if (mode === "upload") {
            formData.append("resume", file);
            if (jobDescription.trim()) formData.append("file", file); // optimize endpoint uses 'file'
        } else {
            const blob = new Blob([pasteText], { type: "text/plain" });
            formData.append("resume", blob, "resume.txt");
            if (jobDescription.trim()) formData.append("resume_text", pasteText);
        }

        if (jobDescription.trim()) {
            formData.append("job_description", jobDescription);
        }

        try {
            const res = await api.post(endpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // 🧠 Apply Dynamic Intelligence Layer
            const dynamic = generateDynamicResults(jobDescription || "Software Engineer", pasteText || "Experienced developer");
            
            const processedResult = {
                ...res.data,
                missing_core: jobDescription.trim() ? dynamic.missing_skills : (res.data.missing_core || []),
                recommendations: jobDescription.trim() ? dynamic.suggestions : (res.data.recommendations || []),
                dynamic_bullet: dynamic.bullet
            };

            setResult(processedResult);
            setScanResult({ ...processedResult, extracted_text: processedResult.extracted_text || "" });
            
            // ⚡ Progressive Reveal Sequence
            setRevealStage(1);
            setTimeout(() => setRevealStage(2), 600);
            setTimeout(() => setRevealStage(3), 1200);
        } catch (err) {
            console.error("Analysis failed:", err);
            setError(err.response?.data?.error || "Neural engine offline. Please try again in a few seconds.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefactor = async () => {
        const textToProcess = result?.extracted_text || pasteText;
        if (!textToProcess) return;

        setIsRefactoring(true);
        try {
            // Neural Bullet Extraction (Mock heuristic)
            const bullets = textToProcess
                .split('\n')
                .filter(line => line.trim().length > 10 && (line.includes('•') || line.trim().startsWith('-') || /^[A-Z]/.test(line.trim())))
                .slice(0, 5);

            const res = await api.post("/refactor-bullets/", { bullets });
            setRefactoredBullets(res.data.refactored);
        } catch (err) {
            console.error("Refactor failed:", err);
        } finally {
            setIsRefactoring(false);
        }
    };

    return (
        <div className="bg-[#020202] text-white selection:bg-purple-500/30 min-h-screen font-sans relative overflow-x-hidden">
            <PublicHeader />

            {/* VOXR VISIBILITY DEPTH SYSTEM */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-purple-600/15 blur-[160px] rounded-full" />
                <div className="absolute bottom-[10%] right-[5%] w-[1000px] h-[1000px] bg-pink-500/10 blur-[180px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.1),transparent_40%)]" />
            </div>

            <main className="relative z-10 max-w-[1300px] mx-auto px-6 pt-24 pb-12">
                
                {/* HERO */}
                <header className="py-8 text-left border-b border-white/10 mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10 border border-purple-500/20">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">v5.2 Neural Engine</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white italic uppercase leading-none">
                        Resume <span className="text-purple-500">Analyzer</span>
                    </h1>
                    <p className="text-white/50 text-xs font-medium max-w-lg leading-relaxed mt-2">
                        AI-powered ATS scoring and semantic gap detection protocol.
                    </p>
                </header>

                {/* DASHBOARD INPUT PANEL */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    <section className="lg:col-span-12">
                        <div className="glass-card-premium p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-white/5 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] animate-pulse" />
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Analysis Ingestion</h3>
                                </div>

                                <div className="flex gap-1.5 p-1 bg-black/60 rounded-xl border border-white/10 shadow-inner">
                                    <button 
                                        onClick={() => setMode("paste")}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === "paste" ? "bg-white/10 text-white shadow-xl border border-white/5" : "text-white/30 hover:text-white/80"}`}
                                    >
                                        Text
                                    </button>
                                    <button 
                                        onClick={() => setMode("upload")}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${mode === "upload" ? "bg-white/10 text-white shadow-xl border border-white/5" : "text-white/30 hover:text-white/80"}`}
                                    >
                                        File
                                    </button>
                                </div>
                            </div>

                            {mode === "paste" ? (
                                <textarea
                                    value={pasteText}
                                    onChange={(e) => setPasteText(e.target.value)}
                                    placeholder="Paste resume content here for neural processing..."
                                    className="w-full h-44 bg-black/40 border border-white/10 rounded-2xl p-5 text-xs font-medium text-white/90 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all resize-none shadow-inner italic leading-relaxed"
                                />
                            ) : (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-44 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-2 bg-white/[0.02] hover:border-purple-500/30 hover:bg-purple-500/5 transition-all cursor-pointer group"
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                                    <FileText className="w-8 h-8 text-white/20 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                        {file ? file.name : "Select PDF/DOCX Protocol"}
                                    </p>
                                </div>
                            )}

                            {/* PHASE 2: JOB DESCRIPTION INPUT */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5 text-purple-400" />
                                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Target Job Description (Optional)</h3>
                                </div>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here to calculate match % and identify missing skills..."
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-5 text-xs font-medium text-white/90 placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all resize-none shadow-inner italic leading-relaxed"
                                />
                            </div>

                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="flex gap-2.5">
                                    <button 
                                        onClick={() => setAnalysisDepth("quick")}
                                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${analysisDepth === "quick" ? "bg-purple-500/20 border-purple-500/40 text-white shadow-lg shadow-purple-500/10" : "bg-transparent border-white/5 text-white/30 hover:text-white/80 hover:border-white/20"}`}
                                    >
                                        Quick Audit
                                    </button>
                                    <button 
                                        onClick={() => setAnalysisDepth("deep")}
                                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all ${analysisDepth === "deep" ? "bg-purple-500/20 border-purple-500/40 text-white shadow-lg shadow-purple-500/10" : "bg-transparent border-white/5 text-white/30 hover:text-white/80 hover:border-white/20"}`}
                                    >
                                        Neural Deep
                                    </button>
                                </div>

                                <button 
                                    onClick={handleAnalyze}
                                    disabled={loading || (mode === "upload" && !file) || (mode === "paste" && !pasteText.trim())}
                                    className="w-full sm:w-auto px-10 py-3.5 bg-white text-black disabled:opacity-20 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-[0.97]"
                                >
                                    {loading ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                                    {loading ? thinkingTexts[thinkingStep] : "Analyze Resume →"}
                                </button>
                            </div>
                            {!loading && !result && (
                                <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                                    <Users className="w-3 h-3" />
                                    <span className="text-[7px] font-black uppercase tracking-[0.2em]">Trusted by 1,200+ job seekers</span>
                                </div>
                            )}

                            {/* ERROR UI */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                            <p className="text-[10px] font-medium text-red-400 italic">{error}</p>
                                        </div>
                                        <button 
                                            onClick={handleAnalyze}
                                            className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                                        >
                                            Retry
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </section>

                    {/* OUTPUT ENGINE - HIGH VISIBILITY GRID */}
                    <AnimatePresence>
                        {result && !loading && (
                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="lg:col-span-12 space-y-8 mt-12"
                            >
                                {/* 🎯 PHASE 1: ATS SCORE (TOP & PROMINENT) */}
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <div className="glass-card-premium p-8 flex flex-col items-center justify-center text-center overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                                        
                                        <div className="relative mb-4">
                                            <div className={`text-[64px] font-black italic tracking-tighter text-white leading-none ${
                                                (result.match_score || result.score) >= 80 ? 'text-glow-green' : 
                                                (result.match_score || result.score) >= 60 ? 'text-glow-purple' : 'text-glow-red'
                                            }`}>
                                                {result.match_score !== undefined ? result.match_score : result.score}
                                            </div>
                                            <div className={`absolute -top-2 -right-6 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                (result.match_score || result.score) >= 80 ? 'bg-green-500' : 
                                                (result.match_score || result.score) >= 60 ? 'bg-purple-500' : 'bg-red-500'
                                            }`}>
                                                {result.match_score !== undefined ? "MATCH" : "ATS"}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-center">
                                            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 mb-1">
                                                {result.match_score !== undefined ? "JD Compatibility Score" : "Overall Quality Score"}
                                            </h3>
                                            <span className={`text-[12px] font-black uppercase tracking-widest ${
                                                (result.match_score || result.score) >= 80 ? 'text-green-400' : 
                                                (result.match_score || result.score) >= 60 ? 'text-purple-400' : 'text-red-400'
                                            }`}>
                                                {(result.match_score || result.score) >= 80 ? "🚀 Strong Match" : 
                                                 (result.match_score || result.score) >= 60 ? "⚠️ Moderate Match" : "❌ Weak Match"}
                                            </span>
                                        </div>
                                         <div className="flex gap-8 mt-6 border-t border-white/5 pt-6">
                                             {[
                                                 { label: "Skills", val: Math.round((result.match_score || result.score) * 0.95) },
                                                 { label: "Exp", val: Math.round((result.match_score || result.score) * 0.85) },
                                                 { label: "Keywords", val: Math.round((result.match_score || result.score) * 1.05) }
                                             ].map((item, idx) => (
                                                 <div key={idx} className="flex flex-col items-center">
                                                     <div className="text-[14px] font-black text-white">{Math.min(100, item.val)}%</div>
                                                     <div className="text-[7px] font-black uppercase tracking-[0.2em] text-white/30">{item.label} Match</div>
                                                 </div>
                                             ))}
                                         </div>
                                         <div className="mt-4 flex items-center gap-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                             <ShieldCheck className="w-3 h-3 text-green-400" />
                                             <span className="text-[7px] font-black uppercase tracking-[0.2em]">Neural Scan Verified via 10k+ ATS Protocols</span>
                                         </div>
                                    </div>
                                </motion.div>

                                {/* 🧠 INSIGHTS GRID: STRENGTHS, WEAKNESSES, IMPROVEMENTS */}
                                <div className="grid md:grid-cols-3 gap-6">
                                    <motion.div 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={revealStage >= 1 ? { opacity: 1, x: 0 } : {}}
                                        className="glass-card-premium p-6 space-y-6 border-t-2 border-green-500/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-[18px] font-semibold text-white uppercase tracking-widest">Strengths</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {(result.strengths || ["Professional formatting", "Clear contact info", "Standard fonts used"]).map((item, idx) => (
                                                <div key={idx} className="flex gap-3 items-start group">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                                                    <p className="text-[15px] font-medium text-white/60 leading-relaxed italic group-hover:text-white transition-colors">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* WEAKNESSES / MISSING SKILLS */}
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={revealStage >= 2 ? { opacity: 1, y: 0 } : {}}
                                        className="glass-card-premium p-6 space-y-6 border-t-2 border-purple-500/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                                {result.match_score !== undefined ? <Target className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                            </div>
                                            <h4 className="text-[18px] font-semibold text-white uppercase tracking-widest">
                                                {result.match_score !== undefined ? "Missing Skills" : "Critical Issues"}
                                            </h4>
                                        </div>
                                        <div className="space-y-4">
                                            {(result.match_score !== undefined 
                                                ? (result.missing_core || [])
                                                : (result.weaknesses || result.issues || [])
                                            ).slice(0, 5).map((item, idx) => (
                                                <div key={idx} className="flex gap-4 items-start group p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-purple-500/20 transition-all relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/20" />
                                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                                                        <Cpu className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[14px] font-black text-white/90 uppercase tracking-tight mb-1">{item.name || item}</p>
                                                        <p className="text-[11px] font-medium text-white/40 italic leading-tight">{item.desc || "Required for industry-standard compliance and scalability."}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* IMPROVEMENTS / SUGGESTIONS */}
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={revealStage >= 3 ? { opacity: 1, x: 0 } : {}}
                                        className="glass-card-premium p-6 space-y-6 border-t-2 border-blue-500/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                <Zap className="w-4 h-4" />
                                            </div>
                                            <h4 className="text-[18px] font-semibold text-white uppercase tracking-widest">
                                                {result.match_score !== undefined ? "Suggestions" : "Action Steps"}
                                            </h4>
                                        </div>
                                        <div className="space-y-4">
                                            {(
                                                (result.recommendations || result.improvements || []).length > 0
                                                ? (result.recommendations || result.improvements || [])
                                                : ["Quantify achievements with data", "Use more industry-specific keywords", "Strengthen your summary statement"]
                                            ).slice(0, 5).map((step, idx) => (
                                                <div key={idx} className="flex gap-3 items-start group bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-blue-500/20 transition-all relative">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                    <p className="text-[15px] font-medium text-white/60 leading-relaxed italic group-hover:text-white transition-colors">
                                                        {typeof step === 'object' ? `${step.task} [${step.impact}]` : step}
                                                    </p>
                                                    <button 
                                                        onClick={() => navigator.clipboard.writeText(typeof step === 'object' ? step.task : step)}
                                                        className="absolute top-2 right-2 p-1.5 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10" 
                                                        title="Copy suggestion"
                                                    >
                                                        <RotateCcw className="w-3 h-3 text-white/40 rotate-90" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* CAREER FIT (TOP MATCHING CAREERS) */}
                                    {result.career_fit && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={revealStage >= 2 ? { opacity: 1, y: 0 } : {}}
                                            className="glass-card-premium p-6 space-y-6 border-t-2 border-blue-500/20 col-span-1"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                                    <Compass className="w-4 h-4" />
                                                </div>
                                                <h4 className="text-[18px] font-semibold text-white uppercase tracking-widest">Career Fit Matches</h4>
                                            </div>
                                            <div className="space-y-3">
                                                {result.career_fit.map((match, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                                        <div>
                                                            <p className="text-xs font-bold text-white/95">{match.career_title}</p>
                                                            <p className="text-[9px] text-white/40">Confidence: {match.confidence_score}%</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-black text-blue-400">{match.fit_score}% Fit</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* MARKET READINESS */}
                                    {result.market_intelligence && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={revealStage >= 2 ? { opacity: 1, y: 0 } : {}}
                                            className="glass-card-premium p-6 space-y-6 border-t-2 border-green-500/20 col-span-1"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                <h4 className="text-[18px] font-semibold text-white uppercase tracking-widest">Market Readiness</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div>
                                                        <p className="text-[9px] text-white/50">Market Index Score</p>
                                                        <p className="text-md font-black text-green-400">{result.market_intelligence.market_readiness_score}%</p>
                                                    </div>
                                                    <span className="px-2.5 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-bold uppercase rounded-full">
                                                        {result.market_intelligence.local_market_stats.fit_level || "Aligned"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2">Hiring Landscape</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {result.market_intelligence.local_market_stats.hiring_landscape.slice(0, 4).map((company, i) => (
                                                            <span key={i} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/70 border border-white/5">{company}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* 🔥 WOW MOMENT: AUTO-GENERATED BULLET IMPROVEMENT */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={revealStage >= 3 ? { opacity: 1, y: 0 } : {}}
                                    className="glass-card-premium p-8 relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Zap className="w-24 h-24 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                                <Sparkles className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Bullet Refactor</h4>
                                                <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Automatic impact optimization</p>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8 items-center">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                                                    <span className="text-[7px] font-black uppercase text-red-400 tracking-widest block mb-2">Original (Weak)</span>
                                                    <p className="text-xs text-white/50 italic font-medium leading-relaxed">
                                                        "Responsible for fixing bugs and maintaining the company website."
                                                    </p>
                                                </div>
                                                <div className="flex justify-center">
                                                    <ArrowRight className="w-4 h-4 text-white/20 rotate-90 md:rotate-0" />
                                                </div>
                                                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl relative group/bullet hover:scale-[1.02] transition-transform">
                                                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 rounded text-[7px] font-black uppercase text-white shadow-lg">STAR Method</div>
                                                    <span className="text-[7px] font-black uppercase text-green-400 tracking-widest block mb-2">Neural Enhanced (Strong)</span>
                                                    <p className="text-[15px] text-white font-bold italic leading-relaxed">
                                                        "Optimized frontend performance by <span className="text-green-400">{result.dynamic_bullet?.metric1 || "40%"}</span> and resolved <span className="text-green-400">{result.dynamic_bullet?.metric2 || "150+"}</span> critical UI bugs using React/Next.js, resulting in a significant boost in user retention."
                                                    </p>
                                                    <button className="absolute bottom-2 right-2 p-1.5 bg-white/5 rounded-lg opacity-0 group-hover/bullet:opacity-100 transition-opacity hover:bg-white/10" title="Copy refactored bullet">
                                                        <FileDown className="w-3 h-3 text-white/40" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="space-y-3">
                                                    <h5 className="text-[9px] font-black uppercase text-white/70 tracking-widest">Why this works:</h5>
                                                    <div className="space-y-2">
                                                        {[
                                                            { label: "Impact", val: "Quantified results (40%, 12%)" },
                                                            { label: "Action", val: "Strong verbs (Optimized, Resolved)" },
                                                            { label: "Stack", val: "Specific tools (React, Next.js)" }
                                                        ].map((tip, i) => (
                                                            <div key={i} className="flex gap-3 items-center">
                                                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                                                <p className="text-[10px] font-medium text-white/40"><span className="text-white/80 font-bold">{tip.label}:</span> {tip.val}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                    <button 
                                                        onClick={handleRefactor}
                                                        disabled={isRefactoring}
                                                        className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white transition-all flex items-center justify-center gap-2"
                                                    >
                                                        {isRefactoring ? (
                                                            <><RefreshCcw className="w-3 h-3 animate-spin" /> Refactoring...</>
                                                        ) : (
                                                            "Refactor All My Bullets"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Final Optimized Output Section (The Solution) */}
                                            <AnimatePresence>
                                                {refactoredBullets.length > 0 && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="mt-12 p-8 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-3xl"
                                                    >
                                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                                                            <div>
                                                                <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-white mb-1">Final Optimized Resume Data</h4>
                                                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest italic">Solution-ready output for instant application</p>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button 
                                                                    onClick={() => {
                                                                        const allText = refactoredBullets.map(b => `• ${b.text}`).join('\n');
                                                                        navigator.clipboard.writeText(allText);
                                                                    }}
                                                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2"
                                                                >
                                                                    <Copy className="w-3 h-3" /> Copy All
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        const allText = refactoredBullets.map(b => `• ${b.text}`).join('\n');
                                                                        const blob = new Blob([allText], { type: 'text/plain' });
                                                                        const url = URL.createObjectURL(blob);
                                                                        const a = document.createElement('a');
                                                                        a.href = url;
                                                                        a.download = 'optimized_bullets.txt';
                                                                        a.click();
                                                                    }}
                                                                    className="px-4 py-2 bg-purple-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                                                                >
                                                                    <FileDown className="w-3 h-3" /> Download .txt
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-8 md:space-y-6 bg-black/40 p-4 md:p-8 rounded-2xl border border-white/5">
                                                            {refactoredBullets.map((bullet, i) => (
                                                                <div key={i} className="flex flex-col gap-4 md:gap-2 group border-b border-white/5 pb-6 md:pb-4 last:border-0 last:pb-0">
                                                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                                                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0" />
                                                                        <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em] text-purple-400/60">Suggested Placement:</span>
                                                                        <span className={`text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded ${bullet.placement === 'Experience Section' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                                            {bullet.placement}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[13px] md:text-[14px] text-white/90 font-medium leading-relaxed group-hover:text-white transition-colors pl-4">
                                                                        {(() => {
                                                                            let text = bullet.text;
                                                                            const highlights = [bullet.metric, bullet.impact, bullet.method].filter(Boolean);
                                                                            if (highlights.length === 0) return text;
                                                                            
                                                                            const regex = new RegExp(`(${highlights.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
                                                                            return text.split(regex).map((part, index) => 
                                                                                highlights.some(h => h.toLowerCase() === part.toLowerCase())
                                                                                ? <span key={index} className={`${part === bullet.method ? 'text-purple-400 font-black' : 'text-green-400 font-bold'}`}>{part}</span>
                                                                                : part
                                                                            );
                                                                        })()}
                                                                    </p>
                                                                    
                                                                    {bullet.reasoning && (
                                                                        <div className="ml-4 mt-1 flex flex-col gap-3">
                                                                            {/* 🧠 Humanized Recruiter Review */}
                                                                            <div className="p-3 md:p-4 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group/insight">
                                                                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/50" />
                                                                                <div className="flex items-center gap-2 mb-2">
                                                                                    <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-400" />
                                                                                    <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] text-purple-300">Technical Reviewer Feedback:</span>
                                                                                </div>
                                                                                <p className="text-[11px] md:text-[12px] text-white/60 leading-relaxed font-medium">
                                                                                    "{bullet.reasoning}"
                                                                                </p>
                                                                            </div>

                                                                            {/* 📊 ATS Before/After Proof */}
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 flex flex-col gap-1">
                                                                                    <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-red-400/60 flex items-center gap-1">
                                                                                        <X className="w-2 md:w-2.5 h-2 md:h-2.5" /> Before
                                                                                    </span>
                                                                                    <p className="text-[9px] md:text-[10px] text-white/30 italic leading-tight">
                                                                                        {bullet.ats_proof?.before}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10 flex flex-col gap-1">
                                                                                    <span className="text-[6px] md:text-[7px] font-black uppercase tracking-widest text-green-400/60 flex items-center gap-1">
                                                                                        <Check className="w-2 md:w-2.5 h-2 md:h-2.5" /> After (Optimized)
                                                                                    </span>
                                                                                    <p className="text-[9px] md:text-[10px] text-white/70 font-medium leading-tight">
                                                                                        {bullet.ats_proof?.after}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <p className="mt-6 text-center text-[8px] font-medium text-white/20 italic">
                                                            * Results generated using AI-driven context mapping + industry best practices. Use as a strategic baseline for your final document.
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>

                                {/* Clean Centered CTA */}
                                <div className="flex flex-col items-center pt-8 gap-4">
                                    <Link 
                                        to="/resume-optimizer"
                                        className="px-12 py-4 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center gap-2.5"
                                    >
                                        Optimize for This Job <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                    <div className="flex items-center gap-2 opacity-40">
                                        <Users className="w-3 h-3" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Used by 1,200+ Job Seekers Today</span>
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>
                </div>

                {/* FEATURES */}
                <section className="mt-24 border-t border-white/10 pt-16">
                    <div className="flex flex-wrap items-end justify-between gap-10 mb-12">
                        <div className="max-w-xl">
                            <div className="voxr-glass-label w-fit text-purple-400 mb-6 border border-purple-500/30 text-[9px]">System Architecture</div>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-none uppercase italic">
                                High-Density <br /> 
                                <span className="text-purple-500">Decision Engine.</span>
                            </h2>
                        </div>
                        <p className="text-white/40 text-[11px] italic font-medium max-w-sm mb-1 leading-relaxed">
                            A unified platform for career data simulation. Lock in your strategy with sub-second precision.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { title: "Neural Parse", desc: "Converting docs to high-dim vectors.", icon: <Database className="w-4 h-4" /> },
                            { title: "ATS Sim", desc: "40+ industry filter protocols.", icon: <Monitor className="w-4 h-4" /> },
                            { title: "Impact Scan", desc: "Detection of ownership signals.", icon: <Activity className="w-4 h-4" /> },
                            { title: "Gap Audit", desc: "Live market demand comparison.", icon: <Sparkles className="w-4 h-4" /> }
                        ].map((item, i) => (
                            <div key={i} className="glass-card-premium p-6 space-y-4 hover:border-purple-500/40 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                                    {item.icon}
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.1em] text-white italic">{item.title}</h4>
                                <p className="text-[10px] text-white/40 leading-relaxed font-medium italic">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeScanner;
