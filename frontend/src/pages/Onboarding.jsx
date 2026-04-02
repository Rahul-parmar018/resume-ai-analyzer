import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import axios from "axios";

const Onboarding = () => {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user, setProfile } = useAuth();
    const navigate = useNavigate();

    const handleComplete = async () => {
        if (!role) return;
        setLoading(true);
        setError("");
        try {
            const token = await user.getIdToken();
            const res = await axios.post("http://localhost:8000/api/user/update-role/", 
                { role },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Update local profile state
            setProfile(prev => ({ ...prev, role: res.data.role, role_locked: true }));
            
            // Route based on role
            if (role === "candidate") navigate("/app/optimize");
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
                        Welcome to ResumeAI
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
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-left bg-white ${
                            role === "candidate" 
                                ? "border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5" 
                                : "border-slate-100 hover:border-slate-200 hover:shadow-lg"
                        }`}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-primary text-3xl">person</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">I'm a Job Seeker</h3>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <span>AI-powered resume optimization</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <span>Skill gap detection & insights</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <span>ATS-friendly formatting score</span>
                            </li>
                        </ul>
                        {role === "candidate" && (
                            <div className="absolute top-4 right-4 text-primary">
                                <span className="material-symbols-outlined font-bold">check_circle</span>
                            </div>
                        )}
                    </button>

                    {/* Recruiter Option */}
                    <button
                        onClick={() => setRole("recruiter")}
                        className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 text-left bg-white ${
                            role === "recruiter" 
                                ? "border-primary shadow-xl shadow-primary/10 ring-4 ring-primary/5" 
                                : "border-slate-100 hover:border-slate-200 hover:shadow-lg"
                        }`}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-indigo-600 text-3xl">hub</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-4">I'm a Recruiter / HR</h3>
                        <ul className="space-y-3 text-slate-500 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <span>Bulk analyze 100+ resumes at once</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <span>AI Candidate Ranking Engine</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                <span>Semantic Talent Search</span>
                            </li>
                        </ul>
                        {role === "recruiter" && (
                            <div className="absolute top-4 right-4 text-primary">
                                <span className="material-symbols-outlined font-bold">check_circle</span>
                            </div>
                        )}
                    </button>
                </div>

                <div className="flex flex-col items-center gap-4 pt-4">
                    <button
                        onClick={handleComplete}
                        disabled={!role || loading}
                        className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        {loading ? "Initializing Platform..." : "Complete Setup"}
                    </button>
                    <p className="text-xs text-slate-400">
                        * Once selected, your account will be locked to this mode.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
