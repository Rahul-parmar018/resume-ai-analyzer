import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "framer-motion";

const PublicHeader = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIResumeOpen, setIsAIResumeOpen] = useState(false);
  const [isRecruiterToolsOpen, setIsRecruiterToolsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const menuRef = useRef(null);
  const aiResumeRef = useRef(null);
  const recruiterToolsRef = useRef(null);

  const role = profile?.role || 'candidate';

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (aiResumeRef.current && !aiResumeRef.current.contains(event.target)) {
        setIsAIResumeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const getInitials = (name, email) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    if (email) return email[0].toUpperCase();
    return "U";
  };

  const truncateEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (user.length > 12) return user.substring(0, 10) + "..." + "@" + domain;
    return email;
  };

  const navItems = [
    { name: "AI Resume", path: "#" }, 
    { name: "How it Works", path: "/how-it-works" },
    { name: "Recruiter Tools", path: "/recruiter-tools" },
    { name: "Support", path: "/contact" }
  ];

  if (loading) return null;

  return (
    <header className="fixed top-0 w-full glass-header z-50">
      {/* Scroll Progress Bar */}
      <div 
        className="absolute top-0 left-0 h-[2px] bg-emerald-400 transition-all duration-150 z-[60]" 
        style={{ width: `${scrollProgress}%` }}
      />
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4"
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all group-hover:rotate-6">
            <img src="/images/logo.png" alt="Candidex AI Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-black tracking-tighter text-slate-950">
            Candidex <span className="text-blue-500 italic">AI</span>
          </h1>
        </Link>
        
        <div className="flex gap-2 sm:gap-4 items-center">
          {user && (
            <div className="w-9 h-9 rounded-full bg-[#0a1020] text-white flex items-center justify-center text-[11px] font-black shadow-lg border border-white/10">
               {getInitials(profile?.display_name || user?.displayName, user?.email)}
            </div>
          )}

          {/* Toggle Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-900">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          {/* Nav links (Desktop) */}
          <nav className="hidden md:flex gap-10 text-sm items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              if (item.name === "AI Resume") {
                return (
                  <div key="ai-resume-dropdown" className="relative group/ai" ref={aiResumeRef}>
                    <button 
                      onMouseEnter={() => setIsAIResumeOpen(true)}
                      className={`transition-all font-bold flex items-center gap-1 py-1 ${
                        isActive || isAIResumeOpen ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {item.name}
                      <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${isAIResumeOpen ? "rotate-180" : ""}`}>expand_more</span>
                    </button>
                    
                    {isAIResumeOpen && (
                      <div 
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl py-3 dropdown-animate overflow-hidden"
                        onMouseLeave={() => setIsAIResumeOpen(false)}
                      >
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-slate-50 rotate-45 z-0" />
                        <div className="relative z-10">
                          <div className="px-4 py-2 border-b border-slate-50 mb-1 bg-slate-50/50">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Suite</p>
                          </div>
                          <Link 
                            to="/resume-scanner" 
                            onClick={() => setIsAIResumeOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                          >
                            <span className="material-symbols-outlined text-emerald-500">qr_code_scanner</span>
                            <div>
                              <p className="font-bold text-sm">Resume Scanner</p>
                              <p className="text-[10px] text-slate-400 font-medium">Instant ATS Detection</p>
                            </div>
                          </Link>
                          <Link 
                            to="/resume-gap-analysis" 
                            onClick={() => setIsAIResumeOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                          >
                            <span className="material-symbols-outlined text-emerald-500">query_stats</span>
                            <div>
                              <p className="font-bold text-sm">Skill Gap Analyzer</p>
                              <p className="text-[10px] text-slate-400 font-medium">Neural JD Comparison</p>
                            </div>
                          </Link>
                          <Link 
                            to="/resume-optimizer" 
                            onClick={() => setIsAIResumeOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                          >
                            <span className="material-symbols-outlined text-emerald-500">auto_fix_high</span>
                            <div>
                              <p className="font-bold text-sm">Resume Optimizer</p>
                              <p className="text-[10px] text-slate-400 font-medium">Smart AI Rewriting</p>
                            </div>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={`transition-all font-bold relative py-1 ${
                    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link to="/resume-scanner" className="hover:bg-slate-900 hover:text-white transition-all font-bold flex items-center gap-1.5 text-slate-900 bg-slate-50 px-4 py-2 rounded-xl group/prod border border-slate-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Product 
              <span className="material-symbols-outlined text-[16px] group-hover/prod:translate-x-0.5 group-hover/prod:-translate-y-0.5 transition-transform">arrow_outward</span>
            </Link>
          </nav>

          {user ? (
            <div className="hidden md:block relative" ref={menuRef}>
               {/* User Avatar Logic (Existing) */}
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
                 {getInitials(profile?.display_name || user?.displayName, user?.email)}
               </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-4 items-center">
              <Link to="/login" className="text-slate-500 text-sm hover:text-slate-900 transition-colors font-bold px-2">Login</Link>
              <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">Get Started</Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-[100] p-8 flex flex-col gap-10 animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
              <h1 className="text-xl font-black tracking-tighter italic">Candidex <span className="text-blue-500">AI</span></h1>
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-900">close</span>
            </button>
          </div>

          <nav className="flex flex-col gap-6 overflow-y-auto pb-10">
            <div className="space-y-4">
              <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">AI Resume Suite</p>
              <div className="flex flex-col gap-4 pl-2">
                <Link to="/resume-scanner" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900 tracking-tighter">Scanner</Link>
                <Link to="/resume-gap-analysis" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900 tracking-tighter">Gap Analysis</Link>
                <Link to="/resume-optimizer" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900 tracking-tighter">Optimizer</Link>
              </div>
            </div>

            <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-500 tracking-tighter">How it Works</Link>
            
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-slate-400 tracking-tighter">Recruiter Tools</span>
                  <span className="text-[9px] bg-yellow-400 text-black px-2 py-1 rounded-lg font-black tracking-widest leading-none">COMING SOON</span>
               </div>
            </div>

            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-500 tracking-tighter">Support</Link>
            
            <Link to="/resume-scanner" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
              Product <span className="material-symbols-outlined text-2xl">arrow_outward</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
