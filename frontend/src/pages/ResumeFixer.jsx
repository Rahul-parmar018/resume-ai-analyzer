import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, Copy, AlertCircle, Check, 
  AlertTriangle, Target, Zap, Code2, BarChart3,
  Shield, X, Search, BookOpen, Layers, Fingerprint, FileDown
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { motion, AnimatePresence } from "framer-motion";

const BIG_FIVE = [
  { key: "AI/ML Engineer", icon: Target },
  { key: "Cybersecurity Engineer", icon: Shield },
  { key: "Full Stack Developer", icon: Code2 },
  { key: "DevOps Engineer", icon: Zap },
  { key: "Data Scientist", icon: BarChart3 }
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
        document.title = "Resume Optimizer | Candidex AI";
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
    const theme = score >= 75 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
                  score >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : 
                  "text-rose-400 bg-rose-500/10 border-rose-500/20";

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-indigo-500/30">
            <PublicHeader />

            <div className="max-w-[1400px] mx-auto px-4 pt-24 pb-12 space-y-8">
                
                {/* Compact Hero */}
                <header className="space-y-2 max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tight">Resume Optimizer</h1>
                    <p className="text-sm text-white/50 leading-relaxed">
                        Identify skill gaps and get actionable suggestions to bypass ATS filters for your target role.
                    </p>
                </header>

                <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-4xl'} gap-6 items-start`}>
                    
                    {/* Left Panel: Input */}
                    <div className="space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 shadow-sm">
                        <div className="space-y-4">
                            <label className="text-xs font-semibold uppercase tracking-wider text-white/30">01. Select Target Role</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {BIG_FIVE.map((role) => (
                                    <button
                                        key={role.key}
                                        onClick={() => setSelectedRole(role.key)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all ${
                                            selectedRole === role.key 
                                            ? "bg-indigo-600 border-indigo-600 text-white" 
                                            : "bg-white/5 border-white/5 hover:border-white/10"
                                        }`}
                                    >
                                        <role.icon className="w-4 h-4 shrink-0" />
                                        <span>{role.key}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-semibold uppercase tracking-wider text-white/30">02. Paste Resume Text</label>
                            <div className="relative group">
                                <textarea
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Paste full resume content (Experience, Skills, Projects)..."
                                    className="w-full h-[400px] bg-black/20 border border-white/10 rounded-xl p-4 text-sm font-medium leading-relaxed placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                                />
                                <div className="absolute bottom-4 right-4 flex gap-3">
                                    <button 
                                        onClick={handleAnalyze}
                                        disabled={loading || !resumeText.trim() || !selectedRole}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white px-6 py-2.5 rounded-lg text-xs font-bold transition-all shadow-lg"
                                    >
                                        {loading ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                                        {loading ? "Analyzing..." : "Analyze Resume"}
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-rose-500 text-[11px] font-medium">{error}</p>}
                        </div>
                    </div>

                    {/* Right Panel: Results (Conditional) */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Score & Status Card */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-20 h-20 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="6" />
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className={`${theme.split(' ')[0]} transition-all duration-1000`} strokeDasharray={`${score * 2.82} 282`} strokeLinecap="round" />
                                            </svg>
                                            <span className="text-2xl font-bold">{score}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold uppercase tracking-wide">{result.role} Match</h3>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme}`}>
                                                {result.ats_status}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={reset} className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Skills Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">Matched Strengths</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.strengths?.map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-md text-[11px] font-medium text-emerald-400/90 flex items-center gap-1.5">
                                                    <Check className="w-3 h-3" /> {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80">Missing Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing_skills?.map(s => (
                                                <span key={s} className="px-2.5 py-1 bg-rose-500/5 border border-rose-500/10 rounded-md text-[11px] font-medium text-rose-400/90 flex items-center gap-1.5">
                                                    <X className="w-3 h-3" /> {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestions & Roadmap */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Optimization Roadmap</h4>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {result.roadmap?.map((step, idx) => (
                                            <div key={idx} className="flex gap-4 items-start group">
                                                <div className="mt-1 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-white/30 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                                                    {idx + 1}
                                                </div>
                                                <p className="text-sm text-white/60 leading-relaxed group-hover:text-white transition-colors">{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Suggestions Buffer */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="p-5 border-b border-white/5 bg-white/[0.01]">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 italic">Strategic Suggestions</h4>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        {result.recommendations?.map((rec, idx) => (
                                            <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-xl space-y-3 group transition-all hover:border-indigo-500/20">
                                                <p className="text-sm font-medium italic leading-relaxed text-white/70">"{rec}"</p>
                                                <button 
                                                    onClick={() => copyText(rec, idx)}
                                                    className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${copiedIdx === idx ? 'text-emerald-400' : 'text-white/20 hover:text-indigo-400'}`}
                                                >
                                                    {copiedIdx === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                    {copiedIdx === idx ? 'Copied' : 'Copy Suggestion'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Section (Fill Space) */}
                <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
                    <div className="space-y-3 p-4">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center">
                            <Layers className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h4 className="text-sm font-bold">How it works</h4>
                        <p className="text-[13px] text-white/40 leading-relaxed italic">
                            We use semantic analysis to compare your resume against a database of successful job applications and role-specific requirements.
                        </p>
                    </div>
                    <div className="space-y-3 p-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center">
                            <Fingerprint className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-bold">Privacy First</h4>
                        <p className="text-[13px] text-white/40 leading-relaxed italic">
                            Your resume text is processed locally in your session and never stored on our servers. Analysis is instant and private.
                        </p>
                    </div>
                    <div className="space-y-3 p-4">
                        <div className="w-10 h-10 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center">
                            <Search className="w-5 h-5 text-rose-400" />
                        </div>
                        <h4 className="text-sm font-bold">ATS Optimization</h4>
                        <p className="text-[13px] text-white/40 leading-relaxed italic">
                            Get suggestions for action verbs, keyword density, and formatting that specifically trigger recruiter shortlisting.
                        </p>
                    </div>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
