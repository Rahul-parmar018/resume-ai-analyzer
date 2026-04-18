import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import api from "../api-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      const res = await api.get('/user/profile/');
      setProfile(res.data);
    } catch (err) {
      console.error("Profile refresh failed:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Explicitly get token from the currentUser object received in onAuthStateChanged.
          // This avoids the race condition where auth.currentUser is still null
          // when the axios interceptor fires on the very first request.
          const token = await currentUser.getIdToken();
          const res = await api.get('/user/profile/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setProfile(res.data);
        } catch (err) {
          console.error("Initial profile sync failed:", err);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, setProfile, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
