import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const AIRankingLanding = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            <PublicHeader />
            
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full mb-8">
                    <span className="material-symbols-outlined text-[16px] text-indigo-500 font-black">verified_user</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Decision Support System</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">AI Candidate <span className="text-indigo-600">Ranking</span></h1>
                <p className="text-slate-500 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Automatically rank candidates based on job fit, technical skills, and experience depth using cross-dimensional scoring.
                </p>
            </section>

            <section className="pb-24 px-6 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* LEFT FILTERS */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest">Global Filters</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Min. Match Score</label>
                                    <div className="flex justify-between text-xs font-bold text-slate-900 mb-2">
                                        <span>75%</span>
                                        <span className="text-indigo-600">High Bar</span>
                                    </div>
                                    <div className="w-full h-1 bg-slate-100 rounded-full relative">
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-indigo-500 rounded-full -translate-y-1/3"></div>
                                        <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Required Tech</label>
                                    {['React', 'AWS', 'Python'].map(skill => (
                                        <div key={skill} className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                            <div className="w-4 h-4 bg-indigo-500 rounded flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-[12px] font-black">check</span>
                                            </div>
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN RANKING LIST */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">Ranked Pipeline</h2>
                            <span className="text-xs font-bold text-slate-400">Sort by: <span className="text-indigo-600">Neural Fit ▼</span></span>
                        </div>

                        {[
                            { name: "John Smith", role: "Sr. Software Engineer", score: 96, skills: ["Expert", "Cloud", "Lead"], status: "Shortlisted" },
                            { name: "Emily Brown", role: "Fullstack Developer", score: 84, skills: ["Proficient", "API", "React"], status: "Review" },
                            { name: "David Miller", role: "Systems Architect", score: 71, skills: ["Specialist", "Security"], status: "Rejected" },
                        ].map((c, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                                        c.score > 90 ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-900'
                                    }`}>
                                        {c.score}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-slate-900">{c.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 italic mb-2">{c.role}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {c.skills.map(s => <span key={s} className="px-2 py-0.5 bg-slate-50 text-[9px] font-black uppercase text-slate-500 rounded">{s}</span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                                            c.status === 'Shortlisted' ? 'bg-emerald-50 text-emerald-600' : 
                                            c.status === 'Review' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                                        }`}>{c.status}</span>
                                    </div>
                                    <button className="material-symbols-outlined text-slate-300 group-hover:text-indigo-500 transition-colors">more_vert</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PublicFooter />
        </div>
    );
};

export default AIRankingLanding;
