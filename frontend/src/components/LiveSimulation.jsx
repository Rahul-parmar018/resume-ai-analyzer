import React, { useState, useEffect } from 'react';

const LiveSimulation = () => {
  const [step, setStep] = useState(0);
  const steps = ["Reading Resume...", "Extracting Skills...", "Matching Experience...", "Contextual Analysis...", "Neural Scoring..."];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative border-t border-slate-800 w-full">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em]">Live Intelligence Demo</h2>
           <h1 className="text-white text-3xl md:text-5xl font-black">See How Candidex AI Thinks</h1>
        </div>

        {/* SIMULATION CONTAINER */}
        <div className="bg-slate-800 p-2 rounded-[3rem] shadow-[0_0_100px_rgba(16,185,129,0.1)] border border-slate-700 relative group">
           <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col md:flex-row">
              
              {/* LEFT: RESUME PREVIEW */}
              <div className="md:basis-1/2 p-8 border-b md:border-b-0 md:border-r border-slate-800 relative">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                       <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">candidate_profile.pdf</span>
                 </div>

                 <div className="space-y-6">
                    <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-slate-800 rounded animate-pulse delay-75"></div>
                    <div className="h-24 w-full bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 p-4 flex flex-col gap-3">
                       <div className="h-2 w-full bg-emerald-500/20 rounded"></div>
                       <div className="h-2 w-4/5 bg-emerald-500/10 rounded"></div>
                       <div className="h-2 w-full bg-emerald-500/20 rounded"></div>
                    </div>
                    <div className="space-y-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
                            <div className="flex-1 space-y-2 py-1">
                               <div className="h-2 w-1/3 bg-slate-800 rounded"></div>
                               <div className="h-2 w-full bg-slate-800 rounded"></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Floating status tag */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-2xl animate-pulse flex items-center gap-3 z-10">
                    <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                    {steps[step]}
                 </div>
              </div>

              {/* RIGHT: AI ANALYSIS REVEAL */}
              <div className="md:basis-1/2 p-10 bg-slate-900/50 backdrop-blur-3xl flex flex-col justify-center relative">
                 <div className="space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Overall Fitness</p>
                          <h3 className="text-3xl font-black text-white">Neural Analysis</h3>
                       </div>
                       <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center relative">
                          <span className="text-2xl font-black text-white">92<span className="text-xs text-emerald-500">%</span></span>
                          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       {[
                         { label: "Role Alignment", val: "98%", icon: "target" },
                         { label: "Technical Depth", val: "89%", icon: "bolt" },
                         { label: "Growth Potential", val: "94%", icon: "trending_up" }
                       ].map((item, i) => (
                         <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group-hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-3">
                               <span className="material-symbols-outlined text-slate-400 text-[20px]">{item.icon}</span>
                               <span className="font-bold text-sm text-slate-300">{item.label}</span>
                            </div>
                            <span className="font-black text-emerald-400">{item.val}</span>
                         </div>
                       ))}
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Strengths Detected</p>
                       <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase">Scalability</span>
                          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase">Logic Optimization</span>
                          <span className="px-3 py-1 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-[10px] font-black uppercase">+4 more</span>
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
