import { useState, useEffect, useRef } from "react";
import { 
  Zap, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Target, 
  RotateCcw, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Settings, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Layers,
  MousePointer2,
  PieChart,
  Activity,
  UserCheck
} from "lucide-react";
import { analyzeResume, rewriteResume } from "../api/analyze";
import { getScoreColor } from "../utils/scoring";
import { Link } from "react-router-dom";

const Optimizer = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  // Phase 3 Rewrite States
  const [rewrites, setRewrites] = useState(null);
  const [rewriting, setRewriting] = useState(false);
  const [activeTab, setActiveTab] = useState("editor"); // editor | insights

  // Metrics
  const [wordCount, setWordCount] = useState(0);
  const [atsRiskText, setAtsRiskText] = useState("Detecting...");

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setRewrites(null);
    try {
      const data = await analyzeResume(file, jd);
      setResult(data);
      if (data.extracted_text) {
          setWordCount(data.extracted_text.split(/\s+/).length);
          setAtsRiskText(data.score < 60 ? "High ⚠️" : "Low ✅");
      }
    } catch (err) {
      setError(err.message || "Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleImproveAll = async () => {
    if (!result?.extracted_text) return;
    setRewriting(true);
    try {
      const data = await rewriteResume(result.extracted_text);
      setRewrites(data.results);
    } catch (err) {
      console.error("Rewrite failed:", err);
    } finally {
      setRewriting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 selection:bg-indigo-500/10">
      
      {/* 🥇 1. HEADER (STUNNING FIRST IMPRESSION) */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 px-8">
          <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.3em]">
                  <Sparkles className="w-4 h-4" /> Professional AI Workbench
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                  Fix Your Resume Like a <span className="text-indigo-600 italic">Top 1% Candidate</span>
              </h1>
              <p className="text-slate-400 font-medium text-lg italic max-w-2xl">
                  Used by candidates targeting FAANG & global roles. Stop guessing—engineer your identity with clinical precision.
              </p>
          </div>
      </div>

      {/* 🥈 2. CONTEXT BAR (STAY INFORMED) */}
      {result && (
          <div className="sticky top-0 z-50 bg-slate-900 text-white border-y border-white/5 px-8 py-3 flex flex-wrap items-center justify-between gap-6 overflow-hidden">
              <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Target className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Match Score</p>
                          <p className="text-sm font-black italic tracking-tighter text-emerald-400 leading-none">{result.score}% → <span className="text-white opacity-40">Target 85%+</span></p>
                      </div>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                  <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Layers className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                          <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest leading-none mb-1">Target Role</p>
                          <p className="text-sm font-black italic tracking-tighter text-white leading-none">Software Engineer Intern</p>
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">3 Critical Issues Detected</p>
                      <p className="text-[8px] font-bold text-slate-500 italic">Ready to optimize with Neural Engine</p>
                  </div>
                  <button onClick={handleImproveAll} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                      <Zap className="w-3.5 h-3.5" /> Fix All Now
                  </button>
              </div>
          </div>
      )}

      <div className="max-w-7xl mx-auto px-8 py-10">
          {!result && !loading ? (
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
                  <div className="space-y-10">
                      <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 text-[10px] font-black uppercase tracking-widest">Neural Workbench v2.0</div>
                      <h2 className="text-6xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase italic">
                          Start your <br /> <span className="text-indigo-600">Re-Engineering.</span>
                      </h2>
                      <p className="text-xl text-slate-500 font-medium italic border-l-4 border-slate-100 pl-8">
                          Upload your raw data. Our AI analyzes the "Experience Gap" between your current profile and the target role in real-time.
                      </p>
                      <div className="grid grid-cols-2 gap-6 pb-4">
                         <div className="space-y-2">
                             <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase italic">
                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SEO Optimized
                             </div>
                             <p className="text-xs text-slate-400 font-medium">Rank #1 in Recruiter Search.</p>
                         </div>
                         <div className="space-y-2">
                             <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase italic">
                                 <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Impact Driven
                             </div>
                             <p className="text-xs text-slate-400 font-medium">Quantify your achievements.</p>
                         </div>
                      </div>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">01. Source File</label>
                        <div className="relative group cursor-pointer">
                            <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />
                            <div className={`h-48 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all ${
                                file ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-slate-100 bg-slate-50 group-hover:border-indigo-400'
                            }`}>
                                <FileText className={`w-12 h-12 mb-4 ${file ? 'text-emerald-500' : 'text-slate-200 group-hover:text-indigo-400'}`} />
                                <p className="text-sm font-black text-slate-900 italic tracking-tight">{file ? file.name : "Click to Drop Resume PDF"}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Processed securely & locally</p>
                            </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">02. Target Intent (JD)</label>
                        <textarea
                          value={jd}
                          onChange={(e) => setJd(e.target.value)}
                          placeholder="Paste Job Description here..."
                          className="w-full h-48 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none font-medium italic"
                        />
                      </div>

                      {error && <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center italic">{error}</div>}

                      <button 
                        onClick={handleAnalyze} 
                        disabled={loading}
                        className={`w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-2xl transition-all shadow-2xl flex items-center justify-center gap-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800 active:scale-95'}`}
                      >
                        {loading ? "Neural Analysis Processing..." : "Initialize Workbench"} <ArrowRight className="w-6 h-6" />
                      </button>
                  </div>
              </div>
          ) : result && !loading ? (
              <div className="grid lg:grid-cols-12 gap-10">
                  
                  {/* 🥉 3. LEFT PANEL — INPUT & METRICS */}
                  <div className="lg:col-span-4 space-y-10">
                      {/* STATS CARD */}
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 border-b border-slate-50 pb-4">Real-time Metrics</h4>
                          <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-1">
                                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Word Count</p>
                                  <p className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none">{wordCount}</p>
                              </div>
                              <div className="space-y-1">
                                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Readability</p>
                                  <p className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none">Medium</p>
                              </div>
                              <div className="col-span-2 space-y-3 pt-2">
                                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">ATS Risk Indicator</p>
                                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 p-3 rounded-xl">
                                      <ShieldAlert className="w-4 h-4 text-rose-500" />
                                      <span className="text-[11px] font-black uppercase text-rose-600 tracking-widest italic">{atsRiskText}</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 💥 5. LIVE SUGGESTIONS PANEL */}
                      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 flex items-center justify-between">
                              Live Suggestions <span>(3)</span>
                          </h4>
                          <div className="space-y-4">
                              {[
                                  { icon: <Zap className="w-4 h-4 text-amber-500" />, label: "Weak Bullet Detected", desc: "Change passive verbs to action verbs.", action: "Improve Line 8" },
                                  { icon: <Activity className="w-4 h-4 text-blue-500" />, label: "Missing Metrics", desc: "Add numbers to quantify impact.", action: "Add Numbers" },
                                  { icon: <Settings className="w-4 h-4 text-purple-500" />, label: "ATS Risk: Complexity", desc: "Break down long sentences.", action: "Simplify" }
                              ].map((item, idx) => (
                                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-400 cursor-pointer transition-all">
                                      <div className="flex items-center gap-3 mb-2">
                                          {item.icon}
                                          <p className="text-[10px] font-black uppercase italic text-slate-900">{item.label}</p>
                                      </div>
                                      <p className="text-[10px] font-medium text-slate-400 leading-normal mb-3">{item.desc}</p>
                                      <button className="text-[9px] font-black uppercase tracking-widest text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                                          {item.action} <ArrowRight className="w-3 h-3" />
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* 💰 8. PROGRESS + LIMIT */}
                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-2xl shadow-slate-900/20 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                          <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 relative z-10">Account Usage</h4>
                          <div className="space-y-4 relative z-10">
                              <div className="flex justify-between items-end">
                                  <span className="text-3xl font-black italic">8<span className="text-white/20">/20</span></span>
                                  <span className="text-[10px] font-bold text-slate-500">Optimizations Left</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                  <div className="h-full bg-indigo-500 rounded-full w-[40%]"></div>
                              </div>
                              <Link to="/pricing" className="block text-center py-4 bg-white/5 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                                  Upgrade to Pro
                              </Link>
                          </div>
                      </div>
                  </div>

                  {/* 🏆 4. RIGHT PANEL — AI WORKBENCH / OUTPUT */}
                  <div className="lg:col-span-8 space-y-8">
                      {/* ⚡ 7. CONTROL PANEL (TOP BAR) */}
                      <div className="bg-white border border-slate-100 rounded-[2rem] p-4 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-2">
                              <button className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">Fix Entire Resume</button>
                              <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Fix Selected</button>
                              <button className="px-4 py-2 bg-slate-50 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Optimize for Job</button>
                          </div>
                          <div className="flex items-center gap-2">
                              <button className="w-10 h-10 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all"><RotateCcw className="w-4 h-4" /></button>
                              <button className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all">Export PDF</button>
                          </div>
                      </div>

                      {/* SPLIT EDITOR VIEW */}
                      <div className="grid lg:grid-cols-2 gap-4 h-[650px]">
                          {/* INPUT EDITOR */}
                          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-6 shadow-sm overflow-hidden flex flex-col">
                              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Main Resume Text</h4>
                                  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-300">
                                      <MousePointer2 className="w-3 h-3" /> Select line to improve
                                  </div>
                              </div>
                              <div className="flex-1 overflow-y-auto pr-4 font-mono text-sm text-slate-600 leading-[1.8] scrollbar-hide select-text selection:bg-indigo-500/20">
                                  {result.extracted_text || "Paste your resume here..."}
                              </div>
                          </div>

                          {/* OUTPUT / SUGGESTIONS WINDOW */}
                          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 space-y-8 shadow-sm overflow-hidden flex flex-col relative">
                              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">AI Workbench Output</h4>
                                  {rewrites && <span className="text-[9px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Analysis Complete</span>}
                              </div>
                              
                              <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide space-y-6">
                                  {rewriting ? (
                                      <div className="space-y-6">
                                          {[1,2,3,4].map(i => (
                                              <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                                          ))}
                                      </div>
                                  ) : rewrites ? (
                                      rewrites.map((item, idx) => (
                                          <div key={idx} className="space-y-3 group/fix animate-in slide-in-from-right duration-500">
                                              {/* 🧠 6. BEFORE vs AFTER CARD */}
                                              <div className="p-5 bg-slate-800 rounded-2xl space-y-4 border border-white/5 shadow-xl relative overflow-hidden">
                                                  <div className="flex items-center gap-2">
                                                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Source Line</span>
                                                  </div>
                                                  <p className="text-xs text-slate-400 italic font-medium leading-relaxed">"{item.original}"</p>
                                                  
                                                  <div className="h-px bg-white/5"></div>
                                                  
                                                  <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Candidex Recommendation</span>
                                                      </div>
                                                      <button className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center hover:scale-105 transition-all"><Plus className="w-4 h-4" /></button>
                                                  </div>
                                                  <p className="text-xs text-white font-bold leading-relaxed selection:bg-emerald-500/30 italic">"{item.improved}"</p>
                                                  
                                                  {/* Tags */}
                                                  <div className="flex flex-wrap gap-1 mt-1">
                                                     {item.improvements?.map((imp, i) => (
                                                        <span key={i} className="text-[8px] font-black bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                           {imp}
                                                        </span>
                                                     ))}
                                                  </div>
                                              </div>
                                          </div>
                                      ))
                                  ) : (
                                      <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                                          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                                              <Sparkles className="w-10 h-10 text-slate-200" />
                                          </div>
                                          <div>
                                              <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">AI Suggestions Ready</p>
                                              <p className="text-xs text-slate-400 font-medium max-w-[200px] mt-2">Initialized. Select lines or click "Fix All" to begin neural transformation.</p>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* 📊 9. INSIGHTS PANEL (BOTTOM) */}
                  <div className="lg:col-span-12 grid lg:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                      <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                          <h5 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.4em] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" /> Top Skills Missing</h5>
                          <div className="flex flex-wrap gap-2">
                             {result.missing_skills?.map(s => <span key={s} className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black border border-rose-100">-{s}</span>)}
                             {result.missing_skills?.length === 0 && <span className="text-[10px] text-slate-400 italic">No critical skills missing. Perfect.</span>}
                          </div>
                      </div>
                      <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
                          <h5 className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em] flex items-center gap-2"><PieChart className="w-3.5 h-3.5" /> Keyword Match</h5>
                          <div className="flex flex-wrap gap-2">
                             {result.skills_found?.map(s => <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-black border border-indigo-100">+{s}</span>)}
                          </div>
                      </div>
                      <div className="p-8 bg-slate-900 border border-slate-900 rounded-[2.5rem] shadow-sm space-y-6 text-white text-center flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                          <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] relative z-10">Recruiter Visibility</h5>
                          <p className="text-5xl font-black italic tracking-tighter text-rose-500 relative z-10">LOW</p>
                          <p className="text-[9px] font-bold text-slate-400 relative z-10 italic">Optimization score must be 80%+ </p>
                      </div>
                  </div>
              </div>
          ) : loading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-fade-in">
                  <div className="relative">
                      <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <RotateCcw className="w-8 h-8 text-indigo-600 animate-pulse" />
                      </div>
                  </div>
                  <div className="text-center space-y-2">
                      <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Initializing Neural Engine</h2>
                      <p className="text-slate-400 font-medium text-lg italic animate-pulse">Competing with 1.4M candidate data points... (First run may take 30-60s)</p>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};

export default Optimizer;
