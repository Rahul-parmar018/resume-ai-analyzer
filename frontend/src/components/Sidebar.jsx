import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const role = profile?.role || 'candidate';

  const navItems = [
    // Candidate Specific Tools (Public/Direct Flow)
    { name: "Resume Scanner",    icon: "qr_code_scanner", path: "/resume-scanner",      roles: ['candidate'] },
    { name: "AI Optimizer",      icon: "auto_fix_high",   path: "/app/optimize",        roles: ['candidate'] },
    { name: "Gap Analysis",      icon: "query_stats",     path: "/resume-gap-analysis", roles: ['candidate'] },

    // Recruiter Hub
    { name: "IntellHub",         icon: "dashboard",       path: "/app",                 roles: ['recruiter'] },
    { name: "Candidate Finder",  icon: "hub",             path: "/app/scanner",         roles: ['recruiter'] },

    // Core Management
    { name: "History",           icon: "history",         path: "/app/history",         roles: ['candidate', 'recruiter'] },
    { name: "Settings",          icon: "settings",        path: "/app/settings",        roles: ['candidate', 'recruiter'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  // Usage Logic
  const limit = role === 'candidate' ? 20 : 500;
  const current = role === 'candidate' ? (profile?.optimization_count || 0) : (profile?.scan_count || 0);
  const percent = Math.min(100, Math.round((current / limit) * 100));

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 z-40 bg-white flex flex-col p-6 gap-y-2 border-r border-slate-100 font-body">

      {/* Brand */}
      <Link to="/" className="group px-3 py-6 mb-4 block">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
            <span className="material-symbols-outlined text-white text-xl">architecture</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-slate-900 tracking-tighter group-hover:text-emerald-500 transition-colors">Candidex AI</h1>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
           {role === 'recruiter' ? 'Recruiter' : 'Candidate'}
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-y-1.5">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
                isActive
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-emerald-400" : ""}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usage Hub */}
      <div className="mt-auto px-2 py-6 border-t border-slate-50">
        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl shadow-slate-900/10">
           <div className="flex justify-between items-center mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>{role === 'candidate' ? 'Optimization' : 'Usage'}</span>
              <span className="text-white">{current} / {limit}</span>
           </div>
           
           <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-5">
              <div 
                className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${percent}%` }}
              ></div>
           </div>

           <button 
              onClick={() => navigate("/app/settings")}
              className="w-full py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all shadow-lg"
           >
              Upgrade to Pro
           </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
