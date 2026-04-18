import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import { fetchDashboardAnalytics, fetchHistory } from "../api/analyze";
import { getScoreColorClass } from "../utils/scoring";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import { 
  Home, 
  ChevronRight, 
  AlertTriangle, 
  X, 
  Wand2, 
  Eye, 
  TrendingUp, 
  Target, 
  Zap,
  Activity
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import GrowthGraph from "../components/dashboard/GrowthGraph";
import ActionPanel from "../components/dashboard/ActionPanel";
import SkillsGapChart from "../components/dashboard/SkillsGapChart";
import RejectionReasoning from "../components/dashboard/RejectionReasoning";
import InsightsBreakdown from "../components/dashboard/InsightsBreakdown";

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role || "candidate";

  // THE REPAIR: Candidates have no Dashboard track - redirect to primary tool suite
  useEffect(() => {
    if (!loading && role === 'candidate') {
      navigate('/resume-scanner');
    }
  }, [role, loading, navigate]);

  const [data, setData] = useState({
    total_resumes: 0,
    average_score: 0,
    recent_activity: [],
    insight: "Analyzing your career trajectory...",
    suggestions: [],
    missing_skills: [],
    matched_skills: [],
    section_scores: {}
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (role === "recruiter") {
          const analytics = await fetchDashboardAnalytics();
          setData(prev => ({ ...prev, ...analytics }));
        } else {
          const history = await fetchHistory();
          const total = history.length;
          const avg = total > 0 ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / total) : 0;
          const lastRecord = history[0] || {};
          
          // Logic Fix: Avoid contradiction
          const gaps = lastRecord.missing_skills?.length || 0;
          let insight = "";
          if (total === 0) insight = "Upload your resume to reveal your neural alignment.";
          else if (gaps > 0) insight = `Your latest resume is NOT getting shortlisted because of ${gaps} critical skill gaps.`;
          else if (lastRecord.score < 80) insight = "Your resume is NOT getting shortlisted due to weak experience impact and low ATS optimization.";
          else insight = "Your profile is in the top 15% - minimal optimization required for a guaranteed shortlist.";

          setData({
            total_resumes: total,
            average_score: avg,
            recent_activity: history.slice(0, 5).map((h, i) => {
               const prevScore = history[i+1]?.score || 0;
               return {
                  id: h.id,
                  resume: h.resume_name,
                  score: h.score,
                  delta: h.score - prevScore,
                  date: h.date,
               };
            }),
            suggestions: lastRecord.suggestions || [],
            missing_skills: lastRecord.missing_skills || [],
            matched_skills: lastRecord.matched_skills || [],
            section_scores: lastRecord.section_scores || {},
            insight: insight
          });
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setDataLoading(false);
      }
    };

    if (user) loadData();
  }, [user, role]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  const displayName = profile?.display_name?.split(" ")[0] || user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  const scoreGap = 85 - data.average_score;
  const statusSubtitle = role === 'candidate' 
    ? (data.total_resumes > 0 ? `⚠️ You are ${scoreGap}% below shortlist level — fix this in 3 steps.` : "Begin your neural optimization journey to secure a high-value role.")
    : "Review high-precision pipeline metrics and automated candidate shortlists.";

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8 pb-12 font-body"
    >
      
      {/* Dynamic Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-headline">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <Home className="w-3 h-3" />
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900">Dashboard Intelligence Hub</span>
      </nav>

      {/* Hero Header with Urgency */}
      <PageHeader 
        title={`${greeting}, ${displayName}`}
        subtitle={statusSubtitle}
        actionLabel={role === 'recruiter' ? "Launch Ranking Hub" : "Optimize New Resume"}
        actionIcon={role === 'recruiter' ? "hub" : "rocket_launch"}
        actionLink={role === 'recruiter' ? "/app/scanner" : "/app/optimize"}
      />

      {dataLoading ? (
        <div className="h-96 w-full bg-white rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center shadow-sm">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Hydrating Intelligence Layers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[80vh]">
          
          {/* Main Area (8 columns) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Actionable AI Insight Card */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-slate-900/20">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
               
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                       <AlertTriangle className="w-6 h-6 text-emerald-400 animate-pulse" />
                    </div>
                    <h3 className="text-white font-bold text-lg font-headline tracking-tighter uppercase tracking-widest">Global Shortlist Probability</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-8">
                    <div className="flex-1 space-y-4">
                      <p className="text-slate-300 text-xl leading-relaxed font-bold font-headline">
                        {data.insight}
                      </p>
                      
                      {role === 'candidate' && data.missing_skills?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {data.missing_skills.slice(0, 3).map(skill => (
                            <span key={skill} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <X className="w-2.5 h-2.5" />
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="md:w-px h-16 bg-slate-800 hidden md:block"></div>

                    <div className="flex-shrink-0 flex flex-col items-center">
                       <div className="text-4xl font-black text-white mb-1">{data.average_score}%</div>
                       <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Avg. Matching Score</div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
                     <button 
                       onClick={() => navigate('/app/optimize')}
                       className="w-full md:w-auto bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-emerald-500/20"
                     >
                        Fix My Alignment
                        <Wand2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                     </button>
                     <div className="hidden md:flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pool Benchmark:</span>
                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-3/4 shadow-[0_0_12px_#10b981]"></div>
                        </div>
                        <span className="text-[9px] font-black text-emerald-400">EXCELLED</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Killer Feature: Why You Are Rejected */}
            <RejectionReasoning score={data.average_score} missingSkills={data.missing_skills} />

            {/* Growth & Coverage Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="font-headline text-lg font-bold text-slate-900 tracking-tight mb-8">Neural Growth Trend</h3>
                  <GrowthGraph history={data.recent_activity} />
               </div>

               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  <h3 className="font-headline text-lg font-bold text-slate-900 tracking-tight mb-8">Current Skill Coverage</h3>
                  <SkillsGapChart matchedSkills={data.matched_skills} missingSkills={data.missing_skills} />
               </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-headline text-xl font-bold text-slate-900 tracking-tight">Intelligence Evolution Logs</h3>
                <button onClick={() => navigate("/app/history")} className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 px-4 py-2 rounded-xl transition-all border border-slate-100">
                  Full Audit
                </button>
              </div>
              
              <div className="space-y-4">
                {data.recent_activity.length === 0 ? (
                   <p className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">No activity synced</p>
                ) : (
                  data.recent_activity.map((rec) => (
                    <div key={rec.id} className="flex flex-col md:flex-row md:items-center gap-6 p-5 hover:bg-slate-50 rounded-3xl transition-all border border-slate-100 group">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border-2 border-white flex-shrink-0 ${getScoreColorClass(rec.score, 'bg')}`}>
                        <span className={getScoreColorClass(rec.score, 'text')}>{rec.score}%</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-base truncate">{rec.resume}</p>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{rec.date}</span>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${rec.delta >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                             {rec.delta >= 0 ? `+${rec.delta}% Improvement` : `${rec.delta}% Decrease`}
                           </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => navigate('/app/optimize')} className="px-4 py-2 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                            Improve Again
                         </button>
                         <button onClick={() => navigate('/app/history')} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                            <Eye className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* BRIDGE CTA - Execution Transition */}
            {role === 'candidate' && (
              <section className="mt-12 p-12 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-[3.5rem] border border-slate-100 text-center space-y-8 shadow-sm">
                  <div className="space-y-4">
                      <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Ready to deploy these fixes?</h3>
                      <p className="text-slate-500 font-medium italic max-w-2xl mx-auto">Don't let these insights sit idle. Open the AI Optimizer to automatically apply these strategic changes and maximize your shortlist probability.</p>
                  </div>
                  <button 
                      onClick={() => navigate('/app/optimize')}
                      className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-slate-800 transition-all shadow-xl active:scale-95 group"
                  >
                      Fix Resume Automatically <Wand2 className="w-5 h-5 inline-block ml-2 group-hover:rotate-12 transition-transform" />
                  </button>
              </section>
            )}
          </div>

          {/* Sidebar Area (4 columns) */}
          <div className="lg:col-span-4">
             <div className="space-y-8 h-fit lg:sticky lg:top-8">
               
               {/* Priority Actions */}
               <ActionPanel suggestions={data.suggestions} missingSkills={data.missing_skills} role={role} />

               {/* Goal Module */}
               <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-900/10 border border-slate-800">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Target className="w-5 h-5 text-white" />
                     </div>
                     <h4 className="font-bold text-lg font-headline leading-none">Target Goal</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="text-slate-500">Match Milestone</span>
                        <span className="text-primary tracking-widest">85% SCORE</span>
                     </div>
                     <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.6)] transition-all duration-[2000ms]" style={{ width: `${Math.min(100, (data.average_score / 85) * 100)}%` }}></div>
                     </div>
                     <p className="text-slate-400 text-xs leading-relaxed font-medium">
                        You are <strong>{Math.max(0, 85 - data.average_score)}%</strong> away from the optimal threshold.
                     </p>
                  </div>
               </div>

               {/* Health Breakdown */}
               <InsightsBreakdown scores={data.section_scores} />

               {/* AI Personalization */}
               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                     <h4 className="font-headline text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-primary" />
                        AI Focus
                     </h4>
                     <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Recommended Roles</p>
                           <div className="flex flex-wrap gap-2">
                             {["Frontend Engineer", "React Lead"].map(r => (
                               <span key={r} className="text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">{r}</span>
                             ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Neural Average Stat */}
               <StatCard 
                  title="Neural Average"
                  value={`${data.average_score}%`}
                  icon="network_intelligence"
                  insight="Pool Benchmark"
                  insightPositive={data.average_score >= 60}
               />
             </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
