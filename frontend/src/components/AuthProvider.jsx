import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import api from "../api-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const bootstrapAuth = async (currentUser) => {
    if (!currentUser) {
      setUser(null);
      setProfile(null);
      setProfileLoading(false);
      setInitializing(false);
      return;
    }

    setUser(currentUser);
    setProfileLoading(true);

    try {
      // 1. Force retrieval of fresh token
      const token = await currentUser.getIdToken(true);
      
      // 2. Fetch profile with explicit authorization header to prevent race conditions
      const res = await api.get('/user/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error("[AuthBootstrap] Profile bootstrap failed:", err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
      setInitializing(false);
    }
  };

  const refreshProfile = async () => {
    setProfileLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No authenticated user");
      const token = await currentUser.getIdToken(true);
      const res = await api.get('/user/profile/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      console.error("[AuthProvider] Profile refresh failed:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      bootstrapAuth(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, refreshProfile, initializing, profileLoading, bootstrapAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
