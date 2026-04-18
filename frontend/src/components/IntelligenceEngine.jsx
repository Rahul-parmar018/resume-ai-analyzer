import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IntelligenceEngine = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "AI Content Generation", desc: "Instantly turn bullet points into high-impact action statements.", icon: "auto_fix_high" },
    { title: "Resume Parsing", desc: "Extract every detail with 99% accuracy across templates.", icon: "document_scanner" },
    { title: "Skill Intelligence", desc: "Map your hidden skills to job requirements semantically.", icon: "hub" },
    { title: "JD Matching", desc: "Know exactly how you fit based on neural job data.", icon: "target" }
  ];

  return (
    <section className="py-20 px-6 bg-[#0B0F19] text-white relative border-y border-white/5">
      {/* Static Technical Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:30px:30px] opacity-[0.03]"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 relative z-10">
        
        {/* LEFT SIDE (COMPACT FEATURE TABS) */}
        <div className="lg:flex-[0.5] space-y-8 flex flex-col justify-center">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Neural Infrastructure v2.4</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                Intelligence <br/>
                <span className="text-slate-600">Built Different.</span>
              </h1>
              <p className="text-slate-400 text-base font-medium max-w-md">
                We've moved beyond keywords. Our semantic engine understands the technical nuance of your experience.
              </p>
           </div>

           <div className="relative space-y-3">
              {/* Subtle Connection Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-[1px] bg-slate-800"></div>

              {tabs.map((tab, i) => {
                const isActive = activeTab === i;
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setActiveTab(i)}
                    className={`group relative pl-14 transition-all duration-300 ${isActive ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
                  >
                    {/* Progress Marker */}
                    <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border transition-all duration-300 z-10 ${
                      isActive ? "bg-emerald-500 border-emerald-400 scale-125" : "bg-slate-900 border-slate-700"
                    }`}></div>

                    <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer ${
                      isActive 
                        ? "bg-white/[0.03] border-emerald-500/30 shadow-xl" 
                        : "border-transparent hover:border-white/5"
                    }`}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isActive ? "bg-emerald-500 text-white" : "bg-white/5 text-slate-500"
                      }`}>
                        <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                      </div>
                      <div>
                        <h4 className={`font-black text-base transition-colors ${isActive ? "text-white" : "text-slate-400"}`}>
                          {tab.title}
                        </h4>
                        <p className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-emerald-400/80" : "text-slate-600"}`}>
                          {tab.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* RIGHT SIDE (ANCHORED TERMINAL) */}
        <div className="lg:flex-[0.5] flex flex-col justify-center">
           <div className="bg-[#0F1420] p-1 rounded-2xl shadow-2xl border border-white/5 relative overflow-hidden">
              <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                 <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest leading-none">engine.sys.v4.0</span>
                 </div>
              </div>

              <div className="p-8 lg:p-10 space-y-8 min-h-[400px] flex flex-col justify-center relative">
                 <div className="space-y-3">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block">Input_Stream</span>
                    <p className="text-xl lg:text-2xl font-mono text-slate-500 leading-tight italic tracking-tighter">
                       "{tabs[activeTab].desc.split('.')[0]}..."
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div className="h-px bg-white/5 w-full"></div>
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block">Neural_Mapping_Engine</span>
                    
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-1"
                      >
                         <p className="text-3xl lg:text-5xl font-black text-white leading-none tracking-tighter">
                            {tabs[activeTab].title.split(' ')[0]} <br/>
                            <span className="text-emerald-400">{tabs[activeTab].title.split(' ').slice(1).join(' ')}</span>
                         </p>
                         <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] pt-4">Status: Finalized</p>
                      </motion.div>
                    </AnimatePresence>
                 </div>

                 {/* Corner Accent */}
                 <div className="absolute top-6 right-6 opacity-5">
                    <span className="material-symbols-outlined text-[60px]">hub</span>
                 </div>
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-2">
                 <span className="material-symbols-outlined text-sm">verified</span>
                 <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default IntelligenceEngine;
