import { useState } from "react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { useAuth } from "../components/AuthProvider";

const SemanticSearchLanding = () => {
    const { user, profile } = useAuth();
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSearch = async () => {
        if (!user) return alert("Please sign in first.");
        if (profile?.role !== 'recruiter') {
            return alert("Access Denied: AI Talent Search is exclusive to Recruiters.");
        }
        if (!query.trim()) return alert("Please enter a search query.");

        try {
            setLoading(true);
            const token = await user.getIdToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/semantic-search/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ query })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Search failed");
            }

            const data = await res.json();
            setResults(data);
        } catch (err) {
            console.error(err);
            alert(err.message || "Error performing neural search. Ensure you have analyzed some candidates first.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <PublicHeader />
            
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full mb-8">
                    <span className="material-symbols-outlined text-[16px] text-indigo-500 font-black">neurology</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Phase 3: Embedding Discovery</span>
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter italic">Semantic <span className="bg-gradient-to-r from-emerald-500 to-indigo-600 bg-clip-text text-transparent">Talent Search</span></h1>
                <p className="text-slate-500 font-medium text-lg md:text-2xl max-w-3xl mx-auto leading-tight">
                    Search your candidate pool using natural language. Find talent based on actual project depth and context, not just keywords.
                </p>
                
                <div className="mt-16 max-w-4xl mx-auto">
                    {/* SEARCH BAR */}
                    <div className="bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border border-white/10 group focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <div className="pl-6 py-4 flex-1 text-left">
                            <span className="text-indigo-400 font-black text-[9px] uppercase tracking-widest block mb-1">Neural Query Engine</span>
                            <div className="relative">
                                <input 
                                    type="text"
                                    className="w-full bg-transparent border-none text-white text-xl md:text-2xl font-black tracking-tight focus:outline-none placeholder:text-slate-700"
                                    placeholder="e.g., Senior React dev with AWS experience..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            className="bg-indigo-500 text-white h-16 w-16 md:h-20 md:w-20 rounded-[1.8rem] flex items-center justify-center hover:bg-indigo-400 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <span className="material-symbols-outlined text-3xl font-black">query_stats</span>
                            )}
                        </button>
                    </div>
                    {/* HINT */}
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Try phrases like: "Experienced node.js architect" or "Backend expert with microservices knowledge"</p>
                </div>
            </section>

            <section className="pb-24 px-6 max-w-7xl mx-auto">
                {!results && !loading && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No Active Results</p>
                    </div>
                )}

                {loading && (
                    <div className="grid lg:grid-cols-3 gap-8 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-50 rounded-[2.5rem] border border-slate-100"></div>
                        ))}
                    </div>
                )}

                {results && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {results.length > 0 ? (
                            results.map((c, i) => (
                                <div key={i} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6 hover:bg-white hover:shadow-2xl transition-all group">
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-xs text-white">#0{i+1}</div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-2">Match Found</span>
                                            <span className="text-[9px] font-black uppercase text-indigo-400">Confidence: {c.score}%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2 truncate" title={c.candidate}>{c.candidate}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium mb-4">{c.reason}</p>
                                        
                                        <div className="pt-4 border-t border-slate-200">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Top Identified Skills</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {c.skills.map(s => (
                                                    <span key={s} className="px-3 py-1 bg-white text-[9px] font-black uppercase text-slate-600 rounded-lg border border-slate-100 shadow-sm">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="lg:col-span-3 text-center py-20">
                                <p className="text-slate-400 font-bold">No candidates found matching that specific phrase. Try adjusting your search query.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            <PublicFooter />
        </div>
    );
};

export default SemanticSearchLanding;
