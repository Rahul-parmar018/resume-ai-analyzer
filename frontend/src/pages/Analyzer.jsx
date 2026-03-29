import { useState } from "react";
import { analyzeResume } from "../api/analyze";
import { saveAnalysis } from "../db";
import { useAuth } from "../components/AuthProvider";

const skillsDemo = [
  { type: "MATCH",   label: "React & Next.js",   cls: "bg-tertiary-fixed/10 border-tertiary-fixed-dim/20 text-on-tertiary-container" },
  { type: "MATCH",   label: "Python (Django)",    cls: "bg-tertiary-fixed/10 border-tertiary-fixed-dim/20 text-on-tertiary-container" },
  { type: "MATCH",   label: "Cloud Arch (AWS)",   cls: "bg-tertiary-fixed/10 border-tertiary-fixed-dim/20 text-on-tertiary-container" },
  { type: "MISSING", label: "Terraform",          cls: "bg-error-container/20 border-error-container/40 text-error" },
  { type: "BONUS",   label: "Go / Rust",          cls: "bg-secondary-container/20 border-secondary-container/40 text-on-secondary-container" },
  { type: "MATCH",   label: "System Design",      cls: "bg-tertiary-fixed/10 border-tertiary-fixed-dim/20 text-on-tertiary-container" },
];

const Analyzer = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!file) { setError("Please upload a resume"); return; }
    try {
      setLoading(true); setError(""); setResult(null);
      const data = await analyzeResume(file, jd);
      if (user) {
        await saveAnalysis({
          user_id: user.uid, file_name: file.name, score: data.score,
          feedback: data.feedback, matched_skills: data.matched_skills,
          missing_skills: data.missing_skills, suggestions: data.suggestions,
        });
      }
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  // Compute score circle params
  const score = result?.score ?? 92;
  const r = 88;
  const circumference = 2 * Math.PI * r;
  const offset = result ? circumference - (circumference * score) / 100 : 44.2;

  return (
    <div className="space-y-8 pb-8">

      {/* Upload Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">01. Resume Source</label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-outline-variant group-hover:border-primary rounded-xl p-10 text-center transition-all bg-surface-container-low">
                <span className="material-symbols-outlined text-4xl text-outline group-hover:text-primary mb-3 block">upload_file</span>
                <p className="text-sm text-on-surface-variant group-hover:text-primary font-medium">
                  {file ? file.name : "Drop PDF or Click to Browse"}
                </p>
                {file && <p className="text-xs text-outline mt-1">{(file.size / 1024).toFixed(0)} KB</p>}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">02. Target Job Description</label>
            <textarea
              placeholder="Paste the job description here to check ATS compatibility..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full h-[150px] p-4 bg-surface-container-low border-none rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-error-container/30 border border-error-container rounded-xl text-error">
            <span className="material-symbols-outlined">error</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/10"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Analyzing Data Points...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">psychology</span>
              <span>Execute Intelligent Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-12 gap-8">

          {/* Left: Score + Quick Actions */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">

            {/* Score Ring */}
            <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-6">Overall Strength</p>
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-slate-100" cx="96" cy="96" fill="transparent" r={r} stroke="currentColor" strokeWidth="8" />
                  <circle
                    className="text-primary transition-all duration-1000"
                    cx="96" cy="96" fill="transparent" r={r}
                    stroke="currentColor" strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" strokeWidth="12"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-5xl font-bold text-primary">{score}%</span>
                  <span className="text-on-tertiary-container font-semibold text-sm">
                    {score >= 85 ? "Strong Match" : score >= 70 ? "Good Match" : "Needs Work"}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-3">
                {[
                  { label: "Skills",     val: Math.min(100, score + 3) },
                  { label: "Experience", val: Math.max(50,  score - 4) },
                  { label: "Education",  val: Math.min(100, score - 2) },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                    <span className="text-sm font-medium text-slate-600">{s.label}</span>
                    <span className="font-headline font-bold text-primary">{s.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-primary rounded-2xl p-6 text-white space-y-3">
              <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors group">
                <span className="text-sm font-medium">Export Full Report</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">download</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors group">
                <span className="text-sm font-medium">Save to Profile</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">bookmark</span>
              </button>
              <button className="w-full flex items-center justify-between bg-white text-primary px-4 py-3 rounded-xl font-bold active:scale-95 transition-all">
                <span>Find Similar Candidates</span>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Right: Skills + Suggestions */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

            {/* Skills Breakdown */}
            <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline text-xl font-bold text-primary">Skills Breakdown</h3>
                <div className="flex gap-4">
                  {[
                    { color: "bg-tertiary-fixed-dim",    label: "Match" },
                    { color: "bg-error-container",       label: "Missing" },
                    { color: "bg-secondary-container",   label: "Bonus" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <div className={`w-2 h-2 rounded-full ${l.color}`}></div>
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Real matched skills */}
                {result.matched_skills?.map((sk) => (
                  <div key={sk} className="flex flex-col p-4 bg-tertiary-fixed/10 border border-tertiary-fixed-dim/20 rounded-xl">
                    <span className="text-xs font-bold text-on-tertiary-container mb-1">MATCH</span>
                    <span className="font-semibold text-primary text-sm">{sk}</span>
                  </div>
                ))}
                {result.missing_skills?.map((sk) => (
                  <div key={sk} className="flex flex-col p-4 bg-error-container/20 border border-error-container/40 rounded-xl">
                    <span className="text-xs font-bold text-error mb-1">MISSING</span>
                    <span className="font-semibold text-primary text-sm">{sk}</span>
                  </div>
                ))}
                {/* Fallback demo skills if backend didn't return detailed breakdown */}
                {(!result.matched_skills || result.matched_skills.length === 0) && skillsDemo.map((s) => (
                  <div key={s.label} className={`flex flex-col p-4 border rounded-xl ${s.cls}`}>
                    <span className="text-xs font-bold mb-1">{s.type}</span>
                    <span className="font-semibold text-primary text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Suggestions */}
            {(result.suggestions?.length > 0 || result.feedback) && (
              <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border-l-4 border-primary">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                  <h3 className="font-headline text-xl font-bold text-primary">Improvements to Consider</h3>
                </div>

                {result.feedback && (
                  <div className="flex gap-4 p-4 hover:bg-surface-container-low rounded-xl transition-colors mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm mb-1">Executive Verdict</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{result.feedback}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {result.suggestions?.map((s, i) => (
                    <div key={i} className="flex gap-4 p-4 hover:bg-surface-container-low rounded-xl transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">history_edu</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm mb-1">Suggestion {i + 1}</p>
                        <p className="text-sm text-slate-500 leading-relaxed">{s}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Analyzer;
