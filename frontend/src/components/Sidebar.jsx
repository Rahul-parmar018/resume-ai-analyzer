import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const role = profile?.role || 'candidate';

  const navItems = [
    // Recruiter Only
    { name: "Dashboard",         icon: "dashboard",     path: "/app",          roles: ['recruiter'] },
    { name: "Candidate Ranking Engine", icon: "hub",    path: "/app/scanner",  roles: ['recruiter'] },
    
    // Candidate Only
    { name: "Candidex AI Optimizer",  icon: "analytics",     path: "/app/optimize", roles: ['candidate'] },
    
    // Both
    { name: "History",          icon: "history",       path: "/app/history",  roles: ['candidate', 'recruiter'] },
    { name: "Settings",         icon: "settings",      path: "/app/settings", roles: ['candidate', 'recruiter'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  // Usage Logic
  const limit = role === 'candidate' ? 20 : 500;
  const current = role === 'candidate' ? (profile?.optimization_count || 0) : (profile?.scan_count || 0);
  const percent = Math.min(100, Math.round((current / limit) * 100));

  return (
    <aside className="h-screen w-72 fixed left-0 top-0 z-40 bg-white flex flex-col p-6 gap-y-2 border-r border-slate-100 font-body">

      {/* Brand */}
      <div className="px-3 py-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">architecture</span>
          </div>
          <h1 className="font-headline text-2xl font-bold text-slate-900 tracking-tighter">Candidex AI</h1>
        </div>
        <div className="flex items-center gap-2">
           <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full ${
             role === 'recruiter' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
           }`}>
             {role === 'recruiter' ? 'Recruiter Mode' : 'Candidate Mode'}
           </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-y-1.5">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/app" && location.pathname.startsWith(item.path));
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
              <span className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary-container" : ""}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* SaaS Usage Widget */}
      <div className="mt-auto px-2 py-6">
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
           <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {role === 'candidate' ? 'Optimization Limit' : 'Scan Limit'}
              </span>
              <span className="text-[10px] font-bold text-slate-900">
                {current} / {limit}
              </span>
           </div>
           
           <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                   percent > 80 ? 'bg-amber-500' : 'bg-primary'
                }`}
                style={{ width: `${percent}%` }}
              ></div>
           </div>

           <button 
              onClick={() => navigate("/pricing")}
              className="w-full py-2.5 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
           >
              <span className="material-symbols-outlined text-sm">bolt</span>
              Upgrade to Pro
           </button>
        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
