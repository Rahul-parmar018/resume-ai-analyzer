import { useState, useRef } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import api from "../api-client";

const BulkScannerLanding = () => {
    const { user, profile } = useAuth();
    const [files, setFiles] = useState([]);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleBulkAnalyze = async () => {
        if (!user) return alert("Please sign in first.");
        if (profile?.role !== 'recruiter') {
            return alert("Access Denied: Only Recruiter accounts can use Bulk Scanner.");
        }
        if (files.length === 0 || !jd.trim()) {
            return alert("Please upload resumes and a job description.");
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("job_description", jd);

        try {
            setLoading(true);
            const res = await api.post("/bulk-analyze/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Error processing batch.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen">
            <PublicHeader />

            {/* 🚀 HERO SECTION */}
            <section className="pt-32 pb-20 px-6 bg-indigo-50/20 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03]"></div>
                <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 border border-indigo-200 px-4 py-1.5 rounded-full shadow-sm">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Decision Support Active</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-slate-900">
                        Bulk Resume <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Decision Engine</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-500 text-lg md:text-xl font-medium leading-tight">
                        Don't just screen—decide. Our neural engine categorizes candidates by <span className="text-indigo-600 font-bold">Strategic Fitness</span> and <span className="text-emerald-500 font-bold">Growth Potential</span>.
                    </p>
                </div>
            </section>

            {/* 🏆 INTERACTIVE SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* LEFT: UPLOAD & JD */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">1. Ideal Candidate Benchmark</label>
                            <textarea 
                                className="w-full h-64 bg-slate-50 rounded-3xl p-6 text-sm font-medium border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                                placeholder="Describe the role requirements, technology stack, and expectations..."
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                            ></textarea>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 mt-6 block">2. Candidate Batch</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer ${
                                    files.length > 0 ? "border-indigo-500 bg-indigo-50/5" : "border-slate-200 hover:border-indigo-400"
                                }`}
                            >
                                <span className={`material-symbols-outlined text-4xl mb-4 ${files.length > 0 ? "text-indigo-500" : "text-slate-300"}`}>
                                    {files.length > 0 ? "inventory_2" : "upload_file"}
                                </span>
                                <span className="text-xs font-bold text-slate-500">{files.length > 0 ? `${files.length} Files Selected` : "Select up to 150 resumes"}</span>
                                <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                            </div>
                        </div>

                        <button 
                            onClick={handleBulkAnalyze}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-500/10 disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Initiating Strategic Analysis...
                                </>
                            ) : (
                                <>
                                    Run Neural Ranking
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">analytics</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* RIGHT: LEADERBOARD DISPLAY */}
                    <div className="lg:col-span-7 bg-slate-900 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden min-h-[600px]">
                        <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 h-full">
                            <div className="flex justify-between items-center mb-10 px-2">
                                <div>
                                    <h3 className="text-2xl font-black text-white">Strategic Leaderboard</h3>
                                    <p className="text-xs text-slate-400 font-medium tracking-tight mt-1 opacity-60">
                                        {result ? `Decision Insight active for ${result.total_candidates} candidates` : "System awaiting batch input..."}
                                    </p>
                                </div>
                                {result && (
                                    <div className="flex flex-col items-end">
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Automation Efficiency</p>
                                        <p className="text-xl font-black text-white">99%</p>
                                    </div>
                                )}
                            </div>

                            {!result && !loading && (
                                <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4 opacity-50 grayscale">
                                    <span className="material-symbols-outlined text-6xl text-slate-700">leaderboard</span>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic font-mono">Neural Pipeline Empty</p>
                                </div>
                            )}

                            {loading && (
                                <div className="space-y-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse"></div>
                                    ))}
                                </div>
                            )}

                            {result && (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {result.top_candidates.map((c, i) => (
                                        <div key={i} className="group p-6 bg-white/5 rounded-3xl border border-white/[0.03] hover:bg-white/[0.08] transition-all relative overflow-hidden">
                                            {/* DECISION OVERLAY */}
                                            <div className="flex items-center justify-between mb-4 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-indigo-400 border border-indigo-500/20 shadow-xl group-hover:scale-105 transition-transform">
                                                        {c.score}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight truncate max-w-[200px]">{c.name}</h4>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 border border-indigo-500/20 px-3 py-0.5 rounded-full bg-indigo-500/5">
                                                            {c.label || "Matched"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                                                    <p className="text-xs font-bold text-white uppercase">{c.rank === 1 ? 'Prime Choice' : `Rank #${c.rank}`}</p>
                                                </div>
                                            </div>

                                            <div className="pl-[72px] relative z-10">
                                                <p className="text-xs font-medium text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">
                                                    "{c.insight || "Conceptual match detected within core competency areas."}"
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {c.skills.slice(0, 3).map(skill => (
                                                        <span key={skill} className="px-3 py-1 bg-white/5 text-[9px] font-black uppercase text-slate-400 rounded-lg border border-white/5">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {result && (
                                <div className="mt-8 flex justify-center">
                                    <button 
                                        onClick={() => { setFiles([]); setResult(null); setJd(""); }}
                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-2 border border-indigo-500/20 px-6 py-3 rounded-2xl"
                                    >
                                        <span className="material-symbols-outlined text-sm">refresh</span>
                                        Reset Neural Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default BulkScannerLanding;
