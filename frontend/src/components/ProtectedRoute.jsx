import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { useMode } from "../context/ModeContext";
import RoleSelection from "./RoleSelection";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();
  const { mode } = useMode();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚨 Mandatory Onboarding: User has never explicitly chosen a role
  if (profile && !profile.role_onboarding_done) {
    return <RoleSelection />;
  }

  // 🛡️ Strict RBAC: Check if current mode matches the route requirements
  if (mode && allowedRoles && !allowedRoles.includes(mode)) {
    // Redirect to their default dashboard based on their current mode
    return <Navigate to={mode === 'recruiter' ? '/scanner' : '/optimize'} replace />;
  }

  return children;
};

export default ProtectedRoute;
