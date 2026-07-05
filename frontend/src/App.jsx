import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";

// Eager Loading for Critical Auth & Entry Flow
import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./components/RoleSelection";
import FullScreenLoader from "./components/FullScreenLoader";

// Lazy Loading for Non-Critical Pages
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Optimizer = lazy(() => import("./pages/Optimizer"));
const BulkScanner = lazy(() => import("./pages/BulkScanner"));
const RecruiterComingSoon = lazy(() => import("./pages/RecruiterComingSoon"));
const Settings = lazy(() => import("./pages/Settings"));
const History = lazy(() => import("./pages/History"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const Customers = lazy(() => import("./pages/Customers"));
const ResumeScanner = lazy(() => import("./pages/ResumeScanner"));
const ResumeGap = lazy(() => import("./pages/ResumeGap"));
const ResumeFixer = lazy(() => import("./pages/ResumeFixer"));
const BulkScannerPublic = lazy(() => import("./pages/BulkScannerPublic"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const AIResumeScannerLanding = lazy(() => import("./pages/Resources/AIResumeScannerLanding"));
const ATSResumeCheckerLanding = lazy(() => import("./pages/Resources/ATSResumeCheckerLanding"));
const ResumeScoreAILanding = lazy(() => import("./pages/Resources/ResumeScoreAILanding"));
const ResetPasswordConfirm = lazy(() => import("./pages/ResetPasswordConfirm"));

import { useAuth } from "./components/AuthProvider";
import ToolLayout from "./components/ToolLayout";
import Layout    from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider   from "./components/AuthProvider";
import { ModeProvider } from "./context/ModeContext";
import PublicHeader from "./components/PublicHeader";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";
import BackToTop from "./components/BackToTop";
import "./App.css";

const RoleBasedRedirect = () => {
  const { profile } = useAuth();
  if (!profile) return null;
  return <Navigate to={profile.role === 'recruiter' ? '/scanner' : '/optimize'} replace />;
};

function App() {
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 2;
    const wakeBackend = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/warmup/?engine=audit");
        if (!response.ok) throw new Error("Warming failed");
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(wakeBackend, 5000);
        }
      }
    };
    wakeBackend();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ModeProvider>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#0B0F1A',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  fontFamily: 'sans-serif',
                  fontSize: '14px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#0B0F1A',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#0B0F1A',
                  },
                },
              }}
            />
            <BackToTop />
            <Suspense fallback={<FullScreenLoader />}>
              <Routes>
                {/* PUBLIC */}
            <Route path="/"          element={<Landing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/ai-resume-scanner" element={<AIResumeScannerLanding />} />
            <Route path="/ats-resume-checker" element={<ATSResumeCheckerLanding />} />
            <Route path="/resume-score-ai" element={<ResumeScoreAILanding />} />
            <Route path="/pricing"   element={<Pricing />} />
            <Route path="/features"  element={<Features />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/register"  element={<Register />} />
            <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirm />} />
            <Route 
              path="/role-selection" 
              element={
                <ProtectedRoute allowedRoles={['candidate', 'recruiter']} isOnboarding>
                  <RoleSelection />
                </ProtectedRoute>
              } 
            />

            {/* LEGACY TOOLS (Publicly Accessible) */}
            <Route path="/resume-scanner" element={<ResumeScanner />} />
            <Route path="/resume-gap-analysis" element={<ResumeGap />} />
            <Route path="/resume-optimizer" element={<ResumeFixer />} />
            <Route path="/bulk-scanner" element={<><PublicHeader /><div className="pt-20"><BulkScanner /></div></>} />

            {/* PRODUCT TOOLS (No Sidebar, but HAS Topbar) */}
            <Route element={<ToolLayout />}>
              <Route 
                path="/optimize" 
                element={<ProtectedRoute allowedRoles={['candidate']}><Optimizer /></ProtectedRoute>} 
              />
              <Route 
                path="/scanner"  
                element={<ProtectedRoute allowedRoles={['recruiter']}><BulkScanner /></ProtectedRoute>} 
              />
              <Route 
                path="/finder"   
                element={<ProtectedRoute allowedRoles={['recruiter']}><RecruiterComingSoon /></ProtectedRoute>} 
              />
            </Route>

            {/* ACCOUNT AREA (With Sidebar Layout) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['candidate', 'recruiter']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history"  element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </ModeProvider>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
