import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import { executeSemanticSearch } from "../api/analyze";

const Finder = () => {
  const navigate = useNavigate();
  const [aiQuery, setAiQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!aiQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setErrorMsg("");
    setResults([]);

    try {
      const data = await executeSemanticSearch(aiQuery);
      setResults(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to query the semantic vector space.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">

      <PageHeader 
        title="AI Candidate Finder"
        subtitle="Leverage MiniLM Neural Search to naturally query the mathematical semantic traits of your entire candidate pool."
        actionLabel="Import Resumes"
        actionIcon="cloud_upload"
        actionLink="/app/analyze"
      />

      {/* AI Query Mode (Killer Feature) */}
      <div className="bg-gradient-to-r from-primary to-slate-800 p-1.5 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay"></div>
        <form onSubmit={handleSearch} className="bg-white rounded-[1.25rem] p-3 pl-6 flex items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4 flex-1">
            <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-br from-accent to-blue-600 font-bold text-3xl animate-pulse">
              astrophotography_auto
            </span>
            <input 
              type="text" 
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="E.g., Find me a React developer with startup experience who knows Docker..."
              className="w-full bg-transparent border-none outline-none font-medium text-primary placeholder:text-slate-400 focus:ring-0 text-base lg:text-lg"
              disabled={isSearching}
            />
          </div>
          <button 
            type="submit"
            disabled={isSearching || !aiQuery.trim()}
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all shrink-0 flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Thinking...
              </>
            ) : "Semantic Search"}
          </button>
        </form>
      </div>

      {/* Results Area */}
      <div className="grid grid-cols-1 gap-6 pt-4">
        
        {isSearching && (
           <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-200 rounded-3xl">
              <span className="material-symbols-outlined text-accent text-5xl animate-spin mb-4">hexagon</span>
              <h3 className="text-xl font-bold text-primary font-heading">Generating Query Embeddings</h3>
              <p className="text-slate-500 font-medium">Scanning up to 500 dimensional vectors across your database...</p>
           </div>
        )}

        {!isSearching && hasSearched && errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl font-bold flex items-center gap-3">
             <span className="material-symbols-outlined">error</span>
             {errorMsg}
          </div>
        )}

        {!isSearching && hasSearched && !errorMsg && results.length === 0 && (
          <EmptyState 
            icon="search_off"
            title="Zero Vector Matches"
            description="No candidates sufficiently match the semantic profile requested. Please upload more candidates or broaden the query."
            actionLabel="Clear Search"
            onAction={() => { setAiQuery(""); setHasSearched(false); }}
          />
        )}

        {!isSearching && hasSearched && results.map((c, idx) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl flex flex-col lg:flex-row items-start lg:items-center gap-8 border border-gray-100 hover:border-accent/40 shadow-sm hover:shadow-xl transition-all duration-300 group">

            {/* Rank & Avatar Box */}
            <div className="flex items-center gap-6 w-full lg:w-auto">
              <span className="font-heading text-4xl font-black text-slate-200 group-hover:text-accent transition-colors">
                #{idx + 1}
              </span>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                <span className="font-heading font-extrabold text-white text-2xl uppercase">
                  {c.candidate.substring(0,2)}
                </span>
              </div>
            </div>

            {/* Core Candidate Info */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-black font-heading text-primary bg-clip-text">
                  {c.candidate.replace(/\.(pdf|docx)$/i, '')}
                </h3>
                <span className={`px-3 py-1 border rounded-lg text-xs font-bold tracking-widest uppercase flex items-center gap-1 ${c.score >= 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  {c.score}% Hybrid Match
                </span>
              </div>
              
              {/* AI Explanation Subcard */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-sm font-medium text-slate-700 flex items-start gap-2">
                  <span className="material-symbols-outlined text-accent text-[18px] shrink-0">psychology</span>
                  {c.reason}
                </p>
              </div>

              {/* Skills Row */}
              <div className="flex flex-wrap gap-2 pt-1">
                {c.skills.map((sk) => (
                  <span key={sk} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 shadow-sm">{sk}</span>
                ))}
              </div>
            </div>

            {/* Actions Vector Metrics (Right side) */}
            <div className="flex flex-row lg:flex-col gap-4 w-full lg:w-48 xl:w-64 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8">
              <div className="w-full text-center lg:text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pure Semantic Score</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${c.semantic_score}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-primary">{c.semantic_score}%</span>
                </div>
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => navigate(`/app/analysis/${c.id}`)}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 px-0 py-3 rounded-xl text-sm font-bold hover:bg-slate-100 hover:text-primary active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
                <button className="flex-[3] bg-primary text-white border border-transparent px-4 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 active:scale-95 transition-all text-center">
                  Review Match
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Finder;
