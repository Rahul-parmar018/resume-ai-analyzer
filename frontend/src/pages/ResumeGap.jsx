import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, AlertCircle, Sparkles, 
  Target, Zap, Search, Shield, X, Check, Layers, Fingerprint, Activity,
  Cpu, Radar, Crosshair, BookOpen, TrendingUp, HelpCircle
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const ResumeGap = () => {
    const { resumeText, setResumeText } = useResumeStore();
    const [jdText, setJdText] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Skill Gap Analyzer | Candidex AI";
    }, []);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Provide your resume content first."); return; }
        if (!jdText.trim()) { setError("Paste the target Job Description."); return; }
        setLoading(true); setError(""); 
        try {
            const data = await analyzeResume(null, jdText, resumeText, "JD-driven");
            setResult(data);
        } catch (err) {
            setError(err.message || "Analysis failed. Try again.");
        } finally { setLoading(false); }
    };

    const reset = () => { setResult(null); setError(""); setJdText(""); };

    const score = result?.match_score || 0;
    const theme = score >= 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
                  score >= 60 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : 
                  "text-rose-400 bg-rose-500/10 border-rose-500/20";

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <PublicHeader />

            {/* 3D Background Dynamics */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1], x: [0, 50, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]"
                />
                <motion.div 
                    animate={{ rotate: [360, 0], scale: [1, 1.1, 1], x: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] -left-[5%] w-[1000px] h-[1000px] bg-rose-600/5 rounded-full blur-[180px]"
                />
            </div>

            <div className="relative z-10">
                <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 space-y-16">
                    
                    {/* Header Section with 3D Entrance */}
                    <motion.header 
                        initial={{ opacity: 0, y: 20, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        className="space-y-6 max-w-4xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">
                            <Crosshair className="w-4 h-4" /> JD-Driven Alignment
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                            Skill Gap <br /> <span className="text-indigo-500">Analysis.</span>
                        </h1>
                        <p className="text-xl text-white/40 italic font-medium max-w-2xl mx-auto leading-relaxed">
                            Stop guessing. Match your resume against a specific job post to see exactly why you're missing the cut.
                        </p>
                    </motion.header>

                    <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-6xl'} gap-10 items-start`}>
                        
                        {/* Interactive Dual-Pane Input */}
                        <motion.div 
                            layout
                            className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl backdrop-blur-3xl group hover:border-white/20 transition-all duration-500"
                        >
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">01. Target Description</label>
                                    <div className="relative group/field">
                                        <div className="absolute -inset-0.5 bg-indigo-500/10 rounded-[2rem] blur opacity-0 group-hover/field:opacity-100 transition duration-500" />
                                        <textarea
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value)}
                                            placeholder="Paste the target job post here..."
                                            className="relative w-full h-[400px] bg-[#050508]/80 border border-white/10 rounded-[2rem] p-8 text-xs font-medium leading-relaxed placeholder:text-white/5 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">02. Current Profile</label>
                                    <div className="w-full h-[400px] bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 overflow-y-auto relative shadow-inner">
                                        <pre className="text-[12px] text-white/30 whitespace-pre-wrap font-sans leading-relaxed italic">
                                            {resumeText || "No resume detected. Upload one in the Workbench first."}
                                        </pre>
                                        {!resumeText && (
                                            <Link to="/resume-optimizer" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest bg-indigo-600 px-6 py-3 rounded-2xl hover:bg-indigo-500 transition-all shadow-3xl">
                                                Go to Workbench
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAnalyze}
                                disabled={loading || !resumeText || !jdText.trim()}
                                className="w-full py-6 bg-white text-black disabled:opacity-30 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-3xl flex items-center justify-center gap-4 group"
                            >
                                {loading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Radar className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                                {loading ? "Analyzing Overlap..." : "Calculate Skill Gap"}
                            </motion.button>
                            {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">{error}</p>}
                        </motion.div>

                        {/* Result Dashboard with 3D Entrance */}
                        <AnimatePresence>
                            {result && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 60, rotateY: -15 }}
                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                    className="space-y-10"
                                >
                                    {/* Match Index Card */}
                                    <div className="bg-white/[0.04] border border-white/5 rounded-[3.5rem] p-12 flex items-center justify-between shadow-2xl backdrop-blur-3xl group hover:border-indigo-500/20 transition-all duration-500">
                                        <div className="flex items-center gap-10">
                                            <div className="relative w-32 h-32 flex items-center justify-center">
                                                <svg className="absolute inset-0 w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-1000" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="10" />
                                                    <motion.circle 
                                                        initial={{ strokeDasharray: "0 282" }}
                                                        animate={{ strokeDasharray: `${score * 2.82} 282` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className={`${theme.split(' ')[0]}`} strokeLinecap="round" 
                                                    />
                                                </svg>
                                                <span className="text-4xl font-black italic">{score}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Alignment Match Index</h3>
                                                <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${theme} shadow-3xl`}>
                                                    {result.ats_status}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={reset} className="p-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] text-white/20 hover:text-white transition-all shadow-xl">
                                            <RotateCcw className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Findings Grid */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group">
                                        <div className="flex items-center gap-6 border-b border-white/5 pb-8">
                                            <Radar className="w-6 h-6 text-indigo-400" />
                                            <h4 className="text-2xl font-black italic uppercase tracking-tighter">Gap Detection Matrix</h4>
                                        </div>
                                        <div className="space-y-10">
                                            <div className="space-y-6">
                                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-400 italic">Target Matches</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {result.strengths?.map(s => (
                                                        <span key={s} className="px-5 py-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] text-[13px] font-bold text-emerald-400 italic flex items-center gap-3 transition-all hover:bg-emerald-500/10">
                                                            <Check className="w-4 h-4" /> {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6 pt-10 border-t border-white/5">
                                                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-rose-500 italic">Critical Gaps</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {result.missing_skills?.map(s => (
                                                        <span key={s} className="px-5 py-2.5 bg-rose-500/5 border border-rose-500/10 rounded-[1.5rem] text-[13px] font-bold text-rose-400 italic flex items-center gap-3 transition-all hover:bg-rose-500/10">
                                                            <X className="w-4 h-4" /> {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actionable Strategy */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl group">
                                        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Bridge-the-Gap Strategy</h4>
                                            <Sparkles className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div className="p-10 space-y-8">
                                            {result.roadmap?.map((step, idx) => (
                                                <div key={idx} className="flex gap-8 items-start group/item">
                                                    <div className="mt-1 w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 text-xl font-black italic text-white/20 group-hover/item:bg-indigo-600 group-hover/item:text-black transition-all shadow-2xl">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="space-y-1 py-1">
                                                        <p className="text-xl font-black italic text-white leading-tight group-hover/item:text-indigo-400 transition-colors">
                                                            {step.split(':')[0]}
                                                        </p>
                                                        <p className="text-sm font-medium italic text-white/40 leading-relaxed">
                                                            {step.split(':')[1] || "Critical step to align your profile with the employer's expectations."}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Expanded Explanation Sections for Depth */}
                    
                    {/* 01. The Power of Alignment Section */}
                    <section className="bg-white/[0.01] border-y border-white/5 py-40 px-6 relative overflow-hidden">
                        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-32 items-center">
                            <div className="space-y-12 order-2 lg:order-1">
                                <motion.div 
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-8"
                                >
                                    <h2 className="text-4xl md:text-7xl font-black tracking-tight uppercase italic leading-none">
                                        The Alignment <br /> <span className="text-indigo-500">Advantage.</span>
                                    </h2>
                                    <p className="text-xl text-white/40 italic font-medium leading-relaxed max-w-xl">
                                        Most candidates fail because they send the same resume to every job. Our analyzer forces you to look at the job as a set of specific problems you need to solve.
                                    </p>
                                </motion.div>

                                <div className="grid sm:grid-cols-2 gap-8">
                                    {[
                                        { title: "Vector Overlap", desc: "We use AI to measure the semantic distance between your experience and the job's needs.", icon: <Cpu className="w-6 h-6" /> },
                                        { title: "JD Decoding", desc: "Break down complex job posts into simple, actionable skill requirements.", icon: <BookOpen className="w-6 h-6" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6 hover:bg-white/[0.04] transition-all group shadow-2xl">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-3xl">
                                                {item.icon}
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-black italic uppercase leading-none">{item.title}</h4>
                                                <p className="text-xs text-white/30 italic font-medium leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative order-1 lg:order-2">
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    className="relative bg-gradient-to-bl from-indigo-500/20 to-purple-500/10 p-20 rounded-[4rem] border border-white/10 shadow-3xl backdrop-blur-3xl"
                                >
                                    <div className="absolute -top-10 -right-10 bg-[#0A0A0B] border border-white/10 p-10 rounded-[3rem] shadow-3xl rotate-12 animate-float">
                                        <Radar className="w-12 h-12 text-indigo-500" />
                                    </div>
                                    <div className="space-y-10">
                                        <div className="flex justify-between items-center px-4">
                                            <div className="h-2 w-32 bg-white/5 rounded-full relative overflow-hidden">
                                                <motion.div 
                                                    animate={{ x: [-100, 100] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute inset-0 bg-indigo-500/50 blur-sm"
                                                />
                                            </div>
                                            <span className="text-[10px] font-black uppercase text-indigo-400 italic animate-pulse">Scanning Overlap...</span>
                                        </div>
                                        <div className="space-y-4 font-mono text-[11px] text-white/40">
                                            <div className="text-emerald-400">SYNC_STATUS: MATCHED (Python, Docker)</div>
                                            <div className="text-rose-400">GAP_DETECTED: Kubernetes_Orchestration</div>
                                            <div className="text-rose-400">GAP_DETECTED: Distributed_Systems</div>
                                            <div className="opacity-50">INIT_STRATEGY_GENERATION...</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* 02. Final Call to Action */}
                    <section className="pb-32 px-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="p-20 md:p-40 bg-gradient-to-bl from-rose-600/10 to-indigo-600/10 border border-white/10 rounded-[6rem] text-center space-y-16 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                            <div className="space-y-10 relative z-10">
                                <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] select-none">
                                    Close the <br /> <span className="text-indigo-500">Gap.</span>
                                </h2>
                                <p className="text-xl md:text-3xl text-white/40 italic font-medium max-w-3xl mx-auto leading-relaxed">
                                    The difference between a rejection and an interview is usually just 3-4 specific skills. Find them today.
                                </p>
                            </div>
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="px-24 py-8 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-3xl hover:scale-105 active:scale-95 transition-all"
                            >
                                Compare My Resume
                            </button>
                        </motion.div>
                    </section>

                </main>
            </div>

            <PublicFooter />
        </div>
    );
};

export default ResumeGap;
