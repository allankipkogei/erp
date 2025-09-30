import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, accessToken, loading } = useAuth();

  // While checking localStorage/auth, wait
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // If a role is specified, restrict access
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default ProtectedRoute;
