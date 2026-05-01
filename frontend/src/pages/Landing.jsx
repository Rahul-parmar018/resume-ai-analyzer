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
import TubesBackground from "../components/TubesBackground";
import LightBeamButton from "../components/LightBeamButton";
import ImpactStats from "../components/ImpactStats";
import FlowingMenu from "../components/FlowingMenu";
import PhoneShowcase from "../components/PhoneShowcase";
import CircularGallery from "../components/CircularGallery";
import HorizontalScrollShowcase from "../components/HorizontalScrollShowcase";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LandingSkeleton from "../components/LandingSkeleton";

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

const FEATURES = [
  {
    icon: "psychology",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Neural Resume Matching",
    desc: "Our AI simulates recruiter behavior to score your resume against 10,000+ industry standards."
  },
  {
    icon: "speed",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Instant ATS Score",
    desc: "Get your ATS compatibility score in under 3 seconds. No waiting, no fluff."
  },
  {
    icon: "target",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Keyword Gap Analysis",
    desc: "Identify exactly which keywords are missing and how to inject them naturally."
  },
  {
    icon: "auto_fix_high",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    title: "One-Click Optimization",
    desc: "Apply AI-suggested bullet points directly to your resume with perfect formatting."
  },
  {
    icon: "query_stats",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "Skill Gap Analyzer",
    desc: "Compare your resume against any job description to find alignment gaps instantly."
  },
  {
    icon: "batch_prediction",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    title: "Recruiter Bulk Scanner",
    desc: "Recruiters can scan and rank hundreds of resumes in minutes with neural scoring."
  }
];

const Landing = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  // 1. ALL HOOKS MUST BE AT THE TOP
  useEffect(() => {
    // Minimum shimmer duration for perceived stability
    const timer = setTimeout(() => setMinLoadingDone(true), 800);
    return () => clearTimeout(timer);
  }, []);

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
      // Direct redirect to the standalone scanner page
      navigate("/resume-scanner");
    }
  };

  const isLoading = authLoading || !minLoadingDone;

  // 2. CONDITIONAL RETURN AFTER ALL HOOKS
  if (isLoading) {
    return <LandingSkeleton />;
  }

  return (
    <TubesBackground>
      <div className="text-white font-sans min-h-screen w-full">
        <PublicHeader />

        {/* ═══════════════════════════════════════════════
            1. HERO — Content overlay over Tubes
            ═══════════════════════════════════════════════ */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 w-full pt-20 pb-10 grid lg:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 relative pointer-events-auto"
            >
              {/* Voxr-style pill badge */}
              <motion.div variants={itemVariants} className="voxr-pill w-fit">
                <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                Neural Matching v4.0 Active
              </motion.div>

              <div className="space-y-5">
                <motion.h1 
                  variants={itemVariants} 
                  className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white leading-[0.95] drop-shadow-2xl"
                >
                  Stop Guessing. <br />
                  <span className="text-purple-400 italic font-serif">Get Hired.</span>
                </motion.h1>

                <motion.p 
                  variants={itemVariants} 
                  className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl font-medium"
                >
                  AI-powered resume analysis that works at scale, identifies gaps in real-time, and gives you the edge recruiters actually look for.
                </motion.p>
              </div>

              {/* Futuristic LightBeam CTA buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                <LightBeamButton onClick={handleUploadClick}>
                  Try it now
                  <span className="arrow-circle !bg-white/10 !border-white/10">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </span>
                </LightBeamButton>
                
                <Link to="/how-it-works">
                  <LightBeamButton 
                    className="bg-transparent border-white/20 hover:bg-white/5"
                    gradientColors={["#ffffff", "#a855f7", "#ffffff"]}
                  >
                    See How It Works
                    <ArrowRight className="w-5 h-5 opacity-50" />
                  </LightBeamButton>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Side: 3D Phone Showcase */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="hidden lg:flex justify-center items-center pointer-events-auto"
            >
              <PhoneShowcase />
            </motion.div>
          </div>

          {/* Background Highlight */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
        </section>

        {/* ═══════════════════════════════════════════════
          2. FEATURES — Light Section (Voxr 3x2 Grid)
          ═══════════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-transparent relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex justify-center mb-6">
              <span className="voxr-pill !border-purple-500/30 !bg-purple-500/10 !text-purple-300">Main features</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-lg">
              Power Up Your <span className="text-purple-400 italic">Resume</span>
            </h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto drop-shadow-md">
              Six AI-driven tools that analyze, optimize, and transform your resume — on autopilot.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-[32px] p-10 flex flex-col items-start relative group hover:bg-white/10 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(139,92,246,0.15)] transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 rotate-0 group-hover:-rotate-6 transition-transform shadow-lg ${feature.iconBg} ring-1 ring-white/20`}>
                  <span className={`material-symbols-outlined text-3xl ${feature.iconColor}`}>{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3 font-display drop-shadow-sm">{feature.title}</h3>
                <p className="text-white/60 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. LIVE AI SIMULATION — Transparent
          ═══════════════════════════════════════════════ */}
      <div className="w-full bg-black/20 backdrop-blur-sm relative z-20">
        <LiveSimulation />
      </div>

      {/* ═══════════════════════════════════════════════
          3.5 IMPACT STATS — Quantified proof
          ═══════════════════════════════════════════════ */}
      <ImpactStats />

      {/* ═══════════════════════════════════════════════
          3.6 PLATFORM PILLARS — High-end Flowing Menu
          ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-transparent border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
           <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-4 block">The Future of Hiring</span>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              Platform <span className="text-white/30">Pillars</span>
           </h2>
        </div>
        <div className="w-full h-[600px] relative border-y border-white/5">
          <FlowingMenu 
            items={[
              { link: '#', text: 'Neural Parsing', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop' },
              { link: '#', text: 'ATS Optimization', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop' },
              { link: '#', text: 'Velocity Scoring', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop' },
              { link: '#', text: 'Global Scale', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop' }
            ]} 
            marqueeBgColor="#a855f7"
            textColor="rgba(255,255,255,0.4)"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3.7 SIGNATURE TEMPLATES — WebGL Circular Gallery
          ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-transparent border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-4 block">Elite Design System</span>
           <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
              Signature <span className="text-white/30 italic font-serif">Templates</span>
           </h2>
           <p className="text-white/40 text-lg max-w-xl mx-auto font-medium">
             Hand-crafted layouts designed to pass the 6-second recruiter test with 100% ATS compatibility.
           </p>
        </div>
        
        <div className="w-full h-[600px] relative">
          <CircularGallery 
            bend={3}
            textColor="#ffffff"
            borderRadius={0.08}
            scrollEase={0.03}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. TRUSTED ECOSYSTEM — Transparent
          ═══════════════════════════════════════════════ */}
      <div className="relative bg-transparent">
         <TrustedEcosystem />
      </div>

      {/* ═══════════════════════════════════════════════
          5. ATS INTELLIGENCE — Transparent
          ═══════════════════════════════════════════════ */}
      <motion.div {...sectionReveal} className="bg-transparent">
        <ATSIntelligence />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          6. AI ENGINE — Transparent
          ═══════════════════════════════════════════════ */}
      <motion.div {...sectionReveal} className="bg-transparent">
        <IntelligenceEngine />
      </motion.div>
      
      {/* ═══════════════════════════════════════════════
          7. REVIEWS — Transparent
          ═══════════════════════════════════════════════ */}
      <motion.div {...sectionReveal} className="bg-transparent">
        <ReviewSection />
      </motion.div>
      
      {/* ═══════════════════════════════════════════════
          8. RECRUITER SHOWCASE — Transparent
          ═══════════════════════════════════════════════ */}
      <motion.div {...sectionReveal} className="bg-transparent">
        <RecruiterShowcase />
      </motion.div>
      
      {/* ═══════════════════════════════════════════════
          9. TRUST SUPPORT — Transparent
          ═══════════════════════════════════════════════ */}
      <motion.div {...sectionReveal} className="bg-transparent">
        <TrustSupport />
      </motion.div>
      
      {/* ═══════════════════════════════════════════════
          10. ANALYSIS WORKFLOW — GSAP Horizontal Scroll
          ═══════════════════════════════════════════════ */}
      <HorizontalScrollShowcase />

      {/* ═══════════════════════════════════════════════
          10.5 FAQ — Transparent
          ═══════════════════════════════════════════════ */}
      <motion.div {...sectionReveal} className="bg-transparent">
        <FAQSection />
      </motion.div>

      {/* ═══════════════════════════════════════════════
          11. FINAL CTA — Purple Orb (Voxr Style)
          ═══════════════════════════════════════════════ */}
      <FinalCTA />

      {/* ═══════════════════════════════════════════════
          12. SEO BLOCK
          ═══════════════════════════════════════════════ */}
      <div className="py-16 bg-black/40 backdrop-blur-md text-center border-t border-white/5">
         <div className="max-w-5xl mx-auto px-6 space-y-8">
            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] leading-relaxed">
              Candidex AI is a production-grade AI resume analyzer designed to automate candidate screening, optimize resume scores, and enable data-driven hiring decisions through neural semantic alignment.
            </p>
         </div>
      </div>

      <PublicFooter />

      </div>
    </TubesBackground>
  );
};

export default Landing;
