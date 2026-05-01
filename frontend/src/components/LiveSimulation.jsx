import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveSimulation = () => {
  const [step, setStep] = useState(0);
  const steps = ["Reading Resume...", "Extracting Skills...", "Matching Experience...", "Contextual Analysis...", "Neural Scoring..."];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="py-24 bg-transparent overflow-hidden relative border-t border-white/5 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em]">Live Intelligence Demo</h2>
           <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight">See How Candidex AI Thinks</h1>
        </div>

        {/* SIMULATION CONTAINER */}
        <div className="bg-white/10 p-2 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.2)] border border-white/20 relative group backdrop-blur-xl">
           <div className="bg-[#0f172a]/80 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col md:flex-row border border-white/10">
              
              {/* LEFT: RESUME PREVIEW */}
              <div className="md:basis-1/2 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 relative">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-white/30"></div>
                       <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    </div>
                    <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">candidate_profile.pdf</span>
                 </div>

                 <div className="space-y-6">
                    <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-white/20 rounded animate-pulse delay-75"></div>
                    <div className="h-24 w-full bg-white/10 rounded-2xl border border-dashed border-white/30 p-4 flex flex-col gap-3">
                       <div className="h-2 w-full bg-emerald-500/40 rounded"></div>
                       <div className="h-2 w-4/5 bg-emerald-500/20 rounded"></div>
                       <div className="h-2 w-full bg-emerald-500/40 rounded"></div>
                    </div>
                    <div className="space-y-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/20"></div>
                            <div className="flex-1 space-y-2 py-1">
                               <div className="h-2 w-1/3 bg-white/20 rounded"></div>
                               <div className="h-2 w-full bg-white/20 rounded"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Floating status tag */}
                 <motion.div 
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:right-5 bg-emerald-500 text-white px-4 md:px-6 py-3 rounded-2xl font-black text-xs md:text-sm shadow-2xl animate-pulse flex items-center gap-3 z-10 w-[80%] md:w-auto justify-center"
                 >
                    <span className="material-symbols-outlined text-[16px] md:text-[20px] animate-spin">sync</span>
                    {steps[step]}
                 </motion.div>
              </div>

              {/* RIGHT: AI ANALYSIS REVEAL */}
              <div className="md:basis-1/2 p-6 md:p-10 bg-black/20 backdrop-blur-3xl flex flex-col justify-center relative shadow-inner">
                 <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Overall Fitness</p>
                          <h3 className="text-3xl font-black text-white">Neural Analysis</h3>
                       </div>
                       <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center relative">
                          <span className="text-2xl font-black text-white">92<span className="text-xs text-emerald-500">%</span></span>
                          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       {[
                         { label: "Role Alignment", val: "98%", icon: "target" },
                         { label: "Technical Depth", val: "89%", icon: "bolt" },
                         { label: "Growth Potential", val: "94%", icon: "trending_up" }
                       ].map((item, i) => (
                         <div key={i} className="bg-white/10 border border-white/10 p-4 rounded-2xl flex items-center justify-between group-hover:border-emerald-500/50 hover:bg-white/20 transition-all shadow-sm">
                            <div className="flex items-center gap-3">
                               <span className="material-symbols-outlined text-white/70 text-[20px]">{item.icon}</span>
                               <span className="font-bold text-sm text-white">{item.label}</span>
                            </div>
                            <span className="font-black text-emerald-400">{item.val}</span>
                         </div>
                       ))}
                    </div>

                    <div className="pt-6 border-t border-white/10">
                       <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-4">Core Strengths Detected</p>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-black uppercase">Scalability</span>
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-black uppercase">Logic Optimization</span>
                          <span className="px-3 py-1 bg-white/10 text-white/80 border border-white/20 rounded-lg text-[10px] font-black uppercase">+4 more</span>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </div>
    </section>
  );
};

export default LiveSimulation;
