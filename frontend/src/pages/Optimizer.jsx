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
  UserCheck,
  Cpu,
  Monitor,
  Database,
  Terminal,
  Search,
  Eye,
  FileSearch,
  Check,
  X,
  ChevronRight,
  Settings2,
  LayoutDashboard,
  Gauge,
  BarChart3,
  Lightbulb,
  FileDown,
  Fingerprint,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { analyzeResume, rewriteResume } from "../api/analyze";
import { getScoreColor } from "../utils/scoring";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Optimizer = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [rewrites, setRewrites] = useState(null);
  const [rewriting, setRewriting] = useState(false);
  const fileInputRef = useRef(null);

  // Metrics derived from result
  const [wordCount, setWordCount] = useState(0);
  const [atsRiskText, setAtsRiskText] = useState("Detecting...");

  useEffect(() => {
    document.title = "Resume Optimization Workbench | Candidex";
  }, []);

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
          setAtsRiskText(data.score < 60 ? "High Risk" : "Low Risk");
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
    <div className="bg-transparent text-white selection:bg-purple-500/30 min-h-screen font-sans relative">
        {/* ATMOSPHERIC DEPTH SYSTEM */}
        <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-purple-600/10 blur-[160px] rounded-full" />
            <div className="absolute bottom-[10%] left-[-5%] w-[1000px] h-[1000px] bg-pink-500/5 blur-[180px] rounded-full" />
        </div>

        <main className="relative z-10 max-w-[1300px] mx-auto px-6 pt-4 pb-12">
            
            {/* 1. COMPACT HERO */}
            <header className="py-6 text-left border-b border-white/10 mb-6 flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/20 shadow-lg shadow-purple-500/10">
                            <Zap className="w-3 h-3" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">v2.0 Neural Workbench</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white italic uppercase leading-none">
                        Neural <span className="text-purple-500">Workbench</span>
                    </h1>
                    <p className="text-white/40 text-[10px] font-medium max-w-lg leading-relaxed italic">
                        Clinical-grade resume engineering for FAANG-level alignment.
                    </p>
                </div>
            </header>

            {!result && !loading ? (
                /* INITIAL INPUT STATE */
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-6 pt-2">
                        <div className="voxr-glass-label w-fit text-purple-400 border border-purple-500/30 px-2 py-0.5 text-[8px] italic">Ingestion Phase</div>
                        <h2 className="text-4xl font-black text-white leading-[1] tracking-tighter uppercase italic">
                            Quantify your <br /> <span className="text-purple-500">Excellence.</span>
                        </h2>
                        <p className="text-base text-white/50 font-medium italic border-l-2 border-purple-500/30 pl-5 leading-relaxed max-w-md">
                            Upload your protocol. We'll simulate the FAANG screening cycle and re-engineer your bullet points for maximum impact.
                        </p>
                        <div className="flex flex-col gap-3">
                            {[
                                { title: "ATS Optimization", desc: "100% compliant parsing logic.", icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> },
                                { title: "Neural Rewriting", desc: "AI-driven action-verb injection.", icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <div className="p-1.5 bg-white/5 rounded-lg border border-white/5 group-hover:border-purple-500/30 transition-all">{item.icon}</div>
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase italic">{item.title}</p>
                                        <p className="text-[9px] text-white/30 font-medium italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card-premium p-6 space-y-5">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">01. Source File</label>
                                {file && <span className="text-[7px] font-black text-green-400 uppercase italic">Protocol Loaded</span>}
                            </div>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group ${
                                    file ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-purple-500/5'
                                }`}
                            >
                                <input type="file" ref={fileInputRef} accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
                                <FileText className={`w-6 h-6 mb-1.5 transition-all ${file ? 'text-green-400' : 'text-white/10 group-hover:text-purple-400'}`} />
                                <p className="text-[8px] font-black text-white uppercase tracking-widest italic">{file ? file.name : "Select PDF Data File"}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">02. Target Intent (JD)</label>
                            <textarea
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                                placeholder="Paste Job Description for alignment analysis..."
                                className="w-full h-28 p-4 bg-black/40 border border-white/10 rounded-xl text-[11px] text-white/90 focus:outline-none focus:border-purple-500/40 transition-all resize-none font-medium italic shadow-inner"
                            />
                        </div>

                        {error && <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-widest text-center italic">{error}</div>}

                        <button 
                            onClick={handleAnalyze} 
                            disabled={loading}
                            className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20"
                        >
                            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {loading ? "Syncing..." : "Run Analysis →"}
                        </button>
                    </div>
                </div>
            ) : result && !loading ? (
                /* DASHBOARD STATE */
                <div className="grid lg:grid-cols-12 gap-6">
                    
                    {/* LEFT PANEL — METRICS */}
                    <div className="lg:col-span-4 space-y-5">
                        <div className="glass-card-premium p-5 space-y-5">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-400 italic">Analysis Metrics</h4>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-[7px] font-black uppercase text-white/20 tracking-widest italic">Live</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                                    <p className="text-[7px] font-black uppercase text-white/20 tracking-widest mb-0.5 italic">Match Score</p>
                                    <p className="text-2xl font-black italic text-green-400 text-glow-green leading-none">{result.score}%</p>
                                </div>
                                <div className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl text-center">
                                    <p className="text-[7px] font-black uppercase text-white/20 tracking-widest mb-0.5 italic">Risk Level</p>
                                    <p className="text-lg font-black italic text-red-500 text-glow-red leading-none uppercase">{atsRiskText}</p>
                                </div>
                            </div>
                        </div>

                        {/* LIVE SUGGESTIONS - ACTION CARDS */}
                        <div className="glass-card-premium p-5 space-y-5">
                            <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-purple-400 italic">Neural Insights</h4>
                            <div className="space-y-2.5">
                                {[
                                    { label: "Verb Impact", desc: "Line 4: 'Worked on' → 'Spearheaded'", color: "text-amber-500" },
                                    { label: "Missing Metric", desc: "Add % growth to Bullet 2", color: "text-blue-500" }
                                ].map((item, idx) => (
                                    <div key={idx} className="p-3.5 bg-white/[0.01] border border-white/5 rounded-xl group hover:border-purple-500/20 transition-all cursor-pointer">
                                        <p className={`text-[8px] font-black uppercase italic ${item.color} mb-1`}>{item.label}</p>
                                        <p className="text-[10px] font-medium text-white/40 leading-relaxed italic">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* USAGE LIMIT */}
                        <div className="glass-card-premium p-4 bg-purple-500/[0.01] border border-purple-500/10">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-xl font-black italic text-white/80">14<span className="text-white/10">/20</span></span>
                                <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest italic">Protocol Quota</span>
                            </div>
                            <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-purple-500 rounded-full w-[70%] shadow-[0_0_10px_rgba(168,85,247,0.3)]"></div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PANEL — AI WORKBENCH */}
                    <div className="lg:col-span-8 space-y-5">
                        {/* COMPACT CONTROL BAR */}
                        <div className="glass-card-premium p-2.5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1.5">
                                <button onClick={handleImproveAll} disabled={rewriting} className="px-4 py-2 bg-white text-black rounded-lg font-black text-[9px] uppercase tracking-widest hover:scale-[1.03] transition-all disabled:opacity-20 flex items-center gap-2">
                                    {rewriting ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                                    Neural Refactor
                                </button>
                                <button className="px-4 py-2 bg-white/5 text-white/30 border border-white/5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:text-white transition-all italic">Audit Log</button>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button className="w-8 h-8 border border-white/5 text-white/10 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all"><RotateCcw className="w-3.5 h-3.5" /></button>
                                <button className="px-5 py-2 bg-purple-500/5 text-purple-400 border border-purple-500/10 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-purple-500/10 transition-all flex items-center gap-2">
                                    <FileDown className="w-3 h-3" /> Export
                                </button>
                            </div>
                        </div>

                        {/* SPLIT VIEW */}
                        <div className="grid lg:grid-cols-2 gap-3.5 h-[600px]">
                            {/* RAW SOURCE */}
                            <div className="glass-card-premium p-5 flex flex-col bg-black/20 overflow-hidden">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.1em] text-white/20 italic">Legacy Source</h4>
                                    <span className="text-[7px] font-bold text-white/5 italic">{wordCount} Words</span>
                                </div>
                                <div className="flex-1 overflow-y-auto pr-2 font-mono text-[10px] text-white/40 leading-relaxed scrollbar-hide select-text selection:bg-purple-500/10 whitespace-pre-wrap italic">
                                    {result.extracted_text || "System stand-by..."}
                                </div>
                            </div>

                            {/* REFACTORED OUTPUT */}
                            <div className="glass-card-premium p-5 flex flex-col bg-black/40 overflow-hidden border-purple-500/10">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                                    <h4 className="text-[8px] font-black uppercase tracking-[0.1em] text-purple-400 italic">Synthesized Output</h4>
                                    {rewrites && <span className="text-[7px] font-black bg-green-500/20 text-green-400 border border-green-500/10 px-2 py-0.5 rounded-md uppercase italic">Verified</span>}
                                </div>
                                
                                <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-3">
                                    {rewriting ? (
                                        <div className="space-y-3">
                                            {[1,2,3,4,5,6].map(i => (
                                                <div key={i} className="h-16 bg-white/[0.01] rounded-xl animate-pulse border border-white/5"></div>
                                            ))}
                                        </div>
                                    ) : rewrites ? (
                                        rewrites.map((item, idx) => (
                                            <motion.div 
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.04 }}
                                                key={idx} 
                                                className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-2.5 hover:border-purple-500/20 transition-all shadow-lg group"
                                            >
                                                <p className="text-[9px] text-white/30 italic font-medium border-l border-red-500/20 pl-3">"{item.original}"</p>
                                                <div className="flex items-center justify-between gap-3">
                                                    <p className="text-[10px] text-white font-black italic leading-snug group-hover:text-glow-purple transition-all">"{item.improved}"</p>
                                                    <button className="w-7 h-7 rounded-lg bg-green-500 text-black flex items-center justify-center shrink-0 hover:scale-110 active:scale-90 transition-all shadow-lg shadow-green-500/20"><Plus className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-10">
                                            <Sparkles className="w-10 h-10 text-white" />
                                            <p className="text-[9px] font-black uppercase italic tracking-widest">Protocol Sync Initialized</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : loading && (
                /* LOADING */
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                    <div className="relative">
                        <div className="w-20 h-20 border border-white/5 border-t-purple-500 rounded-full animate-spin"></div>
                        <Cpu className="absolute inset-0 m-auto w-6 h-6 text-purple-500 animate-pulse" />
                    </div>
                    <div className="text-center space-y-1.5">
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic text-glow-purple">Syncing Neural Nodes</h2>
                        <p className="text-white/20 font-medium text-[10px] italic animate-pulse">Competing with 1.4M candidate protocols...</p>
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default Optimizer;
