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
        if (!jd.trim()) {
            setError("Please enter job description for accurate analysis");
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
        const updatedText = resumeText.split(original).join(improved);
        setResumeText(updatedText);
        setAppliedSuggestion(improved);
        handleAnalyze(updatedText);
        setTimeout(() => setAppliedSuggestion(null), 2000);
    };

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-500/10 font-sans">
            <PublicHeader />
            
            {/* 🥇 PRODUCT HEADER: CLARITY FIRST */}
            <div className="bg-slate-50/50 border-b border-slate-100 pt-28 pb-10 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                            AI <span className="text-indigo-600">Workbench</span>
                        </h1>
                        {result && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Strength: {result.match_score > 70 ? 'Strong alignment with core requirements' : 'Solid foundation detected'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-rose-500 font-bold text-sm">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>Missing: {result.missing_skills?.slice(0, 3).join(", ") || "None detected"}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {result && (
                        <div className="flex gap-4">
                            <div className="bg-slate-900 text-white px-8 py-5 rounded-3xl shadow-2xl flex flex-col items-center justify-center min-w-[160px]">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Match Score</p>
                                <p className="text-4xl font-black italic text-emerald-400 leading-none">{result.match_score}%</p>
                            </div>
                            <div className="bg-white border border-slate-200 px-8 py-5 rounded-3xl shadow-xl flex flex-col items-center justify-center min-w-[160px]">
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">ATS Status</p>
                                <p className="text-xl font-black italic text-slate-900 leading-none uppercase">{result.ats_status}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {!result && !loading ? (
                    <div className="grid lg:grid-cols-2 gap-12 items-center py-10">
                        <div className="space-y-8">
                            <h2 className="text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase italic">
                                Built for <br /> <span className="text-indigo-600">Shortlists.</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium italic border-l-4 border-indigo-500 pl-8 max-w-lg">
                                Stop guessing. Let AI benchmark your resume against the JD and provide instant, high-impact rewrites.
                            </p>
                        </div>

                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl space-y-8">
                            <div className="space-y-4">
                              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">1. Paste Resume Content</label>
                              <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                placeholder="Paste your resume here..."
                                className="w-full h-44 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium text-slate-700"
                              />
                            </div>
                            <div className="space-y-4">
                              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">2. Paste Job Description</label>
                              <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste the JD here..."
                                className="w-full h-44 p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium text-slate-700"
                              />
                            </div>
                            {error && <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold text-center border border-rose-100">{error}</div>}
                            <button onClick={() => handleAnalyze()} className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-slate-800 transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4">
                              Analyze & Optimize <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                ) : result && !loading ? (
                    <div className="grid lg:grid-cols-2 gap-10">
                        
                        {/* 📝 LEFT COLUMN: LIVE EDITOR */}
                        <div className="space-y-6">
                            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm flex flex-col h-[800px] space-y-6">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Live Editor</h3>
                                    <button onClick={() => handleAnalyze()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        <RotateCcw className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <textarea 
                                    className="flex-1 w-full bg-transparent text-base leading-relaxed text-slate-700 focus:outline-none resize-none font-medium scrollbar-hide"
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 🚀 RIGHT COLUMN: AI FEEDBACK */}
                        <div className="space-y-8">
                            {/* SUGGESTIONS SECTION */}
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 border-b border-slate-100 pb-4">
                                    Strategic Improvements
                                </h4>
                                <div className="space-y-4">
                                    {(!result.recommendations || result.recommendations.length === 0) ? (
                                        <div className="bg-slate-50 border border-slate-200 p-12 rounded-[2.5rem] text-center space-y-4">
                                            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
                                            <div className="space-y-1">
                                                <p className="font-black text-slate-900 uppercase italic">No suggestions generated.</p>
                                                <p className="text-xs text-slate-500 font-medium">Model might be warming up or resume is already strong.</p>
                                            </div>
                                            <button 
                                                onClick={() => handleAnalyze()}
                                                className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all"
                                            >
                                                Retry Analysis
                                            </button>
                                        </div>
                                    ) : (
                                        result.recommendations.slice(0, 5).map((rec, i) => (
                                            <div key={i} className="group p-6 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-200 transition-all shadow-sm space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full uppercase tracking-tighter">
                                                        +{rec.impact_gain} Impact
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3 opacity-40">
                                                        <span className="text-rose-500 font-bold text-xs mt-0.5">✕</span>
                                                        <p className="text-xs text-slate-600 italic">"{rec.original}"</p>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-emerald-500 font-bold text-xs mt-0.5">✓</span>
                                                        <p className="text-sm text-slate-900 font-bold italic">"{rec.improved}"</p>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => applySuggestion(rec.original, rec.improved)}
                                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                                >
                                                    {appliedSuggestion === rec.improved ? <Check className="w-4 h-4 text-emerald-400" /> : <MousePointer2 className="w-4 h-4" />}
                                                    {appliedSuggestion === rec.improved ? 'Applied' : 'Apply Fix'}
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* SKILLS SECTION */}
                            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-100">
                                <div className="space-y-4">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">✓ Verified Keywords</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(result.skills_found || []).length > 0 ? result.skills_found.map(s => (
                                            <span key={s} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 uppercase italic">{s}</span>
                                        )) : <p className="text-xs text-slate-400 italic">No direct keyword matches found.</p>}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-[11px] font-black uppercase tracking-widest text-rose-500">✕ Missing from Resume</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(result.missing_skills || []).length > 0 ? result.missing_skills.map(s => (
                                            <span key={s} className="px-4 py-2 bg-rose-50/50 border border-rose-100 rounded-xl text-[11px] font-bold text-rose-600 uppercase italic">-{s}</span>
                                        )) : <p className="text-xs text-slate-400 italic">Excellent! All core keywords found.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : loading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
                        <div className="w-20 h-20 border-[6px] border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Analyzing your resume...</h2>
                            <p className="text-slate-500 font-medium italic">This may take 10–20 seconds (AI loading)</p>
                        </div>
                    </div>
                )}
            </div>
            
            <PublicFooter />
        </div>
    );
};
export default ResumeFixer;
