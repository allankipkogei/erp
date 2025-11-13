import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("access_token");
  const userStr = localStorage.getItem("user");

  // Check if user is logged in
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);

    // Check if user has required role
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on actual role
      if (user.role === "admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/worker" replace />;
      }
    }

    return children;
  } catch (error) {
    // If user data is corrupted, logout and redirect to login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
};

export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

export const WorkerRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="worker">{children}</ProtectedRoute>;
};

export const AuthenticatedRoute = ({ children }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};
