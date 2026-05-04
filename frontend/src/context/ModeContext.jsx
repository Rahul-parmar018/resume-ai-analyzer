import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import api from "../api-client";

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const { profile } = useAuth();
  const [mode, setModeState] = useState('candidate'); // Default

  // Initialize mode from profile when it loads
  useEffect(() => {
    if (profile?.role) {
      setModeState(profile.role);
    }
  }, [profile]);

  const setMode = async (newMode) => {
    // Optimistic Update
    setModeState(newMode);
    
    try {
      // Sync with backend
      await api.post('/user/update-role/', { role: newMode });
    } catch (err) {
      console.error("Failed to sync mode with backend:", err);
      // Revert on failure
      if (profile?.role) setModeState(profile.role);
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};
