import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { fetchDashboardAnalytics } from "../api/analyze";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    if (user) {
      fetchDashboardAnalytics()
        .then(setData)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Alexander";

  // Distribution Math
  const dist = data.score_distribution;
  const totalProcessed = dist.low + dist.medium + dist.high || 1; // avoid /0
  const highPct = (dist.high / totalProcessed) * 100;
  const midPct = (dist.medium / totalProcessed) * 100;
  const lowPct = (dist.low / totalProcessed) * 100;

  // Formatting Skills
  const topFoundSkill = data.top_skills.length > 0 ? data.top_skills[0][0] : "None";
  const topMissingSkill = data.top_missing_skills.length > 0 ? data.top_missing_skills[0][0] : "None";

  // KPI Data array
  const kpiData = [
    { label: "Resumes Analyzed", value: data.total_resumes.toString(), icon: "description", insight: "Lifetime Volume", insightPositive: true },
    { label: "Pipeline Quality", value: `${data.average_score}%`, icon: "star", insight: "Average Match Score", insightPositive: data.average_score >= 60 },
    { label: "Most Found Skill", value: topFoundSkill, icon: "verified", insight: data.top_skills.length > 0 ? `${data.top_skills[0][1]} candidates` : "Waiting for data", insightPositive: true },
    { label: "Top Skill Gap", value: topMissingSkill, icon: "warning", insight: data.top_missing_skills.length > 0 ? `${data.top_missing_skills[0][1]} missing this` : "Waiting for data", insightPositive: false },
  ];

  return (
    <div className="space-y-8 pb-12">

      {/* Hero / Header */}
      <PageHeader 
        title={`${greeting}, ${displayName}`}
        subtitle="Your intelligence dashboard is live. Review pipeline metrics and skill gaps below."
        actionLabel="Analyze Resume"
        actionIcon="upload_file"
        actionLink="/app/analyze"
      />

      {loading ? (
        <div className="h-64 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* AI Insight Banner */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-3">
            <span className="material-symbols-outlined text-indigo-500 mt-0.5">tips_and_updates</span>
            <div>
              <h4 className="font-bold text-indigo-900 text-sm mb-1">AI Pipeline Insight</h4>
              <p className="text-indigo-800 text-sm leading-relaxed">{data.insight}</p>
            </div>
          </div>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi) => (
              <StatCard 
                key={kpi.label}
                title={kpi.label}
                value={kpi.value}
                icon={kpi.icon}
                insight={kpi.insight}
                insightPositive={kpi.insightPositive}
              />
            ))}
          </section>

          {/* Score Distribution & Feed Area */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start mt-8">
            
            <div className="xl:col-span-2 space-y-8">
              {/* Distribution Bar */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-primary mb-1">Score Distribution</h3>
                <p className="text-slate-500 text-sm mb-6">Historical breakdown of candidate viability directly from your intelligence engine.</p>
                
                <div className="flex h-6 w-full rounded-full overflow-hidden bg-slate-100 shadow-inner">
                  <div style={{width: `${highPct}%`}} className="bg-green-500 hover:bg-green-600 transition-colors" title={`Strong: ${dist.high}`} />
                  <div style={{width: `${midPct}%`}} className="bg-yellow-400 hover:bg-yellow-500 transition-colors" title={`Average: ${dist.medium}`}/>
                  <div style={{width: `${lowPct}%`}} className="bg-red-500 hover:bg-red-600 transition-colors" title={`Weak: ${dist.low}`}/>
                </div>
                
                <div className="flex justify-between mt-3 text-sm font-bold">
                  <span className="text-green-600 flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500"></span> Strong ({highPct.toFixed(0)}%)</span>
                  <span className="text-yellow-600 flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400"></span> Average ({midPct.toFixed(0)}%)</span>
                  <span className="text-red-500 flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Weak ({lowPct.toFixed(0)}%)</span>
                </div>
              </div>

              {/* Advanced Activity Feed */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-heading text-lg font-bold text-primary">Live Activity Feed</h3>
                  <button onClick={() => navigate("/app/history")} className="text-sm font-bold text-primary hover:underline">View All</button>
                </div>
                
                {data.recent_activity.length === 0 ? (
                  <p className="text-slate-400 text-sm italic py-4">No activity yet. Upload a resume to trigger the feed.</p>
                ) : (
                  <div className="space-y-4">
                    {data.recent_activity.map((rec) => (
                      <div key={rec.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                          ${rec.score >= 70 ? 'bg-green-100 text-green-700' : rec.score >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}
                        `}>
                          {rec.score}
                        </div>
                        <div>
                          <p className="font-bold text-primary text-sm">{rec.resume}</p>
                          <p className="text-slate-500 text-xs mt-0.5">Analyzed on {rec.date} • {rec.score >= 70 ? 'Strong Match' : rec.score >= 40 ? 'Potential Gap' : 'Critical Weakness'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column / Quick Actions */}
            <div className="space-y-6">

              {/* Top Skills Overview mini-panel */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-primary mb-4">Top Skills Vault</h3>
                <div className="flex flex-wrap gap-2">
                  {data.top_skills.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                      {skill[0]} ({skill[1]})
                    </span>
                  ))}
                  {data.top_skills.length === 0 && <span className="text-xs text-slate-400">No skills captured yet.</span>}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-heading text-lg font-bold mb-6">Pipeline Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Resume Analyzer",  icon: "analytics",     path: "/app/analyze" },
                      { label: "Candidate Finder", icon: "person_search", path: "/app/finder" },
                      { label: "Full History",     icon: "folder_shared",  path: "/app/history" },
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => navigate(action.path)}
                        className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors group border border-white/5 hover:border-white/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-xl text-accent group-hover:scale-110 transition-transform">{action.icon}</span>
                          <span className="font-bold text-sm">{action.label}</span>
                        </div>
                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
                  <span className="material-symbols-outlined text-[12rem]">memory</span>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
