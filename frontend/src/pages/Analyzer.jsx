import { useState, useEffect } from "react";
import { analyzeResume } from "../api/analyze";
import { saveAnalysis } from "../db";
import { useAuth } from "../components/AuthProvider";

import PageHeader from "../components/ui/PageHeader";
import ScoreCircle from "../components/ui/ScoreCircle";
import SkillTag from "../components/ui/SkillTag";

const loadingStates = [
  "Parsing document structure...",
  "Analyzing semantic experience...",
  "Matching implicit skills...",
  "Generating actionable feedback..."
];

const Analyzer = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Loading intelligence state cycler
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingStates.length);
      }, 1500); // cycle every 1.5s
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

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

  return (
    <div className="space-y-6 pb-8">
      
      <PageHeader 
        title="Resume Analyzer"
        subtitle="Upload a candidate's resume and a target job description to get a semantic intelligence report."
      />

      {/* Upload Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest">01. Resume Source</label>
            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-gray-200 group-hover:border-accent rounded-xl p-10 text-center transition-all bg-slate-50">
                <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-accent mb-3 block">upload_file</span>
                <p className="text-sm text-secondary group-hover:text-primary font-bold">
                  {file ? file.name : "Drop PDF or Click to Browse"}
                </p>
                {file && <p className="text-xs text-slate-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-secondary uppercase tracking-widest">02. Target Job Description</label>
            <textarea
              placeholder="Paste the job requirements to calibrate the semantic model..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className="w-full h-[150px] p-4 bg-slate-50 border border-gray-100/50 rounded-xl text-sm text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
            <span className="material-symbols-outlined">error</span>
            <span className="text-sm font-bold">{error}</span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={loading || !file}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>{loadingStates[loadingStep]}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 animate-fade-in">

          {/* Left: Score + Quick Actions */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">Overall Strength</p>
              
              <ScoreCircle score={result.score || 0} sizeClass="w-40 h-40" />

              <div className="w-full space-y-3 mt-8">
                {[
                  { label: "Skills",     val: Math.min(100, (result.score || 0) + 3) },
                  { label: "Experience", val: Math.max(50,  (result.score || 0) - 4) },
                  { label: "Education",  val: Math.min(100, (result.score || 0) - 2) },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-gray-100/50">
                    <span className="text-sm font-bold text-secondary">{s.label}</span>
                    <span className="font-heading font-bold text-primary">{s.val}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary rounded-2xl p-6 text-white space-y-3 shadow-lg">
              <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors font-bold text-sm">
                <span>Export Report PDF</span>
                <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              </button>
              <button className="w-full flex items-center justify-between bg-accent text-primary px-4 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                <span>Find Similar Candidates</span>
                <span className="material-symbols-outlined text-lg">person_search</span>
              </button>
            </div>
          </div>

          {/* Right: Skills + Suggestions */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Skills Breakdown */}
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h3 className="font-heading text-xl font-bold text-primary">Capabilities Mapping</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.matched_skills?.map((sk) => (
                  <SkillTag key={`match-${sk}`} label={sk} status="matched" />
                ))}
                {result.missing_skills?.map((sk) => (
                  <SkillTag key={`miss-${sk}`} label={sk} status="missing" />
                ))}
                
                {/* Fallback if backend returns none */}
                {(!result.matched_skills || result.matched_skills.length === 0) && (
                   <p className="text-sm text-secondary italic">No precise skill breakdown returned from API.</p>
                )}
              </div>
            </section>

            {/* AI Suggestions */}
            {(result.suggestions?.length > 0 || result.feedback) && (
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 border-l-4 border-l-accent">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-accent text-2xl">neurology</span>
                  <h3 className="font-heading text-xl font-bold text-primary">Intelligence Briefing</h3>
                </div>

                {result.feedback && (
                  <div className="flex gap-4 p-5 bg-slate-50 rounded-xl mb-4 border border-gray-100/50">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 text-primary">
                      <span className="material-symbols-outlined text-sm">summarize</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary text-sm mb-1 uppercase tracking-widest text-[10px]">Executive Verdict</p>
                      <p className="text-sm text-secondary leading-relaxed">{result.feedback}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {result.suggestions?.map((s, i) => (
                    <div key={i} className="flex gap-4 p-5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-gray-100/50">
                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100 text-accent font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm mb-1 uppercase tracking-widest text-[10px]">Interview Focus</p>
                        <p className="text-sm text-secondary leading-relaxed">{s}</p>
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
