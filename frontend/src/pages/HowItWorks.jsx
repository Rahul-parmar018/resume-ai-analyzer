import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Target, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  Sparkles, 
  Search, 
  Layers, 
  Dna,
  Terminal,
  TrendingUp,
  MousePointer2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const steps = [
  {
    phase: "AUDIT",
    title: "THE AI GATEKEEPER.",
    desc: "You aren't applying to humans. You're applying to an LLM-based classifier that scores your experience in milliseconds.",
    score: 42,
    scoreStatus: "CRITICAL",
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/20",
    icon: <ShieldAlert className="w-8 h-8" />
  },
  {
    phase: "GAP ANALYSIS",
    title: "IT SCORES YOU.",
    desc: "Your history is converted into semantic vectors. If your 'Ownership Density' is low, the machine flags you as high-risk.",
    score: 58,
    scoreStatus: "WEAK",
    colorClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/20",
    icon: <Search className="w-8 h-8" />
  },
  {
    phase: "MODERN REJECTION",
    title: "IT REJECTS YOU.",
    desc: "Without quantified impact, you're invisible. Simple keyword stuffing fails against modern transformer-based filters.",
    score: 31,
    scoreStatus: "REJECTED",
    colorClass: "text-rose-600",
    bgClass: "bg-rose-600/10",
    borderClass: "border-rose-600/20",
    icon: <Activity className="w-8 h-8" />
  },
  {
    phase: "OPTIMIZATION",
    title: "YOU FIX IT.",
    desc: "We rewrite your resume to align with machine context. We inject the exact metrics and action-verbs the model requires.",
    score: 84,
    scoreStatus: "STRONG",
    colorClass: "text-indigo-400",
    bgClass: "bg-indigo-400/10",
    borderClass: "border-indigo-400/20",
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    phase: "SHORTLIST",
    title: "YOU DOMINATE.",
    desc: "The result is a High-Confidence Match. Your resume bypasses the bots and lands directly in front of the hiring lead.",
    score: 96,
    scoreStatus: "ELITE",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    icon: <ShieldCheck className="w-8 h-8" />
  }
];

const NAV_H = 72; // Normalized navbar height in px

const HowItWorks = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [activeIndex, setActiveIndex] = useState(0);

    // Precise scroll switching
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const step = Math.min(
            Math.floor(latest * steps.length),
            steps.length - 1
        );
        if (step !== activeIndex) setActiveIndex(step);
    });

    useEffect(() => {
        document.title = "Neural Pipeline | Candidex AI";
        window.scrollTo(0, 0);
    }, []);

    const currentStep = steps[activeIndex];

    return (
        <div className="bg-[#0B0F19] selection:bg-emerald-500/10 min-h-screen">
            
            {/* 1. FIXED NAV COMPONENT */}
            <div className={`fixed top-0 left-0 w-full z-50 h-[${NAV_H}px]`}>
                <PublicHeader />
            </div>

            {/* 2. THE TOTAL SCROLL VOLUME (5x Sections) */}
            <div ref={containerRef} className="h-[500vh] relative">
                
                {/* 3. THE STICKY VIEWPORT (LOCKED TO SCREEN MINUS NAV) */}
                <div 
                    className="sticky flex w-full"
                    style={{ 
                        top: `${NAV_H}px`, 
                        height: `calc(100vh - ${NAV_H}px)` 
                    }}
                >
                    {/* Perspective Background (Nested inside sticky) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.08)_0%,transparent_70%)] pointer-events-none -z-10"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none -z-10"></div>

                    {/* LEFT: PROGRESS SYNC (18%) */}
                    <aside className="hidden lg:flex w-[18%] h-full p-12 flex-col justify-center gap-12 border-r border-white/5 relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Engine_Sync</h3>
                            <p className="text-xl font-black italic tracking-tighter text-white">Pipeline v4</p>
                        </div>

                        <div className="space-y-8">
                            {steps.map((s, i) => (
                                <div key={i} className="flex items-center gap-4 transition-all duration-500">
                                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= activeIndex ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-white/10'}`}></div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${i === activeIndex ? 'text-white translate-x-1' : 'text-slate-600'}`}>
                                        {s.phase}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* CENTER: NARRATIVE ENGINE (64%) */}
                    <main className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 relative z-10 w-full overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="space-y-6 md:space-y-10 max-w-3xl"
                            >
                                <div className="space-y-4 md:space-y-6">
                                    <div className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full ${currentStep.colorClass}`}>
                                        {currentStep.icon}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{currentStep.phase}</span>
                                    </div>
                                    <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase italic break-words">
                                        {currentStep.title.split('.')[0]}<span className="text-indigo-600">.</span>
                                    </h1>
                                    <p className="text-lg md:text-xl lg:text-3xl text-slate-400 font-medium italic leading-tight max-w-2xl">
                                        {currentStep.desc}
                                    </p>
                                </div>

                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[3rem] backdrop-blur-xl group relative overflow-hidden"
                                >
                                     <div className="flex items-center gap-4 md:gap-6">
                                          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-500">
                                              <Terminal className="w-5 h-5 md:w-6 md:h-6" />
                                          </div>
                                          <div className="min-w-0">
                                              <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 truncate">Live_Processing_Log</p>
                                              <p className="text-xs md:text-sm font-mono text-indigo-400 italic truncate">Executing {currentStep.phase.toLowerCase().replace(' ', '_')}...</p>
                                          </div>
                                     </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    {/* RIGHT: INSIGHTS SYNC (18%) */}
                    <aside className="hidden lg:flex w-[18%] h-full p-12 flex-col justify-center gap-12 border-l border-white/5 relative z-10 bg-[#0B0F19]/50 backdrop-blur-sm">
                        <div className="space-y-12">
                            <div className="space-y-4 text-center">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Prediction</p>
                                <motion.div 
                                    key={currentStep.score}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    <p className={`text-7xl font-black italic tracking-tighter transition-colors duration-500 ${currentStep.colorClass}`}>
                                        {currentStep.score}<span className="text-2xl font-bold">%</span>
                                    </p>
                                    <motion.p 
                                        key={currentStep.scoreStatus}
                                        initial={{ y: 5, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className={`text-[9px] font-black uppercase tracking-[0.3em] mt-2 ${currentStep.colorClass}`}
                                    >
                                        {currentStep.scoreStatus}
                                    </motion.p>
                                </motion.div>
                            </div>

                            <div className="h-px w-full bg-white/5"></div>

                            <div className="space-y-6">
                                 <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-[10px] font-bold text-slate-400 leading-relaxed italic">
                                     Shortlist likelihood for <span className="text-white">{currentStep.phase}</span>. Benchmarked against elite technical job descriptions.
                                 </div>

                                 <Link to="/resume-scanner" className="block outline-none">
                                    <button className="w-full bg-white text-slate-900 py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:scale-[1.02] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2 group">
                                        Analyze My Score <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                 </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* 4. PUBLIC FOOTER (OUTSIDE SCROLL VOLUME) */}
            <div className="relative z-50">
                <PublicFooter />
            </div>

        </div>
    );
};

export default HowItWorks;
