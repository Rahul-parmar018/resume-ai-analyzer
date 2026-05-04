import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useMode } from "../context/ModeContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { CheckCircle2, ChevronDown, Bell, Search as SearchIcon, LogOut, Settings as SettingsIcon, Home } from "lucide-react";

const Topbar = ({ title }) => {
  const { user, profile } = useAuth();
  const { mode, setMode } = useMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const modeMenuRef = useRef(null);
  const navigate = useNavigate();

  // Helper: Initials for avatar
  const getInitials = (name, email) => {
    if (name) return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    return email ? email.substring(0, 2).toUpperCase() : "U";
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (modeMenuRef.current && !modeMenuRef.current.contains(event.target)) {
        setIsModeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchMode = async (newMode) => {
    if (newMode === mode) return;
    setIsModeMenuOpen(false);
    await setMode(newMode);
    // Redirect to the appropriate dashboard on mode switch
    navigate(newMode === 'recruiter' ? '/scanner' : '/optimize');
  };

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
    <header className="h-20 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between text-white z-40">
      <div className="flex items-center gap-4">
        <Link to="/" className="group">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-purple-400 transition-colors">
            {title || "Dashboard"}
          </h2>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        {/* Quick Search */}
        <div className="relative hidden lg:block">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white focus:bg-white/10 w-64 transition-all outline-none placeholder:text-slate-600"
            placeholder="Search Intelligence..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-4">
          
          {/* Mode Switcher (Quick Switch) */}
          <div className="relative" ref={modeMenuRef}>
            <button 
              onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all focus:outline-none"
            >
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Mode:</span>
              <span className="text-xs font-black capitalize text-purple-400">{mode}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            
            {isModeMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0B0F1A] border border-white/10 shadow-2xl rounded-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => handleSwitchMode('candidate')}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${mode === 'candidate' ? 'text-purple-400' : 'text-slate-500'}`}
                >
                  Candidate
                  {mode === 'candidate' && <CheckCircle2 size={14} />}
                </button>
                <button 
                  onClick={() => handleSwitchMode('recruiter')}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors ${mode === 'recruiter' ? 'text-purple-400' : 'text-slate-500'}`}
                >
                  Recruiter
                  {mode === 'recruiter' && <CheckCircle2 size={14} />}
                </button>
              </div>
            )}
          </div>

          <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-500 hidden sm:block">
            <Bell size={20} />
          </button>

          {/* User Profile Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black border-2 border-white/5 group-hover:border-purple-500 transition-all shadow-2xl overflow-hidden">
                {profile?.profile_image ? (
                  <img src={profile.profile_image} alt="P" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile?.display_name || user?.displayName, user?.email)
                )}
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-[#0B0F1A] border border-white/10 shadow-2xl rounded-2xl py-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black text-white truncate uppercase italic">
                      {profile?.display_name || user?.displayName || "User"}
                    </p>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {mode}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/settings"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <SettingsIcon size={18} />
                    Settings
                  </button>
                  <Link
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Home size={18} />
                    Landing Page
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors mt-1"
                  >
                    <LogOut size={18} />
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
