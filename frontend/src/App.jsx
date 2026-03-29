import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing  from "./pages/Landing";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analyzer  from "./pages/Analyzer";
import Finder    from "./pages/Finder";
import Settings  from "./pages/Settings";
import History   from "./pages/History";
import Pricing   from "./pages/Pricing";
import Features  from "./pages/Features";
import Customers from "./pages/Customers";
import Layout    from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthProvider   from "./components/AuthProvider";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/"          element={<Landing />} />
          <Route path="/pricing"   element={<Pricing />} />
          <Route path="/features"  element={<Features />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          {/* PROTECTED */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index         element={<Dashboard />} />
            <Route path="analyze" element={<Analyzer />} />
            <Route path="finder"  element={<Finder />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
