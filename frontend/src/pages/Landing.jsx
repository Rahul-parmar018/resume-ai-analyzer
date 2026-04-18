import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
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
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Advanced Motion Orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const sectionReveal = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: "easeOut" }
};

const Landing = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Candidex AI | Get Shortlisted Faster with Smart AI";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Candidex AI is an advanced AI resume analyzer designed to optimize resumes, improve ATS scores, and help candidates match job descriptions using semantic intelligence.");
    }
  }, []);

  const handleUploadClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      // Direct redirect to the standalone scanner page as requested
      navigate("/resume-scanner");
    }
  };


  return (
    <div className="bg-white text-primary font-sans min-h-screen">
      <PublicHeader />

      {/* 1. HERO SECTION (Aggressively Optimized for 100% Viewport) */}
      <section className="min-h-screen flex flex-col pt-12 pb-12 px-6 relative overflow-hidden bg-white">
        {/* Advanced Parallax Background */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] -z-10"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -50, 0] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] -z-10"
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:48px_48px] opacity-30 -z-20"></div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[1200px] mx-auto text-center space-y-10 relative"
        >
          {/* Neural Chip with Entrance Pulse */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 backdrop-blur-md rounded-full px-5 py-2 shadow-sm mb-4">
            <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] leading-none">Neural Matching v4.0 Active</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 leading-[1.1] sm:leading-[1.05]"
            >
              AI Resume Analyzer that Gets You <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent italic px-2">Shortlisted Faster</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants} 
              className="text-slate-500 text-base sm:text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-medium px-4"
            >
              Analyze your resume, identify gaps, and improve it with AI — <span className="text-slate-900 border-b-4 border-emerald-500/10 italic">calibrated to real recruiter intent.</span>
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 pt-4 relative z-20 px-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md sm:max-w-none">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                className="w-full sm:w-auto bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg sm:text-xl hover:bg-slate-800 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]"
              >
                Upload Resume
              </motion.button>
              <Link to="/how-it-works" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-white border-2 border-slate-100 px-10 py-5 rounded-[2rem] text-slate-900 hover:border-slate-800 transition-all font-black text-lg sm:text-xl flex items-center justify-center gap-4 shadow-xl"
                >
                  <ArrowRight className="w-7 h-7" />
                  See Proof
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. LIVE AI SIMULATION (Now with seamless dark transition) */}
      <div className="w-full bg-slate-950 -mt-1 relative z-20 border-t border-white/5">
        <LiveSimulation />
      </div>

      {/* 3. TRUST + STATS (Bridging White/Dark) */}
      <div className="relative bg-white pt-24">
         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-950 to-white"></div>
         <TrustedEcosystem />
      </div>

      {/* 4. ATS INTERNAL (Terminal) */}
      <motion.div {...sectionReveal}>
        <ATSIntelligence />
      </motion.div>

      {/* 5. AI ENGINE (Rewriting) */}
      {/* 5. AI ENGINE (Rewriting) */}
      <motion.div {...sectionReveal}>
        <IntelligenceEngine />
      </motion.div>
      
      {/* 6. REVIEWS (Social Proof Grid) */}
      <motion.div {...sectionReveal}>
        <ReviewSection />
      </motion.div>
      
      {/* 7. RECRUITER SHOWCASE */}
      <motion.div {...sectionReveal}>
        <RecruiterShowcase />
      </motion.div>
      
      {/* 8. HUMAN SUPPORT (TRUST IMAGE) */}
      <motion.div {...sectionReveal}>
        <TrustSupport />
      </motion.div>
      
      {/* 9. FAQ Section */}
      <motion.div {...sectionReveal}>
        <FAQSection />
      </motion.div>

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
