import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, AlertCircle, Sparkles, 
  Target, Zap, Search, Shield, X, Check, Layers, Fingerprint, Activity
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const ResumeGap = () => {
    const { resumeText, setResumeText } = useResumeStore();
    const [jdText, setJdText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Skill Gap Analyzer | Candidex AI";
    }, []);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Provide your resume content first."); return; }
        if (!jdText.trim()) { setError("Paste the target Job Description."); return; }
        setLoading(true); setError(""); 
        try {
            const data = await analyzeResume(null, jdText, resumeText, "JD-driven");
            setResult(data);
        } catch (err) {
            setError(err.message || "Analysis failed. Try again.");
        } finally { setLoading(false); }
    };

    const reset = () => { setResult(null); setError(""); setJdText(""); };

    const score = result?.match_score || 0;
    const theme = score >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
                  score >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : 
                  "text-rose-400 bg-rose-500/10 border-rose-500/20";

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-indigo-500/30">
            <PublicHeader />

            <main className="pt-24 pb-12 px-4 max-w-[1400px] mx-auto space-y-8">
                
                {/* Compact Hero */}
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Skill Gap Analyzer</h1>
                    <p className="text-sm text-white/50 max-w-xl">
                        Match your resume against a specific job description to find missing keywords and requirements.
                    </p>
                </header>

                <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-6xl'} gap-6 items-start`}>
                    
                    {/* Input Pane */}
                    <div className="space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">01. Target Job Description</label>
                                <textarea
                                    value={jdText}
                                    onChange={(e) => setJdText(e.target.value)}
                                    placeholder="Paste the full job post requirements here..."
                                    className="w-full h-[350px] bg-black/20 border border-white/10 rounded-xl p-4 text-xs font-medium leading-relaxed placeholder:text-white/5 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/20">02. Your Current Resume</label>
                                <div className="w-full h-[350px] bg-white/[0.01] border border-white/5 rounded-xl p-4 overflow-y-auto relative">
                                    <pre className="text-[11px] text-white/30 whitespace-pre-wrap font-sans leading-relaxed">
                                        {resumeText || "No resume detected. Upload one in the Workbench."}
                                    </pre>
                                    {!resumeText && (
                                        <Link to="/resume-optimizer" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all shadow-lg">
                                            Go to Workbench
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            disabled={loading || !resumeText || !jdText.trim()}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
                            {loading ? "Analyzing..." : "Compare Alignment"}
                        </button>
                        {error && <p className="text-rose-500 text-[11px] text-center font-medium">{error}</p>}
                    </div>

                    {/* Results Pane */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Compact Score */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className={`${theme.split(' ')[0]} transition-all duration-1000`} strokeDasharray={`${score * 2.82} 282`} strokeLinecap="round" />
                                            </svg>
                                            <span className="text-xl font-bold">{score}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold uppercase tracking-wide">Job Fit Index</h3>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme}`}>
                                                {result.ats_status}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Skills Breakdown */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-6">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80 flex items-center gap-2">
                                            <Check className="w-3 h-3" /> Target Matches
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.strengths?.map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-md text-[11px] font-medium text-emerald-400/90">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80 flex items-center gap-2">
                                            <X className="w-3 h-3" /> Missing Requirements
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing_skills?.map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-rose-500/5 border border-rose-500/10 rounded-md text-[11px] font-medium text-rose-400/90">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Compact Roadmap */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Skill Gap Roadmap</h4>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {result.roadmap?.map((step, idx) => (
                                            <div key={idx} className="flex gap-4 items-start group">
                                                <div className="mt-1 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-white/30 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">
                                                        {step.split(':')[0]}
                                                    </p>
                                                    <p className="text-xs text-white/40 leading-relaxed italic">
                                                        {step.split(':')[1] || "Necessary alignment step."}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Blocks */}
                <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                    <div className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
                            <Layers className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">Semantic Scan</h4>
                        <p className="text-[12px] text-white/40 leading-relaxed italic">
                            We match your skills against the job's core requirements using vector embeddings for true semantic overlap.
                        </p>
                    </div>
                    <div className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center">
                            <Fingerprint className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">100% Privacy</h4>
                        <p className="text-[12px] text-white/40 leading-relaxed italic">
                            No data is stored. Your resume and job description stay in your browser session during analysis.
                        </p>
                    </div>
                    <div className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                        <div className="w-8 h-8 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-rose-400" />
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-wide">Actionable Gaps</h4>
                        <p className="text-[12px] text-white/40 leading-relaxed italic">
                            Identify exactly which skills to add or highlight to increase your callback rate by up to 3x.
                        </p>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeGap;
