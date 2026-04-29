import { useState, useEffect, useRef } from "react";
import { useAuth } from "../components/AuthProvider";
import api from "../api-client";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, Search, Check, X, Cpu, Target, Zap, ChevronLeft, ChevronRight, BarChart3
} from "lucide-react";

const BIG_FIVE = [
  { key: "AI/ML Engineer", desc: "Neural networks" },
  { key: "Cybersecurity Engineer", desc: "Infosec" },
  { key: "Full Stack Developer", desc: "Web APIs" },
  { key: "DevOps Engineer", desc: "Infrastructure" },
  { key: "Data Scientist", desc: "Analytics" }
];

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = profile?.role || "candidate";

  // Redirect candidates
  useEffect(() => {
    if (!loading && role === 'candidate') {
      navigate('/resume-scanner');
    }
  }, [role, loading, navigate]);

  // State
  const [files, setFiles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("AI/ML Engineer");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);

  const handleRank = async () => {
    if (files.length === 0) return;
    setIsScanning(true);
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("job_description", selectedRole);
    try {
      const res = await api.post("/bulk-analyze/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const filteredCandidates = result?.top_candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div></div>;

  return (
    <div className="w-full space-y-6 font-body">
      
      {/* 🚀 TOP BAR: COMPACT CONTROLS */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role:</span>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-transparent text-xs font-black text-slate-900 outline-none cursor-pointer"
          >
            {BIG_FIVE.map(r => <option key={r.key}>{r.key}</option>)}
          </select>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-w-[200px] flex items-center gap-3 px-4 py-2 border-2 border-dashed rounded-xl cursor-pointer transition-all ${files.length > 0 ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-400'}`}
        >
          <Upload className={`w-4 h-4 ${files.length > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
            {files.length > 0 ? `${files.length} Files` : 'Upload Batch'}
          </span>
          <input type="file" multiple hidden ref={fileInputRef} onChange={(e) => setFiles(Array.from(e.target.files))} />
        </div>

        <button 
          onClick={handleRank}
          disabled={files.length === 0 || isScanning}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30"
        >
          {isScanning ? 'Ranking...' : 'Rank Candidates'}
        </button>
      </div>

      {/* 📊 RESULTS AREA */}
      <AnimatePresence>
        {result && !isScanning && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-100">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                   {selectedRole} <span className="text-slate-400 ml-2">— {filteredCandidates.length} Candidates</span>
                </h2>
                <div className="relative w-full md:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                   <input 
                     type="text" 
                     placeholder="Search..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-slate-900/5"
                   />
                </div>
             </div>

             {/* MANDATORY 4-COLUMN GRID */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCandidates.map((c, i) => (
                  <div key={i} className={`p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-900 transition-all flex flex-col h-full ${i === 0 ? 'ring-2 ring-slate-900/5' : ''}`}>
                     <div className="flex justify-between items-start mb-4">
                        <div className="min-w-0">
                           <h4 className="text-xs font-black truncate">{c.name}</h4>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rank #{i + 1}</p>
                        </div>
                        <span className="text-sm font-black text-slate-900">{c.score}%</span>
                     </div>

                     <div className="space-y-3 py-3 border-t border-slate-50 flex-1">
                        <div>
                           <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1.5">Strengths</p>
                           <div className="flex flex-wrap gap-1">
                              {c.skills.slice(0, 2).map(s => <span key={s} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[7px] font-black uppercase rounded border border-emerald-100">{s}</span>)}
                           </div>
                        </div>
                        <div>
                           <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-1.5">Gaps</p>
                           <div className="flex flex-wrap gap-1">
                              {c.missing_skills?.slice(0, 2).map(s => <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[7px] font-black uppercase rounded border border-rose-100">{s}</span>)}
                              {(!c.missing_skills || c.missing_skills.length === 0) && <span className="text-[7px] font-bold text-slate-300 italic">No major gaps</span>}
                           </div>
                        </div>
                     </div>

                     <button className="w-full py-2 mt-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">
                        Details
                     </button>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!result && !isScanning && (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 flex flex-col items-center text-center space-y-10 shadow-sm">
           <div className="space-y-3">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">System <span className="text-indigo-500">Standby.</span></h3>
              <p className="text-slate-400 text-sm font-medium italic max-w-lg">Upload your candidate batch to activate neural ranking.</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              {[
                { t: "Neural Vectors", d: "Deep match engine.", i: Cpu },
                { t: "Batch Scans", d: "Up to 150 resumes.", i: Zap },
                { t: "Gap Intelligence", d: "Instant skill gaps.", i: Target }
              ].map((s, i) => (
                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                   <s.i className="w-6 h-6 text-slate-400 mx-auto mb-4 group-hover:text-indigo-500 transition-colors" />
                   <p className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-1">{s.t}</p>
                   <p className="text-[9px] text-slate-400 font-medium">{s.d}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      {isScanning && (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
           <div className="w-8 h-8 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ranking Neural Vectors...</p>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
