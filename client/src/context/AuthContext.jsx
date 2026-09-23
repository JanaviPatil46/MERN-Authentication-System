import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [loading, setLoading] = useState(true);

  const startSession = (data) => {
    setUser(data.user);
    setExpiresAt(data.expiresAt);
    setSessionEnded(false);
  };

  // On first load, ask the server who we are (the cookie is sent automatically)
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => startSession(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Sign the user out in the UI the moment their session runs out
  useEffect(() => {
    if (!expiresAt) return;
    const remaining = expiresAt - Date.now();
    const end = () => {
      setUser(null);
      setExpiresAt(null);
      setSessionEnded(true);
    };
    if (remaining <= 0) return end();
    // setTimeout can't handle delays over ~24.8 days; all our options are far below that
    const timer = setTimeout(end, remaining);
    return () => clearTimeout(timer);
  }, [expiresAt]);

  const signup = async (name, email, password, duration) => {
    const res = await api.post("/auth/signup", { name, email, password, duration });
    startSession(res.data);
  };

  const login = async (email, password, duration) => {
    const res = await api.post("/auth/login", { email, password, duration });
    startSession(res.data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setExpiresAt(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, expiresAt, sessionEnded, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
