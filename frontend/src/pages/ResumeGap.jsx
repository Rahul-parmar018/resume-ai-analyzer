import { useState, useRef } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import api from "../api-client";

const ResumeGap = () => {
    const { user } = useAuth();
    const { scanResult, setGapResult } = useResumeStore();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!user) return alert("Please sign in first.");
        if (!file && !scanResult) return alert("Please upload a resume.");
        if (!jd.trim()) return alert("Please provide a job description.");

        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        } else if (scanResult) {
            return alert("The Gap Analyzer requires a file upload for semantic parsing. Please select your resume file.");
        }
        formData.append("job_description", jd);

        try {
            setLoading(true);
            const res = await api.post("/optimize/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResult(res.data);
            setGapResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Error analyzing gaps. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <PublicHeader />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Skill Gap Analyzer</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-tight">
                        Compare your unique profile against a specific job role. We'll identify the <span className="text-rose-500 font-bold">Semantic Gaps</span> that ATS systems hate.
                    </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-12">
                    {/* INPUT SECTION */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">1. Target Job Description</label>
                                <div className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">Neural Sync Active</div>
                            </div>
                            <textarea 
                                className="w-full h-64 bg-slate-50 rounded-3xl p-6 text-sm font-medium border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none mb-6"
                                placeholder="Paste the job requirements here..."
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                            ></textarea>
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">2. Upload Your Resume</label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer ${
                                    file ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200 hover:border-indigo-400"
                                }`}
                            >
                                <span className={`material-symbols-outlined text-4xl mb-4 ${file ? "text-emerald-500" : "text-slate-300"}`}>
                                    {file ? "task" : "upload_file"}
                                </span>
                                <span className="text-xs font-bold text-slate-500">{file ? file.name : "Click to select file"}</span>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt" />
                            </div>
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Finding Gaps...
                                </>
                            ) : (
                                "Find Semantic Gaps →"
                            )}
                        </button>
                    </div>

                    {/* RESULT CARD */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 min-h-[600px] relative overflow-hidden">
                        {(result || loading) ? (
                            <div className={`space-y-10 transition-all duration-500 ${loading ? "opacity-30 blur-sm grayscale" : "opacity-100"}`}>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-slate-900">Match Report</h3>
                                        <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">{result?.fit_label || "Neural Match"}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-7xl font-black text-slate-900 leading-none">{result?.score || "00"}<span className="text-3xl text-slate-300 font-bold">%</span></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Overall JD Fit</p>
                                    </div>
                                </div>

                                {/* ACTION PLAN SYNC */}
                                {result?.action_plan && (
                                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="material-symbols-outlined text-emerald-400">auto_fix_high</span>
                                            <h4 className="text-lg font-black uppercase tracking-tight">AI Strategy Plan</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {result.action_plan.steps.map((st, i) => (
                                                <div key={i} className="flex gap-4 items-center">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center text-sm font-black italic">{i+1}</div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-bold">{st.action}</p>
                                                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest opacity-80">{st.impact}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <Link to="/resume-optimizer" className="w-full mt-6 bg-emerald-500 text-slate-900 py-3 rounded-xl font-black text-[10px] uppercase text-center block hover:bg-emerald-400 transition-colors">
                                            Fix Identified Gaps Now
                                        </Link>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                            Missing Keywords
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {result?.missing_skills ? (
                                                result.missing_skills.map((s, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase border border-rose-100">{s}</span>
                                                ))
                                            ) : (
                                                <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-200 text-5xl">analytics</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 font-mono uppercase italic tracking-tighter">System Idle</h3>
                                    <p className="text-slate-400 font-medium leading-relaxed">Paste the job description and upload your resume to generate a deep gap report.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};
export default ResumeGap;
