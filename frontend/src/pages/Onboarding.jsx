import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import api from "../api-client";
import axios from "axios";

const Onboarding = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, setProfile } = useAuth();
    const navigate = useNavigate();

    const handleComplete = async () => {
        if (!role || !user) return;
        setLoading(true);
        setError("");
        try {
            const res = await api.post("/user/update-role/", { role });
            
            // Update local profile state
            setProfile(prev => ({ ...prev, role: res.data.role, role_locked: true }));
            
            // Route based on role
            // Route based on role - THE REPAIR
            if (role === "candidate") navigate("/resume-scanner");
            else navigate("/app");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to set role. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-body">
            <div className="max-w-4xl w-full space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-headline font-bold text-slate-900 tracking-tight">
                        Welcome to Candidex AI
                    </h1>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        To provide the best experience, please tell us how you'll be using the platform. 
                        This selection is permanent.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Candidate Option */}
                    <button
                        onClick={() => setRole("candidate")}
                        className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 text-left bg-white ${
                            role === "candidate" 
                                ? "border-emerald-500 shadow-2xl shadow-emerald-500/10 ring-4 ring-emerald-500/5 rotate-[-1deg]" 
                                : "border-slate-100 hover:border-slate-200 hover:shadow-xl hover:translate-y-[-4px]"
                        }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                            role === "candidate" ? "bg-emerald-500 text-white scale-110 rotate-[5deg]" : "bg-emerald-50 text-emerald-500 group-hover:scale-110"
                        }`}>
                            <span className="material-symbols-outlined text-3xl">person_search</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Job Seeker</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 whitespace-nowrap">Neural Mode: Candidate</p>
                        
                        <ul className="space-y-4 text-slate-600 text-sm font-medium">
                            {[
                                "AI-Powered Resume Optimization",
                                "Neural Skill Gap Detection",
                                "ATS-Friendly Formatting Score",
                                "Semantic Keywords Injection",
                                "Career Narrative Enhancement"
                            ].map((feat, i) => (
                                <li key={feat} className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-emerald-500 text-[14px] font-bold">check</span>
                                    </div>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        {role === "candidate" && (
                            <div className="absolute top-6 right-6 text-emerald-500 animate-in zoom-in duration-300">
                                <span className="material-symbols-outlined text-3xl font-black">verified</span>
                            </div>
                        )}
                    </button>

                    {/* Recruiter Option */}
                    <button
                        onClick={() => setRole("recruiter")}
                        className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 text-left bg-white ${
                            role === "recruiter" 
                                ? "border-indigo-500 shadow-2xl shadow-indigo-500/10 ring-4 ring-indigo-500/5 rotate-[1deg]" 
                                : "border-slate-100 hover:border-slate-200 hover:shadow-xl hover:translate-y-[-4px]"
                        }`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${
                            role === "recruiter" ? "bg-indigo-500 text-white scale-110 rotate-[-5deg]" : "bg-indigo-50 text-indigo-500 group-hover:scale-110"
                        }`}>
                            <span className="material-symbols-outlined text-3xl">hub</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Hiring Team</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-6 whitespace-nowrap">Neural Mode: Recruiter</p>
                        
                        <ul className="space-y-4 text-slate-600 text-sm font-medium">
                            {[
                                "Bulk Neural Resume Analysis",
                                "AI Candidate Ranking Engine",
                                "Semantic Talent Search",
                                "Collaborative Hiring Hub",
                                "Automated Pipeline Insights"
                            ].map((feat, i) => (
                                <li key={feat} className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <span className="material-symbols-outlined text-indigo-500 text-[14px] font-bold">check</span>
                                    </div>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>

                        {role === "recruiter" && (
                            <div className="absolute top-6 right-6 text-indigo-500 animate-in zoom-in duration-300">
                                <span className="material-symbols-outlined text-3xl font-black">verified</span>
                            </div>
                        )}
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6 pt-4">
                    <div className="h-px w-32 bg-slate-200"></div>
                    <button
                        onClick={handleComplete}
                        disabled={!role || loading}
                        className={`px-16 py-5 rounded-2xl font-black text-lg transition-all duration-500 shadow-2xl active:scale-95 flex items-center gap-3 ${
                            !role 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                                : role === 'candidate' 
                                    ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
                                    : "bg-indigo-500 text-white shadow-indigo-500/20 hover:bg-indigo-600"
                        }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Initializing Intelligence...
                            </>
                        ) : (
                            <>
                                Select {role === 'candidate' ? 'Job Seeker' : role === 'recruiter' ? 'Recruiter' : 'Platform'} Mode
                                <span className="material-symbols-outlined font-black">arrow_forward</span>
                            </>
                        )}
                    </button>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            {role ? `Configuring system for ${role} access...` : "Awaiting selection"}
                        </p>
                        <p className="text-[10px] text-slate-300 font-bold">
                            * Note: This selection stabilizes your neural experience and cannot be reverted easily.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
