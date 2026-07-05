import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Upload, ChevronRight, Check, X, 
    Zap, Target, Layers, BarChart3, ShieldCheck, ShieldX,
    Plus, Minus, ArrowRight, Sparkles, Maximize2, Minimize2,
    Mail, Trash2, Award, TrendingUp, Code2, FileJson, AlertCircle, CheckCircle2,
    Lock
} from "lucide-react";
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, 
    ResponsiveContainer 
} from 'recharts';
import LightBeamButton from "../components/LightBeamButton";
import GlowCard from "../components/GlowCard";
import { auth } from "../firebase";
import { useAuth } from "../components/AuthProvider";
import toast from "react-hot-toast";

// ─── File Validation Constants ────────────────────────────────────────
const ALLOWED_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 50;

function validateFiles(fileList) {
    const valid = [];
    const errors = [];
    for (const file of fileList) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        const typeOk = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext);
        if (!typeOk) {
            errors.push(`"${file.name}" — unsupported format. Only PDF and DOCX allowed.`);
            continue;
        }
        if (file.size === 0) {
            errors.push(`"${file.name}" — file is empty.`);
            continue;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
            errors.push(`"${file.name}" — exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
            continue;
        }
        valid.push(file);
    }
    return { valid, errors };
}

// ─── Recruiter Access Denied Screen ──────────────────────────────────
function AccessDenied({ navigate }) {
    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white font-sans flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
                    <Lock className="w-9 h-9 text-rose-400" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-2xl font-black uppercase italic tracking-tight">Recruiter Feature</h1>
                    <p className="text-sm text-white/40 leading-relaxed">
                        Bulk Candidate Ranking is exclusively available to <span className="text-purple-400 font-bold">Recruiter</span> accounts.
                        Your current account is set to <span className="text-rose-400 font-bold">Candidate</span> mode.
                    </p>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/settings')}
                        className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                    >
                        <ShieldX className="w-4 h-4" />
                        Switch Role in Settings
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[11px] tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

/**
 * 🎯 DATA CONTRACT (Source of Truth)
 * Any data from backend MUST strictly follow this schema.
 * Missing fields result in "N/A" rather than guessing.
 */
/*
const candidateSchema = {
  id: string,
  name: string,
  email: string,
  score: number,
  experience: number | null,
  skills: string[],
  strengths: string[],
  missingSkills: string[],
  categories: { [key: string]: number | null },
  recommendation: string
};
*/

const ROLES = [
    "AI/ML Engineer",
    "Cybersecurity Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist"
];

const CUSTOM_ROLE_EXAMPLE = `{
  "title": "Backend Go Developer",
  "core": ["Go", "PostgreSQL", "REST API", "Microservices", "Docker"],
  "important": ["Kubernetes", "gRPC", "Redis", "CI/CD", "Testing"],
  "optional": ["AWS", "Terraform", "GraphQL", "Monitoring", "Linux"]
}`;

const BulkScanner = () => {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(ROLES[0]);
    const [files, setFiles] = useState([]);
    const [fileErrors, setFileErrors] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [candidates, setCandidates] = useState([]);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [isCompareExpanded, setIsCompareExpanded] = useState(false);
    const [inspectingCandidate, setInspectingCandidate] = useState(null);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [useCustomRole, setUseCustomRole] = useState(false);
    const [customRoleJson, setCustomRoleJson] = useState(CUSTOM_ROLE_EXAMPLE);
    const [customRoleError, setCustomRoleError] = useState(null);
    const [customRoleValid, setCustomRoleValid] = useState(false);
    const [rejectTarget, setRejectTarget] = useState(null);

    // ─── Fix 2: Recruiter Role Guard ─────────────────────────────────
    if (profile && profile.role !== 'recruiter') {
        return <AccessDenied navigate={navigate} />;
    }

    // Filtered list based on search
    const displayCandidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const clearPipeline = () => {
        console.log("🧹 [Frontend] Clearing pipeline and resetting state...");
        setCandidates([]);
        setFiles([]);
        setSelectedCandidates([]);
        setInspectingCandidate(null);
    };

    const handleFileUpload = (e) => {
        const uploadedFiles = Array.from(e.target.files);
        if (uploadedFiles.length === 0) return;

        console.log("📂 [Frontend] Initiating fresh upload batch:", uploadedFiles.map(f => f.name));
        
        // ─── Fix 3: File Validation ───────────────────────────────────
        const { valid, errors } = validateFiles(uploadedFiles);

        // Enforce max file count
        const capped = valid.slice(0, MAX_FILES);
        if (valid.length > MAX_FILES) {
            errors.push(`Only the first ${MAX_FILES} valid files were accepted. ${valid.length - MAX_FILES} were dropped.`);
        }

        setFileErrors(errors);

        // Show errors via toast
        if (errors.length > 0) {
            errors.forEach(msg => toast.error(msg, { duration: 5000 }));
        }

        if (capped.length === 0) {
            // Reset input value even on full rejection
            e.target.value = null;
            return;
        }

        // 🔄 Reset state BEFORE new upload
        clearPipeline();
        
        // Set validated files only
        setFiles(capped);

        if (capped.length > 0 && errors.length === 0) {
            toast.success(`${capped.length} file${capped.length > 1 ? 's' : ''} ready for analysis.`);
        } else if (capped.length > 0) {
            toast.success(`${capped.length} valid file${capped.length > 1 ? 's' : ''} accepted. ${errors.length} rejected.`);
        }

        // Reset input value (Browser fix to allow re-upload of same file)
        e.target.value = null; 
    };

    const validateCustomRole = async () => {
        try {
            JSON.parse(customRoleJson);
            setCustomRoleError(null);
            setCustomRoleValid(true);
        } catch (e) {
            setCustomRoleError(`Invalid JSON: ${e.message}`);
            setCustomRoleValid(false);
        }
    };

    const runAnalysis = async () => {
        if (!files || files.length === 0) return;

        setIsAnalyzing(true);
        setCandidates([]);

        try {
            const formData = new FormData();
            files.forEach(f => formData.append('files', f));

            if (useCustomRole) {
                // Validate JSON before sending
                try {
                    JSON.parse(customRoleJson);
                } catch (e) {
                    throw new Error(`Invalid custom role JSON: ${e.message}`);
                }
                formData.append('custom_role', customRoleJson);
            } else {
                formData.append('role', selectedRole);
            }

            const token = await auth.currentUser?.getIdToken();
            if (!token) throw new Error("Authentication required. Please log in again.");

            const res = await fetch("/api/recruiter/rank/", {
                method: "POST",
                cache: "no-store", 
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `API failed with status: ${res.status}`);
            }
            
            const data = await res.json();

            if (data.candidates && data.candidates.length > 0) {
                setCandidates([...data.candidates]);
                toast.success(`${data.candidates.length} candidate${data.candidates.length > 1 ? 's' : ''} ranked successfully.`);
            } else {
                throw new Error(data.message || "No candidates returned from backend");
            }

            // Surface per-file backend validation errors
            if (data.validation_errors && data.validation_errors.length > 0) {
                data.validation_errors.forEach(msg => toast.error(msg, { duration: 5000 }));
            }
        } catch (err) {
            console.error("Analysis Error:", err);
            // ─── Fix 4: Replace alert() with toast ───────────────────
            toast.error(`Analysis Failed: ${err.message}`, { duration: 6000 });
            setCandidates([]); 
        } finally {
            setIsAnalyzing(false);
        }
    };

    const toggleComparisonSelection = (cand) => {
        setSelectedCandidates(prev => {
            const exists = prev.find(c => c.id === cand.id);
            if (exists) {
                return prev.filter(c => c.id !== cand.id);
            } else {
                if (prev.length >= 3) {
                    // ─── Fix 4: Replace alert() with toast ───────────
                    toast.error("Maximum 3 candidates allowed for comparison.");
                    return prev;
                }
                return [...prev, cand];
            }
        });
    };

    // 🚀 REAL RECRUITER ACTIONS
    const handleInterview = async (candidate) => {
        try {
            // 1. Log to backend (Tracking)
            console.log(`[Backend Log] Recording interview action for ${candidate.id}`);
            const token = await auth.currentUser?.getIdToken();
            await fetch("/api/recruiter/interview/", { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: candidate.id }) 
            });
            
            // 2. UI Update (Update local state status)
            setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: 'interviewed' } : c));

            // 3. 📧 Open Gmail Deep Link (Best UX)
            const subject = encodeURIComponent(`Interview Invitation - Candidex AI`);
            const body = encodeURIComponent(`Hi ${candidate.name},\n\nWe reviewed your profile for the ${selectedRole} position and would like to invite you for an interview.\n\nPlease reply with your availability.\n\nBest regards,\nCandidex Team`);
            
            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${candidate.email}&su=${subject}&body=${body}`;
            window.open(gmailUrl, "_blank");
        } catch (err) {
            console.error("Outreach failed:", err);
        }
    };

    // ─── Fix 4: Reject confirmation via custom modal ─────────────────
    const handleReject = (candidate) => {
        setRejectTarget(candidate);
    };

    const confirmReject = async () => {
        const candidate = rejectTarget;
        setRejectTarget(null);
        try {
            console.log(`[Backend Log] Rejecting candidate ${candidate.id}`);
            const token = await auth.currentUser?.getIdToken();
            await fetch("/api/recruiter/reject/", { 
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: candidate.id }) 
            });
            setCandidates(prev => prev.filter(c => c.id !== candidate.id));
            setSelectedCandidates(prev => prev.filter(c => c.id !== candidate.id));
            if (inspectingCandidate?.id === candidate.id) setInspectingCandidate(null);
            toast.success(`${candidate.name} rejected.`);
        } catch (err) {
            console.error("Rejection failed:", err);
            toast.error("Failed to reject candidate. Please try again.");
        }
    };

    const copyEmail = (email) => {
        navigator.clipboard.writeText(email);
        // ─── Fix 4: Replace alert() with toast ───────────────────────
        toast.success("Email copied to clipboard!");
    };

    const openComparePanel = () => {
        setInspectingCandidate(null);
        setIsCompareOpen(true);
    };

    const openDetailPanel = (cand) => {
        setIsCompareOpen(false);
        setInspectingCandidate(cand);
    };

    // 📊 Intelligence Check
    const hasGraphData = (cand) => {
        return cand && cand.categories && Object.values(cand.categories).some(v => v !== null && v !== undefined);
    };

    return (
        <div className="min-h-screen bg-[#0B0F1A] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <div className="max-w-[1800px] mx-auto px-6 pt-6 relative z-10">
                
                {/* 🛠️ COMPACT TOOL HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-xl font-black italic uppercase tracking-tight">Bulk Candidate Ranking</h1>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-1">
                            {useCustomRole ? 'Custom Role' : selectedRole} • {displayCandidates.length} Profiles
                        </p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                            <input 
                                type="text" 
                                placeholder="Search by name or skill..."
                                className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 ring-purple-500/50 w-64 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <button 
                            onClick={openComparePanel}
                            disabled={selectedCandidates.length < 2}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedCandidates.length >= 2 ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 hover:bg-purple-500' : 'bg-white/5 text-white/20 border border-white/10 cursor-not-allowed'}`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            Compare ({selectedCandidates.length})
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[260px_1fr] gap-4 relative z-10">
                    
                    {/* 🛠️ CONTROL SIDEBAR */}
                    <motion.aside 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <GlowCard className="!p-6 space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Target Role</h3>
                                    <button
                                        onClick={() => { setUseCustomRole(!useCustomRole); setCustomRoleError(null); }}
                                        className={`flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest transition-all border ${useCustomRole ? 'bg-purple-600/20 border-purple-500/40 text-purple-400' : 'bg-white/5 border-white/10 text-white/30 hover:text-white/50'}`}
                                    >
                                        <FileJson className="w-3 h-3" />
                                        {useCustomRole ? 'Custom' : 'Custom'}
                                    </button>
                                </div>

                                {!useCustomRole ? (
                                    <div className="space-y-2">
                                        {ROLES.map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setSelectedRole(role)}
                                                className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all border ${selectedRole === role ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-600/20' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <textarea
                                            value={customRoleJson}
                                            onChange={(e) => { setCustomRoleJson(e.target.value); setCustomRoleError(null); setCustomRoleValid(false); }}
                                            className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-white/70 focus:ring-1 ring-purple-500/50 focus:border-purple-500/50 resize-none"
                                            placeholder="Paste your role JSON here..."
                                            spellCheck={false}
                                        />
                                        <button
                                            onClick={validateCustomRole}
                                            className="w-full py-2.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                        >
                                            <Code2 className="w-3 h-3" />
                                            Validate JSON
                                        </button>
                                        {customRoleError && (
                                            <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-[10px] text-rose-400 font-bold">{customRoleError}</p>
                                            </div>
                                        )}
                                        {customRoleValid && (
                                            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                <p className="text-[10px] text-emerald-400 font-bold">Valid role definition</p>
                                            </div>
                                        )}
                                        <div className="p-3 bg-white/2 border border-white/5 rounded-lg">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Format Guide</p>
                                            <div className="text-[10px] text-white/30 font-mono space-y-0.5 leading-relaxed">
                                                <p><span className="text-purple-400">title</span>: Role name</p>
                                                <p><span className="text-emerald-400">core</span>: 3-8 must-have skills (60%)</p>
                                                <p><span className="text-yellow-400">important</span>: 3-8 preferred (30%)</p>
                                                <p><span className="text-blue-400">optional</span>: 3-8 nice-to-have (10%)</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Pipeline</h3>
                                    <button
                                        onClick={clearPipeline}
                                        className="text-[9px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/30 font-black uppercase tracking-widest transition-all"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <label className="group relative block w-full aspect-[4/3] rounded-2xl bg-white/5 border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer overflow-hidden">
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                        onChange={handleFileUpload}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all shadow-2xl">
                                            <Upload className="w-6 h-6 text-white/40 group-hover:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-widest text-white/60">Upload Batch</p>
                                            <p className="text-[10px] text-white/20 mt-1">PDF or DOCX (Max 50)</p>
                                        </div>
                                    </div>
                                </label>
                                
                                {files.length > 0 && (
                                    <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{files.length} Ready</span>
                                    </div>
                                )}
                            </div>

                            <LightBeamButton 
                                type="button"
                                className="w-full !py-4 shadow-2xl relative z-20 pointer-events-auto" 
                                onClick={runAnalysis}
                                disabled={files.length === 0 || isAnalyzing}
                            >
                                {isAnalyzing ? (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Execute Analysis
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </LightBeamButton>
                        </GlowCard>
                    </motion.aside>

                    <main className="space-y-4">
                        {displayCandidates.length > 0 ? (
                        <>
                        <div className="flex justify-between items-center mb-3 text-[10px] font-black uppercase tracking-widest text-white/20 px-2">
                            <span>Showing {displayCandidates.length} candidates</span>
                            <span>Scored by ML Semantic Analysis</span>
                        </div>

                        <GlowCard className="!p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/2">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 w-16">#</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Candidate</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Match Score</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Exp</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Top Skills</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {displayCandidates.map((cand, i) => {
                                            const isSelected = selectedCandidates.find(c => c.id === cand.id);
                                            return (
                                                <motion.tr 
                                                    key={cand.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="group hover:bg-white/2 transition-all cursor-pointer"
                                                    onClick={() => openDetailPanel(cand)}
                                                >
                                                    <td className="px-8 py-7 font-black text-white/20 text-xs italic">#{i + 1}</td>
                                                    <td className="px-8 py-7">
                                                        <div className="flex flex-col">
                                                            <div className="font-black text-lg tracking-tight group-hover:text-purple-400 transition-colors uppercase italic">{cand.name}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {cand.email ? (
                                                                    <>
                                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                                        <span className="text-[10px] text-emerald-400/60 font-bold lowercase tracking-normal">
                                                                            {cand.email}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <AlertCircle className="w-3 h-3 text-white/15" />
                                                                        <span className="text-[10px] text-white/15 font-bold lowercase tracking-normal italic">
                                                                            no email found
                                                                        </span>
                                                                    </>
                                                                )}
                                                                {cand.email && (
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); copyEmail(cand.email); }}
                                                                        className="p-1 hover:bg-white/5 rounded text-purple-500/40 hover:text-purple-400 transition-all"
                                                                        title="Copy Email"
                                                                    >
                                                                        <Mail className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-7">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-2xl transition-transform hover:scale-110 ${cand.score > 80 ? 'bg-emerald-500 text-white shadow-emerald-500/20' : cand.score > 50 ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-white/10 text-white/40'}`}>
                                                                {cand.score}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                                                    {cand.matched?.length || 0} Matched
                                                                </div>
                                                                <div className="text-[10px] font-black uppercase tracking-widest text-rose-500/50">
                                                                    {cand.missing?.length || 0} Missing
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-7 font-black text-white/40 italic">
                                                        {cand.experience != null ? `${cand.experience} yrs` : "N/A"}
                                                    </td>
                                                    <td className="px-8 py-7">
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {cand.matched?.length > 0 ? cand.matched.slice(0, 3).map(s => (
                                                                <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-black uppercase tracking-widest text-white/30 border border-white/5">
                                                                    {s}
                                                                </span>
                                                            )) : (
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/10 italic">N/A</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-7 text-right">
                                                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                            <button 
                                                                onClick={() => toggleComparisonSelection(cand)}
                                                                title={isSelected ? "Remove from Comparison" : "Add to Comparison"}
                                                                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${isSelected ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/40' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                            >
                                                                {isSelected ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                            </button>
                                                            <button 
                                                                onClick={() => openDetailPanel(cand)}
                                                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/40 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all shadow-xl"
                                                            >
                                                                <ArrowRight className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </GlowCard>
                        </>
                        ) : (
                        <GlowCard className="!p-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center">
                                    <Target className="w-10 h-10 text-purple-400/40" />
                                </div>
                                <div className="space-y-2 max-w-md">
                                    <h3 className="text-lg font-black uppercase italic tracking-tight text-white/60">No Candidates Yet</h3>
                                    <p className="text-sm text-white/25 leading-relaxed">
                                        Upload resume files and select a target role to begin ML-powered candidate ranking. 
                                        You can use a built-in role or define your own via JSON.
                                    </p>
                                </div>
                                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/15">
                                    <span className="flex items-center gap-2"><Upload className="w-3.5 h-3.5" /> Upload PDFs</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Select Role</span>
                                    <span>→</span>
                                    <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Execute</span>
                                </div>
                            </motion.div>
                        </GlowCard>
                        )}
                    </main>
                </div>

                {/* 🛡️ DUAL DRAWER SYSTEM */}
                <AnimatePresence>
                    {(inspectingCandidate || isCompareOpen) && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setInspectingCandidate(null); setIsCompareOpen(false); setIsCompareExpanded(false); }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                    )}
                </AnimatePresence>

                {/* 1. Candidate Detail Drawer */}
                <AnimatePresence>
                    {inspectingCandidate && (
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0B0F1A] border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-[70] p-8 overflow-y-auto"
                        >
                            <button onClick={() => setInspectingCandidate(null)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10">
                                <X className="w-4 h-4 text-white/40" />
                            </button>

                            <div className="space-y-8 mt-4">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">{inspectingCandidate.name}</h2>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Match: {inspectingCandidate.score}%</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Exp: {inspectingCandidate.experience != null ? `${inspectingCandidate.experience}y` : "N/A"}</div>
                                        {inspectingCandidate.resumeUrl && (
                                            <button 
                                                onClick={() => window.open(inspectingCandidate.resumeUrl, "_blank")}
                                                className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/10 hover:bg-white/10"
                                            >
                                                Open Resume
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-white/30 font-bold">{inspectingCandidate.email || "Email N/A"}</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">AI Rationale</h3>
                                        <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-sm font-bold text-white/70 leading-relaxed italic">
                                            "{inspectingCandidate.recommendation || "Insufficient profile data for dynamic suggestion."}"
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-3">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">Matched Skills</h3>
                                            <div className="space-y-1.5">
                                                {inspectingCandidate.matched?.length > 0 ? inspectingCandidate.matched.map(s => (
                                                    <div key={s} className="flex items-center gap-2 text-[11px] font-bold text-white/40">
                                                        <Check className="w-3 h-3 text-emerald-500" /> {s}
                                                    </div>
                                                )) : <span className="text-[10px] italic opacity-20">No matches found</span>}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500/50">Missing Basis</h3>
                                            <div className="space-y-1.5">
                                                {inspectingCandidate.missing?.length > 0 ? inspectingCandidate.missing.map(s => (
                                                    <div key={s} className="flex items-center gap-2 text-[11px] font-bold text-white/40">
                                                        <X className="w-3 h-3 text-rose-500" /> {s}
                                                    </div>
                                                )) : <span className="text-[10px] italic opacity-20">No missing skills</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex gap-3">
                                    <button 
                                        disabled={!inspectingCandidate.email}
                                        onClick={() => handleInterview(inspectingCandidate)}
                                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 ${
                                            inspectingCandidate.email 
                                            ? "bg-purple-600 text-white shadow-purple-600/20 hover:bg-purple-500" 
                                            : "bg-white/10 text-white/20 cursor-not-allowed shadow-none"
                                        }`}
                                    >
                                        <Mail className="w-4 h-4" />
                                        Interview
                                    </button>
                                    <button 
                                        onClick={() => handleReject(inspectingCandidate)}
                                        className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-widest hover:bg-rose-600/20 hover:border-rose-500/50 hover:text-rose-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 2. Comparison Drawer / Fullscreen */}
                <AnimatePresence>
                    {isCompareOpen && (
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0, width: isCompareExpanded ? '100%' : '448px' }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`fixed right-0 top-0 bottom-0 bg-[#0B0F1A] border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-[70] p-8 overflow-y-auto transition-all duration-500`}
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">Intelligence Engine</h2>
                                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Multi-Candidate Decision Matrix</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setIsCompareExpanded(!isCompareExpanded)}
                                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10"
                                        title={isCompareExpanded ? "Collapse" : "Expand to Fullscreen"}
                                    >
                                        {isCompareExpanded ? <Minimize2 className="w-4 h-4 text-white/40" /> : <Maximize2 className="w-4 h-4 text-white/40" />}
                                    </button>
                                    <button onClick={() => { setIsCompareOpen(false); setIsCompareExpanded(false); }} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10">
                                        <X className="w-4 h-4 text-white/40" />
                                    </button>
                                </div>
                            </div>

                            <div className={`${isCompareExpanded ? 'grid lg:grid-cols-[1fr_400px] gap-12' : 'space-y-12'}`}>
                                <div className="space-y-12">
                                    {/* 🛠️ WINNER HIGHLIGHT */}
                                    {selectedCandidates.length > 0 && (
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                    <Award className="w-6 h-6 text-emerald-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/50">Primary Fit Recommendation</p>
                                                    <h3 className="text-lg font-black uppercase italic"
                                                    >{[...selectedCandidates].sort((a,b) => b.score - a.score)[0].name}</h3>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-emerald-400">Score Lead: +{selectedCandidates.length > 1 ? (() => { const s = [...selectedCandidates].sort((a,b) => b.score - a.score); return s[0].score - s[1].score; })() : 0}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 📊 SIDE-BY-SIDE TABLE */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Metric Comparison</h3>
                                        <div className="bg-white/2 rounded-2xl border border-white/5 overflow-hidden">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-white/2 border-b border-white/5 font-black uppercase tracking-widest text-white/40">
                                                    <tr>
                                                        <th className="p-4">Criteria</th>
                                                        {selectedCandidates.map(c => <th key={c.id} className="p-4 border-l border-white/5">{c.name.split(' ')[0]}</th>)}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5 font-bold text-white/60">
                                                    <tr>
                                                        <td className="p-4 text-[10px] font-black uppercase tracking-widest">Match Score</td>
                                                        {selectedCandidates.map(c => <td key={c.id} className="p-4 border-l border-white/5 text-white font-black">{c.score}%</td>)}
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 text-[10px] font-black uppercase tracking-widest">Experience</td>
                                                        {selectedCandidates.map(c => <td key={c.id} className="p-4 border-l border-white/5">{c.experience != null ? `${c.experience} yrs` : "N/A"}</td>)}
                                                    </tr>
                                                    <tr>
                                                        <td className="p-4 text-[10px] font-black uppercase tracking-widest">Core Skills</td>
                                                        {selectedCandidates.map(c => <td key={c.id} className="p-4 border-l border-white/5">{c.matched?.slice(0, 2).join(", ") || "N/A"}</td>)}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* 🕸️ RADAR CHART */}
                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Neural Skill Overlap</h3>
                                        <div className="h-[300px] w-full bg-white/2 rounded-2xl border border-white/5 p-6">
                                            {selectedCandidates.every(hasGraphData) ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                        { subject: 'Frontend', fullMark: 100 },
                                                        { subject: 'Backend', fullMark: 100 },
                                                        { subject: 'Database', fullMark: 100 },
                                                        { subject: 'Cloud', fullMark: 100 },
                                                        { subject: 'Mobile', fullMark: 100 },
                                                    ].map(s => {
                                                        const obj = { ...s };
                                                        selectedCandidates.forEach(c => { obj[c.name] = (c.categories?.[s.subject.toLowerCase()] || 0); });
                                                        return obj;
                                                    })}>
                                                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 'bold' }} />
                                                        {selectedCandidates.map((c, i) => (
                                                            <Radar key={c.id} name={c.name} dataKey={c.name} stroke={i === 0 ? '#a855f7' : i === 1 ? '#34d399' : '#3b82f6'} fill={i === 0 ? '#a855f7' : i === 1 ? '#34d399' : '#3b82f6'} fillOpacity={0.3} />
                                                        ))}
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                                                    <BarChart3 className="w-10 h-10 text-white/5" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Insufficient categorical data for mapping</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Comparative Insights</h3>
                                    <div className="space-y-4">
                                        {selectedCandidates.map(c => (
                                            <div key={c.id} className="p-5 rounded-2xl bg-white/2 border border-white/5 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-black italic uppercase tracking-tight">{c.name}</h4>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-1">Lead Strength: {Object.entries(c.categories || {}).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-black">{c.score}%</p>
                                                        <TrendingUp className="w-3 h-3 text-purple-400 ml-auto mt-1" />
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400/50 mb-1">Key Matched</p>
                                                        <p className="text-[11px] font-bold text-white/60">{c.matched?.slice(0, 3).join(", ") || "N/A"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-rose-400/50 mb-1">Gap Analysis</p>
                                                        <p className="text-[11px] font-bold text-white/60">{c.missing?.slice(0, 3).join(", ") || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => setSelectedCandidates([])}
                                        className="w-full py-4 rounded-xl border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all mt-6"
                                    >
                                        Clear Decision Matrix
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Fix 4: Reject Confirmation Modal ───────────────────── */}
                <AnimatePresence>
                    {rejectTarget && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setRejectTarget(null)}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="fixed z-[90] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#0F1420] border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6"
                            >
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <h3 className="text-lg font-black uppercase italic">Reject Candidate?</h3>
                                    <p className="text-sm text-white/40">
                                        This will permanently remove <span className="text-white font-bold">{rejectTarget?.name}</span> from the pipeline.
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={confirmReject}
                                        className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-[10px] tracking-widest transition-all"
                                    >
                                        Yes, Reject
                                    </button>
                                    <button
                                        onClick={() => setRejectTarget(null)}
                                        className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* 🌌 BACKGROUND GLOWS */}
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-purple-600/5 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[180px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </div>
        </div>
    );
};

export default BulkScanner;
