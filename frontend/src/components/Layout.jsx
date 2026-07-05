import { useState, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Menu, X } from "lucide-react";
import PageLoader from "./PageLoader";

const pageTitles = {
  "/optimize": "AI Optimizer",
  "/scanner":  "Rank Candidates",
  "/finder":   "Candidate Finder",
  "/history":  "History",
  "/settings": "Settings",
};

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-body text-white flex overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0B0F1A] border border-white/10 rounded-lg text-white"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[55] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-[60] w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full relative">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-6 right-4 text-slate-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0A0A0B]">
        <Topbar title={currentTitle} />

        <div className="flex-1 overflow-y-auto p-8 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>

          {/* Footer */}
          <footer className="w-full py-12 border-t border-white/5 bg-[#0A0A0B] mt-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-slate-600 font-label text-[10px] uppercase tracking-widest font-bold">
                © 2024 Candidex AI Intelligence. All rights reserved.
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-slate-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Privacy</a>
                <a href="#" className="text-slate-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Terms</a>
                <a href="#" className="text-slate-600 hover:text-white text-[10px] uppercase tracking-widest font-bold transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
