import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { fetchDashboardAnalytics } from "../api/analyze";

const PublicHeader = () => {
  const { user, profile, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll Progress Logic
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const role = profile?.role || 'candidate';

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Customers", path: "/customers" },
    { name: "Pricing", path: "/pricing" },
  ];

  // Usage Logic
  const limit = role === 'candidate' ? 20 : 500;
  const current = role === 'candidate' ? (profile?.optimization_count || 0) : (profile?.scan_count || 0);
  const percent = Math.min(100, Math.round((current / limit) * 100));

  // Helper: Initials for avatar
  const getInitials = (name, email) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  // Helper: Secure Email Truncation
  const truncateEmail = (email) => {
    if (!email) return "";
    const [userStr, domain] = email.split("@");
    if (userStr.length <= 4) return `${userStr}****@${domain}`;
    return `${userStr.substring(0, 4)}****@${domain}`;
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  if (loading) return null;

  return (
    <header className="fixed top-0 w-full glass-header z-50">
      {/* Scroll Progress Bar */}
      <div 
        className="absolute top-0 left-0 h-[2px] bg-emerald-400 transition-all duration-150 z-[60]" 
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-slate-900/20 group-hover:shadow-slate-900/40 transition-shadow">
            <span className="material-symbols-outlined text-emerald-400 text-base animate-pulse">neurology</span>
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight">Candidex AI</h1>
        </Link>

        {/* Nav links (Desktop) */}
        <nav className="hidden md:flex gap-8 text-sm items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
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
          <Link to="/app" className="hover:text-slate-900 transition-all font-bold flex items-center gap-1.5 text-slate-500 group/prod">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Product 
            <span className="material-symbols-outlined text-[16px] group-hover/prod:translate-x-0.5 group-hover/prod:-translate-y-0.5 transition-transform">arrow_outward</span>
          </Link>
        </nav>

        <div className="flex gap-4 items-center">
          {/* Search Hint */}
          <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:bg-slate-100 transition-all group">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="text-xs font-bold">Search intelligence...</span>
            <span className="ml-4 text-[10px] font-black opacity-40 group-hover:opacity-100 transition-opacity bg-slate-200 px-1.5 py-0.5 rounded-md">⌘K</span>
          </button>
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 focus:outline-none group border-2 border-transparent hover:border-slate-200 rounded-full p-0.5 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shadow-xl overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="P" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.displayName, user.email)
                  )}
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 dropdown-animate">
                  <div className="px-5 py-4 border-b border-slate-50">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {user.displayName || "Active User"}
                      </p>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {truncateEmail(user.email)}
                    </p>
                  </div>

                  <div className="px-5 py-4 border-b border-slate-50">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                         {role === 'candidate' ? 'Optimization Limit' : 'Scan Limit'}
                       </span>
                       <span className="text-[10px] font-black text-slate-900">{current} / {limit}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-1000 ${percent > 85 ? 'bg-amber-500' : 'bg-primary'}`} 
                         style={{ width: `${percent}%` }}
                       ></div>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/app"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">dashboard</span>
                      Go to Dashboard
                    </Link>
                    {role === 'recruiter' ? (
                      <Link
                        to="/app/scanner"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">hub</span>
                        Candidate Ranking Engine
                      </Link>
                    ) : (
                      <Link
                        to="/app/optimize"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">ads_click</span>
                        Candidex AI Optimizer
                      </Link>
                    )}
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
              <Link to="/login" className="text-secondary text-sm hover:text-primary transition-colors font-bold px-2">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary/20"
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
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
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
          ))}
          <Link
            to="/app"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-lg font-bold text-slate-500 flex items-center gap-1"
          >
            Product <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
          </Link>
          {!user && (
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-50">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
