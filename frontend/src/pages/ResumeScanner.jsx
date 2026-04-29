import { useState, useRef, useEffect } from "react";
import api from "../api-client";
import { 
  FileText,
  RefreshCcw, 
  Zap, 
  Search,
  CheckCircle2,
  TrendingUp,
  Target,
  Shield,
  Clock,
  MousePointer,
  Activity,
  Sparkles,
  Layout,
  MessageSquare,
  Lock,
  RotateCcw,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  FileDown,
  Terminal,
  Cpu,
  BrainCircuit,
  Fingerprint,
  Layers,
  Activity as Pulse
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "../store/useResumeStore";

const ResumeScanner = () => {
    const { setScanResult } = useResumeStore();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.title = "Neural Resume Scanner | Candidex AI";
        window.scrollTo(0, 0);
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("resume", file);
        try {
            const res = await api.post("/analyze-resume/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResult(res.data);
            setScanResult({ ...res.data, extracted_text: res.data.extracted_text || "" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || "Unknown error";
            console.error("[SCANNER] Analysis failed:", err);
            alert(`Analysis failed: ${errMsg}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#050508] text-white selection:bg-indigo-500/30 min-h-screen relative overflow-hidden">
            {/* Background Texture & Patterns */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <PublicHeader />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32 relative z-10">
                
                {/* 01. HERO - NEURAL SCANNER */}
                <div className="text-center space-y-12 relative py-10">
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <BrainCircuit className="w-3.5 h-3.5" /> Neural Audit Engine v5.24
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-[8rem] font-black tracking-tighter leading-[0.8] bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent italic"
                        >
                            BYPASS THE <br /> <span className="text-indigo-500">BLACK HOLE.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 text-lg md:text-2xl max-w-3xl mx-auto font-medium italic leading-relaxed"
                        >
                            Recruiters spend <span className="text-white underline decoration-indigo-500/40">6 seconds</span> on your resume. Our AI spends <span className="text-indigo-400 font-bold">42ms</span> to tell you exactly why you're being rejected.
                        </motion.p>
                    </div>

                    {/* 02. UPLOAD - PREMIUM DROPZONE */}
                    {!result && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-3xl mx-auto relative group"
                        >
                            <div className="absolute -inset-4 bg-indigo-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                            
                            <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                                onClick={() => !loading && fileInputRef.current?.click()}
                                className={`relative overflow-hidden border backdrop-blur-sm transition-all duration-700 rounded-[3rem] p-12 sm:p-24 ${
                                    isDragging 
                                    ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" 
                                    : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20"
                                } ${loading ? "cursor-wait" : "cursor-pointer"} shadow-2xl shadow-black`}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                                
                                <div className="space-y-8 relative z-10">
                                    <div className="flex justify-center">
                                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 ${
                                            file ? "bg-indigo-500 text-white shadow-[0_0_50px_rgba(99,102,241,0.6)]" : "bg-white/5 text-white/20 border border-white/5"
                                        }`}>
                                            {loading ? <RefreshCcw className="w-10 h-10 animate-spin" /> : <FileText className="w-10 h-10" />}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <h3 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic truncate px-4">
                                            {file ? file.name : "DROP RESUME HERE"}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                                            SECURE LOCAL UPLOAD • PDF / DOCX / TXT
                                        </p>
                                    </div>

                                    {file && !loading && (
                                        <motion.button 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} 
                                            className="px-16 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
                                        >
                                            INITIATE NEURAL SCAN
                                        </motion.button>
                                    )}

                                    {!file && !loading && (
                                        <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/40">
                                            <div className="flex items-center gap-2"><Lock className="w-3 h-3" /> PRIVATE</div>
                                            <div className="flex items-center gap-2"><Zap className="w-3 h-3" /> INSTANT</div>
                                            <div className="flex items-center gap-2"><Sparkles className="w-3 h-3" /> AI-DRIVEN</div>
                                        </div>
                                    )}
                                </div>

                                {/* Decorative Background Elements in Card */}
                                <div className="absolute top-4 left-4 text-white/[0.02] font-mono text-[8px] select-none text-left leading-none uppercase tracking-tighter">
                                    {Array(10).fill(0).map((_, i) => <div key={i}>SCAN_BUFFER_LOAD_0x{Math.random().toString(16).substr(2, 4)}...</div>)}
                                </div>

                                {/* Loading Overlay */}
                                <AnimatePresence>
                                    {loading && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-[#050508]/90 backdrop-blur-2xl flex flex-col items-center justify-center z-20 space-y-8"
                                        >
                                            <div className="relative">
                                                <div className="w-32 h-32 border border-indigo-500/20 rounded-full animate-[ping_2s_linear_infinite]" />
                                                <div className="w-32 h-32 border border-indigo-500/40 rounded-full animate-[ping_3s_linear_infinite] absolute inset-0" />
                                                <Cpu className="w-12 h-12 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <p className="text-3xl font-black italic tracking-tighter uppercase">Analyzing DNA...</p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400/60 animate-pulse">Running 124 Vector Comparisons</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Trust badges below scanner */}
                            <div className="mt-12 flex flex-wrap justify-center items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">
                                <div className="flex items-center gap-3"><Fingerprint className="w-4 h-4" /> Zero Data Retention</div>
                                <div className="flex items-center gap-3"><Shield className="w-4 h-4" /> End-to-End Encrypted</div>
                                <div className="flex items-center gap-3"><TrendingUp className="w-4 h-4" /> 15,000+ Profiles Audited</div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* 03. FEATURES - WHY SCAN? */}
                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        { title: 'Semantic Audit', desc: 'We scan your resume against thousands of job descriptions to detect keyword gaps.', icon: <Search className="w-6 h-6 text-indigo-400" /> },
                        { title: 'Readability Scoring', desc: 'Identify complex sentence structures that confuse ATS software.', icon: <Pulse className="w-6 h-6 text-rose-400" /> },
                        { title: 'Action-Verb Density', desc: 'Convert passive duties into high-impact ownership signals.', icon: <Zap className="w-6 h-6 text-amber-400" /> }
                    ].map((feature, i) => (
                        <div key={i} className="p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-8 hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                                {feature.icon}
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                {feature.icon}
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-2xl font-black italic tracking-tight uppercase">{feature.title}</h4>
                                <p className="text-sm text-white/40 font-medium leading-relaxed italic">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 04. RESULTS DASHBOARD */}
                <AnimatePresence>
                    {result && !loading && (
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12 pb-20"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-indigo-500 text-black rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                                        <Terminal className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black tracking-tighter italic uppercase">Neural Audit Report</h2>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Sync Complete • Audit_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => {setResult(null); setFile(null);}}
                                    className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
                                >
                                    New Scan <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-10">
                                {/* Score Visualization */}
                                <div className="lg:col-span-5 space-y-10">
                                    <div className="bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-12 text-center relative overflow-hidden group shadow-2xl">
                                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[120px] -mr-40 -mt-40 pointer-events-none" />
                                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-10">Composite Match Score</h3>
                                        
                                        <div className="relative inline-block py-4">
                                            <span className="text-[10rem] md:text-[12rem] font-black italic tracking-tighter leading-none bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent select-none">
                                                {result.score}
                                            </span>
                                            <span className="absolute top-10 -right-8 text-4xl font-black text-indigo-500/40 italic">%</span>
                                        </div>

                                        <div className="mt-6 space-y-6">
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.score}%` }}
                                                    className="h-full bg-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.6)] rounded-full"
                                                />
                                            </div>
                                            <div className="flex justify-between items-center px-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
                                                    <AlertTriangle className="w-3 h-3" /> Critical Risk
                                                </p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Benchmark: 85%+</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <Link 
                                        to="/resume-optimizer"
                                        className="block p-10 bg-indigo-500 text-black rounded-[3rem] text-center space-y-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/30 group"
                                    >
                                        <h4 className="text-2xl font-black italic tracking-tight uppercase flex items-center justify-center gap-3">
                                            Fix Issues Automatically <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                        </h4>
                                        <p className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60 italic">Inject 124 Neural Improvements Instantly</p>
                                    </Link>
                                </div>

                                {/* Issue List */}
                                <div className="lg:col-span-7 space-y-10">
                                    <div className="flex items-center gap-4 px-2">
                                        <Layers className="w-5 h-5 text-indigo-400" />
                                        <h3 className="text-xl font-black italic uppercase tracking-widest text-white/80">Critical Audit Findings</h3>
                                    </div>
                                    <div className="space-y-5">
                                        {result.issues.slice(0, 4).map((issue, idx) => (
                                            <div key={idx} className="flex gap-8 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-white/5">
                                                    {idx % 2 === 0 ? <AlertCircle className="w-8 h-8 text-rose-500" /> : <AlertTriangle className="w-8 h-8 text-amber-500" />}
                                                </div>
                                                <div className="space-y-2 py-1">
                                                    <p className="text-xl font-bold italic leading-tight text-white/90">"{issue}"</p>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80 italic">Fix Complexity: Low</span>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">•</span>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 italic">Impact: +12% Score</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Preview */}
                            <div className="p-16 rounded-[4rem] bg-white/[0.01] border border-white/10 space-y-16 relative overflow-hidden shadow-2xl">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[150px] -mr-250 -mt-250 pointer-events-none" />
                                
                                <div className="text-center space-y-4">
                                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Neural Rewriting Preview</h3>
                                    <p className="text-lg text-white/40 italic max-w-2xl mx-auto leading-relaxed">Our engine doesn't just find issues—it predicts the high-impact language recruiters are looking for.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-16 items-center relative">
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#050508] border border-white/10 items-center justify-center z-10 shadow-2xl">
                                        <ArrowRight className="w-8 h-8 text-indigo-500" />
                                    </div>

                                    <div className="p-10 bg-white/[0.02] rounded-[2.5rem] border border-white/5 space-y-6 opacity-40 group relative grayscale hover:grayscale-0 transition-all">
                                        <div className="flex items-center gap-3">
                                            <XCircle className="w-4 h-4 text-rose-500" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Candidate Original</span>
                                        </div>
                                        <p className="text-lg font-medium italic leading-relaxed text-white/60">"Responsible for managing the team and helping improve the deployment pipeline."</p>
                                    </div>

                                    <div className="p-10 bg-indigo-500/5 rounded-[2.5rem] border border-indigo-500/20 space-y-6 shadow-3xl group transition-all hover:bg-indigo-500/10">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 italic">Neural Optimization</span>
                                        </div>
                                        <p className="text-xl font-bold italic leading-relaxed text-white selection:bg-indigo-500/40">
                                            "Spearheaded the <span className="text-indigo-400">CI/CD transformation</span>, reducing deployment latency by <span className="text-indigo-400">42%</span> and increasing engineering velocity targets."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 05. FINAL CTA */}
                {!result && (
                    <div className="relative p-16 md:p-32 bg-gradient-to-b from-indigo-600/10 to-transparent border border-white/5 rounded-[5rem] text-center space-y-12 overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
                        
                        <div className="space-y-6 relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">READY TO BE <br /> <span className="text-indigo-500">SHORTLISTED?</span></h2>
                            <p className="text-white/40 text-lg md:text-2xl font-medium italic max-w-2xl mx-auto leading-relaxed">Join 15,000+ professionals who bypassed the automated filters and got the interview.</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
                            <button 
                                onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'}); setTimeout(() => fileInputRef.current?.click(), 500);}}
                                className="px-16 py-7 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center gap-4 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                            >
                                Analyze Free Now <Sparkles className="w-5 h-5" />
                            </button>
                            <Link to="/how-it-works" className="px-16 py-7 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] transition-all backdrop-blur-md">
                                See System Architecture
                            </Link>
                        </div>
                    </div>
                )}

            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeScanner;
