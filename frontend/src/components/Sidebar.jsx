import { useAuth } from "./AuthProvider";
import { useMode } from "../context/ModeContext";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  History as HistoryIcon, 
  Settings as SettingsIcon,
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  Home
} from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { mode } = useMode();

  const menu = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'History', path: '/history', icon: <HistoryIcon size={18} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-[#0B0F1A] border-r border-white/5
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo Area */}
        <div className="h-20 px-8 flex items-center justify-between border-b border-white/5">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <span className="text-white font-black text-xl italic tracking-tighter">C</span>
            </div>
            <span className="text-xl font-black text-white italic tracking-tighter uppercase group-hover:text-purple-400 transition-colors">Candidex AI</span>
          </NavLink>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500">
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all group
                ${isActive 
                  ? 'bg-gradient-to-r from-purple-600/20 to-transparent text-purple-400 border-l-2 border-purple-500' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
                }
              `}
            >
              <span className="transition-transform group-hover:scale-110 duration-300">
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Back to Workspace CTA */}
        <div className="px-6 py-4">
          <NavLink 
            to={mode === 'recruiter' ? '/bulk-scanner' : '/resume-optimizer'}
            className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600/10 border border-purple-500/20 rounded-xl text-[10px] font-black text-purple-400 uppercase tracking-widest hover:bg-purple-600/20 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Tools
          </NavLink>
        </div>

        {/* Bottom Section: Usage & Pro */}
        <div className="p-6 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Usage</span>
              <span className="text-[10px] font-black text-white">0 / 500</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95">
              <Sparkles size={14} />
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
