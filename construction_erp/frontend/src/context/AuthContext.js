import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load from localStorage when app starts
        const authData = localStorage.getItem("auth");
        if (authData) {
            const parsed = JSON.parse(authData);
            setUser(parsed.user);
            setAccessToken(parsed.accessToken);
            setRefreshToken(parsed.refreshToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, accessToken, refreshToken) => {
        setUser(userData);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        // Save to localStorage
        localStorage.setItem(
            "auth",
            JSON.stringify({ user: userData, accessToken, refreshToken })
        );
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("auth");
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
