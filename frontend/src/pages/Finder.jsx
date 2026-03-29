import { useState } from "react";
import { useNavigate } from "react-router-dom";

const candidates = [
  {
    id: 1,
    name:     "Alexandra Chen",
    role:     "Senior Machine Learning Engineer @ CloudScale",
    match:    98,
    skills:   ["PyTorch", "Architecture", "NLP", "+4 more"],
    badgeCls: "bg-tertiary-fixed text-on-tertiary-fixed",
    avatar:   "AC",
    avatarBg: "bg-primary",
  },
  {
    id: 2,
    name:     "Marcus Thorne",
    role:     "Technical Product Lead @ FinEdge Global",
    match:    92,
    skills:   ["Agile", "Roadmapping", "Fintech"],
    badgeCls: "bg-tertiary-fixed-dim text-on-tertiary-fixed",
    avatar:   "MT",
    avatarBg: "bg-secondary",
  },
  {
    id: 3,
    name:     "Jordan Rivera",
    role:     "DevOps Architect @ NexaSystems",
    match:    87,
    skills:   ["Kubernetes", "Go", "Terraform"],
    badgeCls: "bg-surface-container-high text-on-surface-variant",
    avatar:   "JR",
    avatarBg: "bg-outline",
  },
];

const Finder = () => {
  const navigate = useNavigate();
  const [query,      setQuery]      = useState("");
  const [skill,      setSkill]      = useState("Machine Learning");
  const [experience, setExperience] = useState("Senior (5-8 years)");
  const [location,   setLocation]   = useState("Remote Only");
  const [matchMin,   setMatchMin]   = useState(85);

  const filtered = candidates.filter((c) =>
    c.match >= matchMin &&
    (query === "" || c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-10 pb-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-headline font-bold text-primary mb-2 tracking-tight">Candidate Finder</h1>
        <p className="text-secondary max-w-2xl">
          Leverage neural search patterns to identify elite candidates across your internal and external talent pools with architectural precision.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
        <div className="flex flex-col gap-6">

          {/* Search */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person_search</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-1 focus:ring-primary/20 focus:bg-white transition-all text-on-surface placeholder:text-outline/60 outline-none"
              placeholder="Search by name, role, or specific achievements..."
              type="text"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary px-1">Skill</label>
              <select value={skill} onChange={(e) => setSkill(e.target.value)} className="bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none">
                <option>Machine Learning</option>
                <option>Product Design</option>
                <option>Cloud Architecture</option>
                <option>Strategic Operations</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary px-1">Experience</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} className="bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none">
                <option>Senior (5-8 years)</option>
                <option>Staff (8-12 years)</option>
                <option>Executive (12+ years)</option>
                <option>Mid-Level (2-5 years)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary px-1">Location</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-primary/20 outline-none">
                <option>Remote Only</option>
                <option>San Francisco, CA</option>
                <option>New York, NY</option>
                <option>London, UK</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-secondary px-1">Match Score</label>
              <div className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
                <input
                  className="w-full accent-primary"
                  max="100" min="0" type="range"
                  value={matchMin}
                  onChange={(e) => setMatchMin(Number(e.target.value))}
                />
                <span className="text-sm font-bold text-primary whitespace-nowrap">{matchMin}%+</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filtered.length === 0 && (
          <div className="bg-surface-container-lowest rounded-2xl p-16 text-center border border-outline-variant/10">
            <span className="material-symbols-outlined text-5xl text-outline/30 block mb-4">person_search</span>
            <p className="text-secondary">No candidates match the current filters.</p>
          </div>
        )}

        {filtered.map((c) => (
          <div key={c.id} className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 border border-outline-variant/5 hover:shadow-md transition-shadow">

            {/* Avatar */}
            <div className={`w-20 h-20 rounded-2xl ${c.avatarBg} flex items-center justify-center shrink-0`}>
              <span className="font-headline font-bold text-white text-2xl">{c.avatar}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold font-headline text-primary">{c.name}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight ${c.badgeCls}`}>
                  {c.match}% MATCH
                </span>
              </div>
              <p className="text-secondary font-medium text-sm mb-3">{c.role}</p>
              <div className="flex flex-wrap gap-2">
                {c.skills.map((sk) => (
                  <span key={sk} className="bg-surface-container px-3 py-1 rounded-lg text-xs font-medium text-on-surface-variant">{sk}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => navigate("/app/analyze")}
                className="flex-1 bg-primary text-on-primary px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
              >
                View Details
              </button>
              <button className="flex-1 bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 active:scale-95 transition-all">
                Shortlist
              </button>
              <button className="p-2.5 text-primary hover:bg-surface-variant rounded-xl transition-all">
                <span className="material-symbols-outlined">mail</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Finder;
