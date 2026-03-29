import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PublicHeader = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <span className="material-symbols-outlined text-accent text-base">neurology</span>
          </div>
          <h1 className="font-heading text-xl font-bold italic tracking-tight">ResumeAI</h1>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex gap-8 text-sm text-secondary items-center">
          <Link to="/#features"    className="hover:text-primary transition-colors">Features</Link>
          <Link to="/#social-proof" className="hover:text-primary transition-colors">Customers</Link>
          <Link to="/app/analyze"  className="hover:text-primary transition-colors">Analyzer</Link>
          <Link to="/app/finder"   className="hover:text-primary transition-colors">Candidate Finder</Link>
          <Link to="/pricing"      className="hover:text-primary transition-colors">Pricing</Link>
        </nav>

        <div className="flex gap-3 items-center">
          {user ? (
            /* Logged-in: go to Dashboard */
            <Link
              to="/app"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md shadow-primary/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-secondary text-sm hover:text-primary transition-colors font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md shadow-primary/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default PublicHeader;
