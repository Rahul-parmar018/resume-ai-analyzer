import React from 'react';

const ReviewCard = ({ text, author, role, rotation, delay, top, left, zIndex }) => (
  <div 
    className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white/20 absolute group hover:scale-105 transition-all duration-500 hover:z-[100] hover:bg-white animate-[fade-in_1s_ease-out_forwards] opacity-0"
    style={{ 
      transform: `rotate(${rotation}deg)`,
      animationDelay: `${delay}s`,
      top: top,
      left: left,
      zIndex: zIndex
    }}
  >
    <div className="space-y-4 max-w-[300px]">
      <div className="flex gap-1 text-emerald-400">
        {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-[18px]">star</span>)}
      </div>
      <p className="text-xl font-black text-slate-900 leading-tight italic">"{text}"</p>
      <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
          {author[0]}
        </div>
        <div>
          <p className="text-xs font-black text-slate-900 leading-none mb-1">{author}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role}</p>
        </div>
      </div>
    </div>
  </div>
);

const FloatingReviews = () => {
  const reviews = [
    { text: "Got 3 interview calls after optimizing my resume", author: "Sarah J.", role: "Software Engineer", rotation: -2, delay: 0.2, top: "5%", left: "5%", zIndex: 10 },
    { text: "Better than any resume tools I used before", author: "Marc K.", role: "Data Scientist", rotation: 1.5, delay: 0.4, top: "15%", left: "55%", zIndex: 5 },
    { text: "The rewrite suggestions are genuinely intelligence", author: "Elena R.", role: "Product Manager", rotation: -1, delay: 0.6, top: "45%", left: "10%", zIndex: 8 },
    { text: "Landed my dream job at Stripe. Thank you!", author: "David W.", role: "Backend Lead", rotation: 2, delay: 0.8, top: "35%", left: "40%", zIndex: 12 },
    { text: "Finally an AI tool that understands context", author: "Aisha T.", role: "HR Analyst", rotation: -1.5, delay: 1.0, top: "65%", left: "60%", zIndex: 6 },
    { text: "Saved me months of trial and error with applications", author: "Kevin L.", role: "UX Designer", rotation: 1, delay: 1.2, top: "75%", left: "20%", zIndex: 9 }
  ];

  return (
    <section className="py-20 px-6 bg-slate-50 relative overflow-hidden min-h-[1000px]">
      {/* Background patterns to avoid "dead" feel */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto relative h-full">
        <div className="text-center mb-40 space-y-4 relative z-20">
          <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em] opacity-40">Success Stories</h2>
          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter">Loved by Candidates & Hiring Teams</h1>
        </div>

        {/* Floating Playfield */}
        <div className="relative h-[800px] w-full mt-10">
          {reviews.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FloatingReviews;
