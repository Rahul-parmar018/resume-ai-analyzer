import React, { useState, useEffect } from 'react';
import CountUp from 'react-countup';

const StatCard = ({ number, label, suffix = "", duration = 2.5, delay = 0 }) => (
  <div 
    className="group relative p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-accent/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden animate-float"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    <div className="relative z-10 text-center lg:text-left">
      <h3 className="text-5xl font-black text-primary mb-2 flex items-center justify-center lg:justify-start gap-1">
        <CountUp end={number} duration={duration} enableScrollSpy scrollSpyOnce />
        <span className="text-accent">{suffix}</span>
      </h3>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{label}</p>
    </div>
    <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent/5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);

const TrustedEcosystem = () => {
  const [liveActivity, setLiveActivity] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveActivity(prev => {
        const next = prev + (Math.random() > 0.4 ? 1 : -1);
        return Math.max(5, next);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background Animated Motion */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-50/50 via-transparent to-transparent animate-pulse pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* LEFT SIDE: Animated Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 order-2 lg:order-1">
            <StatCard number={50} suffix="K+" label="Resumes Analyzed" delay={0} />
            <StatCard number={92} suffix="%" label="Match Accuracy" delay={1} />
            <StatCard number={3} suffix="X" label="Faster Decisions" delay={0.5} />
            <StatCard number={15} suffix="+" label="Global Regions" delay={1.5} />
            
            {/* Live Activity Tracker */}
            <div className="col-span-2 flex items-center justify-center gap-3 py-4 bg-slate-900 rounded-2xl text-white shadow-xl shadow-primary/20">
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
               </span>
               <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-1000">
                 Current Flow: <span className="text-emerald-400">+{liveActivity}</span> candidates per minute
               </p>
            </div>
          </div>

          {/* RIGHT SIDE: Strong Messaging (NO BG BOX) */}
          <div className="flex flex-col items-start space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-widest leading-none shadow-sm">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                AI-Powered Precision
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                Powering Smarter Hiring Decisions with AI
              </h2>
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium max-w-xl">
                Eliminate manual screening and unlock the true potential of your talent pool. Candidex AI processes resumes semantically, ensuring no top candidate is ever missed.
              </p>
            </div>

            <ul className="space-y-5 w-full">
              {[
                { icon: "analytics", text: "Analyze resumes beyond keywords" },
                { icon: "visibility", text: "Understand real candidate potential" },
                { icon: "security_update_good", text: "Make confident hiring decisions" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-5 group">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-slate-100">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <span className="font-bold text-slate-700 text-lg group-hover:text-slate-900 group-hover:translate-x-1 transition-all">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 w-full md:w-auto">
               <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 group w-full btn-glow">
                 See How It Works
                 <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
               </button>
            </div>
          </div>
        </div>

        {/* Visible SEO Paragraph */}
        <div className="mt-24 pt-12 border-t border-slate-100 text-center">
           <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-[0.3em] opacity-50 max-w-4xl mx-auto">
             Candidex AI is a production-grade <strong>AI resume analyzer</strong> designed to automate candidate screening, optimize resume scores, and enable data-driven hiring decisions through neural semantic alignment. 
           </p>
        </div>
      </div>
    </section>
  );
};

export default TrustedEcosystem;
