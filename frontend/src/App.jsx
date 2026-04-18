import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing  from "./pages/Landing";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Optimizer from "./pages/Optimizer";   // Candidate Mode
import BulkScanner from "./pages/BulkScanner"; // Recruiter Mode
import Finder    from "./pages/Finder";      // Recruiter Mode
import Settings  from "./pages/Settings";
import History   from "./pages/History";
import Onboarding from "./pages/Onboarding";
import Pricing   from "./pages/Pricing";
import Features  from "./pages/Features";
import Customers from "./pages/Customers";
import CandidateTools from "./pages/CandidateTools";
import ResumeScanner from "./pages/ResumeScanner";
import ResumeGap from "./pages/ResumeGap";
import ResumeFixer from "./pages/ResumeFixer";
import RecruiterComingSoon from "./pages/RecruiterComingSoon";
import HowItWorks from "./pages/HowItWorks";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import Layout    from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider   from "./components/AuthProvider";
import { useEffect } from "react";
import "./App.css";

function App() {
  // ⚡ Early Wake-up: Ping backend on app load to pre-load ML models
  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 2;

    const wakeBackend = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + "/warmup/?engine=audit");
        if (!response.ok) throw new Error("Warming failed");
        console.log("Neural engine warmed and ready.");
      } catch (err) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.warn(`Warmup attempt ${retryCount} failed. Retrying in 5s...`);
          setTimeout(wakeBackend, 5000);
        } else {
          console.error("Neural engine failed to warm up after retries. Fallback active.");
        }
      }
    };
    wakeBackend();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/"          element={<Landing />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing"   element={<Pricing />} />
          <Route path="/features"  element={<Features />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />
          <Route path="/ai-resume" element={<CandidateTools />} />
          <Route path="/resume-scanner" element={<ResumeScanner />} />
          <Route path="/resume-gap-analysis" element={<ResumeGap />} />
          <Route path="/resume-fixer" element={<ResumeFixer />} />
          <Route path="/resume-optimizer" element={<ResumeFixer />} />
          <Route path="/recruiter-tools" element={<RecruiterComingSoon />} />
          <Route path="/bulk-scanner" element={<RecruiterComingSoon />} />
          <Route path="/ai-ranking" element={<RecruiterComingSoon />} />
          <Route path="/semantic-search" element={<RecruiterComingSoon />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirm />} />

          {/* ONBOARDING */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />

          {/* PROTECTED */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index          element={<Dashboard />} />
            <Route path="optimize" element={<Optimizer />} />
            <Route path="scanner"  element={<RecruiterComingSoon />} />
            <Route path="finder"   element={<RecruiterComingSoon />} />
            <Route path="history"  element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
