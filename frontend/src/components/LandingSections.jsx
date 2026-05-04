import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LightBeamButton from './LightBeamButton';

export const RecruiterShowcase = () => (
  <section className="py-28 px-6 bg-transparent border-b border-white/5 relative z-10">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse items-center gap-20">
      <div className="lg:basis-1/2 space-y-12">
        <div className="space-y-6">
          <div className="voxr-glass-label w-fit">For Talent Teams</div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            Enterprise <br />
            <span className="text-white/30 italic">Recruiter Tools</span>
          </h1>
          <p className="text-white/50 text-lg font-medium leading-relaxed max-w-xl">
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
              <span className="material-symbols-outlined text-purple-400 font-bold">{v.icon}</span>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">{v.title}</h4>
                <p className="text-white/40 text-[11px] font-medium leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
           <Link to="/recruiter-tools">
             <LightBeamButton>
               Join Recruiter Waitlist
               <span className="arrow-circle !bg-white/10 !border-white/10">
                 <ArrowRight className="w-5 h-5 text-white" />
               </span>
             </LightBeamButton>
           </Link>
        </div>
      </div>
      
      <div className="lg:basis-1/2 w-full">
         <div className="relative group animate-float" style={{ animationDelay: '1s' }}>
            <div className="bg-white/5 rounded-[2.5rem] p-3 shadow-2xl relative overflow-hidden border border-white/10">
               <img 
                 src="/images/recruiter-showcase.png" 
                 className="w-full rounded-[2rem] aspect-video object-cover group-hover:scale-105 transition-transform duration-700" 
                 alt="Recruiter Dashboard" 
               />
               <div className="absolute inset-0 bg-purple-900/10 mix-blend-multiply opacity-20"></div>
            </div>
            
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -left-6 glass-panel p-6 space-y-3 hidden sm:block z-10">
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Scanned Today</p>
               <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-white">1,200+</span>
                  <span className="bg-purple-500/20 text-purple-400 text-[10px] font-black px-3 py-1.5 rounded-full">+14.2%</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  </section>
);

export const FinalCTA = () => (
  <section className="py-32 px-6 bg-black/40 backdrop-blur-md relative overflow-hidden text-center">
    {/* Giant Purple Orb — Voxr Signature */}
    <div className="cta-orb" />
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 bg-[radial-gradient(rgba(168,85,247,0.03)_1px,transparent_1px)] [background-size:40px_40px] opacity-50"></div>

    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="max-w-4xl mx-auto space-y-10 relative z-10"
    >
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95]">
          Ready to Get <span className="text-purple-400 italic">Hired?</span>
        </h1>
        <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto">
          Upload your resume today. See results instantly, not in months.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <Link to="/register">
          <button className="btn-primary">
            Start Growth
            <span className="arrow-circle">
              <ArrowRight className="w-5 h-5 text-black" />
            </span>
          </button>
        </Link>
        <Link to="/how-it-works">
          <button className="voxr-glass-label !bg-white/5 !text-white flex items-center gap-2 py-4 px-8">
            Contact us
            <ArrowRight className="w-5 h-5 opacity-50" />
          </button>
        </Link>
      </div>
      
      <p className="text-white/20 font-black text-[9px] uppercase tracking-[0.5em] pt-8">No credit card required &bull; Instant Results</p>
    </motion.div>
  </section>
);
