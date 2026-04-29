import { useState, useEffect } from "react";
import { 
  RotateCcw, CheckCircle2, Copy, AlertCircle, Check, 
  AlertTriangle, Target, Zap, Code2, BarChart3,
  Shield, X, Search, BookOpen, Layers, Fingerprint, FileDown,
  ArrowDown, Cpu, Sparkles, MousePointer2, Briefcase, GraduationCap
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const BIG_FIVE = [
  { key: "AI/ML Engineer", icon: Target, desc: "Neural networks & ML pipelines" },
  { key: "Cybersecurity Engineer", icon: Shield, desc: "Infosec & Threat Detection" },
  { key: "Full Stack Developer", icon: Code2, desc: "Web architecture & APIs" },
  { key: "DevOps Engineer", icon: Zap, desc: "CI/CD & Cloud Infrastructure" },
  { key: "Data Scientist", icon: BarChart3, desc: "Analytics & Predictive Modeling" }
];

const ResumeFixer = () => {
    const { user } = useAuth();
    const { resumeText, setResumeText } = useResumeStore();
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copiedIdx, setCopiedIdx] = useState(null);

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        document.title = "Resume Optimizer | Candidex AI";
    }, []);

    const handleAnalyze = async () => {
        if (!resumeText.trim()) { setError("Paste your resume content first."); return; }
        if (!selectedRole) { setError("Select a target role."); return; }
        setLoading(true); setError(""); 
        try {
            const data = await analyzeResume(null, "", resumeText, selectedRole);
            setResult(data);
        } catch (err) {
            setError(err.message || "Analysis failed. Try again.");
        } finally { setLoading(false); }
    };

    const copyText = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const reset = () => { setResult(null); setError(""); setSelectedRole(""); };

    const score = result?.match_score || 0;
    const theme = score >= 75 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
                  score >= 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : 
                  "text-rose-400 bg-rose-500/10 border-rose-500/20";

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <PublicHeader />

            {/* 3D Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <motion.div 
                    animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"
                />
                <motion.div 
                    animate={{ 
                        rotate: [360, 0],
                        scale: [1, 1.3, 1],
                        x: [0, -100, 0],
                        y: [0, 100, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10">
                <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 space-y-12">
                    
                    {/* Header Section with 3D Tilt Entrance */}
                    <motion.header 
                        initial={{ opacity: 0, y: 20, rotateX: 10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        className="space-y-4 max-w-3xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                            <Sparkles className="w-3 h-3" /> AI-Powered Workbench
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic leading-[0.9]">
                            Optimize for the <br /> <span className="text-indigo-500">Shortlist.</span>
                        </h1>
                        <p className="text-base md:text-lg text-white/50 leading-relaxed font-medium mx-auto">
                            Don't leave your career to chance. Use deterministic analysis to align your resume with industry-standard benchmarks.
                        </p>
                    </motion.header>

                    <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-5xl mx-auto'} gap-8 items-start`}>
                        
                        {/* Input Panel with 3D Hover Effect */}
                        <motion.div 
                            layout
                            className="space-y-8 bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:border-white/20"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <Cpu className="w-24 h-24" />
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-white/30">01. Select Career Path</label>
                                    <MousePointer2 className="w-4 h-4 text-indigo-500 animate-pulse" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {BIG_FIVE.map((role) => (
                                        <button
                                            key={role.key}
                                            onClick={() => setSelectedRole(role.key)}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border text-sm font-bold transition-all relative overflow-hidden ${
                                                selectedRole === role.key 
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]" 
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                            }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                                selectedRole === role.key ? "bg-white/20" : "bg-white/5"
                                            }`}>
                                                <role.icon className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <div className="leading-tight">{role.key}</div>
                                                <div className={`text-[9px] font-medium opacity-40 uppercase tracking-tighter ${selectedRole === role.key ? "text-white" : ""}`}>
                                                    {role.desc}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-xs font-black uppercase tracking-[0.2em] text-white/30">02. Resume Raw Content</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-[1.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                    <textarea
                                        value={resumeText}
                                        onChange={(e) => setResumeText(e.target.value)}
                                        placeholder="Paste your experience, skills, and projects here..."
                                        className="relative w-full h-[450px] bg-[#050508]/80 border border-white/10 rounded-[1.5rem] p-6 text-sm font-medium leading-relaxed placeholder:text-white/5 focus:outline-none focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                                    />
                                    <div className="absolute bottom-6 right-6 flex gap-4">
                                        <motion.button 
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleAnalyze}
                                            disabled={loading || !resumeText.trim() || !selectedRole}
                                            className="flex items-center gap-3 bg-white text-black disabled:opacity-30 px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                        >
                                            {loading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                            {loading ? "Synthesizing..." : "Analyze DNA"}
                                        </motion.button>
                                    </div>
                                </div>
                                {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>}
                            </div>
                        </motion.div>

                        {/* Right Panel: Enhanced Results with Motion */}
                        <AnimatePresence>
                            {result && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 50, rotateY: -10 }}
                                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Score Card with 3D Ring */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 flex items-center justify-between shadow-2xl backdrop-blur-xl group hover:border-white/20 transition-all duration-500">
                                        <div className="flex items-center gap-8">
                                            <div className="relative w-24 h-24 flex items-center justify-center">
                                                <svg className="absolute inset-0 w-full h-full -rotate-90 group-hover:scale-110 transition-transform duration-700" viewBox="0 0 100 100">
                                                    <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
                                                    <motion.circle 
                                                        initial={{ strokeDasharray: "0 282" }}
                                                        animate={{ strokeDasharray: `${score * 2.82} 282` }}
                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                        cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className={`${theme.split(' ')[0]}`} strokeLinecap="round" 
                                                    />
                                                </svg>
                                                <span className="text-3xl font-black italic">{score}</span>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Composite Match Score</h3>
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${theme} shadow-lg`}>
                                                    {result.ats_status}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={reset} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white/30 hover:text-white transition-all">
                                            <RotateCcw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Detailed Breakdown with Tilt Cards */}
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6 shadow-xl"
                                        >
                                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80">Strengths Detected</h4>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="flex flex-wrap gap-2.5">
                                                {result.strengths?.map(s => (
                                                    <span key={s} className="px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[11px] font-bold text-emerald-400 italic flex items-center gap-2">
                                                        <Check className="w-3.5 h-3.5" /> {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6 shadow-xl"
                                        >
                                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400/80">Skill Gaps</h4>
                                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                            </div>
                                            <div className="flex flex-wrap gap-2.5">
                                                {result.missing_skills?.map(s => (
                                                    <span key={s} className="px-3 py-1.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[11px] font-bold text-rose-400 italic flex items-center gap-2">
                                                        <X className="w-3.5 h-3.5" /> {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Actionable Suggestions with Side-Bar Indicator */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Strategy Roadmap</h4>
                                            <BookOpen className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <div className="p-8 space-y-6">
                                            {result.roadmap?.map((step, idx) => (
                                                <div key={idx} className="flex gap-6 items-start group">
                                                    <div className="mt-1 w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[11px] font-black italic text-white/20 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-[15px] font-medium text-white/60 leading-relaxed group-hover:text-white transition-colors">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Copyable Optimized Snippets */}
                                    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                                        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Optimization Buffer</h4>
                                            <Fingerprint className="w-4 h-4 text-indigo-500" />
                                        </div>
                                        <div className="p-8 space-y-4">
                                            {result.recommendations?.map((rec, idx) => (
                                                <div key={idx} className="p-6 bg-[#050508]/60 border border-white/5 rounded-2xl space-y-4 group transition-all hover:border-indigo-500/30">
                                                    <p className="text-base font-bold italic leading-relaxed text-white/80 select-all">"{rec}"</p>
                                                    <button 
                                                        onClick={() => copyText(rec, idx)}
                                                        className={`flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${copiedIdx === idx ? 'text-emerald-400' : 'text-white/20 hover:text-indigo-400'}`}
                                                    >
                                                        {copiedIdx === idx ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        {copiedIdx === idx ? 'Synced to Clipboard' : 'Copy Optimization'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>

                {/* New Expanded "Explanation" Sections to make page bigger */}
                
                {/* 01. Why ATS Matters Section */}
                <section className="bg-white/[0.01] border-y border-white/5 py-32 px-6">
                    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic leading-none">
                                    The 6-Second <br /> <span className="text-indigo-500">Filter.</span>
                                </h2>
                                <p className="text-lg text-white/50 leading-relaxed font-medium max-w-xl">
                                    Modern recruitment systems (ATS) discard 75% of resumes before a human even sees them. Our engine reverses this bias by highlighting the specific semantic patterns these systems search for.
                                </p>
                            </motion.div>
                            
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                                    <Search className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-lg font-bold italic uppercase">Keyword Matching</h4>
                                    <p className="text-[13px] text-white/40 leading-relaxed">We identify missing industry-standard terminology and skill markers.</p>
                                </div>
                                <div className="space-y-4 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all group">
                                    <Layers className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-lg font-bold italic uppercase">Role Alignment</h4>
                                    <p className="text-[13px] text-white/40 leading-relaxed">Compare your history against specialized role templates for 90%+ accuracy.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative order-1 lg:order-2">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-12 rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(99,102,241,0.2)]"
                            >
                                <div className="absolute -top-10 -right-10 bg-[#0A0A0B] border border-white/10 p-6 rounded-3xl shadow-2xl rotate-12 animate-float">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                                </div>
                                <div className="absolute -bottom-10 -left-10 bg-[#0A0A0B] border border-white/10 p-6 rounded-3xl shadow-2xl -rotate-12 animate-float-delayed">
                                    <AlertCircle className="w-8 h-8 text-rose-500" />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <div className="space-y-3 font-mono text-[10px] text-white/40">
                                        <div>{">"} SYSTEM_AUDIT_START</div>
                                        <div className="text-emerald-400">{">"} EXTRACTING_VECTORS... DONE</div>
                                        <div className="text-rose-400">{">"} DETECTED_SKILL_GAP: DOCKER</div>
                                        <div className="text-rose-400">{">"} DETECTED_SKILL_GAP: AWS_S3</div>
                                        <div>{">"} GENERATING_ROADMAP...</div>
                                        <div className="animate-pulse">_</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 02. Usage Steps Section */}
                <section className="py-32 px-6">
                    <div className="max-w-[1400px] mx-auto space-y-20">
                        <div className="text-center space-y-6 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic leading-none">
                                How to <span className="text-indigo-500">Win.</span>
                            </h2>
                            <p className="text-lg text-white/40 italic">Follow our proven workflow to triple your interview conversion rates.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                { step: "01", title: "Select Role", desc: "Choose your target engineering or analytics career path to initialize the comparison engine.", icon: <Briefcase className="w-8 h-8" /> },
                                { step: "02", title: "Paste Context", desc: "Paste your raw resume text. Our secure session ensures your data stays private and never hits our database.", icon: <FileDown className="w-8 h-8" /> },
                                { step: "03", title: "Apply Gaps", desc: "Use our AI-generated snippets and roadmap to fill the gaps and reach an 85%+ match score.", icon: <GraduationCap className="w-8 h-8" /> }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -10 }}
                                    className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-10 text-8xl font-black text-white/[0.02] italic pointer-events-none group-hover:text-indigo-500/[0.05] transition-colors">
                                        {item.step}
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black italic uppercase">{item.title}</h4>
                                        <p className="text-sm text-white/40 leading-relaxed italic">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 03. Final CTA with Motion */}
                <section className="pb-32 px-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-[1400px] mx-auto p-20 md:p-40 bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-white/10 rounded-[6rem] text-center space-y-12 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                        <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter uppercase italic leading-[0.8] select-none">
                            Ready to <br /> <span className="text-indigo-500">Shortlist?</span>
                        </h2>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="px-20 py-8 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
                        >
                            Back to Workbench
                        </button>
                    </motion.div>
                </section>
            </div>

            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
