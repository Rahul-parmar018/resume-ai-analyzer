import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Zap, Search, ShieldCheck } from "lucide-react";
import PublicHeader from "../../components/PublicHeader";
import PublicFooter from "../../components/PublicFooter";

const ResourceTemplate = ({ title, subtitle, content, keywords }) => {
    return (
        <div className="bg-white min-h-screen font-body selection:bg-blue-100">
            <PublicHeader />
            
            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-6">
                            {title}<span className="text-blue-600">.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 font-medium italic mb-10">
                            {subtitle}
                        </p>
                        <Link to="/resume-scanner">
                            <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 mx-auto">
                                Start Free Scan <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="max-w-3xl mx-auto prose prose-slate prose-lg lg:prose-xl">
                        {content}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-20 max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1)_0%,transparent_70%)] pointer-events-none"></div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-6 relative z-10">Beat the Recruiters Today.</h2>
                        <p className="text-slate-400 text-lg mb-8 relative z-10">Don't let a machine reject your dreams. Use our {title.toLowerCase()} to get shortlisted.</p>
                        <Link to="/resume-scanner" className="relative z-10">
                            <button className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
                                Analyze Results in 10s
                            </button>
                        </Link>
                    </div>
                    
                    {/* Keywords Tag Cloud for SEO */}
                    <div className="mt-20 text-center opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Index_Tags: {keywords.join(', ')}</p>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default ResourceTemplate;
