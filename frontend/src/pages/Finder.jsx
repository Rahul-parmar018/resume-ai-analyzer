import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";

const candidates = [
  {
    id: 1,
    name:     "Alexandra Chen",
    role:     "Senior Machine Learning Engineer @ CloudScale",
    match:    98,
    skills:   ["PyTorch", "Architecture", "NLP", "+4 more"],
    badgeCls: "bg-accent/10 border-accent/20 text-accent",
    avatar:   "AC",
    avatarBg: "bg-primary",
  },
  {
    id: 2,
    name:     "Marcus Thorne",
    role:     "Technical Product Lead @ FinEdge Global",
    match:    92,
    skills:   ["Agile", "Roadmapping", "Fintech"],
    badgeCls: "bg-blue-50 border-blue-100 text-blue-600",
    avatar:   "MT",
    avatarBg: "bg-slate-700",
  },
  {
    id: 3,
    name:     "Jordan Rivera",
    role:     "DevOps Architect @ NexaSystems",
    match:    87,
    skills:   ["Kubernetes", "Go", "Terraform"],
    badgeCls: "bg-slate-50 border-gray-200 text-secondary",
    avatar:   "JR",
    avatarBg: "bg-slate-400",
  },
];

const Finder = () => {
  const navigate = useNavigate();
  const [query,      setQuery]      = useState("");
  const [aiQuery,    setAiQuery]    = useState("");
  const [skill,      setSkill]      = useState("Machine Learning");
  const [experience, setExperience] = useState("Senior (5-8 years)");
  const [location,   setLocation]   = useState("Remote Only");
  const [matchMin,   setMatchMin]   = useState(85);

  const filtered = candidates.filter((c) =>
    c.match >= matchMin &&
    (query === "" || c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-8">

      <PageHeader 
        title="Candidate Finder"
        subtitle="Leverage neural search to filter and identify elite candidates across your historic talent pool."
        actionLabel="Import Pool"
        actionIcon="cloud_upload"
      />

      {/* AI Query Mode (Killer Feature) */}
      <div className="bg-gradient-to-r from-primary to-slate-800 p-1 rounded-2xl shadow-xl">
        <div className="bg-white rounded-xl p-2 pl-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500 font-bold">astrophotography_auto</span>
            <input 
              type="text" 
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="AI Query: 'Find me a backend dev with Python + 2 years experience who knows Docker...'"
              className="w-full bg-transparent border-none outline-none font-medium text-primary placeholder:text-slate-400 text-sm focus:ring-0"
            />
          </div>
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md hover:bg-slate-800 transition-colors shrink-0">
            Semantic Search
          </button>
        </div>
      </div>

      {/* Standard Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
        <label className="text-xs uppercase tracking-widest text-secondary font-bold mb-4 block">Standard Filters</label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <select value={skill} onChange={(e) => setSkill(e.target.value)} className="bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-accent/20 outline-none">
              <option>Machine Learning</option>
              <option>Product Design</option>
              <option>Cloud Architecture</option>
              <option>Strategic Operations</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <select value={experience} onChange={(e) => setExperience(e.target.value)} className="bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-accent/20 outline-none">
              <option>Senior (5-8 years)</option>
              <option>Staff (8-12 years)</option>
              <option>Executive (12+ years)</option>
              <option>Mid-Level (2-5 years)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-slate-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-medium focus:ring-1 focus:ring-accent/20 outline-none">
              <option>Remote Only</option>
              <option>San Francisco, CA</option>
              <option>New York, NY</option>
              <option>London, UK</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3 bg-slate-50 border border-gray-100 rounded-xl px-4 py-3">
              <input
                className="w-full accent-accent"
                max="100" min="0" type="range"
                value={matchMin}
                onChange={(e) => setMatchMin(Number(e.target.value))}
              />
              <span className="text-sm font-bold text-primary whitespace-nowrap">{matchMin}%+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 && (
          <EmptyState 
            icon="search_off"
            title="No matches found"
            description="We couldn't find any candidates matching your exact semantic query or filter parameters. Try broadening your search or importing more resumes."
            actionLabel="Clear Filters"
            onAction={() => { setQuery(""); setAiQuery(""); setMatchMin(0); }}
          />
        )}

        {filtered.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-6 border border-gray-100 hover:border-accent/40 shadow-sm hover:shadow-md transition-all group">

            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl ${c.avatarBg} flex items-center justify-center shrink-0 shadow-inner`}>
              <span className="font-heading font-bold text-white text-xl">{c.avatar}</span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold font-heading text-primary">{c.name}</h3>
                <span className={`px-2.5 py-0.5 border rounded-md text-[10px] font-bold tracking-widest uppercase ${c.badgeCls}`}>
                  {c.match}% Match
                </span>
              </div>
              <p className="text-secondary font-medium text-sm mb-3">{c.role}</p>
              <div className="flex flex-wrap gap-2">
                {c.skills.map((sk) => (
                  <span key={sk} className="bg-slate-50 border border-gray-100 px-3 py-1 rounded-lg text-xs font-medium text-secondary">{sk}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
              <button
                onClick={() => navigate("/app/analyze")}
                className="flex-1 bg-white border border-gray-200 text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 active:scale-95 transition-all text-center"
              >
                View Profile
              </button>
              <button className="flex-1 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-slate-800 active:scale-95 transition-all text-center">
                Shortlist
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Finder;
