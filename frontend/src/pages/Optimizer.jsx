import { useState } from "react";
import { analyzeResume, rewriteResume } from "../api/analyze";
import PageHeader from "../components/ui/PageHeader";
import { getScoreColor } from "../utils/scoring";

const Optimizer = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  
  // Phase 3 Rewrite States
  const [rewrites, setRewrites] = useState(null);
  const [rewriting, setRewriting] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setRewrites(null);
    try {
      const data = await analyzeResume(file, jd);
      setResult(data);
    } catch (err) {
      setError(err.message || "Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleImproveAll = async () => {
    if (!result?.extracted_text) return;
    setRewriting(true);
    try {
      const data = await rewriteResume(result.extracted_text);
      setRewrites(data.results);
    } catch (err) {
      console.error("Rewrite failed:", err);
    } finally {
      setRewriting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <div className="space-y-8 pb-12 font-body max-w-5xl mx-auto">
      <PageHeader 
        title="Candidex AI Optimizer"
        subtitle="Upload your resume and the target job description to get an AI-powered ATS score and optimization tips."
      />

      {!result && !loading && (
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          {/* Left: Inputs */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">01. Your Resume</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                    file ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-slate-50 group-hover:border-primary'
                  }`}>
                    <span className={`material-symbols-outlined text-4xl mb-2 ${file ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {file ? 'check_circle' : 'upload_file'}
                    </span>
                    <p className="text-sm font-bold text-slate-900">{file ? file.name : "Click to upload PDF"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">02. Job Description</label>
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  placeholder="Paste the job description here..."
                  className="w-full h-64 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || !file || !jd.trim()}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
              >
                Start Optimization
              </button>
            </div>
          </div>

          {/* Right: Why use this? */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary to-slate-800 p-8 rounded-3xl text-white shadow-2xl">
               <h3 className="text-2xl font-bold mb-6">Why Optimize?</h3>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <span className="material-symbols-outlined text-emerald-400">speed</span>
                     <div>
                        <h4 className="font-bold">Beat the ATS</h4>
                        <p className="text-sm text-slate-300">80% of resumes are filtered by bots before a human sees them. Use AI to align your keywords.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <span className="material-symbols-outlined text-emerald-400">psychology</span>
                     <div>
                        <h4 className="font-bold">Skill Gap Analysis</h4>
                        <p className="text-sm text-slate-300">Instantly identify which skills are missing from your profile and how to highlight them.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <span className="material-symbols-outlined text-emerald-400">edit_note</span>
                     <div>
                        <h4 className="font-bold">ATS Formatting Tips</h4>
                        <p className="text-sm text-slate-300">Get specific phrasing suggestions to improve your impact scores.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-primary rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Optimization...</h2>
          <p className="text-slate-500 font-medium">Comparing your profile vectors against the JD requirements.</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* 1. Overall Score & Fit */}
            <div className={`bg-white p-6 rounded-3xl border shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden ${
              getScoreColor(result.score) === 'green' ? 'border-green-100' : 
              getScoreColor(result.score) === 'yellow' ? 'border-amber-100' : 'border-red-100'
            }`}>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Final Match Score</p>
               
               {/* Trend Indicator (PHASE 4) */}
               {result.trend?.previous_score && (
                 <div className={`absolute top-4 right-4 flex items-center gap-1 font-black text-[10px] px-2 py-1 rounded-lg ${
                   result.trend.improvement >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                 }`}>
                   <span className="material-symbols-outlined text-[14px]">
                     {result.trend.improvement >= 0 ? 'trending_up' : 'trending_down'}
                   </span>
                   {result.trend.improvement !== 0 ? `${result.trend.improvement > 0 ? '+' : ''}${result.trend.improvement}%` : 'Stable'}
                 </div>
               )}

               <div className="relative inline-flex items-center justify-center mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" 
                      className={
                        getScoreColor(result.score) === 'green' ? 'text-green-500' : 
                        getScoreColor(result.score) === 'yellow' ? 'text-amber-500' : 'text-red-500'
                      }
                      strokeDasharray={264} strokeDashoffset={264 - (264 * result.score) / 100} 
                    />
                  </svg>
                  <span className={`absolute text-2xl font-black ${
                    getScoreColor(result.score) === 'green' ? 'text-green-600' : 
                    getScoreColor(result.score) === 'yellow' ? 'text-amber-600' : 'text-red-600'
                  }`}>{result.score}%</span>
               </div>
               
               <div className="space-y-2">
                 <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm inline-block ${
                   result.score > 80 ? 'bg-green-600 text-white' : 
                   result.score > 60 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                 }`}>
                   {result.fit_label}
                 </span>
                 
                 {/* Confidence Badge (PHASE 4) */}
                 <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-slate-400">
                   <span className="material-symbols-outlined text-[12px]">verified_user</span>
                   AI Confidence: {(result.confidence * 100).toFixed(0)}%
                 </div>
               </div>
            </div>

            {/* 2. Semantic Alignment */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
               <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">psychology_alt</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Semantic match</p>
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{result.semantic?.label}</h4>
                  <p className="text-xs text-slate-500 mt-1">Confidence Score: <span className="font-bold text-slate-900">{(result.semantic?.score * 100).toFixed(0)}%</span></p>
               </div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${result.semantic?.score * 100}%` }}></div>
               </div>
            </div>

            {/* 3. Experience Match */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
               <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-500">work_history</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experience Match</p>
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{result.experience?.match_percentage}% Match</h4>
                  <p className="text-xs text-slate-500 mt-1">{result.experience?.message}</p>
               </div>
               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${result.experience?.match_percentage}%` }}></div>
               </div>
            </div>

            {/* 4. Action Panel */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recommended Action</p>
                <div className="space-y-2">
                   <button 
                    onClick={handleImproveAll}
                    disabled={rewriting}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      <span className="material-symbols-outlined text-[16px]">draw</span>
                      {rewriting ? 'Improving...' : 'Improve Resume'}
                   </button>
                   <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                      Apply Later
                   </button>
                </div>
            </div>
          </div>

          {/* New Resume Improvement Section (PHASE 3) */}
          {(rewriting || rewrites) && (
             <div className="bg-white p-8 rounded-4xl border border-indigo-100 shadow-xl shadow-indigo-500/5 space-y-8 animate-slide-up">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                         <span className="material-symbols-outlined">auto_fix_high</span>
                      </div>
                      <div>
                         <h3 className="text-2xl font-black text-slate-900">Resume Rewrite Engine</h3>
                         <p className="text-indigo-500 font-bold text-sm tracking-tight flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">verified</span>
                            PHASE 3: High-Impact Bullet Optimization
                         </p>
                      </div>
                   </div>
                   <button 
                      onClick={handleImproveAll}
                      disabled={rewriting}
                      className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">refresh</span>
                       {rewriting ? 'Rewriting...' : 'Regenerate All'}
                   </button>
                </div>

                {rewriting && !rewrites && (
                   <div className="grid grid-cols-2 gap-6 opacity-50">
                      {[1,2,3].map(i => (
                         <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
                      ))}
                   </div>
                )}

                {rewrites && (
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6 mb-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Original Bullet</p>
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-4">AI Improved Bullet</p>
                      </div>
                      
                      <div className="space-y-6">
                         {rewrites.map((item, idx) => (
                            <div key={idx} className="grid md:grid-cols-2 gap-6 group">
                               {/* Original */}
                               <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-sm font-medium italic">
                                  "{item.original}"
                               </div>
                               
                               {/* Improved */}
                               <div className="relative p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl group-hover:border-indigo-300 transition-all">
                                  <p className="text-slate-900 text-sm font-bold leading-relaxed pr-24">
                                     {item.improved}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-3">
                                     {item.improvements?.map((imp, i) => (
                                        <span key={i} className="text-[9px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded shadow-sm">
                                           {imp}
                                        </span>
                                     ))}
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                     <button 
                                        onClick={() => copyToClipboard(item.improved)}
                                        className="w-10 h-10 bg-white shadow-md rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-[18px]">content_copy</span>
                                     </button>
                                     <button className="w-10 h-10 bg-indigo-600 text-white shadow-md rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all">
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                     </button>
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}
             </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {/* AI Insights (Full Width of row) */}
            <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start gap-8">
               <div className="flex items-start gap-6 flex-1">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                     <span className="material-symbols-outlined">auto_awesome</span>
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-lg font-black text-slate-900">AI Narrative Insight</h3>
                     <p className="text-slate-600 text-sm leading-relaxed">{result.insight}</p>
                  </div>
               </div>
               
               {/* Score Explainability (PHASE 4) */}
               <div className="w-full md:w-80 bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <span className="material-symbols-outlined text-[14px]">psychology_alt</span>
                     Why This Score?
                  </h4>
                  <ul className="space-y-2">
                     {result.reasoning?.map((r, i) => (
                       <li key={i} className="flex gap-2 text-xs text-slate-600 font-medium leading-tight">
                          <span className="material-symbols-outlined text-emerald-500 text-[14px] mt-0.5">check_circle</span>
                          {r}
                       </li>
                     ))}
                     {(!result.reasoning || result.reasoning.length === 0) && <li className="text-xs text-slate-400 italic">Calculation based on domain alignment.</li>}
                  </ul>
               </div>
            </div>

            {/* Skill Gaps & Strengths */}
            <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2 tracking-widest">
                       <span className="material-symbols-outlined text-[16px]">check_circle</span>
                       Matched Strengths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {result.skills_found?.map(s => <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-100">+{s}</span>)}
                       {result.skills_found?.length === 0 && <span className="text-xs text-slate-400 italic">No direct matches found.</span>}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-red-500 uppercase flex items-center gap-2 tracking-widest">
                       <span className="material-symbols-outlined text-[16px]">warning</span>
                       Missing Core Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                       {result.missing_skills?.map(s => <span key={s} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold border border-red-100">-{s}</span>)}
                       {result.missing_preferred?.map(s => <span key={s} className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[11px] font-bold border border-slate-200">-{s} (Optional)</span>)}
                       {result.missing_skills?.length === 0 && result.missing_preferred?.length === 0 && <span className="text-xs text-slate-400 italic">Excellent! You meet all identified requirements.</span>}
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">lightbulb</span>
                Optimization Checklist
             </h3>
             <ul className="space-y-4">
                {result.suggestions?.map((s, i) => (
                  <li key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-2xl border border-white/10">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                       s.priority === 'high' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                     }`}>
                       {i+1}
                     </div>
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                             s.priority === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                           }`}>
                             {s.priority || 'Medium'} Priority
                           </span>
                           <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                             {s.type?.replace('_', ' ') || 'Suggestion'}
                           </span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed font-medium">{s.message || s}</p>
                     </div>
                  </li>
                ))}
             </ul>
          </div>
          
          <div className="flex justify-center">
             <button 
                onClick={() => setResult(null)} 
                className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition-all"
             >
                Test New Resume
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Optimizer;
