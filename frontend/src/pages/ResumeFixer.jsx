import { useState } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, Copy, AlertCircle, Check, Sparkles,
  AlertTriangle, Target, Zap, Code2, Database, Smartphone, BarChart3,
  Shield, Cpu, X, Search, Terminal, BookOpen
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";

const BIG_FIVE = [
  { key: "AI/ML Engineer", icon: Sparkles, color: "text-purple-400" },
  { key: "Cybersecurity Engineer", icon: Shield, color: "text-rose-400" },
  { key: "Full Stack Developer", icon: Code2, color: "text-indigo-400" },
  { key: "DevOps Engineer", icon: Target, color: "text-emerald-400" },
  { key: "Data Scientist", icon: BarChart3, color: "text-amber-400" }
];

const ResumeFixer = () => {
    const { user } = useAuth();
    const { resumeText, setResumeText } = useResumeStore();
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copiedIdx, setCopiedIdx] = useState(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Paste your resume content first."); return; }
        if (!selectedRole) { setError("Select a target role."); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const data = await analyzeResume(null, "", resumeText, selectedRole);
            setResult(data);
        } catch (err) {
            setError(err.message || "Analysis failed.");
        } finally { setLoading(false); }
    };

    const copyText = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const reset = () => { setResult(null); setError(""); setSelectedRole(""); };

    const score = result?.match_score || 0;
    const sc = score >= 75 ? {t:"text-emerald-400", b:"bg-emerald-500/10", border:"border-emerald-500/20"} : 
               score >= 50 ? {t:"text-amber-400", b:"bg-amber-500/10", border:"border-amber-500/20"} : 
               {t:"text-rose-400", b:"bg-rose-500/10", border:"border-rose-500/20"};

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-white/40 text-sm animate-pulse">Running deterministic gap analysis...</p>
        </div>
    );

    if (result) return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <PublicHeader />
            <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 space-y-8">
                {/* Score & Alignment Header */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
                            <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8" className={sc.t} strokeDasharray={`${score * 2.76} 276`} strokeLinecap="round" />
                        </svg>
                        <span className="text-4xl font-black">{score}</span>
                    </div>
                    <div className="flex-1 space-y-3 text-center md:text-left">
                        <h2 className="text-2xl font-bold">You match {score}/100 for {result?.role || "Target Role"}</h2>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${sc.b} ${sc.t}`}>
                            {score >= 70 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            {result?.ats_status || "Analyzing"}
                        </div>
                        {result?.alignment?.is_shift && (
                            <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                                <Target className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Career Shift Detected</p>
                                    <p className="text-xs text-white/50 leading-relaxed">Your resume is a stronger match for <span className="text-indigo-400 font-bold">{result.alignment.best_role} ({result.alignment.best_score}%)</span>. Transitioning to {result.role} will require specific skill bridging.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={reset} className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold transition-all flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Skills Matrix */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20">Strengths ({result?.strengths?.length || 0})</h3>
                            <div className="flex flex-wrap gap-2">
                                {result?.strengths?.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                                        <Check className="w-3 h-3" /> {s}
                                    </span>
                                ))}
                                {(!result?.strengths || result.strengths.length === 0) && <p className="text-xs text-white/20 italic">No direct matches found.</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-rose-400/50">Missing Core ({result?.missing_core?.length || 0})</h3>
                            <div className="flex flex-wrap gap-2">
                                {result?.missing_core?.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-medium text-rose-400 flex items-center gap-1.5">
                                        <X className="w-3 h-3" /> {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-400/50">Missing Important ({result?.missing_important?.length || 0})</h3>
                            <div className="flex flex-wrap gap-2">
                                {result?.missing_important?.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-medium text-amber-400">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Learning Roadmap */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-indigo-400" /> Learning Roadmap
                            </h3>
                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">v1 Steps</span>
                        </div>
                        <div className="space-y-4">
                            {result?.roadmap?.map((step, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:border-indigo-500/50 group-hover:text-indigo-400 transition-all">{i + 1}</div>
                                        {i < (result?.roadmap?.length || 0) - 1 && <div className="w-px flex-1 bg-white/5" />}
                                    </div>
                                    <p className="text-xs text-white/50 leading-relaxed pt-0.5 group-hover:text-white/80 transition-all">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Suggestions */}
                {result?.recommendations?.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" /> AI Impact Rewrites
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {result.recommendations.map((rec, i) => (
                                <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-rose-400/50 uppercase">Original</p>
                                        <p className="text-xs text-white/30 line-through decoration-rose-500/30">{rec.original}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-emerald-400/50 uppercase">Improved</p>
                                        <p className="text-xs text-white/80 font-medium">{rec.improved}</p>
                                    </div>
                                    <button onClick={() => copyText(rec.improved, i)} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                        {copiedIdx === i ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy Rewrite</>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <PublicFooter />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <PublicHeader />
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">AI Resume Optimizer <span className="text-indigo-500">v1</span></h1>
                    <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
                        Select one of our high-demand tech roles. We'll perform a deterministic gap analysis and provide a 4-step roadmap to bridge the skill gap.
                    </p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">1. Paste Resume Content</label>
                        <textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Paste your full resume here..."
                            className="w-full h-64 p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-sm text-white/60 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none font-mono placeholder:text-white/10 transition-all" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">2. Select Target Role</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {BIG_FIVE.map(role => {
                                const Icon = role.icon;
                                const sel = selectedRole === role.key;
                                return (
                                    <button key={role.key} onClick={() => setSelectedRole(sel ? "" : role.key)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${sel ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/30' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                                        <div className={`p-2 rounded-xl bg-white/5 ${sel ? role.color : 'text-white/20'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-xs font-bold ${sel ? 'text-white' : 'text-white/40'}`}>{role.key}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {error && <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-bold flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                    <button onClick={handleAnalyze} disabled={loading || !resumeText.trim() || !selectedRole}
                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${(!resumeText.trim() || !selectedRole) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 active:scale-[0.98]'}`}>
                        Run Gap Analysis <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
