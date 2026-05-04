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
    <section className="py-20 px-6 bg-transparent text-white relative border-y border-white/5">
      {/* Static Technical Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px:30px] opacity-40"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 relative z-10">

        {/* LEFT SIDE (COMPACT FEATURE TABS) */}
        <div className="lg:flex-[0.5] space-y-10 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="voxr-glass-label w-fit">
              Neural Infrastructure v4.0
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Intelligence <br />
              <span className="text-white/30 italic font-serif">Built Different.</span>
            </h1>
            <p className="text-white/40 text-xl font-medium max-w-md leading-relaxed">
              We've moved beyond keywords. Our semantic engine understands the technical nuance of your experience at a vector level.
            </p>
          </div>

          <div className="relative space-y-3">
            {/* Subtle Connection Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-[1px] bg-white/10"></div>

            {tabs.map((tab, i) => {
              const isActive = activeTab === i;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveTab(i)}
                  className={`group relative pl-14 transition-all duration-300 ${isActive ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
                >
                  {/* Progress Marker */}
                  <div className={`absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border transition-all duration-300 z-10 ${isActive ? "bg-purple-500 border-purple-400 scale-125 shadow-[0_0_10px_rgba(168,85,247,0.5)]" : "bg-[#0a0a0f] border-white/20"
                    }`}></div>

                  <div className={`p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer ${isActive
                      ? "bg-white/5 border-purple-500/30 shadow-xl shadow-purple-500/5"
                      : "border-transparent hover:border-white/5"
                    }`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-white/5 text-white/40"
                      }`}>
                      <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-black text-base transition-colors ${isActive ? "text-white" : "text-white/60"}`}>
                        {tab.title}
                      </h4>
                      <p className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isActive ? "text-purple-400" : "text-white/30"}`}>
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
          <div className="glass-panel p-1 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none">engine.sys.v4.0</span>
              </div>
            </div>

            <div className="p-8 lg:p-10 space-y-8 min-h-[400px] flex flex-col justify-center relative bg-black/20">
              <div className="space-y-3">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block">Input_Stream</span>
                <p className="text-xl lg:text-2xl font-mono text-white/60 leading-tight italic tracking-tighter">
                  "{tabs[activeTab].desc.split('.')[0]}..."
                </p>
              </div>

              <div className="space-y-4">
                <div className="h-px bg-white/5 w-full"></div>
                <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest block">Neural_Mapping_Engine</span>

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
                      {tabs[activeTab].title.split(' ')[0]} <br />
                      <span className="text-purple-400">{tabs[activeTab].title.split(' ').slice(1).join(' ')}</span>
                    </p>
                    <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.2em] pt-4">Status: Finalized</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-6 right-6 opacity-5">
                <span className="material-symbols-outlined text-[60px]">hub</span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="absolute bottom-4 right-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg shadow-purple-500/10">
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
