import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { fetchDashboardAnalytics, fetchHistory } from "../api/analyze";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role || "candidate";

  const [data, setData] = useState({
    total_resumes: 0,
    average_score: 0,
    score_distribution: { low: 0, medium: 0, high: 0 },
    top_skills: [],
    top_missing_skills: [],
    recent_activity: [],
    insight: "Gathering intel..."
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (role === "recruiter") {
          const analytics = await fetchDashboardAnalytics();
          setData(analytics);
        } else {
          // Candidate Simplified View
          const history = await fetchHistory();
          const total = history.length;
          const avg = total > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / total) : 0;
          setData({
            total_resumes: total,
            average_score: avg,
            recent_activity: history.slice(0, 5).map(h => ({
              id: h.id,
              resume: h.resume_name,
              score: h.score,
              date: h.date
            })),
            insight: total > 0 ? `Your average ATS score is ${avg}%. Try optimizing for more specific keywords to break 85%.` : "Upload your first resume to get started."
          });
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user, role]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return (
    <div className="space-y-8 pb-12 font-body">

      {/* Hero / Header */}
      <PageHeader 
        title={`${greeting}, ${displayName}`}
        subtitle={role === 'recruiter' 
          ? "Your recruitment intelligence is live. Review pipeline metrics below."
          : "Your career optimization dashboard. Track your resume performance."}
        actionLabel={role === 'recruiter' ? "Bulk Scan" : "Optimize Resume"}
        actionIcon={role === 'recruiter' ? "hub" : "ads_click"}
        actionLink={role === 'recruiter' ? "/app/scanner" : "/app/optimize"}
      />

      {loading ? (
        <div className="h-64 bg-white rounded-3xl border border-slate-100 flex items-center justify-center shadow-sm">
          <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* AI Insight Banner */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-start gap-4 shadow-xl shadow-slate-900/10">
            <span className="material-symbols-outlined text-emerald-400 text-3xl">lightbulb</span>
            <div>
              <h4 className="font-bold text-white text-base mb-1">AI {role === 'recruiter' ? 'Pipeline' : 'Growth'} Insight</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{data.insight}</p>
            </div>
          </div>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
             <StatCard 
                title={role === 'recruiter' ? "Total Candidates Scanned" : "Resumes Optimized"}
                value={data.total_resumes.toString()}
                icon="description"
                insight="Lifetime Usage"
                insightPositive={true}
              />
              <StatCard 
                title={role === 'recruiter' ? "Pipeline Quality" : "Average ATS Match"}
                value={`${data.average_score}%`}
                icon="star"
                insight="Historical Average"
                insightPositive={data.average_score >= 60}
              />
          </section>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-xl font-bold text-slate-900">Recent {role === 'recruiter' ? 'Scans' : 'Optimizations'}</h3>
              <button 
                onClick={() => navigate("/app/history")} 
                className="text-sm font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors"
              >
                View History
              </button>
            </div>
            
            {data.recent_activity.length === 0 ? (
              <div className="text-center py-12 px-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">history</span>
                 <p className="text-slate-400 text-sm font-medium italic">No activity yet. Start your first analysis to see results here.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {data.recent_activity.map((rec) => (
                  <div 
                    key={rec.id} 
                    onClick={() => navigate(`/app/history`)}
                    className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100 cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-sm
                      ${rec.score >= 70 ? 'bg-emerald-50 text-emerald-600' : rec.score >= 40 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}
                    `}>
                      {rec.score}%
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{rec.resume}</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        {rec.date} • {rec.score >= 70 ? 'Strong Match' : rec.score >= 40 ? 'Potential Gap' : 'Weak Alignment'}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions (Recruiter Only) */}
          {role === 'recruiter' && (
            <div className="grid md:grid-cols-2 gap-6">
               <div 
                 onClick={() => navigate("/app/scanner")}
                 className="p-8 bg-indigo-600 rounded-3xl text-white shadow-xl hover:bg-indigo-700 transition-all cursor-pointer group flex items-center justify-between"
               >
                  <div>
                    <h4 className="text-xl font-bold mb-2">Launch Ranking Engine</h4>
                    <p className="text-indigo-100 text-sm">Batch analyze candidates with semantic matching.</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl opacity-50 group-hover:opacity-100 transition-opacity">rocket_launch</span>
               </div>
               <div 
                 onClick={() => navigate("/app/finder")}
                 className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl hover:bg-slate-800 transition-all cursor-pointer group flex items-center justify-between"
               >
                  <div>
                    <h4 className="text-xl font-bold mb-2">Semantic AI Search</h4>
                    <p className="text-slate-400 text-sm">Find candidates using plain English queries.</p>
                  </div>
                  <span className="material-symbols-outlined text-4xl opacity-50 group-hover:opacity-100 transition-opacity">search_spark</span>
               </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
