import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import FullScreenLoader from "./FullScreenLoader";
import { getDashboardForRole } from "../utils/routes";

const ProtectedRoute = ({ children, allowedRoles, isOnboarding = false }) => {
  const { user, profile, initializing, profileLoading } = useAuth();
  const location = useLocation();

  // 1. Wait for Auth Initialization
  if (initializing || (user && !profile && profileLoading)) {
    return <FullScreenLoader />;
  }

  // 2. No User -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User is authenticated, check profile role assignment
  const roleOnboarded = profile?.role_onboarding_done && profile?.role;

  // Onboarding route behavior
  if (isOnboarding) {
    if (roleOnboarded) {
      // If already onboarded, send to their default dashboard
      return <Navigate to={getDashboardForRole(profile.role)} replace />;
    }
    return children;
  }

  // Standard route behavior
  if (!roleOnboarded) {
    // If not onboarded, force redirect to onboarding page
    return <Navigate to="/role-selection" replace />;
  }

  // 4. Strict RBAC validation (using profile.role from DB, not mode)
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={getDashboardForRole(profile.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
