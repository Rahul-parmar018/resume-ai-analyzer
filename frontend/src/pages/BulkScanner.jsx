import { useState, useEffect } from "react";
import { 
  Check, X, Search, Briefcase, Users, 
  Upload, FileText, Cpu, AlertTriangle, 
  Shield, Code2, Zap, BarChart3, Target,
  ChevronRight, ArrowRight, MousePointer2
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { rankResumes } from "../api/analyze";
import { motion, AnimatePresence } from "framer-motion";

const BIG_FIVE = [
  { key: "AI/ML Engineer", icon: Target, desc: "Neural networks & ML pipelines" },
  { key: "Cybersecurity Engineer", icon: Shield, desc: "Infosec & Threat Detection" },
  { key: "Full Stack Developer", icon: Code2, desc: "Web architecture & APIs" },
  { key: "DevOps Engineer", icon: Zap, desc: "CI/CD & Cloud Infrastructure" },
  { key: "Data Scientist", icon: BarChart3, desc: "Analytics & Predictive Modeling" }
];

const BulkScanner = () => {
    const { user, profile } = useAuth();
    const [selectedRole, setSelectedRole] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        document.title = "Recruiter Bulk Scanner | Candidex AI";
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 10) {
            setError("MVP Limit: Max 10 resumes per batch.");
            return;
        }
        setFiles(selectedFiles);
        setError("");
    };

    const handleRank = async () => {
        if (!selectedRole) { setError("Select a target role."); return; }
        if (files.length === 0) { setError("Upload at least one resume."); return; }
        
        setLoading(true);
        setError("");
        try {
            const data = await rankResumes(files, selectedRole);
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.error || "Ranking failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <PublicHeader />
            
            {/* 3D Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-[0.02] bg-repeat" />
            </div>

            <div className="relative z-10">
                <main className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 space-y-12">
                    
                    {/* Header */}
                    <motion.header 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 max-w-4xl mx-auto text-center"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-400">
                            <Users className="w-4 h-4" /> Recruiter Intelligence Hub
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8]">
                            Bulk Candidate <br /> <span className="text-indigo-500">Ranking.</span>
                        </h1>
                        <p className="text-xl text-white/40 italic font-medium max-w-2xl mx-auto leading-relaxed">
                            Upload multiple resumes and rank them against industry-standard roles in seconds.
                        </p>
                    </motion.header>

                    <div className={`grid ${result ? 'lg:grid-cols-2' : 'max-w-6xl mx-auto'} gap-10 items-start transition-all duration-700`}>
                        
                        {/* Input Area */}
                        <motion.div 
                            layout
                            className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 space-y-10 shadow-2xl backdrop-blur-3xl group hover:border-white/20 transition-all duration-500"
                        >
                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                                    01. Select Target Career Path <MousePointer2 className="w-3 h-3 text-indigo-500" />
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {BIG_FIVE.map((role) => (
                                        <button
                                            key={role.key}
                                            onClick={() => setSelectedRole(role.key)}
                                            className={`p-6 rounded-[2rem] border transition-all text-left group/btn relative overflow-hidden ${
                                                selectedRole === role.key 
                                                ? "bg-indigo-600 border-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.3)]" 
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/5"
                                            }`}
                                        >
                                            <div className="relative z-10 flex items-center gap-4">
                                                <role.icon className={`w-6 h-6 ${selectedRole === role.key ? "text-white" : "text-indigo-400 group-hover/btn:scale-110 transition-transform"}`} />
                                                <div>
                                                    <p className="font-black italic text-sm uppercase leading-tight">{role.key}</p>
                                                    <p className={`text-[10px] font-medium italic ${selectedRole === role.key ? "text-white/60" : "text-white/20"}`}>{role.desc}</p>
                                                </div>
                                            </div>
                                            {selectedRole === role.key && (
                                                <motion.div layoutId="roleGlow" className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                                    02. Upload Candidate Resumes <Upload className="w-3 h-3 text-indigo-500" />
                                </label>
                                <div 
                                    className="relative group/upload"
                                    onClick={() => document.getElementById('bulk-upload').click()}
                                >
                                    <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-12 text-center group-hover/upload:border-indigo-500/50 transition-all cursor-pointer bg-white/[0.01]">
                                        <input 
                                            id="bulk-upload" 
                                            type="file" 
                                            multiple 
                                            hidden 
                                            accept=".pdf,.docx,.txt"
                                            onChange={handleFileChange}
                                        />
                                        <div className="space-y-4">
                                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto group-hover/upload:scale-110 group-hover/upload:bg-indigo-500/20 transition-all shadow-2xl">
                                                <FileText className="w-10 h-10 text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="text-xl font-black italic tracking-tight uppercase">
                                                    {files.length > 0 ? `${files.length} Resumes Ready` : "Drop Resumes Here"}
                                                </p>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">
                                                    PDF, DOCX, or TXT • MAX 10 FILES
                                                </p>
                                            </div>
                                            {files.length > 0 && (
                                                <div className="flex flex-wrap justify-center gap-2 mt-4">
                                                    {Array.from(files).slice(0, 3).map((f, i) => (
                                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/40 italic">
                                                            {f.name.length > 15 ? f.name.substring(0, 12) + '...' : f.name}
                                                        </span>
                                                    ))}
                                                    {files.length > 3 && (
                                                        <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-indigo-400 italic">
                                                            +{files.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400">
                                    <AlertTriangle className="w-5 h-5 shrink-0" />
                                    <p className="text-sm font-bold italic">{error}</p>
                                </motion.div>
                            )}

                            <button
                                onClick={handleRank}
                                disabled={loading}
                                className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-tighter italic transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group ${
                                    loading 
                                    ? "bg-white/5 text-white/20" 
                                    : "bg-white text-black hover:bg-indigo-500 hover:text-white"
                                }`}
                            >
                                {loading ? (
                                    <>Ranking Neural Vectors... <Cpu className="w-6 h-6 animate-spin" /></>
                                ) : (
                                    <>Start Ranking Engine <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>
                                )}
                            </button>
                        </motion.div>

                        {/* Result Area */}
                        <AnimatePresence>
                            {result && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-3xl font-black tracking-tight uppercase italic">Top Candidates <span className="text-indigo-500">for {result.role}</span></h2>
                                        <div className="px-4 py-1.5 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                            {result.total} Processed
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {result.candidates.map((cand, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all group overflow-hidden ${idx === 0 ? 'border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-2xl shadow-indigo-500/10' : ''}`}
                                            >
                                                {idx === 0 && (
                                                    <div className="absolute top-0 right-0 px-8 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase italic tracking-widest rounded-bl-3xl">
                                                        Top Pick
                                                    </div>
                                                )}
                                                
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl italic border-2 transition-all group-hover:rotate-6 ${
                                                            cand.score >= 80 ? 'bg-indigo-600 border-white/20 text-white' : 
                                                            cand.score >= 60 ? 'bg-white/5 border-white/10 text-white/80' : 
                                                            'bg-white/[0.02] border-white/5 text-white/40'
                                                        }`}>
                                                            #{idx + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-black italic tracking-tight">{cand.name}</h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                                                                    <div className={`h-full transition-all duration-1000 ${cand.score >= 80 ? 'bg-indigo-500' : 'bg-white/40'}`} style={{ width: `${cand.score}%` }} />
                                                                </div>
                                                                <span className={`text-sm font-black italic ${cand.score >= 80 ? 'text-indigo-400' : 'text-white/40'}`}>{cand.score}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6 mt-8 border-t border-white/5 pt-8">
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 italic">
                                                            <Check className="w-3 h-3" /> Strengths
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cand.strengths.slice(0, 5).map((s, i) => (
                                                                <span key={i} className="px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-[10px] font-bold text-emerald-500/60 italic uppercase tracking-wider">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 flex items-center gap-2 italic">
                                                            <X className="w-3 h-3" /> Gaps Detected
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {cand.missing.slice(0, 5).map((s, i) => (
                                                                <span key={i} className="px-3 py-1 bg-rose-500/5 border border-rose-500/10 rounded-xl text-[10px] font-bold text-rose-500/60 italic uppercase tracking-wider">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Explanatory Depth Section */}
                    {!result && (
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-12 border-t border-white/5">
                            {[
                                { title: "Neural Ranking", desc: "Our engine uses semantic vector overlap to rank candidates beyond simple keyword matching.", icon: Cpu },
                                { title: "Batch Processing", desc: "Analyze up to 10 candidates simultaneously with unified role calibration.", icon: Layers },
                                { title: "Decision Intelligence", desc: "Instant visibility into strengths and missing core skills for every applicant.", icon: Target }
                            ].map((item, i) => (
                                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-2xl">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-black italic uppercase text-sm tracking-tight">{item.title}</h4>
                                        <p className="text-xs text-white/30 font-medium leading-relaxed italic">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </main>
            </div>
            
            <PublicFooter />
        </div>
    );
};

export default BulkScanner;
