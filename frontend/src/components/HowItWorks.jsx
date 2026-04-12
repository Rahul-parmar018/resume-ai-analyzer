import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Upload Resume",
      desc: "Drag and drop your PDF or DOCX file. Our engine parses it in seconds.",
      icon: "upload_file",
      color: "bg-blue-50 text-blue-600"
    },
    {
      number: "02",
      title: "AI Analysis",
      desc: "Our neural engine scans your profile against deep job requirements.",
      icon: "psychology",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      number: "03",
      title: "Get Insights",
      desc: "Receive a ranked shortlist of gaps and instant rewrite suggestions.",
      icon: "auto_awesome",
      color: "bg-indigo-50 text-indigo-600"
    }
  ];

  return (
    <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] opacity-40">The Process</h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">See How Candidex AI Works</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-0"></div>

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 group">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center space-y-6">
                <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                  <span className="material-symbols-outlined text-3xl font-bold">{step.icon}</span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Step {step.number}</span>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-semibold">{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Animated Demo Placeholder (PHASE 4) */}
        <div className="mt-20 bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-slate-800 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none"></div>
           <div className="bg-slate-800/50 rounded-[2rem] border border-slate-700/50 overflow-hidden aspect-video flex items-center justify-center relative">
              <div className="absolute top-4 left-6 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
              </div>
              <div className="text-center space-y-4 px-10 animate-pulse-subtle">
                 <span className="material-symbols-outlined text-6xl text-slate-700">slow_motion_video</span>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Interactive Demo Interface Loading...</p>
                 <div className="flex gap-2 justify-center">
                    <div className="h-1.5 w-12 bg-slate-700 rounded-full"></div>
                    <div className="h-1.5 w-8 bg-slate-700 rounded-full"></div>
                    <div className="h-1.5 w-16 bg-slate-700 rounded-full"></div>
                 </div>
              </div>
              
              {/* Floating UI Elements (Simulated) */}
              <div className="absolute top-1/2 right-10 bg-white shadow-2xl rounded-2xl p-4 scale-75 lg:scale-100 opacity-90 border border-slate-100 animate-float">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black text-[10px]">94%</div>
                    <div className="text-left"><p className="text-[10px] font-bold leading-none">Match Found</p><p className="text-[8px] text-slate-400">Software Engineer</p></div>
                 </div>
                 <div className="space-y-1.5">
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden"><div className="w-4/5 h-full bg-emerald-400"></div></div>
                    <div className="h-1 w-full bg-slate-100 rounded-full opacity-50"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
