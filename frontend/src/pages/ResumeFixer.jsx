import { useState } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, Copy,
  AlertCircle, Check, Sparkles, ChevronDown,
  AlertTriangle, Target, Zap, Code2, 
  Palette, Database, Smartphone, BarChart3,
  Briefcase, Search, X
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";

// ─── Pre-built role templates ───────────────────────
const ROLES = [
  { key: "frontend_developer", label: "Frontend Developer", icon: Code2, color: "from-blue-500 to-cyan-400" },
  { key: "backend_developer", label: "Backend Developer", icon: Database, color: "from-emerald-500 to-teal-400" },
  { key: "fullstack_developer", label: "Full Stack Developer", icon: Zap, color: "from-violet-500 to-purple-400" },
  { key: "data_scientist", label: "Data Scientist", icon: BarChart3, color: "from-orange-500 to-amber-400" },
  { key: "devops_engineer", label: "DevOps Engineer", icon: Target, color: "from-red-500 to-rose-400" },
  { key: "mobile_developer", label: "Mobile Developer", icon: Smartphone, color: "from-pink-500 to-fuchsia-400" },
  { key: "product_manager", label: "Product Manager", icon: Briefcase, color: "from-indigo-500 to-blue-400" },
  { key: "ui_ux_designer", label: "UI/UX Designer", icon: Palette, color: "from-yellow-500 to-orange-400" },
  { key: "general_sde", label: "Software Engineer", icon: Search, color: "from-slate-600 to-slate-400" },
];

const ResumeFixer = () => {
    const { user } = useAuth();
    const { resumeText, setResumeText } = useResumeStore();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [showCustomJD, setShowCustomJD] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [highlightedIdx, setHighlightedIdx] = useState(null);

    const handleAnalyze = async () => {
        if (!resumeText.trim() && !file) {
            setError("Paste your resume content to begin.");
            return;
        }
        if (!selectedRole && !jd.trim()) {
            setError("Select a target role or paste a custom job description.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);
        try {
            const data = await analyzeResume(file, jd, resumeText, selectedRole);
            console.log("API RESULT:", data);
            if (!data) throw new Error("Empty response from server");
            setResult(data);
        } catch (err) {
            console.error("Analysis Error:", err);
            setError(err?.response?.data?.error || err.message || "Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const locateInEditor = (original) => {
        const idx = resumeText.toLowerCase().indexOf(original.toLowerCase().substring(0, 40));
        if (idx === -1) {
            setError("Text not found in editor — this may be an AI-generated suggestion. Use 'Copy' to paste manually.");
            setTimeout(() => setError(""), 4000);
            return;
        }
        const before = resumeText.substring(0, idx);
        const match = resumeText.substring(idx, idx + original.length);
        const after = resumeText.substring(idx + original.length);
        setResumeText(`${before}▶▶ ${match} ◀◀${after}`);
    };

    const resetAnalysis = () => {
        setResult(null);
        setError("");
        setSelectedRole("");
        setJd("");
        setShowCustomJD(false);
    };

    const score = result?.score || result?.match_score || 0;
    const recs = result?.recommendations || result?.suggestions || [];
    const skillsFound = result?.skills_found || [];
    const missingSkills = result?.missing_skills || [];
    const issues = result?.issues || [];
    const summary = result?.summary || result?.insight || "";
    const atsStatus = result?.fit_label || result?.ats_status || "";

    // ─── Score ring color ────────────────────────────
    const getScoreColor = (s) => {
        if (s >= 80) return { ring: "text-emerald-500", bg: "bg-emerald-500/10", label: "text-emerald-600" };
        if (s >= 60) return { ring: "text-amber-500", bg: "bg-amber-500/10", label: "text-amber-600" };
        return { ring: "text-rose-500", bg: "bg-rose-500/10", label: "text-rose-600" };
    };
    const sc = getScoreColor(score);

    // ─── LOADING STATE ──────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
                <PublicHeader />
                <div className="flex-1 flex flex-col items-center justify-center gap-8">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full border-[6px] border-white/5 border-t-indigo-500 animate-spin" />
                        <Sparkles className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="text-center space-y-3">
                        <h2 className="text-2xl font-bold text-white">Analyzing your resume...</h2>
                        <p className="text-white/40 text-sm">AI is comparing against job requirements • 10–20 seconds</p>
                    </div>
                </div>
            </div>
        );
    }

    // ─── RESULTS STATE ──────────────────────────────
    if (result) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white">
                <PublicHeader />

                {/* ── Score Dashboard ──────────────────── */}
                <div className="border-b border-white/5 pt-24 pb-10">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            {/* Score Ring */}
                            <div className="flex items-center gap-8">
                                <div className={`relative w-32 h-32 rounded-full ${sc.bg} flex items-center justify-center`}>
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className={sc.ring}
                                            strokeDasharray={`${score * 2.64} 264`} strokeLinecap="round" />
                                    </svg>
                                    <span className="text-4xl font-black">{score}</span>
                                </div>
                                <div className="space-y-2">
                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${sc.bg} ${sc.label}`}>
                                        {score >= 70 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        {atsStatus}
                                    </div>
                                    <p className="text-white/50 text-sm max-w-md">{summary}</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-4">
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-center">
                                    <p className="text-2xl font-black text-emerald-400">{skillsFound.length}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Skills Found</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-center">
                                    <p className="text-2xl font-black text-rose-400">{missingSkills.length}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Missing</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-center">
                                    <p className="text-2xl font-black text-amber-400">{issues.length}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Issues</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-center">
                                    <p className="text-2xl font-black text-indigo-400">{recs.length}</p>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Fixes</p>
                                </div>
                            </div>
                        </div>

                        {/* Action bar */}
                        <div className="mt-8 flex gap-3">
                            <button onClick={resetAnalysis} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-all">
                                <RotateCcw className="w-4 h-4" /> New Analysis
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main Content ──────────────────── */}
                <div className="max-w-6xl mx-auto px-6 py-10">
                    <div className="grid lg:grid-cols-5 gap-8">

                        {/* LEFT: Resume Editor (2/5) */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 h-[700px] flex flex-col">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-4">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/30">Your Resume</h3>
                                    <button onClick={handleAnalyze} className="text-white/20 hover:text-white/60 transition-colors">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>
                                <textarea
                                    className="flex-1 w-full bg-transparent text-[13px] leading-[1.8] text-white/70 focus:outline-none resize-none font-mono"
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>

                            {/* Issues Panel */}
                            {issues.length > 0 && (
                                <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" /> Resume Issues ({issues.length})
                                    </h4>
                                    <ul className="space-y-2">
                                        {issues.map((issue, i) => (
                                            <li key={i} className="text-sm text-white/60 flex items-start gap-3">
                                                <span className="text-amber-400 mt-0.5">•</span>
                                                {issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: AI Feedback (3/5) */}
                        <div className="lg:col-span-3 space-y-8">

                            {/* Skills Section */}
                            <div className="grid grid-cols-2 gap-4">
                                {skillsFound.length > 0 && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">✓ Matched Skills</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {skillsFound.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] font-semibold text-emerald-300">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {missingSkills.length > 0 && (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">✕ Missing Skills</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {missingSkills.map(s => (
                                                <span key={s} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] font-semibold text-rose-300">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Recommendations */}
                            <div className="space-y-5">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> AI Rewrites ({recs.length})
                                </h4>

                                {recs.length === 0 ? (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-12 text-center space-y-4">
                                        <Sparkles className="w-10 h-10 text-white/10 mx-auto" />
                                        <p className="text-white/40 text-sm">No specific rewrites generated. Try a different role or add more resume content.</p>
                                        <button onClick={resetAnalysis} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold transition-all">
                                            Try Again
                                        </button>
                                    </div>
                                ) : (
                                    recs.slice(0, 6).map((rec, i) => (
                                        <div key={i} 
                                            className={`bg-white/[0.02] border rounded-2xl p-6 space-y-4 transition-all ${highlightedIdx === i ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-white/5 hover:border-white/10'}`}
                                            onMouseEnter={() => setHighlightedIdx(i)}
                                            onMouseLeave={() => setHighlightedIdx(null)}
                                        >
                                            {/* Section badge + reason */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-white/40">
                                                    {rec.section || "General"}
                                                </span>
                                                <button 
                                                    onClick={() => locateInEditor(rec.original)}
                                                    className="text-[10px] font-bold uppercase tracking-wider text-white/20 hover:text-indigo-400 transition-colors"
                                                >
                                                    Find in Editor →
                                                </button>
                                            </div>

                                            {/* Original */}
                                            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
                                                <div className="flex items-start gap-3">
                                                    <X className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-white/40 leading-relaxed">{rec.original}</p>
                                                </div>
                                            </div>

                                            {/* Improved */}
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                                                <div className="flex items-start gap-3">
                                                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-white/80 font-medium leading-relaxed">{rec.improved}</p>
                                                </div>
                                            </div>

                                            {/* Reason */}
                                            {rec.reason && (
                                                <p className="text-[11px] text-white/25 italic pl-7">↳ {rec.reason}</p>
                                            )}

                                            {/* Copy button */}
                                            <button 
                                                onClick={() => copyToClipboard(rec.improved, i)}
                                                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                                                    copiedIdx === i 
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                                    : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
                                                }`}
                                            >
                                                {copiedIdx === i ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Improved Text</>}
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <PublicFooter />
            </div>
        );
    }

    // ─── INPUT STATE (Landing) ──────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <PublicHeader />
            
            <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
                {/* Hero */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> AI-Powered Resume Optimizer
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05]">
                        Get your resume<br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">job-ready in seconds</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-xl mx-auto">
                        Paste your resume, select a target role, and get instant AI-powered rewrites with real impact metrics.
                    </p>
                </div>

                <div className="space-y-10">
                    {/* Step 1: Resume */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-black">1</span>
                            Paste your resume
                        </label>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your full resume content here..."
                            className="w-full h-56 p-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white/70 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 outline-none transition-all resize-none font-mono placeholder:text-white/15"
                        />
                    </div>

                    {/* Step 2: Role Selection */}
                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/30 flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-black">2</span>
                            Select target role
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
                            {ROLES.map((role) => {
                                const Icon = role.icon;
                                const isSelected = selectedRole === role.key;
                                return (
                                    <button
                                        key={role.key}
                                        onClick={() => { setSelectedRole(isSelected ? "" : role.key); setShowCustomJD(false); }}
                                        className={`relative group flex items-center gap-3 px-4 py-4 rounded-2xl border text-left transition-all ${
                                            isSelected 
                                            ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/20' 
                                            : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0 ${isSelected ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'} transition-opacity`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-white' : 'text-white/50 group-hover:text-white/70'}`}>
                                            {role.label}
                                        </span>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 absolute top-2.5 right-2.5" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom JD toggle */}
                        <button 
                            onClick={() => { setShowCustomJD(!showCustomJD); if (!showCustomJD) setSelectedRole(""); }}
                            className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors font-medium"
                        >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCustomJD ? 'rotate-180' : ''}`} />
                            Or paste a custom job description
                        </button>
                        {showCustomJD && (
                            <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the full job description here..."
                                className="w-full h-40 p-6 bg-white/[0.03] border border-white/5 rounded-2xl text-sm text-white/70 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 outline-none transition-all resize-none placeholder:text-white/15"
                            />
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-sm text-rose-400 font-medium flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button 
                        onClick={handleAnalyze} 
                        disabled={!resumeText.trim() || (!selectedRole && !jd.trim())}
                        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                            (!resumeText.trim() || (!selectedRole && !jd.trim()))
                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl shadow-indigo-500/20 active:scale-[0.99]'
                        }`}
                    >
                        Analyze My Resume <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
