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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/users/profile");
        const payload = res.data?.user ?? res.data;
        // keep local user if backend confirms, otherwise update
        setUser(payload || JSON.parse(localStorage.getItem("payanam_user")) || null);
        setIsAuthenticated(Boolean(payload) || Boolean(localStorage.getItem("payanam_user")));
      } catch (error) {
        // if backend check fails, keep client-side user if present (allows offline UI), otherwise clear
        const cached = (() => {
          try {
            return JSON.parse(localStorage.getItem("payanam_user"));
          } catch (e) {
            return null;
          }
        })();
        setUser(cached || null);
        setIsAuthenticated(Boolean(cached));
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}