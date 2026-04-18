import React from 'react';

const RejectionReasoning = ({ score, missingSkills = [] }) => {
  const reasons = [
    { 
      title: "No Measurable Impact", 
      desc: "Your experience bullets lack quantitative results (%, $, #). Recruiters prioritize documented outcomes.",
      icon: "trending_down",
      show: score < 70
    },
    { 
      title: "Weak Tech Alignment", 
      desc: `Missing ${missingSkills.length > 0 ? missingSkills.slice(0, 2).join(' & ') : 'core stack'} requirements. You are currently filtered out by automated screeners.`,
      icon: "code_off",
      show: missingSkills.length > 0
    },
    { 
      title: "ATS Structural Flaws", 
      desc: "Complex layouts or non-standard fonts are making your resume unreadable to enterprise ATS platforms.",
      icon: "summarize",
      show: score < 50
    }
  ].filter(r => r.show);

  if (reasons.length === 0) return null;

  return (
    <div className="bg-rose-50 border border-rose-100 p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-xl hover:shadow-rose-500/5 transition-all">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
            <span className="material-symbols-outlined text-[20px]">psychology_alt</span>
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-lg font-headline leading-none">Why You Are Rejected</h3>
            <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1">AI Rejection Simulator</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-rose-200">
             <span className="text-[10px] font-black text-slate-400">Confidence:</span>
             <span className="text-[10px] font-black text-rose-600">89%</span>
          </div>
        </div>

        <div className="space-y-4">
          {reasons.map((reason, i) => (
            <div key={i} className="flex gap-4">
              <span className="material-symbols-outlined text-rose-500 text-lg mt-0.5">{reason.icon}</span>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">{reason.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{reason.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RejectionReasoning;
