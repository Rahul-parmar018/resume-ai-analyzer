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
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-14 h-14 flex items-center justify-center transition-all group-hover:scale-110">
            <img src="/images/logo.png" alt="Candidex AI Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-heading text-2xl font-black tracking-tighter text-slate-950">
            Candidex <span className="inline-block bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent italic px-1">AI</span>
          </h1>
        </Link>

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

            if (item.name === "Recruiter Tools") {
              return (
                <div key="recruiter-tools-dropdown" className="relative group/rec" ref={recruiterToolsRef}>
                  <button 
                    disabled
                    className="opacity-50 cursor-not-allowed relative transition-all font-bold flex items-center gap-2 py-1 text-slate-500"
                  >
                    {item.name}
                    <span className="ml-1 text-[8px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black tracking-widest leading-none">
                      COMING SOON
                    </span>
                  </button>
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
          <Link to="/app" className="hover:bg-slate-900 hover:text-white transition-all font-bold flex items-center gap-1.5 text-slate-900 bg-slate-50 px-4 py-2 rounded-xl group/prod border border-slate-200/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Product 
            <span className="material-symbols-outlined text-[16px] group-hover/prod:translate-x-0.5 group-hover/prod:-translate-y-0.5 transition-transform">arrow_outward</span>
          </Link>
        </nav>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 focus:outline-none group border-2 border-transparent hover:border-slate-200 rounded-full p-0.5 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xl overflow-hidden">
                  {profile?.profile_image ? (
                    <img src={profile.profile_image} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profile?.display_name || user?.displayName, user?.email)
                  )}
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 dropdown-animate">
                  <div className="px-5 py-4 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {profile?.display_name || user?.displayName || "User"}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${role === 'recruiter' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
                          role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {truncateEmail(user.email)}
                    </p>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/app/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      Account Settings
                    </Link>
                  </div>

                  <div className="mt-1 p-2 border-t border-slate-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-500 text-sm hover:text-slate-900 transition-colors font-bold px-2">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                Get Started
              </Link>
            </>
          )}
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </motion.div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => {
            if (item.name === "Recruiter Tools") {
              return (
                <div key="mobile-rec" className="flex items-center gap-3 opacity-50">
                  <span className="text-lg font-bold text-slate-500">{item.name}</span>
                  <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black tracking-widest leading-none">
                    COMING SOON
                  </span>
                </div>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-bold ${
                  location.pathname === item.path ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            to="/app"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-500 flex items-center gap-1"
          >
            Product <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
