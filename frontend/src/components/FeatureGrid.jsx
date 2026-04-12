import React from 'react';

const FeatureGrid = () => {
  const features = [
    { title: "Resume Score (ATS + AI)", desc: "A dual-layered scoring system that considers both machine parsing and human-like semantic reasoning.", icon: "speed" },
    { title: "Skill Gap Detection", desc: "Automated extraction of required vs. preferred skills to show you exactly where you fall short.", icon: "emergency" },
    { title: "JD Matching", desc: "Neural alignment that matches your career trajectory with the job's growth path.", icon: "join_inner" },
    { title: "AI Rewrite Suggestions", desc: "Context-aware enhancements for your bullet points using professional recruiter language.", icon: "edit_note" },
    { title: "Confidence Score", desc: "A reliability indicator that shows how certain the AI is about your match for a role.", icon: "verified" },
    { title: "Improvement Tracking", desc: "Watch your score grow over time as you apply AI suggestions and polish your profile.", icon: "trending_up" }
  ];

  return (
    <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em]">Deep Dive</h2>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Everything You Need to Optimize</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
              <span className="material-symbols-outlined text-emerald-400 text-3xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</span>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
