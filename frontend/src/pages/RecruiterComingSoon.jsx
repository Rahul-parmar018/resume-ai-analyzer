import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers, Search, Users, Mail, ArrowRight } from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const RecruiterComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#0B0F19] min-h-screen text-white flex flex-col">
            <PublicHeader />

            <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] -z-10 rounded-full"></div>

                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl w-full text-center space-y-12"
                >
                     <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400">
                             <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                             </span>
                             <span className="text-[10px] font-black uppercase tracking-widest">Planned Phase: Recruiter Suite</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight italic uppercase">
                            Hiring <span className="text-indigo-500">Intelligence</span> v2.0
                        </h1>
                        
                        <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto italic">
                            We're currently finalizing our secondary engine for high-volume recruitment. This suite will enable semantic ranking of 500+ candidates in under 30 seconds.
                        </p>
                     </div>

                     <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                     >
                        {[
                            { icon: <Search />, name: "Semantic Search", info: "Natural language talent discovery" },
                            { icon: <Layers />, name: "Bulk Analysis", info: "Auto-scan 100+ candidates" },
                            { icon: <Users />, name: "Neural Ranking", info: "Score by job description fit" }
                        ].map((feat, i) => (
                            <motion.div 
                                key={i} 
                                variants={{
                                    hidden: { opacity: 0, scale: 0.9 },
                                    visible: { opacity: 1, scale: 1 }
                                }}
                                className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left space-y-3"
                            >
                                <div className="text-indigo-500">{feat.icon}</div>
                                <h3 className="font-bold text-sm text-white">{feat.name}</h3>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{feat.info}</p>
                            </motion.div>
                        ))}
                     </motion.div>

                     <div className="pt-10 flex flex-col items-center gap-8">
                        <div className="w-full max-w-md bg-white/[0.03] border border-white/10 p-2 rounded-2xl flex items-center shadow-2xl">
                             <input 
                                type="email" 
                                placeholder="Enter email for early access" 
                                className="bg-transparent flex-1 px-4 py-3 outline-none text-sm font-medium"
                             />
                             <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center gap-2"
                             >
                                Join Waitlist <ArrowRight className="w-4 h-4" />
                             </motion.button>
                        </div>

                        <div className="space-y-4">
                            <button 
                                onClick={() => navigate("/resume-scanner")}
                                className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-widest group"
                            >
                                Continue as Candidate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
                                🚀 Used by early candidates — recruiter tools launching next phase
                            </p>
                        </div>
                     </div>
                </motion.div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default RecruiterComingSoon;
