import { useState, useEffect } from "react";
import { 
  Check, X, Search, Upload, FileText, Cpu, Target, Zap, ChevronLeft, ChevronRight
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { rankResumes } from "../api/analyze";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const BIG_FIVE = [
  { key: "AI/ML Engineer", desc: "Neural networks" },
  { key: "Cybersecurity Engineer", desc: "Infosec" },
  { key: "Full Stack Developer", desc: "Web APIs" },
  { key: "DevOps Engineer", desc: "Infrastructure" },
  { key: "Data Scientist", desc: "Analytics" }
];

const BulkScanner = () => {
    const { user, profile } = useAuth();
    const location = useLocation();
    const isInsideApp = location.pathname.startsWith("/app");
    
    const [selectedRole, setSelectedRole] = useState("AI/ML Engineer");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    const handleRank = async () => {
        if (files.length === 0) return;
        setLoading(true);
        try {
            const data = await rankResumes(files, selectedRole);
            setResult(data);
        } catch (err) {
            setError("Ranking failed.");
        } finally {
            setLoading(false);
        }
    };

    const filteredCandidates = result?.candidates.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className={`min-h-screen ${isInsideApp ? 'bg-transparent' : 'bg-[#0A0A0B]'} text-white selection:bg-indigo-500/30`}>
            {!isInsideApp && <PublicHeader />}
            
            <main className={`max-w-[1600px] mx-auto px-6 ${isInsideApp ? 'pt-4' : 'pt-32'} pb-24`}>
                
                {/* 🚀 TOP BAR: COMPACT SINGLE-ROW CONTROLS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-2xl mb-8">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Role</span>
                        <select 
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="bg-transparent text-xs font-black text-white outline-none cursor-pointer"
                        >
                            {BIG_FIVE.map(r => <option key={r.key} value={r.key} className="bg-[#0A0A0B]">{r.key}</option>)}
                        </select>
                    </div>

                    <div 
                        onClick={() => document.getElementById('bulk-upload').click()}
                        className={`flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2 border-2 border-dashed rounded-xl cursor-pointer transition-all ${files.length > 0 ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'}`}
                    >
                        <Upload className="w-4 h-4 text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 truncate">
                            {files.length > 0 ? `${files.length} Files Selected` : 'Click to upload resumes'}
                        </span>
                        <input id="bulk-upload" type="file" multiple hidden onChange={handleFileChange} />
                    </div>

                    <button 
                        onClick={handleRank}
                        disabled={loading || files.length === 0}
                        className="bg-white text-black px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-10"
                    >
                        {loading ? 'Analyzing...' : 'Rank Candidates'}
                    </button>
                </div>

                {/* 📊 RESULTS HUB */}
                <AnimatePresence>
                    {result && !loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            
                            {/* Filter Bar */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-white/5">
                                <h2 className="text-sm font-black italic tracking-widest text-indigo-400 uppercase">
                                    {result.role} — <span className="text-white/40">{filteredCandidates.length} Candidates</span>
                                </h2>
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                    <input 
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 pl-9 pr-4 py-2 rounded-xl text-[10px] font-bold outline-none focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            {/* THE GRID (MANDATORY 4 COLUMNS) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredCandidates.map((cand, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-all flex flex-col h-full ${idx === 0 ? 'ring-1 ring-indigo-500/30' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="min-w-0">
                                                <h3 className="text-xs font-black italic truncate">{cand.name}</h3>
                                                <p className="text-[8px] font-bold text-white/20 mt-0.5 uppercase tracking-widest">#{idx + 1} Best Fit</p>
                                            </div>
                                            <span className={`text-sm font-black italic ${cand.score >= 80 ? 'text-indigo-400' : 'text-white/40'}`}>{cand.score}%</span>
                                        </div>

                                        <div className="space-y-4 py-4 border-t border-white/5 flex-1">
                                            <div>
                                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-2">Strengths</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {cand.strengths.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="px-2 py-1 bg-emerald-500/5 text-emerald-500 text-[7px] font-black uppercase rounded-md border border-emerald-500/10">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-2">Gaps</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {cand.missing.slice(0, 3).map((s, i) => (
                                                        <span key={i} className="px-2 py-1 bg-rose-500/5 text-rose-500 text-[7px] font-black uppercase rounded-md border border-rose-500/10">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full py-2 mt-4 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                                            Details
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                {!result && !loading && (
                    <div className="py-20 text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Ready to <span className="text-indigo-500">Rank?</span></h2>
                            <p className="text-white/30 italic text-sm">Select a role and upload a batch of resumes to begin neural analysis.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                { t: "Neural Vectors", d: "Deep semantic matching engine.", i: Cpu },
                                { t: "Batch Flow", d: "Process up to 10 files at once.", i: Zap },
                                { t: "Gap Detection", d: "Instant skill-gap intelligence.", i: Target }
                            ].map((s, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all group">
                                    <s.i className="w-8 h-8 text-indigo-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">{s.t}</h4>
                                    <p className="text-[10px] text-white/20 italic font-medium">{s.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="py-40 text-center space-y-6">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Calibrating Neural Decision Engine...</p>
                    </div>
                )}

            </main>
            
            {!isInsideApp && <PublicFooter />}
        </div>
    );
};

export default BulkScanner;
