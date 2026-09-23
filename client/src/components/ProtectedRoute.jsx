import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Loading…</p>;
  return user ? children : <Navigate to="/login" replace />;
}

// Keeps signed-in users away from the login and signup pages
export function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading">Loading…</p>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}
