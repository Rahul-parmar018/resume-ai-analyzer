import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { fetchHistory } from "../api/analyze";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  ChevronRight,
  Search,
  Plus
} from "lucide-react";

const History = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = profile?.role || 'candidate';

  useEffect(() => {
    if (user) {
      fetchHistory()
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Analysis History</h1>
          <p className="text-slate-500 text-sm mt-1">Review and re-evaluate your past AI resume evaluations.</p>
        </div>
        <button 
          onClick={() => navigate(role === 'recruiter' ? '/scanner' : '/optimize')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Plus size={16} />
          New Analysis
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 border-4 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Accessing Archives...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-16 flex flex-col items-center text-center backdrop-blur-sm">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
            <Search size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">No History Yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-8">
            You haven't processed any resumes yet. Start your first analysis to see results here.
          </p>
          <button 
            onClick={() => navigate(role === 'recruiter' ? '/scanner' : '/optimize')}
            className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-purple-600 hover:text-white transition-all"
          >
            Go to Analyzer
          </button>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Resume Name</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Match Score</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Processed Date</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                          <FileText className="text-purple-400" size={18} />
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                          {item.resume_name || item.file_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {item.score ? (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-black ${getScoreColor(item.score)}`}>
                          <TrendingUp size={12} />
                          {item.score}%
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs font-bold">Pending</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">{item.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => navigate(role === 'recruiter' ? '/scanner' : '/optimize')}
                        className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default History;
