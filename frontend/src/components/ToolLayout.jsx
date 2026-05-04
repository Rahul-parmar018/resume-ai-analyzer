import { Outlet, useLocation } from "react-router-dom";
import Topbar from "./Topbar";

const pageTitles = {
  "/optimize": "AI Optimizer",
  "/scanner":  "Rank Candidates",
  "/finder":   "Candidate Finder",
};

const ToolLayout = () => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Product Tool";

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-body text-white flex flex-col overflow-hidden">
      {/* Global Topbar for navigation context */}
      <Topbar title={currentTitle} />

      {/* Main content area (Full Width) */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0B]">
        <div className="max-w-[1800px] mx-auto p-4 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* Compact Footer */}
      <footer className="w-full py-8 border-t border-white/5 bg-[#0A0A0B]">
        <div className="max-w-[1800px] mx-auto px-8 flex justify-between items-center">
          <p className="text-slate-600 font-label text-[10px] uppercase tracking-widest font-bold">
            © 2024 Candidex AI Intelligence.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Privacy</a>
            <a href="#" className="text-slate-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToolLayout;
