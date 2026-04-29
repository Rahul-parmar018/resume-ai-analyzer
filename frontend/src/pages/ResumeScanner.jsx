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
  Fingerprint
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
    const [pasteText, setPasteText] = useState("");
    const [mode, setMode] = useState("upload"); // 'upload' or 'paste'
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
        <div className="bg-[#0A0A0B] text-white selection:bg-indigo-500/30 min-h-screen">
            <PublicHeader />

            <main className="pt-24 pb-12 px-4 max-w-[1200px] mx-auto space-y-8">
                
                {/* Compact Hero */}
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Resume Scanner</h1>
                    <p className="text-sm text-white/50 max-w-xl">
                        Instantly audit your resume for ATS compatibility and recruiter visibility.
                    </p>
                </header>

                <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-4xl'} gap-6 items-start`}>
                    
                    {/* Input Area */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6 shadow-sm">
                        <div className="flex gap-4 border-b border-white/5 pb-4">
                            <button 
                                onClick={() => setMode("upload")}
                                className={`text-xs font-bold uppercase tracking-wider pb-2 transition-all ${mode === "upload" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-white/20 hover:text-white/40"}`}
                            >
                                Upload File
                            </button>
                            <button 
                                onClick={() => setMode("paste")}
                                className={`text-xs font-bold uppercase tracking-wider pb-2 transition-all ${mode === "paste" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-white/20 hover:text-white/40"}`}
                            >
                                Paste Text
                            </button>
                        </div>

                        {mode === "upload" ? (
                            <div 
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                                onClick={() => !loading && fileInputRef.current?.click()}
                                className={`relative border-2 border-dashed transition-all rounded-xl p-12 text-center cursor-pointer ${
                                    isDragging ? "border-indigo-500 bg-indigo-500/5" : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                                }`}
                            >
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                                <div className="space-y-4">
                                    <div className="mx-auto w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-white/40">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold">{file ? file.name : "Select or drag resume"}</p>
                                        <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold">PDF, DOCX, TXT</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <textarea
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                                placeholder="Paste your resume content here..."
                                className="w-full h-[200px] bg-black/20 border border-white/10 rounded-xl p-4 text-sm font-medium leading-relaxed placeholder:text-white/10 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                            />
                        )}

                        <button 
                            onClick={handleAnalyze}
                            disabled={loading || (mode === "upload" && !file) || (mode === "paste" && !pasteText.trim())}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                            {loading ? "Scanning..." : "Get Instant Feedback"}
                        </button>

                        <div className="flex justify-between items-center px-2 text-[10px] font-bold text-white/20 uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> Secure</span>
                            <span className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> Anonymous</span>
                            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> Encrypted</span>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <AnimatePresence>
                        {result && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-6">
                                        <div className="relative w-16 h-16 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
                                                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray={`${result.score * 2.82} 282`} strokeLinecap="round" />
                                            </svg>
                                            <span className="text-xl font-bold">{result.score}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold uppercase tracking-wide">Scan Score</h3>
                                            <p className="text-[11px] text-white/40 font-medium">Audit ID: {Math.random().toString(16).substr(2, 6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => {setResult(null); setFile(null); setPasteText("");}} className="p-2 hover:bg-white/5 rounded-lg text-white/30 hover:text-white transition-colors">
                                        <RotateCcw className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-6 shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                        <Layers className="w-4 h-4 text-indigo-400" />
                                        <h4 className="text-xs font-bold uppercase tracking-widest">Analysis Findings</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {result.issues.slice(0, 5).map((issue, idx) => (
                                            <div key={idx} className="flex gap-4 items-start group">
                                                <div className={`mt-1 w-5 h-5 rounded flex items-center justify-center shrink-0 ${idx % 2 === 0 ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"}`}>
                                                    {idx % 2 === 0 ? <AlertCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                </div>
                                                <p className="text-sm text-white/70 leading-relaxed group-hover:text-white transition-colors">{issue}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Link 
                                    to="/resume-optimizer"
                                    className="flex items-center justify-between p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-lg group"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold">Fix These Issues</p>
                                        <p className="text-[10px] font-medium opacity-60 uppercase tracking-widest">Go to Optimizer →</p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dense Info Content */}
                <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">How it works</h3>
                        <div className="grid gap-4">
                            {[
                                { step: 1, text: "Upload your resume file or paste the raw text." },
                                { step: 2, text: "We analyze keyword density, formatting, and action verbs." },
                                { step: 3, text: "Get an instant ATS score and list of improvements." }
                            ].map(item => (
                                <div key={item.step} className="flex gap-4 items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                    <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-[11px] font-bold text-white/30">{item.step}</span>
                                    <p className="text-[13px] text-white/50 italic">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white/30">Optimization Tips</h3>
                        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                            <div className="flex gap-3 items-center">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                <p className="text-[13px] font-medium">Use a standard, simple font like Arial or Helvetica.</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Target className="w-4 h-4 text-emerald-400" />
                                <p className="text-[13px] font-medium">Include specific keywords from the job description.</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Activity className="w-4 h-4 text-rose-400" />
                                <p className="text-[13px] font-medium">Focus on quantifiable results, not just duties.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <PublicFooter />
        </div>
    );
};

export default ResumeScanner;
