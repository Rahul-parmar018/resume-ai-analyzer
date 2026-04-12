import React from 'react';

const ReviewCard = ({ text, name, delay }) => (
  <div 
    className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 hover:-translate-y-2 group animate-fade-in"
    style={{ animationDelay: `${delay}s`, opacity: 0, animationFillMode: 'forwards' }}
  >
    <div className="flex gap-1 text-emerald-400 mb-4 group-hover:scale-105 transition-transform origin-left">
      {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[18px]">star</span>)}
    </div>
    <p className="text-slate-700 font-bold leading-relaxed mb-6 italic">"{text}"</p>
    <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
        {name[0]}
      </div>
      <div>
        <p className="text-xs font-black text-slate-900 leading-none mb-1">{name}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Verified Candidate</p>
      </div>
    </div>
  </div>
);

const ReviewSection = () => {
  const reviews = [
    { text: "Got shortlisted in 3 days after optimizing my resume.", name: "Rahul S." },
    { text: "Finally a tool that understands context, not just keywords.", name: "Ankit P." },
    { text: "Saved hours of manual editing. Worth it.", name: "Priya M." },
    { text: "Better than ATS checkers I used before.", name: "Dev K." },
    { text: "Helped me identify real gaps in my resume.", name: "Sneha R." },
    { text: "The rewrite feature is insanely useful.", name: "Aman T." }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-emerald-500 font-extrabold text-xs uppercase tracking-[0.4em]">Success Stories</h2>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Loved by Candidates & Hiring Teams</h1>
        </div>

        {/* REVIEW GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <ReviewCard key={i} {...r} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
