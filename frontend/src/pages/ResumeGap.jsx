import { useState, useEffect } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { 
    Target, Sparkles, BookOpen, Check, X, RotateCcw, 
    ArrowRight, AlertCircle, Zap, Shield, Code2, 
    BarChart3, CheckCircle2, AlertTriangle, FileText, Search
} from "lucide-react";

const ResumeGap = () => {
    const { resumeText, setResumeText } = useResumeStore();
    const [jdText, setJdText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Please provide your resume content."); return; }
        if (!jdText.trim()) { setError("Please provide the target job description."); return; }
        
        setLoading(true); setError(""); setResult(null);
        try {
            const data = await analyzeResume(null, jdText, resumeText, "");
            setResult(data);
        } catch (err) {
            setError(err.message || "The Neural engine is currently busy. Please try again.");
        } finally { setLoading(false); }
    };

    const reset = () => { setResult(null); setError(""); setJdText(""); };

    const score = result?.match_score || 0;
    const theme = score >= 75 ? { t: "text-emerald-400", b: "bg-emerald-500/10", border: "border-emerald-500/20" } : 
                  score >= 50 ? { t: "text-amber-400", b: "bg-amber-500/10", border: "border-amber-500/20" } : 
                  { t: "text-rose-400", b: "bg-rose-500/10", border: "border-rose-500/20" };

    if (loading) return (
        <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-8 px-6">
            <div className="relative">
                <div className="w-24 h-24 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="w-8 h-8 text-indigo-500 animate-pulse" />
                </div>
            </div>
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Neural JD Syncing...</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto">Extracting critical requirements and mapping them to your experience graph.</p>
            </div>
        </div>
    );

    if (result) return (
        <div className="min-h-screen bg-[#050508] text-white">
            <PublicHeader />
            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-10">
                {/* Result Hero */}
                <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${theme.t.replace('text', 'from')} to-transparent opacity-10 blur-2xl transition duration-1000 group-hover:opacity-20`} />
                    <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 flex flex-col lg:flex-row items-center gap-12">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="6" />
                                <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className={`${theme.t} transition-all duration-1000 ease-out`} strokeDasharray={`${score * 2.89} 289`} strokeLinecap="round" />
                            </svg>
                            <div className="text-center">
                                <span className="text-6xl font-black tracking-tighter block">{score}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">JD Fit Score</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="space-y-2">
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                                    Target JD Analysis
                                </h2>
                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${theme.b} ${theme.t} border ${theme.border}`}>
                                    {score >= 75 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                    {result.ats_status}
                                </div>
                            </div>
                            <p className="text-white/40 text-sm max-w-xl italic leading-relaxed">"{result.summary}"</p>
                        </div>

                        <button onClick={reset} className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                            <RotateCcw className="w-4 h-4" /> New JD Analysis
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Skills Overlap */}
                    <div className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">JD Keyword Overlap</h3>
                                <div className="h-px flex-1 mx-4 bg-white/5" />
                                <span className="text-[10px] font-bold text-emerald-400">{result.strengths?.length || 0} Found</span>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {result.strengths?.map(s => (
                                    <span key={s} className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-400 flex items-center gap-2">
                                        <Check className="w-3.5 h-3.5" /> {s}
                                    </span>
                                ))}
                                {(!result.strengths || result.strengths.length === 0) && <p className="text-xs text-white/20 italic">No significant overlap detected.</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400/40">Missing from Resume</h3>
                                <div className="h-px flex-1 mx-4 bg-white/5" />
                                <span className="text-[10px] font-bold text-rose-400">{result.missing_core?.length || 0} Core Gaps</span>
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {result.missing_core?.map(s => (
                                    <span key={s} className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-bold text-rose-400 flex items-center gap-2">
                                        <X className="w-3.5 h-3.5" /> {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/40">Preferred Skills (Missing)</h3>
                                <div className="h-px flex-1 mx-4 bg-white/5" />
                            </div>
                            <div className="flex flex-wrap gap-2.5">
                                {result.missing_important?.map(s => (
                                    <span key={s} className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-400">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gap Fix Roadmap */}
                    <div className="relative group overflow-hidden bg-[#0a0a12] border border-white/5 rounded-[2rem] p-10 flex flex-col">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
                        
                        <div className="relative flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                    <Zap className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Bridge the Gap</h3>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">JD Alignment Strategy</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex-1 space-y-8">
                            {result.roadmap?.map((step, i) => (
                                <div key={i} className="flex gap-6 group/step">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white/30 group-hover/step:border-indigo-500/50 group-hover/step:text-indigo-400 transition-all duration-300">
                                            {i + 1}
                                        </div>
                                        {i < result.roadmap.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-white/10 to-transparent" />}
                                    </div>
                                    <div className="space-y-1 py-2">
                                        <p className="text-sm font-medium text-white/80 leading-relaxed group-hover/step:text-white transition-colors duration-300">{step}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link to="/resume-optimizer" className="relative mt-8 group/btn w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            Optimize Content for this JD <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050508] text-white">
            <PublicHeader />
            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 space-y-16">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Search className="w-3.5 h-3.5" /> Precise Job Alignment
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        Skill Gap <br /> <span className="text-indigo-500">Analyzer</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                        The "JD Sniper." Match your resume against any specific job post to see exactly why you aren't getting the callback.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Input 1: JD */}
                    <div className="space-y-4 group">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2 block">01. Target Job Description</label>
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                            <textarea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste the full job post requirements here..."
                                className="relative w-full h-[500px] p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] text-sm text-white/80 focus:ring-0 focus:border-indigo-500/50 outline-none resize-none font-medium placeholder:text-white/10 transition-all backdrop-blur-xl" />
                        </div>
                    </div>

                    {/* Input 2: Resume */}
                    <div className="space-y-6">
                        <div className="space-y-4 group">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2 block">02. Your Current Resume</label>
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000" />
                                <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your resume text here..."
                                    className="relative w-full h-[350px] p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] text-sm text-white/80 focus:ring-0 focus:border-indigo-500/50 outline-none resize-none font-medium placeholder:text-white/10 transition-all backdrop-blur-xl" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[1.5rem] text-xs text-rose-400 font-bold flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5" /> {error}
                            </div>
                        )}

                        <button onClick={handleAnalyze} disabled={loading || !resumeText.trim() || !jdText.trim()}
                            className={`group relative w-full py-6 rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-sm overflow-hidden transition-all duration-500 ${(!resumeText.trim() || !jdText.trim()) ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'}`}>
                            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors duration-500">
                                Run Neural Gap Scan <ArrowRight className="w-5 h-5" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default ResumeGap;
