import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";

const Topbar = ({ title }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showBack = location.pathname !== "/app";

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
          {title || "Dashboard"}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/10 w-64 transition-all outline-none"
            placeholder="Search analytics..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-slate-600">notifications</span>
          </button>

          <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 border border-slate-100">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.email || "User")}&background=0c1427&color=4edea3&bold=true`
              }
            />
          </div>
        </div>
      </div>

    </header>
  );
};

export default Topbar;
