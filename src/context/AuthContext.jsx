import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("payanam_user");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("payanam_user", JSON.stringify(userData));
    } catch (e) {
      // ignore storage errors
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem("payanam_user");
    } catch (e) {}
  };

  // Merge partial updates into the current user (e.g. after profile image upload)
  const updateUser = (updates) => {
    setUser((prev) => {
      const merged = prev ? { ...prev, ...updates } : updates;
      try { localStorage.setItem("payanam_user", JSON.stringify(merged)); } catch {}
      return merged;
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/users/profile");
        // backend returns { success, data: { ...user } }
        const payload = res.data?.data ?? res.data?.user ?? null;
        setUser(payload);
        setIsAuthenticated(Boolean(payload));
      } catch (error) {
        const status = error.response?.status;
        // 403 = account suspended/banned — do NOT fall back to cache
        if (status === 403) {
          setUser(null);
          setIsAuthenticated(false);
          try { localStorage.removeItem("payanam_user"); } catch {}
        } else {
          // Other errors (network, 401 mid-refresh, etc.) — use cache as fallback
          const cached = (() => {
            try {
              return JSON.parse(localStorage.getItem("payanam_user"));
            } catch (e) {
              return null;
            }
          })();
          setUser(cached || null);
          setIsAuthenticated(Boolean(cached));
        }
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Listen for force-logout events dispatched by the axios interceptor
    // (e.g. when a 403 "account suspended" response is received)
    const handleForceLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      try { localStorage.removeItem("payanam_user"); } catch {}
    };
    window.addEventListener("payanam:force-logout", handleForceLogout);
    return () => window.removeEventListener("payanam:force-logout", handleForceLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}