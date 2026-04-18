import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Topbar = ({ title }) => {
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const role = profile?.role || 'candidate';

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
        <h2 className="font-headline font-bold text-xl tracking-tight text-slate-900">
          {title || "Intelligence Hub"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="bg-slate-50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 w-64 transition-all outline-none"
            placeholder="Search Intelligence..."
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
              <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black border-2 border-white group-hover:border-emerald-500 transition-all shadow-xl overflow-hidden">
                {profile?.profile_image ? (
                  <img src={profile.profile_image} alt="P" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile?.display_name || user?.displayName, user?.email)
                )}
              </div>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 dropdown-animate">
                {/* User Info Section */}
                <div className="px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-black text-slate-900 truncate">
                      {profile?.display_name || user?.displayName || "User"}
                    </p>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {truncateEmail(user?.email)}
                  </p>
                </div>

                {/* Account Actions Only - REDUNDANCY PURGED */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate("/app/settings"); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
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
