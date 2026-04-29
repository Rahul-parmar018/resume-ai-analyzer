import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Target, 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Terminal,
  MousePointer2,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  LineChart,
  GitBranch,
  Layers
} from "lucide-react";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";

const steps = [
  {
    phase: "01. Neural Audit",
    title: "The AI Gatekeeper.",
    desc: "Your resume isn't read by humans first. It's processed by a Neural Classifier that scores your experience in milliseconds. If your vector alignment is off, you're out.",
    score: 42,
    scoreStatus: "CRITICAL",
    color: "rose",
    icon: <ShieldAlert className="w-6 h-6" />,
    stats: "42ms Processing Latency"
  },
  {
    phase: "02. Semantic Mapping",
    title: "Ownership Density.",
    desc: "We convert your career history into high-dimensional vectors. Our engine detects 'Impact Gaps' where your responsibilities lack quantified results.",
    score: 58,
    scoreStatus: "WEAK",
    color: "amber",
    icon: <Search className="w-6 h-6" />,
    stats: "128 Vector Dimensions"
  },
  {
    phase: "03. Transformer Feedback",
    title: "Predictive Analysis.",
    desc: "Bypass the 'Black Hole' of ATS. We simulate a recruiter's response using transformer-based models to predict your shortlist probability.",
    score: 74,
    scoreStatus: "STRONG",
    color: "indigo",
    icon: <BrainCircuit className="w-6 h-6" />,
    stats: "94% Accuracy Rate"
  },
  {
    phase: "04. Optimization",
    title: "The Forge.",
    desc: "Our AI Workbench injects the exact action-verbs and technical weights needed to satisfy both the machine filters and the human hiring manager.",
    score: 96,
    scoreStatus: "ELITE",
    color: "emerald",
    icon: <Sparkles className="w-6 h-6" />,
    stats: "Instant Content Sync"
  }
];

const HowItWorks = () => {
    useEffect(() => {
        document.title = "Neural Pipeline | Candidex AI";
        window.scrollTo(0, 0);
    }, []);

    const [activeStep, setActiveStep] = useState(0);

    return (
        <div className="bg-[#050508] text-white selection:bg-indigo-500/30 min-h-screen">
            <PublicHeader />
            
            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-24">
                {/* Hero Section */}
                <div className="text-center space-y-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] -z-10 rounded-full" />
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <Terminal className="w-3.5 h-3.5" /> System Architecture
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
                    >
                        THE NEURAL <br /> <span className="text-indigo-500">PIPELINE.</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic"
                    >
                        Stop guessing why you aren't getting callbacks. We built a machine-learning engine that simulates exactly how recruiters and bots see your resume.
                    </motion.p>
                </div>

                {/* Pipeline Flow (Interactive) */}
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Step Navigation */}
                    <div className="lg:col-span-5 space-y-4">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                onMouseEnter={() => setActiveStep(i)}
                                onClick={() => setActiveStep(i)}
                                className={`group cursor-pointer relative p-8 rounded-[2rem] transition-all duration-500 border ${
                                    activeStep === i 
                                    ? "bg-white/[0.03] border-white/10 shadow-2xl shadow-indigo-500/10 translate-x-2" 
                                    : "bg-transparent border-transparent opacity-40 hover:opacity-100"
                                }`}
                            >
                                <div className="flex gap-6 items-start">
                                    <div className={`p-4 rounded-2xl transition-colors duration-500 ${
                                        activeStep === i ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "bg-white/5 text-white/20"
                                    }`}>
                                        {step.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                                            activeStep === i ? "text-indigo-400" : "text-white/20"
                                        }`}>
                                            {step.phase}
                                        </h3>
                                        <h4 className="text-2xl font-black tracking-tight">{step.title}</h4>
                                        <p className="text-sm text-white/40 font-medium leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                                {activeStep === i && (
                                    <motion.div 
                                        layoutId="active-pill"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-indigo-500 rounded-r-full"
                                    />
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Step Visualizer */}
                    <div className="lg:col-span-7 sticky top-32">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                className="relative bg-[#0a0a12] border border-white/5 rounded-[3rem] p-12 overflow-hidden min-h-[500px] flex flex-col justify-between"
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -ml-32 -mb-32" />

                                <div className="relative space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                                <Cpu className="w-6 h-6 text-indigo-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Neural_Status</p>
                                                <p className="text-xs font-mono text-emerald-400">ACTIVE_SYNC_V.04</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Processing_Speed</p>
                                            <p className="text-xs font-mono text-white/60">{steps[activeStep].stats}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.85]">
                                            {steps[activeStep].title}
                                        </h2>
                                        <p className="text-xl md:text-2xl text-white/40 font-medium italic leading-relaxed">
                                            {steps[activeStep].desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Match_Score</div>
                                        <div className={`text-4xl font-black tracking-tighter text-${steps[activeStep].color}-400`}>
                                            {steps[activeStep].score}<span className="text-sm font-bold opacity-30">%</span>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl space-y-2 text-center md:text-left">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Verdict</div>
                                        <div className={`text-xs font-black uppercase tracking-widest text-${steps[activeStep].color}-400`}>
                                            {steps[activeStep].scoreStatus}
                                        </div>
                                    </div>
                                    <div className="hidden md:block col-span-2 p-6 bg-white/[0.03] border border-white/5 rounded-2xl">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Vector_Activity</div>
                                            <div className="flex gap-1">
                                                {[1,2,3,4].map(v => <div key={v} className="w-1 h-3 bg-indigo-500/30 rounded-full animate-pulse" style={{ animationDelay: `${v * 200}ms` }} />)}
                                            </div>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${steps[activeStep].score}%` }}
                                                className={`h-full bg-${steps[activeStep].color}-500/50`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="relative p-12 md:p-20 bg-gradient-to-b from-indigo-600/20 to-transparent border border-indigo-500/20 rounded-[4rem] text-center space-y-10 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/20 blur-[120px] -z-10 rounded-full" />
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">Ready to bypass the <br /> <span className="text-indigo-500">filters?</span></h2>
                        <p className="text-white/40 text-lg font-medium italic max-w-xl mx-auto">Apply the same neural logic to your resume today. Get shortlisted, not filtered.</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                        <Link to="/resume-optimizer" className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
                            Start Optimization <Sparkles className="w-4 h-4" />
                        </Link>
                        <Link to="/resume-scanner" className="px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                            Scan Free First
                        </Link>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
};

export default HowItWorks;
