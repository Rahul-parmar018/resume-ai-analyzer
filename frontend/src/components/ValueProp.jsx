import React from 'react';

const ValueProp = () => {
  const values = [
    {
      title: "Not Just Keywords",
      desc: "Traditional ATS scans for simple text. Candidex understands context and semantic meaning using deep AI matching.",
      icon: "neurology",
      badge: "Semantic Intelligence"
    },
    {
      title: "Real Gap Detection",
      desc: "Know exactly what's missing in your resume for a specific job description. We highlight the bridge you need to build.",
      icon: "rule",
      badge: "Job Alignment"
    },
    {
      title: "Instant Improvement",
      desc: "Get rewrite suggestions for your bullet points instantly. Turn weak descriptions into high-impact, quantified results.",
      icon: "bolt",
      badge: "AI Optimization"
    }
  ];

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">The Candidex Advantage</h2>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Why Candidex AI is Different</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {values.map((v, i) => (
            <div key={i} className="space-y-6 group">
              <div className="w-14 h-14 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl">{v.icon}</span>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black text-emerald-600 border border-emerald-100 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{v.badge}</span>
                <h3 className="text-2xl font-black text-slate-900">{v.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
