import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { name: "Overview",         icon: "dashboard",     path: "/app" },
  { name: "Resume Analyzer",  icon: "analytics",     path: "/app/analyze" },
  { name: "Candidate Finder", icon: "person_search", path: "/app/finder" },
  { name: "History",          icon: "history",       path: "/app/history" },
  { name: "Settings",         icon: "settings",      path: "/app/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-slate-50 flex flex-col p-4 gap-y-2 border-r border-slate-100">

      {/* Brand */}
      <div className="px-3 py-6 mb-4">
        <h1 className="font-headline text-lg font-bold text-slate-900">ResumeAI</h1>
        <p className="text-xs text-on-primary-container uppercase tracking-widest mt-1">Premium Intelligence</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== "/app" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:translate-x-1"
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}>
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-y-1">
        <button
          onClick={() => navigate("/app/analyze")}
          className="mb-4 bg-primary text-on-primary py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold active:scale-95 duration-200 text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Analysis
        </button>
        <a
          href="#"
          className="text-slate-500 hover:bg-slate-100 rounded-xl flex items-center gap-3 px-3 py-2.5 font-medium transition-transform duration-200 hover:translate-x-1"
        >
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </a>
        <a
          href="#"
          className="text-slate-500 hover:bg-slate-100 rounded-xl flex items-center gap-3 px-3 py-2.5 font-medium transition-transform duration-200 hover:translate-x-1"
        >
          <span className="material-symbols-outlined">description</span>
          <span>Documentation</span>
        </a>
      </div>

    </aside>
  );
};

export default Sidebar;
