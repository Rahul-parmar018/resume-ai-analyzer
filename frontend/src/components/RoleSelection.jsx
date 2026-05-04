import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api-client";
import { useAuth } from "./AuthProvider";

const RoleSelection = () => {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelectRole = async (role) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/user/update-role/", { role });
      await refreshProfile();
    } catch (err) {
      console.error(err);
      setError("Failed to set role. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0B] flex items-center justify-center p-6 text-white font-body selection:bg-indigo-500/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Select your <span className="text-indigo-400 italic">operating mode.</span></h1>
          <p className="text-white/40 text-sm font-medium">You can switch this anytime from your dashboard navbar.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex justify-center">
            <p className="text-xs font-bold text-rose-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => !loading && handleSelectRole('candidate')}
            className={`p-8 md:p-10 rounded-3xl border ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-indigo-500 hover:bg-white/[0.02]'} border-white/10 bg-white/[0.01] transition-all group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-indigo-500/20 transition-all"></div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <span className="material-symbols-outlined text-indigo-400">person</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Candidate</h3>
                <p className="text-sm text-white/40 leading-relaxed">Optimize your resume, bypass ATS filters, and analyze job descriptions to land more interviews.</p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-white/5">
                {['AI Resume Tailoring', 'ATS Gap Analysis', 'Action Verb Suggestions'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Recruiter Card */}
          <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => !loading && handleSelectRole('recruiter')}
            className={`p-8 md:p-10 rounded-3xl border ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-emerald-500 hover:bg-white/[0.02]'} border-white/10 bg-white/[0.01] transition-all group relative overflow-hidden`}
          >
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/4 group-hover:bg-emerald-500/20 transition-all"></div>
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <span className="material-symbols-outlined text-emerald-400">work</span>
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2">Recruiter</h3>
                <p className="text-sm text-white/40 leading-relaxed">Scan bulk resumes, rank candidates semantically, and build explainable hiring shortlists in seconds.</p>
              </div>
              <ul className="space-y-3 pt-4 border-t border-white/5">
                {['Bulk AI Scanning', 'Semantic Candidate Ranking', 'Explainable Hiring Rationale'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs font-bold text-white/60">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelection;
