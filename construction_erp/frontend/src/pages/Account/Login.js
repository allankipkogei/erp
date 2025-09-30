import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState(""); // must match CustomUser.USERNAME_FIELD
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", { username, password });
    setError("");

    try {
      // 1️⃣ Obtain JWT tokens
      const tokenRes = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: username,
        password: password
      }, {
        headers: { "Content-Type": "application/json" }
      });

      const { access, refresh } = tokenRes.data;

      // 2️⃣ Fetch user profile
      const profileRes = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${access}` }
      });

      const user = profileRes.data;

      // 3️⃣ Save user + tokens in context/localStorage
      login(user, access, refresh);

      // Optional: set default axios Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 4️⃣ Redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin-dashboard");
          break;
        case "manager":
          navigate("/manager-dashboard");
          break;
        case "worker":
          navigate("/worker-dashboard");
          break;
        default:
          navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Construction ERP</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <form onSubmit={handleLogin} className="login-form">
          {error && <p className="error-message">{error}</p>}

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <a href="/register">Sign up here</a>
        </p>
        <p className="login-footer">
          <a href="/forgot-password">Forgot your password?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
