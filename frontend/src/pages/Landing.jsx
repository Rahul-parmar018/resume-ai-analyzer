import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";
import PublicFooter from "../components/PublicFooter";
import TrustedEcosystem from "../components/TrustedEcosystem";
import LiveSimulation from "../components/LiveSimulation";
import ATSIntelligence from "../components/ATSIntelligence";
import ReviewSection from "../components/ReviewSection";
import IntelligenceEngine from "../components/IntelligenceEngine";
import TrustSupport from "../components/TrustSupport";
import { RecruiterShowcase, FinalCTA } from "../components/LandingSections";
import FAQSection from "../components/FAQSection";

const Landing = () => {

  useEffect(() => {
    document.title = "Candidex AI | Get Shortlisted Faster with Smart AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Candidex AI is an advanced AI resume analyzer designed to optimize resumes, improve ATS scores, and help candidates match job descriptions using semantic intelligence.");
    }
  }, []);


  return (
    <div className="bg-white text-primary font-sans min-h-screen">
      <PublicHeader />

      {/* 1. HERO SECTION (100vh - Full Impact) */}
      <section className="h-screen flex flex-col justify-center pt-20 pb-10 px-6 relative overflow-hidden bg-white">
        {/* Background Textures */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_20%_20%,#10b9811a_0%,transparent_50%)] -z-10 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:40px_40px] opacity-40 -z-20"></div>
        
        <div className="max-w-[1100px] mx-auto text-center space-y-10 relative">
          {/* Neural CSS Fix - Glass Chip Badge */}
          <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 backdrop-blur-md rounded-full px-5 py-2 shadow-sm animate-fade-in mb-4">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Neural Matching v4.0 is Live</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] text-slate-900 tracking-tighter animate-[fade-slide_1s_ease-out_forwards]">
              AI Resume Analyzer that Gets You <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">Shortlisted Faster</span>
            </h1>

            <p className="text-slate-500 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-medium">
              Analyze your resume, identify gaps, and improve it with AI — calibrated to real job requirements.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6 pt-6 relative z-20">
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register">
                <button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/10 hover:-translate-y-1">
                  Upload Resume
                </button>
              </Link>
              <Link to="/login">
                <button className="bg-white border border-slate-200 px-10 py-5 rounded-2xl text-slate-900 hover:border-slate-900 transition-all font-black text-xl hover:-translate-y-1 flex items-center gap-3 group shadow-lg">
                  <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  See How It Works
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 z-10">
           <span className="material-symbols-outlined text-4xl">expand_more</span>
        </div>

        {/* Elite Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
      </section>

      {/* 2. LIVE AI SIMULATION (Explicit w-full wrapper to fix white gap) */}
      <div className="w-full bg-slate-900 overflow-hidden relative z-20">
        <LiveSimulation />
      </div>

      {/* 3. TRUST + STATS */}
      <TrustedEcosystem />

      {/* 4. ATS INTELLIGENCE (Logic) */}
      <ATSIntelligence />

      {/* 5. AI ENGINE (Rewriting) */}
      <IntelligenceEngine />

      {/* 6. REVIEWS (Social Proof Grid) */}
      <ReviewSection />

      {/* 7. RECRUITER SHOWCASE */}
      <RecruiterShowcase />

      {/* 8. HUMAN SUPPORT (TRUST IMAGE) */}
      <TrustSupport />

      {/* 9. FAQ Section */}
      <FAQSection />

      {/* 10. FINAL CTA */}
      <div className="relative">
         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-50 to-white"></div>
         <FinalCTA />
      </div>

      {/* 11. SEO BLOCK */}
      <div className="py-16 bg-white text-center border-t border-slate-100">
         <div className="max-w-5xl mx-auto px-6 space-y-8">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] leading-relaxed">
              Candidex AI is a production-grade AI resume analyzer designed to automate candidate screening, optimize resume scores, and enable data-driven hiring decisions through neural semantic alignment.
            </p>
         </div>
      </div>

      <PublicFooter />

    </div>
  );
};

export default Landing;
