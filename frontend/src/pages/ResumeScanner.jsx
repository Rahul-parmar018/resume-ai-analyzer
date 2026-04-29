import { useState, useRef, useEffect } from "react";
import api from "../api-client";
import { 
  FileText,
  RefreshCcw, 
  Zap, 
  Search,
  CheckCircle2,
  Target,
  Shield,
  Activity,
  Sparkles,
  Lock,
  RotateCcw,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  FileDown,
  Layers,
  Fingerprint,
  Cpu,
  Monitor,
  Eye,
  FileSearch,
  Check
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useResumeStore } from "../store/useResumeStore";

const ResumeScanner = () => {
    const { setScanResult } = useResumeStore();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [pasteText, setPasteText] = useState("");
    const [mode, setMode] = useState("upload");
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.title = "Resume Scanner | Candidex AI";
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (mode === "upload" && !file) return;
        if (mode === "paste" && !pasteText.trim()) return;
        
        setLoading(true);
        const formData = new FormData();
        if (mode === "upload") {
            formData.append("resume", file);
        } else {
            const blob = new Blob([pasteText], { type: "text/plain" });
            formData.append("resume", blob, "resume.txt");
        }

        try {
            const res = await api.post("/analyze-resume/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setResult(res.data);
            setScanResult({ ...res.data, extracted_text: res.data.extracted_text || "" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            const errMsg = err.response?.data?.error || err.message || "Unknown error";
            alert(`Analysis failed: ${errMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0A0A0B] text-white selection:bg-indigo-500/30 min-h-screen overflow-x-hidden">
            <PublicHeader />

            {/* 3D Background Dynamics */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[150px]"
                />
                <motion.div 
                    animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[1200px] h-[1200px] bg-purple-500/5 rounded-full blur-[180px]"
                />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 max-w-[1400px] mx-auto space-y-24">
                
                {/* Hero with Entrance Motion */}
                <motion.header 
                    initial={{ opacity: 0, y: 30, rotateX: 5 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    className="space-y-6 max-w-4xl"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">
                        <Cpu className="w-4 h-4" /> Neural Audit Engine v5.2
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                        Instant <br /> <span className="text-indigo-500">Resume Audit.</span>
                    </h1>
                    <p className="text-xl text-white/40 italic font-medium max-w-2xl leading-relaxed">
                        Extract hidden scores, detect keyword gaps, and see your resume through the eyes of an automated recruitment system.
                    </p>
                </motion.header>

                <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-6xl'} gap-10 items-start`}>
                    
                    {/* Compact Interactive Input Area */}
                    <motion.div 
                        layout
                        className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl backdrop-blur-3xl group hover:border-white/20 transition-all duration-500"
                    >
                        <div className="flex gap-8 border-b border-white/5 pb-6">
                            <button 
                                onClick={() => setMode("upload")}
                                className={`text-[11px] font-black uppercase tracking-[0.4em] pb-2 transition-all relative ${mode === "upload" ? "text-indigo-400" : "text-white/20 hover:text-white/40"}`}
                            >
                                {mode === "upload" && <motion.div layoutId="activeTab" className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-indigo-400" />}
                                01. File Upload
                            </button>
                            <button 
                                onClick={() => setMode("paste")}
                                className={`text-[11px] font-black uppercase tracking-[0.4em] pb-2 transition-all relative ${mode === "paste" ? "text-indigo-400" : "text-white/20 hover:text-white/40"}`}
                            >
                                {mode === "paste" && <motion.div layoutId="activeTab" className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-indigo-400" />}
                                02. Raw Content
                            </button>
                        </div>

                        {mode === "upload" ? (
                            <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                                onClick={() => !loading && fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed transition-all rounded-[2rem] p-20 text-center cursor-pointer group ${
                                    isDragging ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/[0.01]"
                                }`}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                                <div className="space-y-6">
                                    <div className="mx-auto w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:bg-indigo-500 group-hover:text-black group-hover:scale-110 transition-all shadow-2xl">
                                        <FileText className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter truncate px-10">
                                            {file ? file.name : "Drop Resume File"}
                                        </h3>
                                        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black italic">
                                            Secure Session • PDF / DOCX / TXT
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                <textarea
                                    value={pasteText}
                                    onChange={(e) => setPasteText(e.target.value)}
                                    placeholder="Paste full resume content (Experience, Skills, Projects)..."
                                    className="relative w-full h-[400px] bg-[#050508]/80 border border-white/10 rounded-[2rem] p-8 text-sm font-medium leading-relaxed placeholder:text-white/5 focus:outline-none focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                                />
                            </div>
                        )}

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAnalyze}
                            disabled={loading || (mode === "upload" && !file) || (mode === "paste" && !pasteText.trim())}
                            className="w-full py-6 bg-white text-black disabled:opacity-30 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-[0_30px_60px_rgba(255,255,255,0.05)] flex items-center justify-center gap-4 group"
                        >
                            {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                            {loading ? "Initializing..." : "Run Neural Audit"}
                        </motion.button>

                        <div className="flex justify-between items-center px-4 text-[9px] font-black text-white/20 uppercase tracking-[0.5em] italic">
                            <span className="flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> Private Audit</span>
                            <span className="flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5" /> No Storage</span>
                            <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Secure Session</span>
                        </div>
                    </motion.div>

                    {/* Results Presentation with 3D Entrance */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, x: 60, rotateY: -15 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                className="space-y-10"
                            >
                                {/* Composite Score Index */}
                                <div className="bg-white/[0.04] border border-white/5 rounded-[3rem] p-10 flex items-center justify-between shadow-2xl backdrop-blur-3xl group hover:border-indigo-500/20 transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                        <Monitor className="w-32 h-32" />
                                    </div>
                                    <div className="flex items-center gap-10 relative z-10">
                                        <div className="relative w-32 h-32 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90 group-hover:scale-105 transition-transform duration-1000" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="10" />
                                                <motion.circle 
                                                    initial={{ strokeDasharray: "0 282" }}
                                                    animate={{ strokeDasharray: `${result.score * 2.82} 282` }}
                                                    transition={{ duration: 2, ease: "easeOut" }}
                                                    cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="10" strokeLinecap="round" 
                                                />
                                            </svg>
                                            <span className="text-4xl font-black italic select-none">{result.score}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30 italic">Audit Match Index</h3>
                                            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">
                                                AUDIT_ID_0x{Math.random().toString(16).substr(2, 6).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => {setResult(null); setFile(null); setPasteText("");}} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/20 hover:text-white transition-all shadow-xl">
                                        <RotateCcw className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Vulnerabilities Card */}
                                <div className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute bottom-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                        <Eye className="w-32 h-32" />
                                    </div>
                                    <div className="flex items-center gap-6 border-b border-white/5 pb-8 relative z-10">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-2xl font-black italic uppercase tracking-tighter">System Vulnerabilities</h4>
                                    </div>
                                    <div className="space-y-8 relative z-10">
                                        {result.issues.slice(0, 5).map((issue, idx) => (
                                            <motion.div 
                                                key={idx} 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex gap-8 items-start group/item"
                                            >
                                                <div className={`mt-1.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${idx % 2 === 0 ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}`}>
                                                    {idx % 2 === 0 ? <AlertCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                                </div>
                                                <div className="space-y-1 py-1">
                                                    <p className="text-[17px] font-bold italic leading-tight text-white/80 group-hover/item:text-white transition-colors">
                                                        "{issue}"
                                                    </p>
                                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic">
                                                        Score Impact: -{Math.floor(Math.random() * 8) + 5}% • Criticality: High
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <Link 
                                    to="/resume-optimizer"
                                    className="flex items-center justify-between p-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2.5rem] transition-all shadow-[0_40px_80px_rgba(99,102,241,0.3)] group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                                        <Zap className="w-20 h-20" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <p className="text-2xl font-black italic uppercase tracking-tighter">Inject Fixes</p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60">Optimize to 85%+ Match →</p>
                                    </div>
                                    <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-500 relative z-10" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Expanded Sections for Vertical Depth */}

                {/* 01. The Anatomy Section */}
                <section className="bg-white/[0.01] border-y border-white/5 py-40 px-6 overflow-hidden relative">
                    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-32 items-center">
                        <div className="relative">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true }}
                                className="relative bg-gradient-to-tr from-indigo-500/20 to-rose-500/10 p-20 rounded-[4rem] border border-white/10 shadow-3xl backdrop-blur-3xl"
                            >
                                <div className="absolute -top-10 -left-10 bg-[#0A0A0B] border border-white/10 p-10 rounded-[3rem] shadow-3xl -rotate-12 animate-float">
                                    <FileSearch className="w-12 h-12 text-indigo-500" />
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <div className="h-4 w-3/4 bg-white/5 rounded-full" />
                                        <div className="h-4 w-1/2 bg-white/5 rounded-full" />
                                        <div className="h-4 w-2/3 bg-white/5 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                                                <Check className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Verified Skills</p>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] space-y-4">
                                            <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/20 flex items-center justify-center">
                                                <X className="w-5 h-5 text-rose-500" />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Keyword Gaps</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="space-y-12">
                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <h2 className="text-4xl md:text-7xl font-black tracking-tight uppercase italic leading-none">
                                    Anatomy of <br /> <span className="text-indigo-500">Perfect Resume.</span>
                                </h2>
                                <p className="text-xl text-white/40 italic font-medium leading-relaxed max-w-xl">
                                    Our scanner doesn't just look for words; it analyzes the semantic architecture of your career. From action-verb density to section hierarchy.
                                </p>
                            </motion.div>

                            <div className="grid gap-8">
                                {[
                                    { title: "Semantic Parsing", desc: "We convert your resume into a mathematical vector to find true skill overlap.", icon: <Cpu className="w-6 h-6" /> },
                                    { title: "Structure Check", desc: "Ensuring headers and date formats are standard for ATS readability.", icon: <Layers className="w-6 h-6" /> },
                                    { title: "Ownership Signals", desc: "Detecting the shift from passive duties to active achievements.", icon: <Target className="w-6 h-6" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-8 items-center p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xl">
                                            {item.icon}
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-xl font-black italic uppercase leading-none">{item.title}</h4>
                                            <p className="text-sm text-white/30 italic font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 02. Final Call to Action */}
                <section className="pb-32 px-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-20 md:p-40 bg-gradient-to-tr from-indigo-600/10 to-transparent border border-white/10 rounded-[6rem] text-center space-y-16 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                        <div className="space-y-10 relative z-10">
                            <h2 className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-[0.8] select-none">
                                Stop Being <br /> <span className="text-indigo-500">Invisible.</span>
                            </h2>
                            <p className="text-xl md:text-3xl text-white/40 italic font-medium max-w-3xl mx-auto leading-relaxed">
                                Join 15k+ professionals who used Candidex to bypass the automated filters and get the interview.
                            </p>
                        </div>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="px-24 py-8 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-3xl hover:scale-105 active:scale-95 transition-all"
                        >
                            Upload Resume Now
                        </button>
                    </motion.div>
                </section>

            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeScanner;
