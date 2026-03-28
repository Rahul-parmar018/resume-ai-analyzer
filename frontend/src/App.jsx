import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./components/AuthProvider";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import "./App.css";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="logo-text-brand" style={{ textDecoration: 'none' }}>
          Candide<span className="logo-text-accent">xAI</span>
        </Link>
      </div>

      <div className="nav-center-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/examples" className="nav-link">Examples</Link>
        <Link to="/how-it-works" className="nav-link">How It Works</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-outline" style={{ border: 'none' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ border: 'none' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ border: 'none' }}>Login</Link>
            <Link to="/register" className="btn btn-brand">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Placeholder components for structural routing
const Placeholder = ({ title }) => (
  <div style={{ padding: '100px', textAlign: 'center', color: 'var(--muted)' }}>
    <h2>{title} coming soon to React UI</h2>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-main">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Placeholder title="Home Page" />} />
            <Route path="/examples" element={<Placeholder title="Examples Page" />} />
            <Route path="/how-it-works" element={<Placeholder title="How It Works" />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
