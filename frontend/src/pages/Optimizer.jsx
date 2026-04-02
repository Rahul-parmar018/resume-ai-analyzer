import { useState } from "react";
import { analyzeResume } from "../api/analyze";
import PageHeader from "../components/ui/PageHeader";

const Optimizer = () => {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file || !jd.trim()) {
      setError("Please provide both a resume and a job description.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await analyzeResume(file, jd);
      setResult(data);
    } catch (err) {
      setError(err.message || "Optimization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 font-body max-w-5xl mx-auto">
      <PageHeader 
        title="Resume AI Optimizer"
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
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
               <p className="text-xs font-bold text-slate-400 uppercase mb-4">ATS Match Score</p>
               <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary" strokeDasharray={364} strokeDashoffset={364 - (364 * result.score) / 100} />
                  </svg>
                  <span className="absolute text-3xl font-black text-slate-900">{result.score}%</span>
               </div>
            </div>

            <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
               <h3 className="text-xl font-bold mb-4">AI Insights</h3>
               <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 uppercase mb-2">Strengths Found</h4>
                    <div className="flex flex-wrap gap-2">
                       {result.skills_found?.map(s => <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">{s}</span>)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-red-500 uppercase mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                       {result.missing_skills?.map(s => <span key={s} className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold">{s}</span>)}
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
                  <li key={i} className="flex gap-4 items-start">
                     <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">{i+1}</span>
                     <p className="text-slate-300 text-sm leading-relaxed">{s}</p>
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
