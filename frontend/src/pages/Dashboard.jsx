import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { getAnalysisHistory } from "../db";
import { useNavigate } from "react-router-dom";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";

const kpiData = [
  { label: "Resumes Analyzed", value: "1,284", icon: "description", insight: "+12% this week", insightPositive: true },
  { label: "Candidates Found", value: "456", icon: "person_search", insight: "+8% this week", insightPositive: true },
  { label: "Avg. Match Score", value: "84%", icon: "star", insight: "Top tier alignment (Avg +4%)", insightPositive: true },
  { label: "Drop-off Rate",    value: "14%", icon: "trending_down", insight: "Needs attention (-2%)", insightPositive: false },
];

const recentActivityStatic = [
  { id: 1, file_name: "John_Doe_Senior_Dev.pdf",  date: "2 mins ago", score: 94 },
  { id: 2, file_name: "Sarah_Smith_PM_Lead.pdf",  date: "15 mins ago", score: 82 },
  { id: 3, file_name: "Data_Science_Intern.docx", date: "1 hour ago", score: 45 },
  { id: 4, file_name: "Marketing_Dir_v2.pdf",     date: "3 hours ago", score: null },
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

  // Table Setup
  const columns = ["Candidate", "Processed Date", "Match Score", "Status"];
  
  const renderRow = (row) => {
    const isAnalyzed = row.score !== null && row.score !== undefined;
    const isHighMatch = isAnalyzed && row.score >= 80;
    
    return (
      <>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
            </div>
            <span className="font-semibold text-primary">{row.file_name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-secondary">{row.date || "Just now"}</td>
        <td className="px-6 py-4">
          {isAnalyzed ? (
            <span className={`font-heading font-bold ${isHighMatch ? 'text-green-600' : 'text-primary'}`}>{row.score}%</span>
          ) : (
            <span className="text-secondary">-</span>
          )}
        </td>
        <td className="px-6 py-4">
          {isAnalyzed ? (
            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">Analyzed</span>
          ) : (
            <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max">
              <span className="material-symbols-outlined text-[10px] animate-spin">sync</span> Pending
            </span>
          )}
        </td>
      </>
    );
  };

  const displayHistory = history.length > 0 ? history.slice(0, 5) : recentActivityStatic;

  return (
    <div className="space-y-6 pb-8">

      {/* Hero / Header */}
      <PageHeader 
        title={`${greeting}, ${displayName}`}
        subtitle={`Your AI-driven talent pipeline is evaluating ${history.length || 14} candidates.`}
        actionLabel="Upload New"
        actionIcon="upload_file"
        actionLink="/app/analyze"
      />

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

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start mt-8">

        {/* Recent Activity Table */}
        <div className="xl:col-span-2">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-heading text-xl font-bold text-primary">Recent Processing</h3>
             <button onClick={() => navigate("/app/history")} className="text-sm font-bold text-primary hover:underline">View All History</button>
          </div>
          {loading ? (
             <div className="h-64 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
             </div>
          ) : (
             <DataTable 
               columns={columns} 
               data={displayHistory} 
               renderRow={renderRow} 
               emptyMessage="No resumes analyzed yet. Upload one to see it here."
             />
          )}
        </div>

        {/* Right Column / Quick Actions */}
        <div className="space-y-6">

          {/* Quick Actions (Premium styling) */}
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
            {/* Decorative BG */}
            <div className="absolute -bottom-8 -right-8 opacity-10 pointer-events-none">
              <span className="material-symbols-outlined text-[12rem]">memory</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Dashboard;
