import { useState, useMemo } from "react";
import { 
  RotateCcw, CheckCircle2, ArrowRight, Copy, AlertCircle, Check, Sparkles, ChevronDown,
  AlertTriangle, Target, Zap, Code2, Palette, Database, Smartphone, BarChart3,
  Briefcase, Search, X, Shield, Cpu, Globe, Layers, Terminal, PenTool, 
  Users, Megaphone, BookOpen, Server, Cloud, Wrench, FileText, Monitor
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";
import { useResumeStore } from "../store/useResumeStore";
import { analyzeResume } from "../api/analyze";

const ROLES = [
  // Engineering
  { key:"frontend_developer", label:"Frontend Developer", cat:"Engineering", icon:Code2 },
  { key:"backend_developer", label:"Backend Developer", cat:"Engineering", icon:Database },
  { key:"fullstack_developer", label:"Full Stack Developer", cat:"Engineering", icon:Zap },
  { key:"mobile_developer", label:"Mobile Developer", cat:"Engineering", icon:Smartphone },
  { key:"ios_developer", label:"iOS Developer", cat:"Engineering", icon:Smartphone },
  { key:"android_developer", label:"Android Developer", cat:"Engineering", icon:Smartphone },
  { key:"devops_engineer", label:"DevOps Engineer", cat:"Engineering", icon:Target },
  { key:"sre_engineer", label:"Site Reliability Engineer", cat:"Engineering", icon:Shield },
  { key:"qa_engineer", label:"QA Engineer", cat:"Engineering", icon:CheckCircle2 },
  { key:"security_engineer", label:"Security Engineer", cat:"Engineering", icon:Shield },
  { key:"platform_engineer", label:"Platform Engineer", cat:"Engineering", icon:Layers },
  { key:"embedded_engineer", label:"Embedded Systems", cat:"Engineering", icon:Cpu },
  { key:"blockchain_developer", label:"Blockchain Developer", cat:"Engineering", icon:Layers },
  { key:"game_developer", label:"Game Developer", cat:"Engineering", icon:Monitor },
  { key:"golang_developer", label:"Go Developer", cat:"Engineering", icon:Terminal },
  { key:"java_developer", label:"Java Developer", cat:"Engineering", icon:Terminal },
  { key:"dotnet_developer", label:".NET Developer", cat:"Engineering", icon:Terminal },
  { key:"ruby_developer", label:"Ruby on Rails", cat:"Engineering", icon:Terminal },
  { key:"php_developer", label:"PHP Developer", cat:"Engineering", icon:Terminal },
  { key:"rust_developer", label:"Rust Developer", cat:"Engineering", icon:Terminal },
  // Data & AI
  { key:"data_scientist", label:"Data Scientist", cat:"Data & AI", icon:BarChart3 },
  { key:"ml_engineer", label:"ML Engineer", cat:"Data & AI", icon:Cpu },
  { key:"ai_engineer", label:"AI/ML Engineer", cat:"Data & AI", icon:Sparkles },
  { key:"data_engineer", label:"Data Engineer", cat:"Data & AI", icon:Database },
  { key:"data_analyst", label:"Data Analyst", cat:"Data & AI", icon:BarChart3 },
  { key:"nlp_engineer", label:"NLP Engineer", cat:"Data & AI", icon:BookOpen },
  { key:"computer_vision_engineer", label:"Computer Vision", cat:"Data & AI", icon:Monitor },
  { key:"bi_analyst", label:"BI Analyst", cat:"Data & AI", icon:BarChart3 },
  { key:"analytics_engineer", label:"Analytics Engineer", cat:"Data & AI", icon:Database },
  { key:"mlops_engineer", label:"MLOps Engineer", cat:"Data & AI", icon:Wrench },
  // Design
  { key:"ui_ux_designer", label:"UI/UX Designer", cat:"Design", icon:Palette },
  { key:"product_designer", label:"Product Designer", cat:"Design", icon:PenTool },
  { key:"graphic_designer", label:"Graphic Designer", cat:"Design", icon:Palette },
  // Management
  { key:"product_manager", label:"Product Manager", cat:"Management", icon:Briefcase },
  { key:"engineering_manager", label:"Engineering Manager", cat:"Management", icon:Users },
  { key:"scrum_master", label:"Scrum Master", cat:"Management", icon:Users },
  { key:"technical_program_manager", label:"Technical PM", cat:"Management", icon:Briefcase },
  // Cloud & Infra
  { key:"cloud_architect", label:"Cloud Architect", cat:"Cloud & Infra", icon:Cloud },
  { key:"database_administrator", label:"Database Admin", cat:"Cloud & Infra", icon:Server },
  { key:"network_engineer", label:"Network Engineer", cat:"Cloud & Infra", icon:Globe },
  { key:"solutions_architect", label:"Solutions Architect", cat:"Cloud & Infra", icon:Layers },
  { key:"cybersecurity_analyst", label:"Cybersecurity Analyst", cat:"Cloud & Infra", icon:Shield },
  // Marketing
  { key:"digital_marketing", label:"Digital Marketing", cat:"Marketing", icon:Megaphone },
  { key:"growth_engineer", label:"Growth Engineer", cat:"Marketing", icon:Zap },
  { key:"seo_specialist", label:"SEO Specialist", cat:"Marketing", icon:Search },
  { key:"business_analyst", label:"Business Analyst", cat:"Marketing", icon:BarChart3 },
  { key:"content_strategist", label:"Content Strategist", cat:"Marketing", icon:FileText },
  // Other
  { key:"technical_writer", label:"Technical Writer", cat:"Other", icon:BookOpen },
  { key:"salesforce_developer", label:"Salesforce Dev", cat:"Other", icon:Cloud },
  { key:"sap_consultant", label:"SAP Consultant", cat:"Other", icon:Server },
  { key:"support_engineer", label:"Support Engineer", cat:"Other", icon:Wrench },
  { key:"general_sde", label:"Software Engineer", cat:"Engineering", icon:Code2 },
];

const CATS = ["All","Engineering","Data & AI","Design","Management","Cloud & Infra","Marketing","Other"];

const ResumeFixer = () => {
    const { user } = useAuth();
    const { resumeText, setResumeText } = useResumeStore();
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [showCustomJD, setShowCustomJD] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [roleSearch, setRoleSearch] = useState("");
    const [activeCat, setActiveCat] = useState("All");

    const filteredRoles = useMemo(() => {
        return ROLES.filter(r => {
            const matchCat = activeCat === "All" || r.cat === activeCat;
            const matchSearch = !roleSearch || r.label.toLowerCase().includes(roleSearch.toLowerCase()) || r.key.includes(roleSearch.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [roleSearch, activeCat]);

    const handleAnalyze = async () => {
        if (!resumeText.trim() && !file) { setError("Paste your resume content."); return; }
        if (!selectedRole && !jd.trim()) { setError("Select a target role or paste a custom JD."); return; }
        setLoading(true); setError(""); setResult(null);
        try {
            const data = await analyzeResume(file, jd, resumeText, selectedRole);
            if (!data) throw new Error("Empty response");
            setResult(data);
        } catch (err) {
            setError(err?.response?.data?.error || err.message || "Analysis failed.");
        } finally { setLoading(false); }
    };

    const copyText = (text, idx) => { navigator.clipboard.writeText(text); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); };
    const locateInEditor = (original) => {
        const idx = resumeText.toLowerCase().indexOf(original.toLowerCase().substring(0, 40));
        if (idx === -1) { setError("Text not found — use Copy to paste manually."); setTimeout(() => setError(""), 3000); return; }
        const b = resumeText.substring(0, idx), m = resumeText.substring(idx, idx + original.length), a = resumeText.substring(idx + original.length);
        setResumeText(`${b}▶▶ ${m} ◀◀${a}`);
    };
    const resetAll = () => { setResult(null); setError(""); setSelectedRole(""); setJd(""); setShowCustomJD(false); setRoleSearch(""); setActiveCat("All"); };

    const score = result?.score || result?.match_score || 0;
    const recs = result?.recommendations || result?.suggestions || [];
    const skillsFound = result?.skills_found || [];
    const missingSkills = result?.missing_skills || [];
    const issues = result?.issues || [];
    const summary = result?.summary || result?.insight || "";
    const atsStatus = result?.fit_label || result?.ats_status || "";
    const sc = score >= 80 ? {r:"text-emerald-500",b:"bg-emerald-500/10",l:"text-emerald-400"} : score >= 60 ? {r:"text-amber-500",b:"bg-amber-500/10",l:"text-amber-400"} : {r:"text-rose-500",b:"bg-rose-500/10",l:"text-rose-400"};
    const selectedRoleLabel = ROLES.find(r => r.key === selectedRole)?.label || "";

    // ─── LOADING ────────────────────────────────
    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
            <PublicHeader />
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
                <div className="relative"><div className="w-28 h-28 rounded-full border-[6px] border-white/5 border-t-indigo-500 animate-spin" /><Sparkles className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" /></div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">Analyzing against {selectedRoleLabel || "job description"}...</h2>
                    <p className="text-white/40 text-sm">Matching skills, detecting issues, generating rewrites • 10–20s</p>
                </div>
            </div>
        </div>
    );

    // ─── RESULTS ────────────────────────────────
    if (result) return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <PublicHeader />
            <div className="border-b border-white/5 pt-24 pb-8">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className={`relative w-28 h-28 rounded-full ${sc.b} flex items-center justify-center`}>
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="5" className="text-white/5" />
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="5" className={sc.r} strokeDasharray={`${score*2.64} 264`} strokeLinecap="round" />
                                </svg>
                                <span className="text-3xl font-black">{score}</span>
                            </div>
                            <div className="space-y-1.5">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${sc.b} ${sc.l}`}>
                                    {score>=70?<CheckCircle2 className="w-3 h-3"/>:<AlertTriangle className="w-3 h-3"/>}{atsStatus}
                                </div>
                                {selectedRoleLabel && <p className="text-xs text-white/30">Target: {selectedRoleLabel}</p>}
                                <p className="text-white/50 text-sm max-w-md">{summary}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {[{n:skillsFound.length,l:"Matched",c:"text-emerald-400"},{n:missingSkills.length,l:"Missing",c:"text-rose-400"},{n:issues.length,l:"Issues",c:"text-amber-400"},{n:recs.length,l:"Fixes",c:"text-indigo-400"}].map(s=>(
                                <div key={s.l} className="bg-white/[0.03] border border-white/5 rounded-xl px-5 py-3 text-center min-w-[70px]">
                                    <p className={`text-xl font-black ${s.c}`}>{s.n}</p>
                                    <p className="text-[9px] text-white/25 font-bold uppercase tracking-wider">{s.l}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={resetAll} className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium transition-all">
                        <RotateCcw className="w-3.5 h-3.5" /> New Analysis
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* LEFT: Editor + Issues */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 h-[600px] flex flex-col">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 pb-3 border-b border-white/5 mb-3">Your Resume</p>
                            <textarea className="flex-1 w-full bg-transparent text-[12px] leading-[1.9] text-white/60 focus:outline-none resize-none font-mono" value={resumeText} onChange={e=>setResumeText(e.target.value)} spellCheck={false} />
                        </div>
                        {issues.length>0&&(
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-5 space-y-3">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2"><AlertTriangle className="w-3.5 h-3.5"/>Issues ({issues.length})</h4>
                                <ul className="space-y-2">{issues.map((s,i)=><li key={i} className="text-[12px] text-white/50 flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span>{s}</li>)}</ul>
                            </div>
                        )}
                    </div>
                    {/* RIGHT: Skills + Rewrites */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            {skillsFound.length>0&&(
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">✓ Matched Skills</p>
                                    <div className="flex flex-wrap gap-1">{skillsFound.map(s=><span key={s} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/15 rounded-md text-[10px] font-semibold text-emerald-300">{s}</span>)}</div>
                                </div>
                            )}
                            {missingSkills.length>0&&(
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">✕ Missing Skills</p>
                                    <div className="flex flex-wrap gap-1">{missingSkills.map(s=><span key={s} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/15 rounded-md text-[10px] font-semibold text-rose-300">{s}</span>)}</div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5"/>AI Rewrites ({recs.length})</h4>
                            {recs.length===0?(
                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-10 text-center space-y-3">
                                    <p className="text-white/30 text-sm">No rewrites generated.</p>
                                    <button onClick={resetAll} className="px-4 py-2 bg-indigo-600 rounded-lg text-xs font-bold">Try Again</button>
                                </div>
                            ):recs.slice(0,6).map((rec,i)=>(
                                <div key={i} className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-5 space-y-3 transition-all">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-white/30">{rec.section||"General"}</span>
                                        <button onClick={()=>locateInEditor(rec.original)} className="text-[9px] font-bold uppercase text-white/15 hover:text-indigo-400 transition-colors">Find →</button>
                                    </div>
                                    <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 flex items-start gap-2.5">
                                        <X className="w-3.5 h-3.5 text-rose-400 mt-0.5 flex-shrink-0"/><p className="text-[12px] text-white/35 leading-relaxed">{rec.original}</p>
                                    </div>
                                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 flex items-start gap-2.5">
                                        <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0"/><p className="text-[12px] text-white/70 font-medium leading-relaxed">{rec.improved}</p>
                                    </div>
                                    {rec.reason&&<p className="text-[10px] text-white/20 italic pl-6">↳ {rec.reason}</p>}
                                    <button onClick={()=>copyText(rec.improved,i)} className={`w-full py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${copiedIdx===i?'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20':'bg-white/5 hover:bg-white/10 text-white/40 border border-white/5'}`}>
                                        {copiedIdx===i?<><Check className="w-3 h-3"/>Copied</>:<><Copy className="w-3 h-3"/>Copy Improved Text</>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <PublicFooter />
        </div>
    );

    // ─── INPUT STATE ────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <PublicHeader />
            <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
                <div className="text-center space-y-5 mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> AI Resume Optimizer
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
                        Get your resume<br/><span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">job-ready in seconds</span>
                    </h1>
                    <p className="text-white/35 max-w-lg mx-auto text-sm">Select a target role from 50+ templates. AI matches your skills, finds gaps, and rewrites weak bullet points.</p>
                </div>
                <div className="space-y-8">
                    {/* Step 1: Resume */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/25 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-black">1</span>Paste Resume
                        </label>
                        <textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} placeholder="Paste your full resume here..."
                            className="w-full h-48 p-5 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white/60 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none font-mono placeholder:text-white/10"/>
                    </div>
                    {/* Step 2: Role */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/25 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[9px] font-black">2</span>Select Target Role
                        </label>
                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-white/20 absolute left-4 top-1/2 -translate-y-1/2"/>
                            <input value={roleSearch} onChange={e=>setRoleSearch(e.target.value)} placeholder="Search roles... (e.g. ML Engineer, DevOps, Product Manager)"
                                className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white/60 focus:ring-1 focus:ring-indigo-500/30 outline-none placeholder:text-white/15"/>
                            {roleSearch && <button onClick={()=>setRoleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"><X className="w-4 h-4"/></button>}
                        </div>
                        {/* Category tabs */}
                        <div className="flex gap-1.5 flex-wrap">
                            {CATS.map(c=>(
                                <button key={c} onClick={()=>setActiveCat(c)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeCat===c?'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30':'bg-white/[0.02] text-white/25 border border-white/5 hover:text-white/40'}`}>{c}</button>
                            ))}
                        </div>
                        {/* Role grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                            {filteredRoles.map(role=>{
                                const Icon=role.icon; const sel=selectedRole===role.key;
                                return (
                                    <button key={role.key} onClick={()=>{setSelectedRole(sel?"":role.key);setShowCustomJD(false);}}
                                        className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border text-left transition-all ${sel?'bg-indigo-500/10 border-indigo-500/30':'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'}`}>
                                        <Icon className={`w-4 h-4 flex-shrink-0 ${sel?'text-indigo-400':'text-white/20'}`}/>
                                        <span className={`text-[11px] font-medium truncate ${sel?'text-white':'text-white/40'}`}>{role.label}</span>
                                        {sel&&<CheckCircle2 className="w-3 h-3 text-indigo-400 ml-auto flex-shrink-0"/>}
                                    </button>
                                );
                            })}
                            {filteredRoles.length===0&&<p className="col-span-full text-center text-white/20 text-xs py-6">No roles match your search.</p>}
                        </div>
                        {/* Custom JD */}
                        <button onClick={()=>{setShowCustomJD(!showCustomJD);if(!showCustomJD)setSelectedRole("");}} className="flex items-center gap-1.5 text-[10px] text-white/20 hover:text-white/40 font-medium transition-colors">
                            <ChevronDown className={`w-3 h-3 transition-transform ${showCustomJD?'rotate-180':''}`}/>Or paste custom JD
                        </button>
                        {showCustomJD&&<textarea value={jd} onChange={e=>setJd(e.target.value)} placeholder="Paste the full job description..."
                            className="w-full h-36 p-5 bg-white/[0.03] border border-white/5 rounded-xl text-sm text-white/60 focus:ring-1 focus:ring-indigo-500/30 outline-none resize-none placeholder:text-white/10"/>}
                    </div>
                    {error&&<div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400 font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
                    <button onClick={handleAnalyze} disabled={!resumeText.trim()||(!selectedRole&&!jd.trim())}
                        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${(!resumeText.trim()||(!selectedRole&&!jd.trim()))?'bg-white/5 text-white/15 cursor-not-allowed':'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-xl shadow-indigo-500/15 active:scale-[0.99]'}`}>
                        Analyze My Resume <ArrowRight className="w-4 h-4"/>
                    </button>
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};

export default ResumeFixer;
