import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { getAnalysisHistory } from "../db";
import { useNavigate } from "react-router-dom";

const recentActivityStatic = [
  { id: 1, name: "John_Doe_Senior_Dev.pdf",  meta: "2 mins ago • 1.2 MB",  icon: "picture_as_pdf", status: "Analyzed", statusClass: "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant" },
  { id: 2, name: "Sarah_Smith_PM_Lead.pdf",  meta: "15 mins ago • 840 KB", icon: "picture_as_pdf", status: "Pending",  statusClass: "bg-secondary-container/30 text-on-secondary-container" },
  { id: 3, name: "Data_Science_Intern.docx", meta: "1 hour ago • 45 KB",   icon: "description",    status: "Failed",   statusClass: "bg-error-container/40 text-error" },
  { id: 4, name: "Marketing_Dir_v2.pdf",     meta: "3 hours ago • 2.1 MB", icon: "picture_as_pdf", status: "Analyzed", statusClass: "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant" },
];

const kpiData = [
  { label: "Resumes Analyzed", value: "1,284", badge: "+12%",   badgeClass: "text-tertiary-fixed-dim bg-tertiary-container/10", icon: "description",  barClass: "bg-primary", barW: "w-3/4" },
  { label: "Candidates Found", value: "456",   badge: "+8%",    badgeClass: "text-tertiary-fixed-dim bg-tertiary-container/10", icon: "person_search", barClass: "bg-primary", barW: "w-1/2" },
  { label: "Avg. Match Score", value: "84%",   badge: "Stable", badgeClass: "text-secondary bg-slate-100",                     icon: "star",          barClass: "bg-tertiary-fixed-dim", barW: "w-[84%]" },
  { label: "Monthly Growth",   value: "3.2k",  badge: "+24%",   badgeClass: "text-tertiary-fixed-dim bg-tertiary-container/10", icon: "trending_up",   barClass: "bg-primary", barW: "w-[90%]" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getAnalysisHistory(user.uid)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Alexander";

  return (
    <div className="space-y-8 pb-8">

      {/* Hero */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-on-primary-container font-medium tracking-wide text-xs uppercase">Welcome back</p>
          <h1 className="font-headline text-4xl font-bold text-primary tracking-tight">
            {greeting}, {displayName}
          </h1>
          <p className="text-secondary max-w-md">
            Your AI-driven talent pipeline is currently optimizing {history.length || 14} active candidates across 3 departments.
          </p>
        </div>
        <button
          onClick={() => navigate("/app/analyze")}
          className="bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/10 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">upload_file</span>
          Upload New Resume
        </button>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg text-primary">
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${kpi.badgeClass}`}>{kpi.badge}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-secondary text-sm font-medium">{kpi.label}</h3>
              <p className="text-2xl font-bold text-primary">{kpi.value}</p>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full ${kpi.barClass} ${kpi.barW} rounded-full`}></div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-headline text-lg font-bold text-primary">Recent Activity</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50">
            {(history.length > 0
              ? history.slice(0, 4).map((item) => ({
                  id:         item.id,
                  name:       item.file_name,
                  meta:       `${item.date} • ${item.matched_skills?.length || 0} matches`,
                  icon:       "picture_as_pdf",
                  status:     item.score > 70 ? "Analyzed" : "Pending",
                  statusClass: item.score > 70
                    ? "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant"
                    : "bg-secondary-container/30 text-on-secondary-container",
                }))
              : recentActivityStatic
            ).map((item) => (
              <div key={item.id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary text-sm">{item.name}</h4>
                    <p className="text-on-primary-container text-xs">{item.meta}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.statusClass}`}>
                  {item.status}
                </span>
              </div>
            ))}
            {loading && (
              <div className="px-8 py-8 flex justify-center">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="bg-primary text-on-primary rounded-2xl p-8 shadow-xl shadow-primary/10 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline text-lg font-bold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: "Resume Analyzer",  icon: "analytics",     path: "/app/analyze" },
                  { label: "Candidate Finder", icon: "person_search", path: "/app/finder" },
                  { label: "Saved Reports",    icon: "folder_shared",  path: "/app/history" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl">{action.icon}</span>
                      <span className="font-medium text-sm">{action.label}</span>
                    </div>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Background texture */}
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <span className="material-symbols-outlined text-[12rem]">token</span>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-slate-200/40">
            <h4 className="text-xs uppercase tracking-widest text-on-primary-container font-bold mb-4">Market Insights</h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Tech hiring up 4% this week</p>
                  <p className="text-xs text-secondary">AI and Cloud infrastructure roles leading the trend.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary">Candidate Match Tip</p>
                  <p className="text-xs text-secondary">Try filtering by 'Project Experience' to find specialized talent.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
