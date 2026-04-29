import { useState, useEffect } from "react";
import { 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  MousePointer2,
  AlertCircle,
  Check,
  Sparkles,
  Info
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";

const ResumeFixer = () => {
    const { user } = useAuth();
    const { scanResult, resumeText, setResumeText } = useResumeStore();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [appliedSuggestion, setAppliedSuggestion] = useState(null);

    const handleAnalyze = async (textOverride = null) => {
        const textToUse = textOverride || resumeText;
        if (!textToUse.trim() && !file) {
            setError("Paste your resume content to begin.");
            return;
        }
        if (!jd.trim() || jd.length < 20) {
            setError("Please enter a proper job description (min 20 characters) for accurate analysis.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const data = await analyzeResume(file, jd, textToUse);
            console.log("API RESULT:", data);

            if (!data || !data.recommendations) {
                throw new Error("Invalid AI response");
            }
            setResult(data);
        } catch (err) {
            setError(err.message || "Optimization failed.");
        } finally {
            setLoading(false);
        }
    };

    const applySuggestion = (original, improved) => {
        const index = resumeText.toLowerCase().indexOf(original.toLowerCase());

        if (index === -1) {
            setError("Sentence not found in editor. Please edit manually.");
            return;
        }

        const before = resumeText.substring(0, index);
        const match = resumeText.substring(index, index + original.length);
        const after = resumeText.substring(index + original.length);

        const highlighted = `${before}<<${match}>>${after}`;
        setResumeText(highlighted);
        setAppliedSuggestion(improved);
        setTimeout(() => setAppliedSuggestion(null), 3000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setAppliedSuggestion("COPIED");
        setTimeout(() => setAppliedSuggestion(null), 2000);
    };

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-500/10 font-sans">
            <PublicHeader />
            
            {/* 🥇 PRODUCT HEADER: ACTIONABLE SCORE */}
            <div className="bg-white border-b border-slate-100 pt-28 pb-12 px-6">
                <div className="max-w-5xl mx-auto space-y-8 text-center md:text-left">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            Your Resume Score: <span className="text-indigo-600">{result?.match_score || "N/A"}/100</span>
                            {result && <span className="text-xl md:text-2xl text-slate-400 ml-4 italic font-medium">({result.ats_status})</span>}
                        </h1>
                    </div>

                    {result && (
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                            <div className="flex items-start gap-4 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-emerald-700 uppercase tracking-widest">Strengths</p>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        {result.match_score > 70 ? 'Strong alignment with core technical requirements' : 'Solid professional foundation detected'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100">
                                <AlertCircle className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-rose-700 uppercase tracking-widest">Areas to Improve</p>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        Missing: {result.missing_skills?.length > 0 ? result.missing_skills.slice(0, 3).join(", ") : "None detected"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {!result && !loading ? (
                    <div className="grid lg:grid-cols-2 gap-16 items-center py-10">
                        <div className="space-y-8">
                            <h2 className="text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase italic">
                                Built for <br /> <span className="text-indigo-600">Shortlists.</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium italic border-l-4 border-indigo-500 pl-8 max-w-lg">
                                Stop guessing. Let AI benchmark your resume against the JD and provide instant, high-impact rewrites.
                            </p>
                        </div>

                        <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-10">
                            <div className="space-y-4">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-400">1. Paste Resume Content</label>
                              <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                placeholder="Paste your resume here..."
                                className="w-full h-44 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium text-slate-700"
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-400">2. Paste Job Description</label>
                              <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the target role description here..."
                                className="w-full h-44 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium text-slate-700"
                              />
                            </div>
                            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold text-center border border-rose-100">{error}</div>}
                            <button onClick={() => handleAnalyze()} className="w-full py-7 bg-slate-900 text-white rounded-[2rem] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4">
                              Analyze My Resume <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : result && !loading ? (
                    <div className="grid lg:grid-cols-2 gap-12">
                        
                        {/* 📝 LEFT COLUMN: LIVE EDITOR */}
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-[800px] space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Live Editor</h3>
                                    <button onClick={() => handleAnalyze()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        <RotateCcw className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <textarea 
                                    className="flex-1 w-full bg-transparent text-base leading-relaxed text-slate-700 focus:outline-none resize-none font-medium scrollbar-hide"
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                />
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 italic">
                                    Tip: When you click "Locate in Editor", the text will be wrapped in {"<< >>"} for easy finding.
                                </div>
                            </div>
                        </div>

                        {/* 🚀 RIGHT COLUMN: AI FEEDBACK */}
                        <div className="space-y-10">
                            {/* SUGGESTIONS SECTION */}
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 border-b border-slate-100 pb-4">
                                    Recommended Rewrites
                                </h4>
                                <div className="space-y-6">
                                    {(!result.recommendations || result.recommendations.length === 0) ? (
                                        <div className="bg-slate-50 border border-slate-200 p-16 rounded-[2.5rem] text-center space-y-6">
                                            <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
                                            <div className="space-y-2">
                                                <p className="text-lg font-black text-slate-900 uppercase italic leading-none">No suggestions generated.</p>
                                                <p className="text-sm text-slate-500 font-medium italic">Try adding a more detailed job description for better analysis.</p>
                                            </div>
                                            <button 
                                                onClick={() => handleAnalyze()}
                                                className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                                            >
                                                Retry Analysis
                                            </button>
                                        </div>
                                    ) : (
                                        result.recommendations.slice(0, 5).map((rec, i) => (
                                            <div key={i} className="group p-8 bg-white border border-slate-200 rounded-[2.5rem] hover:border-indigo-200 transition-all shadow-sm space-y-6">
                                                <div className="space-y-4">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Improve this sentence:</p>
                                                    <div className="space-y-4">
                                                        <div className="flex items-start gap-4 bg-rose-50/30 p-4 rounded-2xl border border-rose-50 relative group">
                                                            <span className="text-rose-500 font-bold text-sm">✕</span>
                                                            <p className="text-sm text-slate-500 italic">"{rec.original}"</p>
                                                            <button 
                                                                onClick={() => applySuggestion(rec.original, rec.improved)}
                                                                className="absolute -top-3 -right-2 bg-white border border-slate-200 px-3 py-1 rounded-full text-[9px] font-black uppercase shadow-sm hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                Locate in Editor
                                                            </button>
                                                        </div>
                                                        <div className="flex items-start gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-50">
                                                            <span className="text-emerald-500 font-bold text-sm">✓</span>
                                                            <p className="text-base text-slate-900 font-bold italic leading-relaxed">"{rec.improved}"</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => copyToClipboard(rec.improved)}
                                                    className="w-full py-5 bg-slate-900 text-white rounded-[1.25rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                                                >
                                                    {appliedSuggestion === "COPIED" ? <Check className="w-5 h-5 text-emerald-400" /> : <MousePointer2 className="w-5 h-5" />}
                                                    {appliedSuggestion === "COPIED" ? 'Copied to Clipboard' : 'Copy Improved Text'}
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* SKILLS SECTION: ONLY SHOW IF DATA EXISTS */}
                            {((result.skills_found?.length > 0) || (result.missing_skills?.length > 0)) ? (
                                <div className="grid grid-cols-1 gap-10 pt-10 border-t border-slate-100">
                                    {result.skills_found?.length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">✓ Detected Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.skills_found.map(s => (
                                                    <span key={s} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 uppercase italic tracking-tighter">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {result.missing_skills?.length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-xs font-black uppercase tracking-widest text-rose-500">✕ Missing Keywords</p>
                                            <div className="flex flex-wrap gap-2">
                                                {result.missing_skills.map(s => (
                                                    <span key={s} className="px-5 py-2.5 bg-rose-50/50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 uppercase italic tracking-tighter">-{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : result && !loading && (
                                <div className="pt-10 border-t border-slate-100">
                                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <AlertCircle className="w-5 h-5 text-slate-400" />
                                        <p className="text-sm text-slate-500 font-medium italic">
                                            ⚠ AI could not extract keywords properly. Try adding a more detailed job description.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : loading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10">
                        <div className="w-24 h-24 border-[8px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="text-center space-y-3">
                            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Analyzing your resume...</h2>
                            <p className="text-lg text-slate-500 font-medium italic">This may take 10–20 seconds (AI loading)</p>
                        </div>
                    </div>
                )}
            </div>
            
            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
