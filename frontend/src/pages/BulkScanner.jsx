import { useState } from "react";
import { bulkAnalyzeResumes } from "../api/analyze";
import PageHeader from "../components/ui/PageHeader";
import { getScoreColorClass } from "../utils/scoring";

const EXPERIENCE_LEVELS = [
  { value: "intern", label: "Intern" },
  { value: "junior", label: "Junior (0–2)" },
  { value: "mid", label: "Mid (2–5)" },
  { value: "senior", label: "Senior (5+)" },
];

const TOOL_OPTIONS = ["Docker", "AWS", "Kubernetes", "TensorFlow"];

const PRESETS = [
  {
    key: "frontend",
    label: "Frontend Developer",
    values: {
      job_title: "Frontend Developer",
      department: "Engineering",
      experience_level: "mid",
      required_skills: ["JavaScript", "React", "TypeScript"],
      optional_skills: ["Next.js", "CSS", "Testing"],
      tools: ["Docker", "AWS"],
      weights: { skills: 40, experience: 30, education: 15, ats: 15 },
      notes: "Startup experience preferred",
    },
  },
  {
    key: "backend",
    label: "Backend Engineer",
    values: {
      job_title: "Backend Engineer",
      department: "Engineering",
      experience_level: "mid",
      required_skills: ["Python", "Django", "SQL"],
      optional_skills: ["Redis", "Celery", "REST APIs"],
      tools: ["Docker", "AWS", "Kubernetes"],
      weights: { skills: 40, experience: 30, education: 15, ats: 15 },
      notes: "Experience scaling APIs preferred",
    },
  },
  {
    key: "datasci",
    label: "Data Scientist",
    values: {
      job_title: "Data Scientist",
      department: "Data",
      experience_level: "mid",
      required_skills: ["Python", "Machine Learning", "Statistics"],
      optional_skills: ["NLP", "Deep Learning", "Data Visualization"],
      tools: ["AWS", "TensorFlow"],
      weights: { skills: 40, experience: 30, education: 15, ats: 15 },
      notes: "Prior experimentation and model deployment preferred",
    },
  },
];

const normalizeTag = (tag) => tag.trim().replace(/\s+/g, " ");

const TagInput = ({ label, tags, setTags, placeholder }) => {
  const [value, setValue] = useState("");

  const addTag = (raw) => {
    const next = normalizeTag(raw);
    if (!next) return;
    const exists = tags.some((t) => t.toLowerCase() === next.toLowerCase());
    if (exists) return;
    setTags([...tags, next]);
    setValue("");
  };

  const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-secondary uppercase tracking-widest">{label}</label>
      <div className="w-full min-h-[3rem] p-3 bg-slate-50 border border-gray-100 rounded-2xl text-sm text-primary focus-within:ring-2 focus-within:ring-accent/20 outline-none transition-all">
        <div className="flex flex-wrap gap-2 items-center">
          {tags.map((t, idx) => (
            <span
              key={`${t}-${idx}`}
              className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-xl text-xs font-bold"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="text-slate-400 hover:text-slate-700 transition-colors leading-none"
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(value);
              }
              if (e.key === "Backspace" && !value && tags.length) {
                e.preventDefault();
                setTags(tags.slice(0, -1));
              }
            }}
            onBlur={() => addTag(value)}
            placeholder={placeholder}
            className="flex-1 min-w-[10rem] bg-transparent outline-none text-sm"
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">Type a skill and press Enter to add.</p>
    </div>
  );
};

const WeightSlider = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-xs font-black text-primary">{value}%</span>
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-black"
    />
  </div>
);

const BulkAnalyzer = () => {
  const [files, setFiles] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [optionalSkills, setOptionalSkills] = useState([]);
  const [tools, setTools] = useState([]);
  const [notes, setNotes] = useState("");
  const [weights, setWeights] = useState({ skills: 40, experience: 30, education: 15, ats: 15 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const setWeightKeepingTotal = (key, nextVal) => {
    const clamped = Math.max(0, Math.min(100, Math.round(nextVal)));
    const otherKeys = Object.keys(weights).filter((k) => k !== key);
    const remaining = 100 - clamped;
    const curOtherSum = otherKeys.reduce((acc, k) => acc + weights[k], 0);

    const newWeights = { ...weights, [key]: clamped };

    if (curOtherSum === 0) {
      const share = Math.floor(remaining / otherKeys.length);
      otherKeys.forEach((k, i) => {
        newWeights[k] = i === otherKeys.length - 1 ? remaining - share * (otherKeys.length - 1) : share;
      });
    } else {
      let allocated = 0;
      otherKeys.forEach((k, i) => {
        if (i === otherKeys.length - 1) {
          newWeights[k] = remaining - allocated;
        } else {
          const share = Math.round((weights[k] / curOtherSum) * remaining);
          newWeights[k] = share;
          allocated += share;
        }
      });
    }
    setWeights(newWeights);
  };

  const applyPreset = (preset) => {
    const v = preset.values;
    setJobTitle(v.job_title || "");
    setDepartment(v.department || "");
    setExperienceLevel(v.experience_level || "mid");
    setRequiredSkills(v.required_skills || []);
    setOptionalSkills(v.optional_skills || []);
    setTools(v.tools || []);
    setWeights(v.weights || { skills: 50, experience: 30, semantic: 20 });
    setNotes(v.notes || "");
    setError("");
  };

  const buildJobProfile = () => {
    const total = weights.skills + weights.experience + weights.semantic;
    const safeTotal = total > 0 ? total : 100;
    return {
      job_title: jobTitle.trim(),
      department: department.trim(),
      experience_level: experienceLevel,
      required_skills: requiredSkills,
      optional_skills: optionalSkills,
      tools,
      weights: {
        skills: weights.skills / safeTotal,
        experience: weights.experience / safeTotal,
        education: weights.education / safeTotal,
        ats: weights.ats / safeTotal,
      },
      notes: notes.trim(),
    };
  };

  // File Handlers
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 150) {
      setError("Maximum 150 resumes allowed per batch.");
      return;
    }
    setFiles(selected);
    setError("");
  };

  const handleAnalyzeAll = async () => {
    if (!files.length) { setError("Please upload at least one resume."); return; }
    if (!jobTitle.trim()) { setError("Job Title is required."); return; }
    if (!experienceLevel) { setError("Experience Level is required."); return; }
    if (!requiredSkills.length) { setError("Add at least 1 Required Skill."); return; }
    
    try {
      setLoading(true); 
      setError(""); 
      setResult(null);
      setSelectedForCompare([]);
      setShowCompare(false);
      
      const data = await bulkAnalyzeResumes(files, buildJobProfile());
      setResult(data);
    } catch (err) {
      setError(err.message || "Bulk Analysis failed executing batch vectors.");
    } finally {
      setLoading(false);
    }
  };

  // Compare Logic
  const toggleCompare = (id) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 4) {
         setError("You can only compare up to 4 candidates at once.");
         return prev;
      }
      return [...prev, id];
    });
  };

  const compareCandidatesRaw = selectedForCompare.map(id => 
    result?.top_candidates.find(c => c.id === id)
  ).filter(Boolean);

  // Generate superset of all skills found across compared candidates
  const allCompareSkills = Array.from(new Set(compareCandidatesRaw.flatMap(c => c.skills)));

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Candidate Ranking Engine"
        subtitle="Recruiter Mode: Process up to 150 resumes simultaneously against a structured hiring profile with neural semantic matching."
        actionLabel={files.length > 0 ? `${files.length} Ready` : "Awaiting PDFs"}
        actionIcon="hub"
      />

      {/* Upload & Hiring Profile Configuration Block */}
      {!result && !loading && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
            
            {/* Multi-File Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-secondary uppercase tracking-widest">01. Candidate Pool (Bulk)</label>
              <div className="relative group h-48">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`h-full border-2 border-dashed ${files.length > 0 ? 'border-accent bg-accent/5' : 'border-gray-200 bg-slate-50'} group-hover:border-accent group-hover:bg-accent/5 rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center`}>
                  <span className={`material-symbols-outlined text-4xl mb-3 ${files.length > 0 ? 'text-accent' : 'text-slate-400 group-hover:text-accent'}`}>
                    content_copy
                  </span>
                  <p className="text-sm font-bold text-primary">
                    {files.length > 0 ? `${files.length} Resumes Staged for Batching` : "Drop Resumes Here (Max 150)"}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">PDF, DOCX formats supported</p>
                </div>
              </div>
            </div>

            {/* Structured Hiring Form */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">02. Structured Hiring Form</label>
                  <p className="text-xs text-slate-400 mt-1">Use presets or build your own role profile. No more unstructured JD text walls.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 1: Role Info */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">badge</span>
                  <h3 className="font-heading font-black text-primary">Role Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                    <input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="AI/ML Engineer"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Department</label>
                    <input
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Engineering"
                      className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-sm text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  >
                    {EXPERIENCE_LEVELS.map((lvl) => (
                      <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION 2: Skills Selection */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">psychology</span>
                  <h3 className="font-heading font-black text-primary">Skills Selection</h3>
                </div>
                <TagInput
                  label="Required Skills"
                  tags={requiredSkills}
                  setTags={setRequiredSkills}
                  placeholder='Type "Python" and press Enter'
                />
                <TagInput
                  label="Optional Skills"
                  tags={optionalSkills}
                  setTags={setOptionalSkills}
                  placeholder='Type "Docker" and press Enter'
                />
              </div>

              {/* SECTION 3: Tools / Tech Stack */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">deployed_code</span>
                  <h3 className="font-heading font-black text-primary">Tools / Tech Stack</h3>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Select Tools</label>
                  <select
                    multiple
                    value={tools}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                      setTools(selected);
                    }}
                    className="w-full min-h-[7rem] p-3 bg-white border border-slate-200 rounded-2xl text-sm text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                  >
                    {TOOL_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                {tools.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tools.map((t) => (
                      <span key={t} className="bg-white border border-slate-200 text-slate-700 px-2 py-1 rounded-xl text-xs font-bold">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 4: Weight System */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-accent">tune</span>
                    <h3 className="font-heading font-black text-primary">Weight System</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeights({ skills: 40, experience: 30, education: 15, ats: 15 })}
                    className="text-xs font-black text-slate-500 hover:text-primary transition-colors"
                  >
                    Reset 40/30/15/15
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <WeightSlider label="Skills" value={weights.skills} onChange={(v) => setWeightKeepingTotal("skills", v)} />
                  <WeightSlider label="Experience" value={weights.experience} onChange={(v) => setWeightKeepingTotal("experience", v)} />
                  <WeightSlider label="Education" value={weights.education} onChange={(v) => setWeightKeepingTotal("education", v)} />
                  <WeightSlider label="ATS Format" value={weights.ats} onChange={(v) => setWeightKeepingTotal("ats", v)} />
                </div>
                <div className="text-[11px] text-slate-400">
                  Total: {weights.skills + weights.experience + weights.education + weights.ats}%. We auto-balance sliders to always equal 100%.
                </div>
              </div>

              {/* SECTION 5: Additional Requirements */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent">notes</span>
                  <h3 className="font-heading font-black text-primary">Additional Requirements</h3>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='e.g., "Startup experience preferred" or "Remote only"'
                  className="w-full h-24 p-4 bg-white border border-slate-200 rounded-2xl text-sm text-primary focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400">Optional. This is included in the semantic query context.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
              <span className="material-symbols-outlined text-xl">error</span>
              <span className="text-sm font-bold">{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyzeAll}
            disabled={files.length === 0 || !jobTitle.trim() || !requiredSkills.length}
            className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20 group"
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">bolt</span>
            <span>Analyze {files.length || 0} Candidates</span>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <span className="material-symbols-outlined text-4xl text-accent absolute inset-0 flex items-center justify-center animate-pulse">
              memory
            </span>
          </div>
          <h2 className="text-2xl font-black font-heading text-primary mb-2">Analyzing {files.length} Candidates</h2>
          <p className="text-slate-500 font-medium">Batch scoring resumes using your structured hiring profile.</p>
          <div className="mt-8 px-6 py-2 bg-slate-50 rounded-full text-xs font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
            Estimated time: {Math.ceil(files.length * 1.5)}s
          </div>
        </div>
      )}

      {/* Post-Analysis: Leaderboard & Compare */}
      {result && !loading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><span className="material-symbols-outlined">group</span></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Analyzed</p>
                  <p className="text-2xl font-black text-primary">{result.total_candidates}</p>
                </div>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center"><span className="material-symbols-outlined">auto_awesome</span></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Auto-Shortlisted</p>
                  <p className="text-2xl font-black text-primary">{result.auto_shortlist?.length || 0}</p>
                </div>
             </div>
             <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                {selectedForCompare.length > 0 ? (
                  <button 
                    onClick={() => setShowCompare(true)}
                    className="w-full py-3 bg-accent text-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md shadow-accent/20"
                  >
                    <span className="material-symbols-outlined">compare_arrows</span>
                    Compare ({selectedForCompare.length})
                  </button>
                ) : (
                  <div className="text-center text-slate-400 text-xs font-bold py-1">Select to Compare</div>
                )}
                <div className="flex gap-2 w-full pt-1 border-t border-slate-50">
                  <button 
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
                      const downloadAnchorNode = document.createElement('a');
                      downloadAnchorNode.setAttribute("href", dataStr);
                      downloadAnchorNode.setAttribute("download", `batch_report_${result.session_id}.json`);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.click();
                      downloadAnchorNode.remove();
                    }}
                    className="flex-1 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg text-[10px] font-black hover:bg-slate-100 transition-all"
                  >
                    JSON
                  </button>
                  <button 
                    onClick={() => {
                        const headers = ["Rank", "Name", "Score", "Skills"];
                        const rows = result.top_candidates.map(c => [c.rank, c.name, c.score, c.skills.join("; ")]);
                        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement("a");
                        link.setAttribute("href", URL.createObjectURL(blob));
                        link.setAttribute("download", `candidates_ranking_${result.session_id}.csv`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className="flex-1 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg text-[10px] font-black hover:bg-slate-100 transition-all"
                  >
                    CSV
                  </button>
                </div>
             </div>
          </div>

          {/* Compare Modal/View overlay */}
          {showCompare && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
              <div className="bg-slate-800 px-6 py-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent">view_week</span>
                  <h3 className="font-bold font-heading">Candidate Comparison</h3>
                </div>
                <button onClick={() => setShowCompare(false)} className="hover:bg-slate-700 p-1 rounded-lg transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 border-b-2 border-slate-100 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 rounded-tl-xl">Feature</th>
                      {compareCandidatesRaw.map(c => (
                        <th key={c.id} className="p-4 border-b-2 border-slate-100 bg-slate-50 first:rounded-tl-xl last:rounded-tr-xl">
                          <div className="font-heading font-black text-primary text-lg truncate w-40" title={c.name}>{c.name.replace(/\.(pdf|docx)$/i, '')}</div>
                          <div className="text-accent text-sm font-bold">{c.score}% Match</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allCompareSkills.map((skill, i) => (
                      <tr key={skill} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-4 border-b border-slate-100/50 font-bold text-slate-700 text-sm">{skill}</td>
                        {compareCandidatesRaw.map(c => {
                          const hasSkill = c.skills.includes(skill);
                          return (
                            <td key={`${c.id}-${skill}`} className="p-4 border-b border-slate-100/50 text-center">
                              {hasSkill ? (
                                <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
                              ) : (
                                <span className="material-symbols-outlined text-slate-300 font-bold">cancel</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leaderboard Table Core */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-heading font-black text-primary text-xl flex items-center gap-2">
                <span className="material-symbols-outlined text-accent">leaderboard</span>
                Candidate Leaderboard
              </h3>
              <button 
                onClick={() => {
                  setResult(null);
                  setFiles([]);
                  setJobTitle("");
                  setDepartment("");
                  setExperienceLevel("mid");
                  setRequiredSkills([]);
                  setOptionalSkills([]);
                  setTools([]);
                  setNotes("");
                  setWeights({ skills: 50, experience: 30, semantic: 20 });
                  setShowCompare(false);
                  setSelectedForCompare([]);
                  setError("");
                }}
                className="text-sm font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span> New Session
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {result.top_candidates.map((c, idx) => {
                const isShortlisted = result.auto_shortlist?.some(s => s.id === c.id);
                const isSelected = selectedForCompare.includes(c.id);

                return (
                  <div key={c.id} className={`p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50/30' : ''}`}>
                    
                    {/* Rank & Compare Check */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div 
                        onClick={() => toggleCompare(c.id)}
                        className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer border-2 transition-all ${isSelected ? 'bg-accent border-accent text-primary' : 'border-slate-300 hover:border-accent text-transparent'}`}
                      >
                         <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-black text-xl shadow-inner ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-slate-50 text-slate-400'}`}>
                        #{c.rank}
                      </div>
                    </div>

                    {/* Core Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-heading font-bold text-lg text-primary truncate">
                          {c.name.replace(/\.(pdf|docx)$/i, '')}
                        </h4>
                        {isShortlisted && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded text-[10px] font-bold uppercase tracking-widest self-start mt-1">
                            Auto-Shortlist
                          </span>
                        )}
                      </div>
                      
                      {/* Tailwind Score Bar */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              c.score > 75 ? 'bg-green-500' : 
                              c.score >= 50 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${c.score}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg border ${getScoreColorClass(c.score)}`}>
                          {c.score}%
                        </span>
                      </div>
                    </div>

                    {/* Skills Summary (Right side on desktop) */}
                    <div className="w-full md:w-64 shrink-0 border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Matched Key Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.skills.slice(0, 4).map(sk => (
                          <span key={sk} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-[11px] font-bold">
                            {sk}
                          </span>
                        ))}
                        {c.skills.length > 4 && (
                          <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded text-[11px] font-bold">
                            +{c.skills.length - 4}
                          </span>
                        )}
                        {c.skills.length === 0 && <span className="text-xs text-slate-400 italic">No exact matches</span>}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default BulkAnalyzer;
