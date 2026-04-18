import { useState, useRef } from "react";
import axios from "axios";
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
  FileDown
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/analyze-resume/`, formData);
            setResult(res.data);
            setScanResult({ ...res.data, extracted_text: res.data.extracted_text || "" });
        } catch (err) {
            alert("Analysis failed. Please check your internet connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white text-slate-800 font-sans min-h-screen selection:bg-emerald-500/10">
            <PublicHeader />

            {/* 01. HERO - LIVED EXPERIENCE */}
            <section className="pt-32 sm:pt-48 pb-20 px-4 sm:px-6 bg-white text-center">
                <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 animate-fade-in relative z-10">
                    <div className="space-y-6">
                        <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black leading-[1.1] sm:leading-none text-slate-900 tracking-tighter">
                            50 Applications. <br />
                            <span className="inline-block bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent italic px-2">Zero Replies?</span>
                        </h1>
                        <p className="text-slate-500 text-base sm:text-xl md:text-3xl leading-relaxed sm:leading-tight max-w-4xl mx-auto font-medium px-4">
                            You apply. You wait. Nothing. Still no feedback. <br className="hidden md:block" /> 
                            <span className="text-slate-900 font-bold underline decoration-emerald-500/30 italic">We show you exactly why recruiters are ignoring you in 10 seconds.</span>
                        </p>
                    </div>

                    {/* 02. UPLOAD - VISUAL TRUST PROOF */}
                    {!result && (
                      <div className="flex flex-col items-center pt-8">
                        <div 
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); }}
                          onClick={() => !loading && fileInputRef.current?.click()}
                          className={`relative w-full max-w-3xl border-2 border-dashed rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-20 transition-all duration-700 ${
                            isDragging ? "border-emerald-500 bg-emerald-50 scale-[1.01]" : "border-slate-200 bg-slate-50/20 hover:border-emerald-400 group shadow-[0_40px_100px_-40px_rgba(0,0,0,0.1)]"
                          } ${loading ? "opacity-50" : "cursor-pointer"}`}
                        >
                            {/* Visual Trust Badge */}
                            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                                <Lock className="w-3 h-3 text-emerald-500" />
                                <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest">Processed Locally</span>
                            </div>

                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.docx,.txt" />
                            <FileText className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-6 sm:mb-10 transition-colors ${file ? "text-emerald-500" : "text-slate-200 group-hover:text-emerald-500 font-black"}`} />
                            
                            <div className="space-y-3">
                                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic break-all">{file ? file.name : "Start Your Free Scan"}</h3>
                                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[8px] sm:text-[9px]">
                                    Takes less than 10 seconds • No signup required
                                </p>
                            </div>

                            {file && !loading ? (
                                <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="mt-8 sm:mt-12 w-full max-w-sm bg-slate-900 text-white px-10 py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 mx-auto shadow-2xl">
                                    Analyze PDF →
                                </button>
                            ) : !loading && (
                                <div className="mt-10 flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-emerald-500 underline" />
                                        <span className="text-emerald-500 font-black text-[10px] sm:text-xs uppercase tracking-widest">Click or Drop PDF here</span>
                                    </div>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 italic px-4">Most resumes we scan miss 2–3 critical recruiter signals.</p>
                                </div>
                            )}

                            {loading && (
                              <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem] sm:rounded-[3rem] p-6 text-center">
                                 <RefreshCcw className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 animate-spin mb-4 sm:mb-6" />
                                 <p className="text-slate-900 text-xl sm:text-3xl font-black tracking-tighter uppercase italic animate-pulse">Checking your resume...</p>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-2">(Neural engine warming up)</p>
                              </div>
                            )}
                        </div>
                        <div className="mt-10 flex flex-wrap justify-center items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                             <div className="flex items-center gap-2 font-black">100% Secure & Private</div>
                             <div className="flex items-center gap-2 font-black text-emerald-500/50"><TrendingUp className="w-4 h-4" /> Users improve by 15-25%</div>
                        </div>
                      </div>
                    )}
                </div>
            </section>

            {/* 03. HOW IT WORKS - SHORTLISTED GROUNDING */}
            <section className="py-32 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic text-center mb-24">How we help you get shortlisted</h2>
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-20"
                    >
                        {[
                            { title: 'Resume Audit', desc: 'We compare your resume with real job descriptions and resumes that successfully get shortlisted.', icon: <Search className="w-6 h-6 text-emerald-500" /> },
                            { title: 'Gap Discovery', desc: 'Identify the exact reasons why your resume is being filtered out by automated screening software.', icon: <Zap className="w-6 h-6 text-blue-500" /> },
                            { title: 'The Fix-Plan', desc: 'Get a prioritized list of changes to make your experience sound stronger and more relevant to recruiters.', icon: <CheckCircle2 className="w-6 h-6 text-purple-500" /> },
                        ].map(item => (
                            <motion.div key={item.title} variants={itemVar} className="space-y-6 text-center">
                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">{item.icon}</div>
                                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{item.title}</h4>
                                <p className="text-base font-medium text-slate-400 leading-relaxed max-w-[280px] mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 04. RESULT PREVIEW - IMPERFECT REALISM (SCORE CONTEXT) */}
            <section className="py-40 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10">
                        <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-[10px] font-black uppercase tracking-widest leading-none">Recruiter Preview</div>
                        <h2 className="text-6xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase italic">
                            Realistic <br /> <span className="text-blue-600 text-7xl">Insights.</span>
                        </h2>
                        <p className="text-xl text-slate-500 font-medium italic">We don't give you a generic score. We provide the same clinical feedback a professional recruiter would give you during a resume review.</p>
                        <div className="pt-6 border-t border-slate-100">
                             <div className="flex items-center gap-4">
                                 <MessageSquare className="w-8 h-8 text-blue-500 opacity-20" />
                                 <p className="text-sm font-black text-slate-400 uppercase tracking-widest italic">"Most resumes miss 2-3 sector-specific keywords."</p>
                             </div>
                        </div>
                    </div>

                    {/* REAL-MODE PREVIEW WITH CONTEXT */}
                    <div className="relative group perspective-1000">
                        <div className="absolute top-0 right-10 -translate-y-1/2 bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-20 transition-transform group-hover:scale-110">Sample Report</div>
                        <div className="bg-white border-4 border-slate-100 shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)] rounded-[3.5rem] p-12 transition-all group-hover:border-emerald-500/20 group-hover:rotate-1 duration-500">
                             <div className="flex items-center justify-between mb-12 pb-10 border-b border-slate-50">
                                  <div className="flex items-center gap-5">
                                       <div className="w-14 h-14 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-black italic">A</div>
                                       <div>
                                           <p className="text-xl font-black text-slate-900 leading-none">Alex R.</p>
                                           <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Senior Backend Engineer</p>
                                       </div>
                                  </div>
                                  <div className="text-right">
                                       <span className="text-6xl font-black text-blue-600 leading-none tracking-tighter">78%</span>
                                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-rose-500">Below sector average</p>
                                  </div>
                             </div>
                             <div className="space-y-10">
                                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative">
                                     <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3">Recruiter Verdict</h4>
                                     <p className="text-lg font-bold text-slate-600 italic leading-tight">"Alex, your backend experience is strong, but your resume lacks measurable impact in your React project. e.g. Mentioning 'Reduced latency by 40%' would increase your score instantly."</p>
                                 </div>
                                 <div className="flex items-center justify-between text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                     <div className="flex items-center gap-2 text-slate-400 tracking-widest">Audit Completed in 8.4s</div>
                                     <div className="hidden md:block">v5.24 Engine</div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 05. FEATURES - MICRO EXAMPLES */}
            <section className="py-32 bg-slate-900 text-white rounded-[5.5rem] mx-6 shadow-2xl">
                 <div className="max-w-7xl mx-auto px-12">
                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-24 text-center md:text-left">
                         {[
                             { title: 'Fix formatting issues', desc: 'Ensure your resume is perfectly readable. e.g. Fix broken margin headers.', icon: <Layout className="w-6 h-6 text-blue-400" /> },
                             { title: 'Increase impact language', desc: 'Replace passive words like "helped with" with high-ownership action verbs.', icon: <RefreshCcw className="w-6 h-6 text-emerald-400" /> },
                             { title: 'Add measurable results', desc: 'Highlight quantitative data. e.g. "Increased performance by 30%".', icon: <TrendingUp className="w-6 h-6 text-purple-400" /> },
                             { title: 'Match job requirements', desc: 'Align your skill set to the actual intent of the role description.', icon: <Target className="w-6 h-6 text-amber-400" /> },
                         ].map(f => (
                             <div key={f.title} className="space-y-6">
                                 <h4 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none">{f.title}</h4>
                                 <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-80 italic">"{f.desc}"</p>
                             </div>
                         ))}
                     </div>
                 </div>
            </section>

            {/* 06. TRUST - GROUNDED PROOF */}
            <section className="py-48 text-center bg-white">
                <div className="max-w-4xl mx-auto space-y-8 px-6">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Tested by Working Professionals</h2>
                    <p className="text-slate-500 text-xl font-medium italic leading-relaxed">Helping real professionals stand out across Tech, Finance, Marketing, and Healthcare roles for over 3 years.</p>
                    <div className="pt-8 flex flex-wrap justify-center gap-12 font-black uppercase tracking-[0.4em] text-slate-200 text-xs italic select-none">
                        <span>Product</span> <span>Engineering</span> <span>Sales</span> <span>Design</span> <span>Finance</span>
                    </div>
                </div>
            </section>

            {/* 07. FINAL CTA - URGENCY TRIGGER */}
            <section className="pb-40 px-4 md:px-6">
                <div className="max-w-5xl mx-auto bg-slate-50 border border-slate-100 rounded-[3rem] md:rounded-[6rem] p-8 sm:p-12 md:p-32 text-center shadow-xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-40 -skew-x-12 translate-x-1/2 pointer-events-none group-hover:translate-x-1/3 transition-transform duration-1000"></div>
                     <div className="space-y-8 md:space-y-12 relative z-10">
                         <div className="space-y-4 md:space-y-6">
                             <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Start <br /> <span className="text-blue-600 italic leading-none">shortlisting.</span></h2>
                             <p className="text-lg sm:text-xl md:text-2xl text-slate-500 font-medium max-w-xl mx-auto italic leading-relaxed">Stop guessing why you aren't hearing back. Your free scan takes less than 10 seconds.</p>
                         </div>
                         <button onClick={() => {window.scrollTo({top: 0, behavior: 'smooth'}); setTimeout(() => fileInputRef.current.click(), 500);}} className="bg-slate-900 text-white w-full sm:w-auto px-8 md:px-20 py-5 md:py-7 rounded-2xl md:rounded-3xl font-black text-xl md:text-3xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 group">
                             Get Results in 10s
                         </button>
                     </div>
                </div>
            </section>

            {/* RESULTS DASHBOARD (HIGH-CONVERSION ACTION CENTER) */}
            {result && !loading && (
                <div className="fixed inset-0 bg-white z-[999] overflow-y-auto font-body selection:bg-emerald-500/10 animate-in slide-in-from-bottom duration-700">
                    {/* Sticky Dashboard Header */}
                    <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                             <TrendingUp className="w-5 h-5 text-emerald-400" />
                          </div>
                          <span className="font-black uppercase italic tracking-tighter text-slate-900 text-lg">Analysis Report</span>
                       </div>
                       <button onClick={() => setResult(null)} className="group flex items-center gap-2 bg-slate-50 hover:bg-slate-900 transition-all px-4 py-2 rounded-xl text-slate-500 hover:text-white font-bold text-xs uppercase tracking-widest border border-slate-100">
                          Exit Dashboard <XCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                       </button>
                    </header>

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 sm:space-y-24">
                         
                         {/* SECTION 1 — SCORE + QUICK STATUS */}
                         <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-center">
                             <div className="lg:col-span-5 bg-slate-900 text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
                                 {/* Decorative Glow */}
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
                                 
                                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 relative z-10">Match Score</h4>
                                 <div className="relative z-10">
                                     <div className="text-7xl sm:text-9xl font-black italic tracking-tighter leading-none select-none">{result.score}%</div>
                                     {result.is_heuristic ? (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-amber-400 font-bold uppercase text-[9px] tracking-widest bg-amber-400/10 py-2 rounded-lg">
                                           <RotateCcw className="w-3.5 h-3.5" /> Basic Mode (Neural warming up)
                                        </div>
                                     ) : (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-emerald-400 font-bold uppercase text-[9px] tracking-widest bg-emerald-400/10 py-2 rounded-lg">
                                           <Sparkles className="w-3.5 h-3.5" /> Full Neural Audit Active
                                        </div>
                                     )}
                                     <div className="mt-2 flex items-center justify-center gap-2 text-rose-400 font-bold uppercase text-[8px] tracking-[0.2em]">
                                        <AlertTriangle className="w-3.5 h-3.5" /> High Shortlist Risk
                                     </div>
                                 </div>
                                 
                                 {/* Progress Bar / Benchmark */}
                                 <div className="space-y-3 pt-6 relative z-10">
                                     <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                        <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" style={{ width: `${result.score}%` }}></div>
                                     </div>
                                     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Candidate Avg: 62%</span>
                                        <span className="text-emerald-400">Target Benchmark: 85%+</span>
                                     </div>
                                 </div>
                             </div>

                             {/* SECTION 2 — WHAT’S WRONG (SIMPLIFIED) */}
                             <div className="lg:col-span-7 space-y-8 pl-4">
                                 <div className="space-y-2">
                                     <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Your Resume Issues:</h3>
                                     <p className="text-slate-400 text-sm font-medium italic">Scanning 124 sector-specific data points...</p>
                                 </div>
                                 
                                 <div className="grid gap-4">
                                     {[
                                         { label: 'Weak Action Verbs', status: 'critical', desc: 'Recruiters see passive experience.' },
                                         { label: 'High Complexity Sentences', status: 'critical', desc: 'Difficult for ATS to parse logic.' },
                                         { label: 'Missing Strategic Keywords', status: 'warning', desc: 'Below sector relevancy avg.' }
                                     ].map((issue, idx) => (
                                         <div key={idx} className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] group hover:border-rose-500 transition-all translate-x-0 hover:translate-x-2">
                                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${issue.status === 'critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                 {issue.status === 'critical' ? <XCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                             </div>
                                             <div>
                                                 <p className="text-sm font-black text-slate-900 uppercase italic truncate">{issue.label}</p>
                                                 <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{issue.desc}</p>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>

                         {/* SECTION 3 — THE FIX ROADMAP (COMPACT & ICONIC) */}
                         <div className="space-y-10">
                             <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                                 <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3">
                                    <Zap className="w-6 h-6 text-emerald-500" /> Improvement Roadmap
                                 </h4>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Prioritized Fixes</span>
                             </div>
                             
                             <div className="grid md:grid-cols-3 gap-8">
                                 {result.issues.slice(0, 3).map((issue, idx) => (
                                     <div key={idx} className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border-b-4 hover:border-b-emerald-500 h-full flex flex-col gap-6">
                                         <div className="flex items-center justify-between">
                                             <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xs font-black italic text-emerald-400">{idx+1}</div>
                                             <Sparkles className="w-4 h-4 text-slate-100" />
                                         </div>
                                         <div className="space-y-3">
                                             <p className="font-bold text-slate-900 text-lg leading-tight italic line-clamp-3">"{issue}"</p>
                                             <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-wider">
                                                 <CheckCircle2 className="w-3 h-3" /> Impact: +8-12% Score
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>

                         {/* SECTION 4 — BEFORE vs AFTER (THE "WOW" PIECE) */}
                         <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] p-12 space-y-10">
                             <div className="text-center space-y-2">
                                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter italic">Dynamic Improvement Preview</h4>
                                <p className="text-slate-400 text-sm font-medium italic">See how our AI transforms weak bullet points into high-impact signals.</p>
                             </div>

                             <div className="grid md:grid-cols-2 gap-8 relative items-center">
                                 {/* Before */}
                                 <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Original Resume (Weak)</span>
                                     </div>
                                     <p className="text-sm text-slate-400 italic font-medium leading-relaxed">"Worked on a system that helped the team improve website performance and user experience."</p>
                                 </div>

                                 {/* Connector */}
                                 <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border border-slate-100 items-center justify-center shadow-xl z-10">
                                     <ArrowRight className="w-6 h-6 text-emerald-500" />
                                 </div>

                                 {/* After */}
                                 <div className="p-8 bg-slate-900 rounded-2xl border border-emerald-500/30 shadow-2xl space-y-4">
                                     <div className="flex items-center gap-2">
                                         <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                         <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">AI Rewritten (Optimized)</span>
                                     </div>
                                     <p className="text-sm text-white font-bold leading-relaxed selection:bg-emerald-500/30">
                                        "Engineered a <span className="text-emerald-400">scalable async system</span> improving page-load performance by <span className="text-emerald-400">30%</span> and increasing user retention targets."
                                     </p>
                                 </div>
                             </div>
                         </div>

                         {/* SECTION 5 — CTA (OUTCOME FOCUS) */}
                         <div className="bg-slate-900 rounded-[4rem] p-20 text-white text-center space-y-10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden block">
                             {/* Mesh Gradient Background */}
                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50"></div>
                             
                             <div className="space-y-6 relative z-10">
                                 <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none max-w-2xl mx-auto">
                                    🚀 Improve your score <br className="hidden md:block" /> 
                                    from <span className="text-rose-500 line-through opacity-50">{result.score}%</span> → <span className="text-emerald-400 italic">85%+</span>
                                 </h2>
                                 <p className="text-xl text-slate-400 font-medium italic opacity-80 max-w-xl mx-auto">
                                    Stop manual editing. Our sector-specific optimizer will apply these fixes to your resume automatically in 10 seconds.
                                 </p>
                             </div>

                             <div className="flex flex-col items-center gap-6 relative z-10">
                                 <Link to="/resume-optimizer" className="group w-full max-w-md bg-emerald-500 text-slate-900 py-7 rounded-[2.5rem] font-black text-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-400 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4">
                                     Fix My Resume Automatically <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                 </Link>
                                 
                                 {/* SECTION 6 — SECONDARY ACTIONS */}
                                 <div className="flex flex-wrap justify-center gap-4 pt-4">
                                     <button onClick={() => {setResult(null); setFile(null); window.scrollTo({top:0});}} className="flex items-center gap-2 text-white/30 hover:text-white py-3 px-6 font-black text-[10px] uppercase tracking-[0.4em] transition-all bg-white/5 rounded-2xl border border-white/5 group">
                                         <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" /> Try Another Resume
                                     </button>
                                     <button className="flex items-center gap-2 text-white/30 hover:text-white py-3 px-6 font-black text-[10px] uppercase tracking-[0.4em] transition-all bg-white/5 rounded-2xl border border-white/5 group">
                                         <FileDown className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" /> Download Audit Report
                                     </button>
                                 </div>
                             </div>
                         </div>

                    </div>
                </div>
            )}

            <PublicFooter />
        </div>
    );
};

export default ResumeScanner;
