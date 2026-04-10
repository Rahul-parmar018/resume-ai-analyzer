import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { fetchDashboardAnalytics } from "../api/analyze";

const Topbar = ({ title }) => {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/app";
  const role = profile?.role || 'candidate';

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

  return (
    <header className="sticky top-0 w-full z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/50 shadow-sm px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {showBack && (
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center text-secondary"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        )}
        <h2 className="font-headline font-bold text-xl tracking-tight text-primary">
          {title || "Overview"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 w-64 transition-all outline-none"
            placeholder="Search intelligence..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all active:scale-95 text-slate-600">
            <span className="material-symbols-outlined">notifications</span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black border-2 border-white group-hover:border-primary transition-all shadow-xl overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="P" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.displayName, user?.email)
                )}
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 dropdown-animate">
                <div className="px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black text-slate-900 truncate">
                      {user?.displayName || "Active User"}
                    </p>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {truncateEmail(user?.email)}
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
                    Dashboard
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
                  <Link
                    to="/app/history"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">history</span>
                    History
                  </Link>
                </div>

                <div className="mt-1 p-2 border-t border-slate-50">
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/app/settings"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Account Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
