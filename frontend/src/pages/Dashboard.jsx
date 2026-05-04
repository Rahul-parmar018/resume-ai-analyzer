import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { useMode } from "../context/ModeContext";
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  ChevronRight,
  ArrowUpRight,
  BarChart3,
  FileText,
  Activity,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Trophy,
  PieChart
} from "lucide-react";
import api from "../api-client";

const CandidateDashboard = ({ data }) => {
  return (
    <div className="space-y-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
              <Trophy size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-purple-400">Current Standing</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Latest Resume Score</p>
          <h3 className="text-4xl font-black text-white">{data?.latest_score || 0}%</h3>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
             <Trophy size={120} />
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-600/20 rounded-xl text-emerald-400">
              <Activity size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-400">Market Fit</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Applications Sent</p>
          <h3 className="text-4xl font-black text-white">{data?.apps_sent || 0}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-600/20 rounded-xl text-yellow-400">
              <TrendingUp size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-yellow-400">Growth</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Score Trend</p>
          <div className="flex items-end gap-1 h-10 mt-1">
             {(data?.history || []).map((h, i) => (
               <div key={i} className="flex-1 bg-yellow-500/20 rounded-sm" style={{ height: `${h.score}%` }} title={`${h.date}: ${h.score}%`} />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Matches */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Job Opportunities for You</h3>
              <p className="text-xs text-slate-500">Matching based on your latest skill extraction.</p>
            </div>
            <Briefcase size={20} className="text-purple-500" />
          </div>
          
          <div className="space-y-4">
            {(data?.job_matches || []).length > 0 ? (data?.job_matches || []).map((job, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#0B0F1A] border border-white/5 rounded-2xl group hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-black text-xs">
                    {job.match}%
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase truncate max-w-[200px]">{job.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">AI Match Insight Available</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-slate-600 group-hover:text-purple-400 transition-colors" />
              </div>
            )) : (
              <p className="text-xs text-slate-500 italic p-4 text-center">Analyze a resume against a JD to see matches here.</p>
            )}
          </div>
        </div>

        {/* Skill Gap Insight */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Skill Gap Insights</h3>
              <p className="text-xs text-slate-500">Missing blocks preventing a 90%+ match.</p>
            </div>
            <Zap size={20} className="text-yellow-500" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {(data?.skill_gaps || []).length > 0 ? (data?.skill_gaps || []).map((skill, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] font-black text-rose-400 uppercase tracking-widest">
                - {skill}
              </span>
            )) : (
              <div className="flex flex-col items-center justify-center w-full py-10 opacity-40">
                <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest">Profile Healthy</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruiterDashboard = ({ data }) => {
  return (
    <div className="space-y-10">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-blue-400">Scale</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Candidates Scanned</p>
          <h3 className="text-4xl font-black text-white">{data?.total_scans || 0}</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600/20 rounded-xl text-purple-400">
              <PieChart size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-purple-400">Quality</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Avg Match Score</p>
          <h3 className="text-4xl font-black text-white">{data?.avg_score || 0}%</h3>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-600/20 rounded-xl text-emerald-400">
              <Trophy size={24} />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-400">Elite</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Top Candidate Score</p>
          <h3 className="text-4xl font-black text-white">{data?.top_score || 0}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Candidates */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Top Candidates (Live)</h3>
              <p className="text-xs text-slate-500">Highest ranked talent across your recent sessions.</p>
            </div>
            <Trophy size={20} className="text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            {(data?.top_candidates || []).length > 0 ? (data?.top_candidates || []).map((cand, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#0B0F1A] border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-xs">
                    {cand.score}%
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase truncate">{cand.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Processed: {cand.date}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
            )) : (
              <p className="text-xs text-slate-500 italic p-10 text-center">No high-scoring candidates found yet.</p>
            )}
          </div>
        </div>

        {/* Pipeline Insight */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
           <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-8">Pipeline Insight</h3>
           <div className="space-y-6">
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-emerald-400">Strong Match</span>
                    <span className="text-white">{data?.pipeline?.strong || 0}</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${((data?.pipeline?.strong || 0) / Math.max(1, data?.total_scans || 1)) * 100}%` }} />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-yellow-400">Medium Potential</span>
                    <span className="text-white">{data?.pipeline?.medium || 0}</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${((data?.pipeline?.medium || 0) / Math.max(1, data?.total_scans || 1)) * 100}%` }} />
                 </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-rose-400">Weak / Out of Scope</span>
                    <span className="text-white">{data?.pipeline?.weak || 0}</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500" style={{ width: `${((data?.pipeline?.weak || 0) / Math.max(1, data?.total_scans || 1)) * 100}%` }} />
                 </div>
              </div>
           </div>
           
           <div className="mt-12 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Efficiency Tip</p>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Focus on the Top 12% of your pipeline for faster hiring cycles.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { mode } = useMode();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setData(null); // Clear stale data before new fetch
      try {
        const endpoint = mode === 'recruiter' ? '/recruiter/dashboard/' : '/user/dashboard/';
        const response = await api.get(endpoint);
        setData(response.data);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [mode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
        <span className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Synthesizing Intelligence...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            {mode === 'recruiter' ? 'Hiring Intelligence Hub' : 'Career Intelligence Hub'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {mode === 'recruiter' 
              ? 'Real-time talent pipeline metrics and candidate quality analysis.' 
              : 'Growth insights and job matching powered by your latest resume data.'}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time Data Active</span>
        </div>
      </header>

      {mode === 'recruiter' ? (
        <RecruiterDashboard data={data} />
      ) : (
        <CandidateDashboard data={data} />
      )}

    </div>
  );
};

export default Dashboard;
