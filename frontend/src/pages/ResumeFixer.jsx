import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, Copy, AlertCircle, Check, Sparkles,
  AlertTriangle, Target, Zap, Code2, Database, Smartphone, BarChart3,
  Shield, Cpu, X, Search, Terminal, BookOpen, Layers, Fingerprint, BrainCircuit
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";

const BIG_FIVE = [
  { key: "AI/ML Engineer", icon: Sparkles, color: "from-purple-500 to-indigo-500", shadow: "shadow-purple-500/20" },
  { key: "Cybersecurity Engineer", icon: Shield, color: "from-rose-500 to-orange-500", shadow: "shadow-rose-500/20" },
  { key: "Full Stack Developer", icon: Code2, color: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/20" },
  { key: "DevOps Engineer", icon: Target, color: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/20" },
  { key: "Data Scientist", icon: BarChart3, color: "from-amber-500 to-yellow-500", shadow: "shadow-amber-500/20" }
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
        document.title = "AI Resume Workbench | Candidex AI";
    }, []);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Please paste your resume content first."); return; }
        if (!selectedRole) { setError("Please select a target career path."); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const data = await analyzeResume(null, "", resumeText, selectedRole);
            setResult(data);
        } catch (err) {
            setError(err.message || "The AI engine is currently busy. Please try again.");
        } finally { setLoading(false); }
    };

    const copyText = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const reset = () => { setResult(null); setError(""); setSelectedRole(""); };

    const score = result?.match_score || 0;
    const theme = score >= 75 ? { t: "text-emerald-400", b: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" } : 
                  score >= 50 ? { t: "text-amber-400", b: "bg-amber-500/10", border: "border-amber-500/20", glow: "shadow-amber-500/20" } : 
                  { t: "text-rose-400", b: "bg-rose-500/10", border: "border-rose-500/20", glow: "shadow-rose-500/20" };

    if (loading) return (
        <div className="min-h-screen bg-[#050508] flex flex-col items-center justify-center gap-12 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            <div className="relative">
                <div className="w-32 h-32 border border-white/5 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <BrainCircuit className="w-10 h-10 text-indigo-500 animate-pulse" />
                </div>
            </div>
            <div className="text-center space-y-4 relative z-10">
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-white">Synthesizing Neural Matrix...</h3>
                <p className="text-white/40 text-lg font-medium italic max-w-sm mx-auto">Cross-referencing your professional DNA with the <span className="text-indigo-400">{selectedRole}</span> core requirements.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050508] text-white selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Background Density Layer */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            <div className="neural-glow top-[-10%] left-[-10%] opacity-40" />
            <div className="neural-glow bottom-[-10%] right-[-10%] opacity-40" />

            <PublicHeader />

            <div className="max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10 space-y-20">
                
                {result ? (
                    <div className="space-y-16">
                        {/* Result Hero */}
                        <div className="relative group">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${theme.t.replace('text', 'from')} to-transparent opacity-10 blur-3xl transition duration-1000 group-hover:opacity-20`} />
                            <div className="relative bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-[3.5rem] p-12 flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
                                <div className="relative w-56 h-56 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="46" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="6" />
                                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="6" className={`${theme.t} transition-all duration-1000 ease-out`} strokeDasharray={`${score * 2.89} 289`} strokeLinecap="round" />
                                    </svg>
                                    <div className="text-center">
                                        <span className="text-7xl font-black tracking-tighter block">{score}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Match Score</span>
                                    </div>
                                </div>

                                <div className="flex-1 space-y-8 text-center lg:text-left">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 justify-center lg:justify-start">
                                            <Fingerprint className="w-5 h-5 text-indigo-400" />
                                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none">
                                                {result.role} Path
                                            </h2>
                                        </div>
                                        <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] ${theme.b} ${theme.t} border ${theme.border}`}>
                                            {score >= 70 ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            {result.ats_status}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                        <button onClick={reset} className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all">
                                            <RotateCcw className="w-4 h-4" /> Reset Analysis
                                        </button>
                                        <button className="flex items-center gap-3 bg-indigo-500 text-black px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all">
                                            <FileDown className="w-4 h-4" /> Export Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid lg:grid-cols-2 gap-10">
                            {/* Strengths & Gaps */}
                            <div className="space-y-10">
                                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Skill Alignment</h4>
                                        <span className="text-[10px] font-black text-emerald-400">{result.strengths?.length || 0} Matched</span>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">Verified Strengths</p>
                                            <div className="flex flex-wrap gap-3">
                                                {result.strengths?.map(s => (
                                                    <div key={s} className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-[11px] font-bold text-emerald-400 italic">
                                                        <Check className="w-3.5 h-3.5" /> {s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400 italic">Critical Gaps Detected</p>
                                            <div className="flex flex-wrap gap-3">
                                                {result.missing_skills?.map(s => (
                                                    <div key={s} className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2.5 text-[11px] font-bold text-rose-400 italic">
                                                        <X className="w-3.5 h-3.5" /> {s}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Evolution Roadmap */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-xl">
                                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Evolution Roadmap</h4>
                                        <BookOpen className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    <div className="space-y-6">
                                        {result.roadmap?.map((step, idx) => (
                                            <div key={idx} className="flex gap-6 group">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-xs font-black italic text-white/40 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-sm font-medium italic text-white/60 leading-relaxed group-hover:text-white transition-colors">
                                                    {step}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-xl flex flex-col">
                                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Optimization Buffer</h4>
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                </div>
                                <div className="flex-1 space-y-6">
                                    {result.recommendations?.map((rec, idx) => (
                                        <div key={idx} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all space-y-6 group relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <p className="text-lg font-bold italic leading-tight text-white selection:bg-indigo-500/40">"{rec}"</p>
                                            <button 
                                                onClick={() => copyText(rec, idx)}
                                                className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${copiedIdx === idx ? 'text-emerald-400' : 'text-white/20 hover:text-indigo-400'}`}
                                            >
                                                {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                {copiedIdx === idx ? 'Synced to Clipboard' : 'Copy Optimization'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-32">
                        {/* Workbench Header */}
                        <div className="text-center space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]"
                            >
                                <Zap className="w-4 h-4" /> High-Performance Analysis
                            </motion.div>
                            <h1 className="text-6xl md:text-[8rem] font-black tracking-[0.02em] uppercase italic leading-[0.8] bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
                                AI Resume <br /> <span className="text-indigo-500">Workbench</span>
                            </h1>
                            <p className="text-white/40 text-lg md:text-2xl max-w-2xl mx-auto font-medium italic leading-relaxed">
                                Cross-referencing your professional history against deterministic role matrices for precision matching.
                            </p>
                        </div>

                        {/* Input Area */}
                        <div className="grid lg:grid-cols-12 gap-16 items-start">
                            {/* Role Select */}
                            <div className="lg:col-span-4 space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pl-2">01. Target Career Path</h3>
                                    <div className="grid gap-3">
                                        {BIG_FIVE.map((role) => (
                                            <button
                                                key={role.key}
                                                onClick={() => setSelectedRole(role.key)}
                                                className={`p-6 rounded-[2rem] border text-left transition-all relative overflow-hidden group ${
                                                    selectedRole === role.key 
                                                    ? `bg-indigo-500 border-indigo-500 text-black shadow-2xl` 
                                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                                }`}
                                            >
                                                <div className="flex items-center gap-5 relative z-10">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                                                        selectedRole === role.key ? "bg-black/10 border-black/10" : "bg-white/5 border-white/5"
                                                    }`}>
                                                        <role.icon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-lg font-black italic uppercase tracking-tight leading-none">{role.key}</span>
                                                </div>
                                                {selectedRole === role.key && <Sparkles className="absolute bottom-4 right-4 w-5 h-5 opacity-20" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Resume Content */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pl-2">02. Professional History (Plain Text)</h3>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                                        <textarea
                                            value={resumeText}
                                            onChange={(e) => setResumeText(e.target.value)}
                                            placeholder="Paste your raw resume content here... (Skills, Experience, Projects)"
                                            className="w-full h-[600px] bg-[#050508] border border-white/10 rounded-[3rem] p-12 text-lg font-medium italic text-white/60 placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all shadow-2xl relative z-10 resize-none selection:bg-indigo-500/40"
                                        />
                                        <div className="absolute bottom-8 right-8 z-20 flex gap-4">
                                            <button 
                                                onClick={handleAnalyze}
                                                className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-3xl disabled:opacity-50 disabled:hover:scale-100"
                                                disabled={!resumeText.trim() || !selectedRole}
                                            >
                                                Synthesize Report
                                            </button>
                                        </div>
                                    </div>
                                    {error && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest italic animate-pulse px-2">{error}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
