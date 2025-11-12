import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchCurrentUser } from "../services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      // Try to fetch the latest user info from backend
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // fallback to stored user if API fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = (userData, tokens) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
