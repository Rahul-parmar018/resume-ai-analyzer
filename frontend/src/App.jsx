import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing  from "./pages/Landing";
import Login    from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Optimizer from "./pages/Optimizer";   // Candidate Mode
import BulkScanner from "./pages/BulkScanner"; // Recruiter Mode
import { useAuth } from "./components/AuthProvider";
import Finder    from "./pages/Finder";      // Recruiter Mode
import Settings  from "./pages/Settings";
import History   from "./pages/History";
import Pricing   from "./pages/Pricing";
import Features  from "./pages/Features";
import Customers from "./pages/Customers";
import CandidateTools from "./pages/CandidateTools";
import ResumeScanner from "./pages/ResumeScanner";
import ResumeGap from "./pages/ResumeGap";
import ResumeFixer from "./pages/ResumeFixer";
import RecruiterComingSoon from "./pages/RecruiterComingSoon";
import BulkScannerPublic from "./pages/BulkScannerPublic";
import HowItWorks from "./pages/HowItWorks";
import AIResumeScannerLanding from "./pages/Resources/AIResumeScannerLanding";
import ATSResumeCheckerLanding from "./pages/Resources/ATSResumeCheckerLanding";
import ResumeScoreAILanding from "./pages/Resources/ResumeScoreAILanding";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import ToolLayout from "./components/ToolLayout";
import Layout    from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider   from "./components/AuthProvider";
import { useEffect } from "react";
import { ModeProvider } from "./context/ModeContext";
import PublicHeader from "./components/PublicHeader";
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
    <Router>
      <AuthProvider>
        <ModeProvider>
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
        </ModeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
