import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, AlertCircle, Sparkles, 
  Target, Zap, Search, Shield, Cpu, X, Check, BrainCircuit, Fingerprint, Layers
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { motion, AnimatePresence } from "framer-motion";

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
        if (!resumeText.trim()) { setError("Please provide your resume content first."); return; }
        if (!jdText.trim()) { setError("Please paste the target Job Description."); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const data = await analyzeResume(null, jdText, resumeText, "JD-driven");
            setResult(data);
        } catch (err) {
            setError(err.message || "Engine capacity reached. Please try again.");
        } finally { setLoading(false); }
    };

    const reset = () => { setResult(null); setError(""); setJdText(""); };

    const score = result?.match_score || 0;
    const theme = score >= 80 ? { t: "text-emerald-400", b: "bg-emerald-500/10", border: "border-emerald-500/20" } : 
                  score >= 60 ? { t: "text-amber-400", b: "bg-amber-500/10", border: "border-amber-500/20" } : 
                  { t: "text-rose-400", b: "bg-rose-500/10", border: "border-rose-500/20" };

    if (loading) return (
        <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-12 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            <div className="relative">
                <div className="w-32 h-32 border border-white/5 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-10 h-10 text-indigo-500 animate-pulse" />
                </div>
            </div>
            <div className="text-center space-y-4">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">Targeting Alignment...</h3>
                <p className="text-white/40 text-lg font-medium italic max-w-sm mx-auto animate-pulse">Running semantic overlap checks against your target JD.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050508] text-white selection:bg-indigo-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            <div className="neural-glow top-[-15%] right-[-10%] opacity-30" />
            <div className="neural-glow bottom-[-15%] left-[-10%] opacity-30 bg-purple-600/10" />

            <PublicHeader />

            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 space-y-24">
                
                {result ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-16"
                    >
                        {/* Comparison Hero */}
                        <div className="bg-white/[0.03] border border-white/10 rounded-[4rem] p-12 flex flex-col md:flex-row items-center gap-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-[120px] -mr-40 -mt-40" />
                            
                            <div className="relative w-64 h-64 shrink-0 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
                                    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className={`${theme.t} transition-all duration-1000 ease-out`} strokeDasharray={`${score * 2.89} 289`} strokeLinecap="round" />
                                </svg>
                                <div className="text-center">
                                    <span className="text-[6rem] font-black tracking-tighter block leading-none">{score}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 italic">ATS Fit Score</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-8 text-center md:text-left">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 justify-center md:justify-start">
                                        <div className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">JD Target Locked</div>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
                                        Precision <span className="text-indigo-500 italic">Alignment</span>
                                    </h2>
                                    <p className={`text-sm font-black uppercase tracking-[0.3em] ${theme.t} italic`}>
                                        Recruiter Verdict: {result.ats_status}
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <button onClick={reset} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                        <RotateCcw className="w-4 h-4" /> New Alignment
                                    </button>
                                    <button className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                                        <Zap className="w-4 h-4" /> Optimize DNA
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Content */}
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-12">
                                {/* Matches & Gaps */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-12 space-y-12 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                        <div className="flex items-center gap-4">
                                            <Layers className="w-5 h-5 text-indigo-400" />
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Semantic Mapping</h4>
                                        </div>
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Vector Comparison</span>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 italic">Target Matches</p>
                                            <div className="flex flex-wrap gap-3">
                                                {result.strengths?.map(s => (
                                                    <div key={s} className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-xs font-bold text-emerald-400 italic transition-all hover:bg-emerald-500/20 cursor-default">
                                                        <Check className="w-4 h-4" /> {s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-6 pt-4 border-t border-white/5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500 italic">Alignment Gaps</p>
                                            <div className="flex flex-wrap gap-3">
                                                {result.missing_skills?.map(s => (
                                                    <div key={s} className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-xs font-bold text-rose-400 italic transition-all hover:bg-rose-500/20 cursor-default">
                                                        <X className="w-4 h-4" /> {s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12">
                                {/* The Roadmap */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-12 space-y-12 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                        <div className="flex items-center gap-4">
                                            <BrainCircuit className="w-5 h-5 text-indigo-400" />
                                            <h4 className="text-xl font-black uppercase italic tracking-tighter">Roadmap to 90%+</h4>
                                        </div>
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <div className="space-y-8">
                                        {result.roadmap?.map((step, idx) => (
                                            <div key={idx} className="flex gap-8 group">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-lg font-black italic text-white/20 group-hover:bg-indigo-500 group-hover:text-black transition-all shadow-xl">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-2 py-1">
                                                    <p className="text-lg font-bold italic text-white leading-tight group-hover:text-indigo-400 transition-colors">
                                                        {step.split(':')[0]}
                                                    </p>
                                                    <p className="text-sm font-medium italic text-white/40 leading-relaxed">
                                                        {step.split(':')[1] || "Critical alignment step to bypass screening filters."}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-32">
                        {/* Header Section */}
                        <div className="text-center space-y-10 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
                            <div className="space-y-6">
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]"
                                >
                                    <Target className="w-4 h-4" /> Precise Job Alignment
                                </motion.div>
                                <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase italic leading-[0.8] bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                                    Skill Gap <br /> <span className="text-indigo-500">Analyzer</span>
                                </h1>
                                <p className="text-white/40 text-xl md:text-3xl max-w-3xl mx-auto font-medium italic leading-relaxed">
                                    The "JD Sniper." Match your resume against <span className="text-white underline decoration-indigo-500/30">any specific job post</span> to see exactly why you aren't getting the callback.
                                </p>
                            </div>
                        </div>

                        {/* Dual Pane Inputs */}
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pl-4">01. Target Job Description</h3>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-indigo-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                                    <textarea
                                        value={jdText}
                                        onChange={(e) => setJdText(e.target.value)}
                                        placeholder="Paste the full job post requirements here..."
                                        className="w-full h-[550px] bg-[#050508]/50 border border-white/10 rounded-[3.5rem] p-12 text-lg font-medium italic text-white/60 placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all shadow-2xl relative z-10 resize-none backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pl-4">02. Your Current Resume</h3>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-purple-500/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                                    <div className="w-full h-[550px] bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-12 overflow-y-auto relative z-10 shadow-2xl scrollbar-hide">
                                        <pre className="text-sm font-medium italic text-white/40 whitespace-pre-wrap font-sans">
                                            {resumeText || "No resume detected. Please upload/paste your resume in the Workbench first."}
                                        </pre>
                                        {!resumeText && (
                                            <Link to="/resume-optimizer" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-8 py-4 rounded-2xl hover:bg-indigo-400 hover:text-black transition-all">
                                                Go to Workbench
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="text-center pb-20">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAnalyze}
                                disabled={loading || !resumeText || !jdText}
                                className="bg-white text-black px-24 py-7 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:bg-indigo-500 hover:text-black transition-all disabled:opacity-30 disabled:hover:scale-100 relative group overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Initiate Alignment Scan <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </motion.button>
                            {error && <p className="mt-8 text-rose-500 font-black uppercase tracking-widest italic text-xs animate-pulse">{error}</p>}
                        </div>
                    </div>
                )}
            </div>

            <PublicFooter />
        </div>
    );
};

export default ResumeGap;
