import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import { Link } from "react-router-dom";

const CandidateTools = () => {
    const tools = [
        { title: "Resume Scanner", desc: "Detect ATS issues instantly", link: "/resume-scanner", icon: "qr_code_scanner" },
        { title: "Skill Gap Analyzer", desc: "Find what you're missing", link: "/resume-gap-analysis", icon: "query_stats" },
        { title: "Resume Optimizer", desc: "Fix and improve instantly", link: "/resume-fixer", icon: "auto_fix_high" }
    ];

    return (
        <div className="bg-slate-50 min-h-screen">
            <PublicHeader />
            <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <h1 className="text-5xl font-black text-slate-900 mb-12 text-center">AI Resume Intelligence</h1>
                <div className="grid md:grid-cols-3 gap-8">
                    {tools.map(tool => (
                        <Link key={tool.link} to={tool.link} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                                <span className="material-symbols-outlined text-emerald-500 group-hover:text-white text-3xl">{tool.icon}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">{tool.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
            <PublicFooter />
        </div>
    );
};
export default CandidateTools;
