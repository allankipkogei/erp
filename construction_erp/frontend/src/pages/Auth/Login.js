import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Mail, Lock, AlertCircle, RefreshCw, Building2 } from "lucide-react";
import { login } from "../../services/api";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      const data = await login(formData.email, formData.password);
      
      console.log("Login successful:", data);

      // Redirect based on user role
      const role = data.user?.role || "worker";
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/worker-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-white space-y-6">
          {/* Logo Image */}
          <div className="w-full max-w-md">
            <img 
              src="/cornerstone-logo.png" 
              alt="Cornerstone ERP" 
              className="w-full h-auto rounded-3xl shadow-2xl"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback branding if image fails to load */}
            <div className="hidden flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-12 rounded-3xl shadow-2xl">
              <div className="w-32 h-32 mb-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                <Building2 className="text-white" size={64} />
              </div>
              <h1 className="text-5xl font-black mb-4 text-center">
                Cornerstone
              </h1>
              <h2 className="text-3xl font-light mb-6 text-center opacity-90">
                ERP
              </h2>
              <p className="text-xl text-center max-w-md opacity-80">
                Construction Enterprise Resource Planning System
              </p>
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Welcome Back!</h3>
            <p className="text-lg opacity-90">
              Manage your construction projects with ease
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span>Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Finance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Building2 className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Sign In
            </h2>
            <p className="text-gray-600 text-lg">Access your construction dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="animate-spin" size={20} />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Demo Credentials: <br />
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin@example.com</span> / 
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
