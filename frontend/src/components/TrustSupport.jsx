import React from 'react';

const TrustSupport = () => {
  return (
    <section className="py-20 px-6 bg-black/40 backdrop-blur-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SIDE (CONTENT) */}
        <div className="space-y-10 group">
          <div className="space-y-6">
            <h2 className="text-purple-400 font-extrabold text-xs uppercase tracking-[0.4em]">Expert Validation</h2>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter">
              Built to Help You Get <span className="text-purple-400 italic">Hired</span> — Not Just Score Resumes
            </h1>
            <p className="text-white/40 text-lg md:text-xl leading-relaxed font-medium max-w-xl">
              Data is nothing without outcomes. We focus on real-world hiring logic to ensure you actually land the interview, using technology calibrated by headhunters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
             {[
               { icon: "verified_user", text: "Calibrated by Headhunters", color: "text-purple-400" },
               { icon: "psychology", text: "Human-Logic Matching", color: "text-purple-400" }
             ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                  <span className="font-bold text-xs text-white/70">{item.text}</span>
                </div>
             ))}
          </div>
        </div>

        {/* RIGHT SIDE (REAL HUMAN ILLUSTRATION) */}
        <div className="relative group animate-float">
          {/* Main Image */}
          <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/10">
            <img 
              src="/images/resume-analysis-real.png"
              alt="Resume Analysis in Action" 
              className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
            />
            {/* Soft Ambient Fade */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0f]/30 to-transparent"></div>
          </div>

          {/* Premium Floating Badge */}
          <div className="absolute -bottom-6 -left-6 glass-panel px-6 py-4 flex items-center gap-3 animate-bounce-subtle z-10">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="material-symbols-outlined text-white text-[20px]">check_circle</span>
            </div>
            <div>
              <p className="font-black text-white leading-none mb-1 text-sm">AI Verified Insight</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-none">Headhunter Approved</p>
            </div>
          </div>

          {/* Decorative Backglow */}
          <div className="absolute -inset-4 bg-purple-500/5 blur-[50px] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

      </div>
    </section>
  );
};

export default TrustSupport;
