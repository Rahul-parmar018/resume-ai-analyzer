import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";

const RecruiterTools = () => {
    const tools = [
        { 
            title: "Bulk Resume Scanner", 
            tagline: "Process 150+ resumes and get ranked results instantly",
            desc: "Automate your high-volume candidate screening with neural parsing that detects talent in seconds.", 
            link: "/bulk-scanner", 
            icon: "stacks" 
        },
        { 
            title: "AI Candidate Ranking", 
            tagline: "Identify top candidates using AI scoring",
            desc: "Go beyond keywords. Rank your talent pool based on deep semantic alignment with your job profile.", 
            link: "/ai-ranking", 
            icon: "leaderboard" 
        },
        { 
            title: "Semantic Search", 
            tagline: "Find candidates using natural language queries",
            desc: "Search your database like you're talking to a colleague. Find the right person using plain English.", 
            link: "/semantic-search", 
            icon: "saved_search" 
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <PublicHeader />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Recruiting Intelligence Hub</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">State-of-the-art AI infrastructure designed for modern talent acquisition teams.</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {tools.map(tool => (
                        <Link key={tool.title} to={tool.link} className="group h-full">
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all hover:-translate-y-2 border border-slate-50 flex flex-col h-full relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-slate-900 -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                                
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 rotate-0 group-hover:-rotate-6 transition-transform shadow-lg">
                                    <span className="material-symbols-outlined text-white text-3xl">{tool.icon}</span>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className="text-2xl font-black text-slate-900 mb-1">{tool.title}</h3>
                                    <p className="text-xs font-black text-indigo-500 uppercase tracking-widest">{tool.tagline}</p>
                                </div>
                                
                                <p className="text-slate-500 font-medium leading-relaxed mb-8 text-sm">{tool.desc}</p>
                                
                                <div className="mt-auto inline-flex items-center gap-2 text-slate-900 font-black text-sm group-hover:gap-4 transition-all">
                                    Explore 
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};
export default RecruiterTools;
