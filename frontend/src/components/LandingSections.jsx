import React from 'react';
import { Link } from 'react-router-dom';

export const RecruiterShowcase = () => (
  <section className="py-20 px-6 bg-white border-b border-slate-100">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-16">
      <div className="lg:basis-1/2 space-y-10">
        <div className="space-y-4">
          <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em]">For Talent Teams</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.05]">
            For Recruiters & Hiring Teams
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl">
            Streamline your recruitment workflow with AI-powered batch screening, semantic ranking, and detailed candidate insights.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            { icon: "group_add", title: "Analyze 100+ Instantly", desc: "Process entire candidate pools in a single batch upload." },
            { icon: "leaderboard", title: "Rank with AI", desc: "Get an objective ranking based on semantic merit." },
            { icon: "file_export", title: "Export Insights", desc: "Download JSON/CSV reports for your ATS system." },
            { icon: "verified", title: "Bias-Free Scoring", desc: "Ensure diverse hiring with demographic-blind analysis." }
          ].map((v, i) => (
            <div key={i} className="flex gap-4">
              <span className="material-symbols-outlined text-indigo-600 font-bold">{v.icon}</span>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">{v.title}</h4>
                <p className="text-slate-500 text-[11px] font-medium leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
           <Link to="/register">
             <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1">
               Explore Hiring Tools
             </button>
           </Link>
        </div>
      </div>
      
      <div className="lg:basis-1/2 w-full">
         <div className="relative group animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl relative overflow-hidden">
               <img 
                 src="/images/recruiter-showcase.png" 
                 className="w-full rounded-[2rem] aspect-video object-cover group-hover:scale-105 transition-transform duration-700" 
                 alt="Recruiter Dashboard" 
               />
               <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply opacity-20"></div>
            </div>
            
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 space-y-3 hidden sm:block z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Scanned Today</p>
               <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-slate-900">1,200+</span>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-full">+14.2%</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const FinalCTA = () => (
  <section className="py-24 px-6 bg-slate-900 relative overflow-hidden text-center rounded-t-[4rem]">
    {/* Dynamic Background Elements */}
    <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:40px_40px] opacity-20"></div>
    
    {/* Animated Blobs */}
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/30 rounded-full animate-pulse-glare"></div>
    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/30 rounded-full animate-pulse-glare" style={{ animationDelay: '2s' }}></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
    
    {/* 3D Glass Objects (True Motion) */}
    <div className="absolute top-24 left-[10%] w-16 h-16 bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 animate-orbit opacity-60 hidden lg:block"></div>
    <div className="absolute bottom-24 right-[10%] w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 animate-orbit opacity-60 hidden lg:block" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
    <div className="absolute top-1/2 right-[15%] w-10 h-10 bg-emerald-400/20 backdrop-blur-2xl rounded-full animate-float-up opacity-40"></div>

    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
      <div className="space-y-4">
        <h2 className="text-emerald-400 font-black text-xs uppercase tracking-[0.5em] mb-4">Final Step</h2>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95]">
          Ready to Improve Your <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">Resume?</span>
        </h1>
      </div>
      
      <div className="flex flex-col items-center gap-8">
        <Link to="/register">
          <button className="group relative bg-white text-slate-900 px-16 py-7 rounded-[2rem] font-black text-2xl hover:bg-slate-50 transition-all shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:-translate-y-2 flex items-center gap-4 overflow-hidden">
             <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
             Upload Resume Now
             <span className="material-symbols-outlined text-emerald-500 group-hover:translate-x-3 transition-transform">arrow_forward</span>
          </button>
        </Link>
        <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.4em] opacity-60">No credit card required • Instant Results</p>
      </div>
    </div>
  </section>
);
