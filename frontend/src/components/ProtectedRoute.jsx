import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to Onboarding if role is missing (EXEMPT Settings page)
  const isSettingsPage = location.pathname.includes("/settings");
  if (!profile?.role && location.pathname !== "/onboarding" && !isSettingsPage) {
    return <Navigate to="/onboarding" replace />;
  }

  // If already has role and trying to go back to onboarding, send to their workspace
  if (profile?.role && location.pathname === "/onboarding") {
    return <Navigate to={profile.role === "candidate" ? "/resume-scanner" : "/app"} replace />;
  }

  return children;
};

export default ProtectedRoute;
