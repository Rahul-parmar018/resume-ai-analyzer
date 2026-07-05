import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, Copy, AlertCircle, Check, 
  AlertTriangle, Target, Zap, Code2, BarChart3,
  Shield, X, Search, BookOpen, Layers, Fingerprint, FileDown,
  ArrowDown, Cpu, Sparkles, MousePointer2, Briefcase, GraduationCap,
  ArrowRight, RefreshCcw, Monitor, Database, Activity, Lightbulb
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { motion, AnimatePresence } from "framer-motion";

const BIG_FIVE = [
  { key: "AI/ML Engineer", icon: Target, desc: "Neural networks & ML pipelines" },
  { key: "Cybersecurity Engineer", icon: Shield, desc: "Infosec & Threat Detection" },
  { key: "Full Stack Developer", icon: Code2, desc: "Web architecture & APIs" },
  { key: "DevOps Engineer", icon: Zap, desc: "CI/CD & Cloud Infrastructure" },
  { key: "Data Scientist", icon: BarChart3, desc: "Analytics & Predictive Modeling" }
];

const ResumeFixer = () => {
    const { user } = useAuth();
    const { resumeText, setResumeText } = useResumeStore();
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copiedIdx, setCopiedIdx] = useState(null);

    useEffect(() => {
        document.title = "Neural Optimizer | Candidex AI";
    }, []);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Paste your resume content first."); return; }
        if (!selectedRole) { setError("Select a target role."); return; }
        setLoading(true); setError(""); 
        try {
            const data = await analyzeResume(null, "", resumeText, selectedRole);
            setResult(data);
        } catch (err) {
            setError(err.message || "Analysis failed. Try again.");
        } finally { setLoading(false); }
    };

    const copyText = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const reset = () => { setResult(null); setError(""); setSelectedRole(""); };

    const score = result?.match_score || 0;
    
    return (
        <div className="bg-[#020202] text-white selection:bg-purple-500/30 min-h-screen font-sans relative overflow-x-hidden">
            <PublicHeader />

            {/* ATMOSPHERIC DEPTH SYSTEM */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-purple-600/10 blur-[160px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-5%] w-[1000px] h-[1000px] bg-pink-500/5 blur-[180px] rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.08),transparent_40%)]" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 pt-24 pb-12">
                
                {/* COMPACT HERO */}
                <header className="py-8 text-left border-b border-white/10 mb-8 flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/10">
                                <Monitor className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">v4.0 Synthesis Engine</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white italic uppercase leading-none">
                            Neural <span className="text-purple-500">Optimizer</span>
                        </h1>
                        <p className="text-white/50 text-[11px] font-medium max-w-lg leading-relaxed">
                            Deterministic career engineering for the shortlist era.
                        </p>
                    </div>
                    
                    {result && (
                        <button onClick={reset} className="px-5 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2">
                            <RotateCcw className="w-3 h-3" /> Reset Protocol
                        </button>
                    )}
                </header>

                <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-[1200px] mx-auto'} gap-8 items-start`}>
                    
                    {/* INPUT PANEL */}
                    <section className="glass-card-premium p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">01. Source File</label>
                                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Protocol Required</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                {BIG_FIVE.map((role) => (
                                    <button
                                        key={role.key}
                                        onClick={() => setSelectedRole(role.key)}
                                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-[9px] font-black transition-all relative overflow-hidden group ${
                                            selectedRole === role.key 
                                            ? "bg-purple-600/20 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                                            : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                                        }`}
                                    >
                                        <role.icon className={`w-3.5 h-3.5 ${selectedRole === role.key ? "text-white" : "text-white/20 group-hover:text-purple-400"}`} />
                                        <span className="uppercase tracking-tight text-left leading-tight">{role.key}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">02. Target Intent (DNA)</label>
                                <div className="flex items-center gap-2">
                                    <MousePointer2 className="w-3 h-3 text-purple-400 animate-pulse" />
                                    <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Awaiting Data</span>
                                </div>
                            </div>
                            <div className="relative group">
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste resume content here for deep neural optimization..."
                                    className="w-full h-72 bg-black/40 border border-white/10 rounded-2xl p-5 text-[11px] text-white/90 focus:outline-none focus:border-purple-500/40 transition-all resize-none font-medium italic shadow-inner leading-relaxed"
                                />
                                <div className="absolute bottom-5 right-5">
                                    <button 
                                        onClick={handleAnalyze}
                                        disabled={loading || !resumeText.trim() || !selectedRole}
                                        className="px-8 py-3.5 bg-white text-black disabled:opacity-20 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-[0.97]"
                                    >
                                        {loading ? <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                                        {loading ? "Synthesizing..." : "Analyze DNA →"}
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-[8px] font-black uppercase tracking-[0.3em] text-center italic">{error}</p>}
                        </div>
                    </section>

                    {/* RESULTS PANEL */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-5"
                            >
                                {/* Score Dashboard */}
                                <div className="glass-card-premium p-6 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-20 h-20 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="6" />
                                                <motion.circle 
                                                    initial={{ strokeDasharray: "0 276" }}
                                                    animate={{ strokeDasharray: `${score * 2.76} 276` }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    cx="50" cy="50" r="44" fill="none" stroke={score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"} strokeWidth="6" strokeLinecap="round" 
                                                />
                                            </svg>
                                            <span className={`text-3xl font-black italic ${score >= 75 ? "text-green-400 text-glow-green" : score >= 50 ? "text-amber-400" : "text-red-500 text-glow-red"}`}>{score}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Composite Match Score</h3>
                                            <div className={`text-lg font-black uppercase italic ${score >= 75 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-500"}`}>
                                                {result.ats_status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-right space-y-1">
                                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest">Protocol Variant</p>
                                        <p className="text-[10px] font-black text-white italic">{selectedRole}</p>
                                    </div>
                                </div>

                                {/* Breakdown Grid */}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="glass-card-premium p-5 space-y-4">
                                        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                            <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Strengths</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {result.strengths?.length > 0 ? (
                                                result.strengths.map(s => (
                                                    <span key={s} className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-[9px] font-black text-green-400 italic flex items-center gap-1.5">
                                                        <Check className="w-2.5 h-2.5" /> {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-white/40 text-[10px] italic">No standout strengths detected yet.</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="glass-card-premium p-5 space-y-4">
                                        <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                                            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                            <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Gaps</h4>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {result.missing_skills?.length > 0 ? (
                                                result.missing_skills.map(s => (
                                                    <span key={s} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[9px] font-black text-red-500 italic flex items-center gap-1.5">
                                                        <X className="w-2.5 h-2.5" /> {s}
                                                    </span>
                                                ))
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                                    <p className="text-green-400/80 text-[10px] font-black italic uppercase tracking-wider">No critical gaps detected.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Strategy Roadmap - ACTION CARDS */}
                                <div className="glass-card-premium p-5 space-y-5 bg-white/[0.01]">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                        <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-400 italic">Alignment Protocol</h4>
                                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                                    </div>
                                    <div className="space-y-2.5">
                                        {result.roadmap?.length > 0 ? (
                                            result.roadmap.map((step, idx) => {
                                                const [title, ...desc] = step.split('.');
                                                return (
                                                    <div key={idx} className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-purple-500/20 transition-all">
                                                        <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-black italic text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition-all">
                                                            {idx + 1}
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[11px] font-black text-white italic uppercase tracking-tight group-hover:text-purple-400 transition-colors">{title}.</p>
                                                            {desc.length > 0 && <p className="text-[10px] font-medium text-white/50 leading-relaxed italic">{desc.join('.')}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-white/40 text-[10px] italic text-center py-4 border border-dashed border-white/10 rounded-2xl">Protocol synthesis complete. No further actions required.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Optimization Snippets - SMART REWRITES */}
                                <div className="glass-card-premium p-5 space-y-5">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                        <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-400 italic">Neural Snippets</h4>
                                        <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                                    </div>
                                    <div className="space-y-3">
                                        {result.recommendations?.length > 0 ? (
                                            result.recommendations.map((rec, idx) => (
                                                <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3 group transition-all hover:border-purple-500/30">
                                                    <p className="text-[11px] font-black italic leading-relaxed text-white group-hover:text-glow-purple transition-all select-all">
                                                        {typeof rec === 'object' ? `"${rec.task}"` : `"${rec}"`}
                                                    </p>
                                                    <div className="flex justify-between items-center pt-1 border-t border-white/[0.03]">
                                                        <button 
                                                            onClick={() => copyText(typeof rec === 'object' ? rec.task : rec, idx)}
                                                            className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest transition-all ${copiedIdx === idx ? 'text-green-400' : 'text-white/20 hover:text-purple-400'}`}
                                                        >
                                                            {copiedIdx === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                            {copiedIdx === idx ? 'Synced' : 'Clone Protocol'}
                                                        </button>
                                                        <span className="text-[7px] font-bold text-white/10 uppercase italic">ATS Ready</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 border border-dashed border-white/10 rounded-2xl text-center space-y-4">
                                                <p className="text-white/40 text-[10px] italic">No direct rewrites available. Follow these general guidelines:</p>
                                                <div className="flex flex-col gap-2 items-start max-w-[240px] mx-auto">
                                                    {[
                                                        "Add quantified achievements (%, $, #)",
                                                        "Inject high-intent action verbs",
                                                        "Ensure core technical stack is prominent"
                                                    ].map((tip, i) => (
                                                        <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-white/60 italic">
                                                            <Sparkles className="w-3 h-3 text-purple-500" /> {tip}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
