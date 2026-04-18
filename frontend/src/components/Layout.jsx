import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const pageTitles = {
  "/app":          "Dashboard",
  "/app/analyze":  "Resume Analyzer",
  "/app/finder":   "Candidate Finder",
  "/app/history":  "History",
  "/app/settings": "Settings",
};

const Layout = () => {
  const location = useLocation();
  const isSettings = location.pathname === "/app/settings";
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {!isSettings && <Sidebar />}

      <main className={`${!isSettings ? "ml-72" : ""} min-h-screen bg-surface flex flex-col`}>
        {!isSettings && <Topbar title={title} />}

        <div className="flex-1 overflow-y-auto">
          <div className={`${!isSettings ? "max-w-[1600px] mx-auto p-8" : "h-screen"}`}>
            <Outlet />
          </div>

          {/* Footer */}
          {!isSettings && (
            <footer className="w-full py-12 border-t border-slate-100 bg-white mt-12">
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-400 font-label text-xs uppercase tracking-widest">
                  © 2024 Candidex AI Intelligence. All rights reserved.
                </p>
                <div className="flex gap-8">
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-xs uppercase tracking-widest transition-colors">Privacy Policy</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-xs uppercase tracking-widest transition-colors">Terms of Service</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-xs uppercase tracking-widest transition-colors">Cookie Policy</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-xs uppercase tracking-widest transition-colors">Contact Us</a>
                </div>
              </div>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
