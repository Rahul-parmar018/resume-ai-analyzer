import { useState, useEffect } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";

const ResumeFixer = () => {
    const { user } = useAuth();
    const { scanResult, resumeText, setResumeText } = useResumeStore();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleRewrite = async () => {
        if (!user) return alert("Please sign in first.");
        if (!resumeText.trim()) return alert("Please paste or scan your resume content.");

        try {
            setLoading(true);
            const token = await user.getIdToken(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/rewrite-resume/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ resume_text: resumeText })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Optimization failed");
            }

            const data = await res.json();
            setResults(data.results || []);
        } catch (err) {
            console.error(err);
            alert("Error optimizing resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <PublicHeader />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Neural Resume Fixer</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                        Automatically transform weak, passive phrases into high-velocity <span className="text-indigo-600 font-black">quantified achievements</span>.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* INPUT SECTION */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Optimization Input</label>
                                <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Decision Logic Enhanced</span>
                            </div>
                            <textarea 
                                className="w-full h-[500px] bg-slate-50 rounded-3xl p-6 text-sm font-medium border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none mb-6 font-mono"
                                placeholder="Paste your resume bullets or full context here..."
                                value={resumeText}
                                onChange={(e) => setResumeText(e.target.value)}
                            ></textarea>
                            
                            <button 
                                onClick={handleRewrite}
                                disabled={loading || !resumeText.trim()}
                                className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        Generating Neural Fixes...
                                    </>
                                ) : (
                                    <>
                                        Fix All with AI →
                                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">bolt</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* RESULTS SECTION */}
                    <div className="lg:col-span-7 space-y-6 max-h-[900px] overflow-y-auto pr-2 custom-scrollbar">
                        {!results && !loading && (
                            <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center space-y-6 h-full min-h-[500px]">
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-200 text-4xl">psychology</span>
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-xl font-black text-slate-900 mb-2">System Initialized</h3>
                                    <p className="text-slate-400 text-sm font-medium leading-relaxed">Analysis from your scanner is ready. Click 'Fix All with AI' to begin the transformation.</p>
                                </div>
                            </div>
                        )}

                        {results && results.map((item, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden transform transition-all group hover:-translate-y-1">
                                <div className="grid md:grid-cols-2">
                                    <div className="p-8 bg-slate-50/50">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Before</p>
                                        <p className="text-sm text-slate-500 font-medium italic leading-relaxed">"{item.original}"</p>
                                    </div>
                                    <div className="p-8 bg-slate-900 relative">
                                        <div className="absolute top-2 right-4 bg-emerald-500 text-[9px] font-black text-slate-900 px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl shadow-emerald-500/20">
                                            +{item.score_gain || 12}% Gain
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Neural Optimized</p>
                                        <p className="text-sm text-white font-bold leading-relaxed">"{item.improved}"</p>
                                        
                                        <div className="flex flex-wrap gap-2 mt-6">
                                            <span className="px-2 py-0.5 bg-indigo-500 text-[9px] font-black uppercase tracking-widest text-white rounded">
                                                {item.impact_type?.replace('_', ' ') || 'QUANTIFIED IMPACT'}
                                            </span>
                                            {(item.improvements || []).map((imp, j) => (
                                                <span key={j} className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                    {imp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-8 py-3 bg-white border-t border-slate-50 flex justify-between items-center group-hover:bg-slate-50 transition-colors">
                                    <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">content_copy</span>
                                        Copy Optimized Bullet
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">Neural Cleaned</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};
export default ResumeFixer;
