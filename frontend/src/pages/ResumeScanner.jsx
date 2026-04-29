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
  Fingerprint
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "../store/useResumeStore";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVar = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

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
        <div className="bg-[#050508] text-white selection:bg-indigo-500/30 min-h-screen">
            <PublicHeader />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-32">
                
                {/* 01. HERO - NEURAL SCANNER */}
                <div className="text-center space-y-12 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full" />
                    
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
                            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent italic"
                        >
                            BYPASS THE <br /> <span className="text-indigo-500">BLACK HOLE.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 text-lg md:text-2xl max-w-3xl mx-auto font-medium italic leading-relaxed"
                        >
                            Recruiters spend <span className="text-white">6 seconds</span> on your resume. Our AI spends <span className="text-indigo-400">42ms</span> to tell you exactly why you're being rejected.
                        </motion.p>
                    </div>

                    {/* 02. UPLOAD - PREMIUM DROPZONE */}
                    {!result && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-3xl mx-auto relative group"
                        >
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                            
                            <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                                onClick={() => !loading && fileInputRef.current?.click()}
                                className={`relative overflow-hidden border transition-all duration-700 rounded-[3rem] p-12 sm:p-24 ${
                                    isDragging 
                                    ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" 
                                    : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10"
                                } ${loading ? "cursor-wait" : "cursor-pointer"}`}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                                
                                <div className="space-y-8 relative z-10">
                                    <div className="flex justify-center">
                                        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-700 ${
                                            file ? "bg-indigo-500 text-white shadow-[0_0_40px_rgba(99,102,241,0.5)]" : "bg-white/5 text-white/20"
                                        }`}>
                                            {loading ? <RefreshCcw className="w-8 h-8 animate-spin" /> : <FileText className="w-8 h-8" />}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black tracking-tighter uppercase italic truncate px-4">
                                            {file ? file.name : "DROP RESUME HERE"}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                                            PDF, DOCX, or TXT • NO SIGNUP REQUIRED
                                        </p>
                                    </div>

                                    {file && !loading && (
                                        <motion.button 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} 
                                            className="px-12 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                        >
                                            INITIATE NEURAL SCAN
                                        </motion.button>
                                    )}

                                    {!file && !loading && (
                                        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/60">
                                            <Sparkles className="w-3.5 h-3.5" /> SECURE LOCAL PROCESSING
                                        </div>
                                    )}
                                </div>

                                {/* Loading Overlay */}
                                <AnimatePresence>
                                    {loading && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-[#050508]/80 backdrop-blur-xl flex flex-col items-center justify-center z-20 space-y-6"
                                        >
                                            <div className="relative">
                                                <div className="w-24 h-24 border-2 border-indigo-500/20 rounded-full animate-ping" />
                                                <Cpu className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black italic tracking-tighter uppercase">Analyzing DNA...</p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">Running 124 Vector Comparisons</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Trust badges below scanner */}
                            <div className="mt-8 flex justify-center items-center gap-10 text-[9px] font-black uppercase tracking-[0.3em] text-white/10">
                                <div className="flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5" /> Zero Data Retention</div>
                                <div className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> End-to-End Encrypted</div>
                                <div className="flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> 15k+ Resumes Optimized</div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* 03. FEATURES - WHY SCAN? */}
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Semantic Audit', desc: 'We scan your resume against thousands of job descriptions to detect keyword gaps.', icon: <Search className="text-indigo-400" /> },
                        { title: 'Readability Scoring', desc: 'Identify complex sentence structures that confuse ATS software.', icon: <Activity className="text-rose-400" /> },
                        { title: 'Action-Verb Density', desc: 'Convert passive duties into high-impact ownership signals.', icon: <Zap className="text-amber-400" /> }
                    ].map((feature, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 hover:bg-white/[0.04] transition-colors group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {feature.icon}
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black italic tracking-tight">{feature.title}</h4>
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
                            className="space-y-12"
                        >
                            <div className="flex items-center justify-between border-b border-white/5 pb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                        <Terminal className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tighter italic uppercase">Scanner Report</h2>
                                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Audit ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setResult(null)}
                                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                                >
                                    New Scan <RotateCcw className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-12">
                                {/* Score Visualization */}
                                <div className="lg:col-span-5 space-y-8">
                                    <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
                                        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8">Composite Match Score</h3>
                                        <div className="relative inline-block">
                                            <span className="text-9xl font-black italic tracking-tighter leading-none bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                                                {result.score}%
                                            </span>
                                        </div>
                                        <div className="mt-8 space-y-4">
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.score}%` }}
                                                    className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                                />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">
                                                Critical Shortlist Risk • Below Sector Avg
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Links */}
                                    <Link 
                                        to="/resume-optimizer"
                                        className="block p-8 bg-indigo-500 text-black rounded-[2.5rem] text-center space-y-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-indigo-500/20"
                                    >
                                        <h4 className="text-xl font-black italic tracking-tight uppercase">Fix These Issues Now</h4>
                                        <p className="text-[10px] font-black uppercase tracking-[0.1em] opacity-60">Auto-Apply 124 Improvements →</p>
                                    </Link>
                                </div>

                                {/* Issue List */}
                                <div className="lg:col-span-7 space-y-8">
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white/60 px-2">Critical Audit Findings</h3>
                                    <div className="space-y-4">
                                        {result.issues.slice(0, 4).map((issue, idx) => (
                                            <div key={idx} className="flex gap-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                                    {idx % 2 === 0 ? <AlertCircle className="w-6 h-6 text-rose-500" /> : <AlertTriangle className="w-6 h-6 text-amber-500" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-bold italic leading-tight text-white/90">"{issue}"</p>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">Potential Score Impact: +12%</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Comparison Preview */}
                            <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 space-y-12">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">Neural Rewriting Preview</h3>
                                    <p className="text-sm text-white/40 italic mt-2">See how our AI transforms passive experience into owner-driven results.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 items-center relative">
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#050508] border border-white/10 items-center justify-center z-10">
                                        <ArrowRight className="w-5 h-5 text-indigo-500" />
                                    </div>

                                    <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 space-y-4 opacity-40">
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Original Version</div>
                                        <p className="text-sm font-medium italic leading-relaxed">"Responsible for managing the team and helping improve the deployment pipeline."</p>
                                    </div>

                                    <div className="p-8 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/30 space-y-4 shadow-2xl">
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 italic">Neural Optimization</div>
                                        <p className="text-sm font-bold italic leading-relaxed text-white">
                                            "Spearheaded the <span className="text-indigo-400">CI/CD transformation</span>, reducing deployment latency by <span className="text-indigo-400">42%</span> and increasing engineering velocity targets."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 05. FINAL CTA */}
                <div className="relative p-12 md:p-24 bg-gradient-to-b from-indigo-600/10 to-transparent border border-white/5 rounded-[4rem] text-center space-y-12 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/10 blur-[120px] -z-10 rounded-full" />
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">READY TO BE <br /> <span className="text-indigo-500">SHORTLISTED?</span></h2>
                        <p className="text-white/40 text-lg md:text-xl font-medium italic max-w-xl mx-auto">Join 15,000+ professionals who bypassed the automated filters and got the interview.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                        <button 
                            onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'}); setTimeout(() => fileInputRef.current?.click(), 500);}}
                            className="px-12 py-6 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
                        >
                            Analyze Free Now <Sparkles className="w-4 h-4" />
                        </button>
                        <Link to="/how-it-works" className="px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                            How it Works
                        </Link>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeScanner;
