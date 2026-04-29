import { useState, useEffect } from "react";
import { 
  Zap, 
  Sparkles, 
  Target, 
  RotateCcw, 
  CheckCircle2, 
  TrendingUp,
  Activity,
  ArrowRight,
  MousePointer2,
  AlertCircle,
  Hash,
  Layout,
  BarChart3,
  Check
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
        setLoading(true);
        setError("");
        try {
            const data = await analyzeResume(file, jd || "General Role Optimization", textToUse);
            setResult(data);
        } catch (err) {
            setError(err.message || "Optimization failed.");
        } finally {
            setLoading(false);
        }
    };

    const applySuggestion = (original, improved) => {
        const updatedText = resumeText.replace(original, improved);
        setResumeText(updatedText);
        setAppliedSuggestion(improved);
        handleAnalyze(updatedText);
        setTimeout(() => setAppliedSuggestion(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] selection:bg-indigo-500/10 font-sans">
            <PublicHeader />
            
            {/* 🥇 HEADER (COMPACT & DENSE) */}
            <div className="bg-white border-b border-slate-100 pt-28 pb-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-[9px] uppercase tracking-widest">
                            <Activity className="w-3 h-3" /> Professional Workbench
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                            Optimize <span className="text-indigo-600">Your Impact</span>
                        </h1>
                    </div>
                    {result && (
                        <div className="flex items-center gap-6 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-xl">
                            <div className="text-center">
                                <p className="text-[8px] font-bold uppercase text-slate-500 tracking-[0.2em] mb-0.5">Match Score</p>
                                <p className="text-2xl font-black italic text-emerald-400 leading-none">{result.match_score}%</p>
                            </div>
                            <div className="w-px h-8 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-[8px] font-bold uppercase text-slate-500 tracking-[0.2em] mb-0.5">ATS Status</p>
                                <p className="text-sm font-black italic text-white leading-none uppercase">{result.ats_status}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-6">
                {!result && !loading ? (
                    <div className="grid lg:grid-cols-2 gap-10 items-center min-h-[60vh]">
                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase italic">
                                Engineer a <br /> <span className="text-indigo-600">Shortlist-Ready</span> Resume.
                            </h2>
                            <p className="text-lg text-slate-500 font-medium italic border-l-2 border-indigo-200 pl-6 max-w-lg">
                                Real data-driven scoring across 5 metrics. Detect quantified gaps and apply AI suggestions with one click.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase italic">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Action Verbs
                               </div>
                               <div className="flex items-center gap-2 text-slate-900 font-bold text-[10px] uppercase italic">
                                   <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quantified Impact
                               </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-2xl shadow-indigo-500/5 space-y-6">
                            <div className="space-y-3">
                              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Optimization Input</label>
                              <textarea
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="w-full h-80 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all resize-none font-medium text-slate-600"
                              />
                            </div>
                            {error && <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold text-center italic">{error}</div>}
                            <button onClick={() => handleAnalyze()} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                              Initialize AI Workbench <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : result && !loading ? (
                    <div className="grid lg:grid-cols-12 gap-6">
                        
                        {/* 📊 LEFT COLUMN: METRICS HUB */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-5">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500 border-b border-slate-50 pb-3 flex items-center gap-2">
                                    <BarChart3 className="w-3.5 h-3.5" /> Benchmarks
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { label: "Keyword Overlap", score: result.metrics?.keyword_match || 0, icon: <Target className="w-3 h-3" /> },
                                        { label: "Action Verbs", score: result.metrics?.action_verbs || 0, icon: <Zap className="w-3 h-3" /> },
                                        { label: "Quantified Results", score: result.metrics?.quantified_results || 0, icon: <TrendingUp className="w-3 h-3" /> },
                                        { label: "Formatting", score: result.metrics?.formatting || 0, icon: <Layout className="w-3 h-3" /> },
                                        { label: "Readability", score: result.metrics?.readability || 0, icon: <Activity className="w-3 h-3" /> },
                                    ].map((m, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase italic text-slate-500">
                                                <span className="flex items-center gap-1">{m.icon} {m.label}</span>
                                                <span className={m.score > 70 ? 'text-emerald-500' : 'text-slate-400'}>{m.score}%</span>
                                            </div>
                                            <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: `${m.score}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-3xl p-5 text-white space-y-4">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">ML Insights</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[8px] font-bold text-slate-400 mb-1">Strong Verbs</p>
                                        <p className="text-xl font-black italic">{result.stats?.strong_verbs || 0}</p>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[8px] font-bold text-slate-400 mb-1">Metrics Found</p>
                                        <p className="text-xl font-black italic">{result.stats?.metrics_detected || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 🏆 RIGHT COLUMN: EDITOR & SUGGESTIONS */}
                        <div className="lg:col-span-8 grid lg:grid-cols-2 gap-6">
                            {/* LIVE EDITOR */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col h-[700px]">
                                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Live Editor</p>
                                    <button onClick={() => handleAnalyze()} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors"><RotateCcw className="w-3.5 h-3.5 text-slate-400" /></button>
                                </div>
                                <textarea 
                                    className="flex-1 w-full bg-transparent text-[13px] leading-relaxed text-slate-600 focus:outline-none resize-none font-medium scrollbar-hide"
                                    value={resumeText}
                                    onChange={(e) => setResumeText(e.target.value)}
                                    placeholder="Resume content..."
                                />
                            </div>

                            {/* ACTIONABLE SUGGESTIONS */}
                            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-5 flex flex-col h-[700px]">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-500 border-b border-slate-50 pb-3">Optimized Suggestions</p>
                                <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                                    {(result.recommendations || []).length > 0 ? (result.recommendations || []).map((rec, i) => (
                                        <div key={i} className="group p-4 bg-slate-50 hover:bg-white hover:border-indigo-100 border border-slate-50 rounded-2xl transition-all space-y-3 relative">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-bold uppercase">
                                                    <CheckCircle2 className="w-2.5 h-2.5" /> High Impact
                                                </div>
                                                <span className="text-[10px] font-black text-indigo-600 italic">{rec.impact_gain}</span>
                                            </div>
                                            
                                            {rec.type === 'rewrite' ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-300 mt-1 flex-shrink-0"></div>
                                                        <p className="text-[11px] text-slate-400 italic font-medium">"{rec.original}"</p>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 flex-shrink-0"></div>
                                                        <p className="text-[11px] text-slate-900 font-bold italic">"{rec.improved}"</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => applySuggestion(rec.original, rec.improved)}
                                                        className="mt-2 w-full py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                    >
                                                        {appliedSuggestion === rec.improved ? <Check className="w-3 h-3" /> : <MousePointer2 className="w-3 h-3" />}
                                                        {appliedSuggestion === rec.improved ? 'Applied' : 'Apply Fix'}
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-slate-600 font-medium italic">{rec.message}</p>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                                            <Sparkles className="w-10 h-10 text-slate-200" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Scanning Complete</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 📊 BOTTOM METRICS: SKILLS GAP */}
                        <div className="lg:col-span-12 grid lg:grid-cols-2 gap-6 pt-10 border-t border-slate-100">
                             <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-5">
                                <h5 className="text-[9px] font-black uppercase text-rose-500 tracking-[0.3em] flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" /> Missing Core Skills
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                   {(result.missing_skills || []).length > 0 ? (result.missing_skills || []).map(s => (
                                       <span key={s} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold border border-rose-100 uppercase italic">-{s}</span>
                                   )) : <p className="text-[11px] text-slate-400 italic">Excellent! No core skills missing.</p>}
                                </div>
                             </div>
                             <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-5">
                                <h5 className="text-[9px] font-black uppercase text-indigo-500 tracking-[0.3em] flex items-center gap-2">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Keywords
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                   {(result.skills_found || []).length > 0 ? (result.skills_found || []).map(s => (
                                       <span key={s} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-bold border border-indigo-100 uppercase italic">{s}</span>
                                   )) : <p className="text-[11px] text-slate-400 italic">No exact matches found.</p>}
                                </div>
                             </div>
                        </div>
                    </div>
                ) : loading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-widest animate-pulse">Running Neural Engine...</h2>
                    </div>
                )}
            </div>
            
            <PublicFooter />
        </div>
    );
};
export default ResumeFixer;
