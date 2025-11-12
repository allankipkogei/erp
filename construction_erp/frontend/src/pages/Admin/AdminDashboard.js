import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/dashboard";
import { Button } from "../../components/ui/button";
import { PlusCircle, Users, Building2, Wrench, AlertCircle, RefreshCw, TrendingUp, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navigation/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, employees: 0, equipments: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
          {/* Header with Construction Theme */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <TrendingUp size={20} className="text-emerald-500" />
                <span className="font-medium">Construction Enterprise Resource Planning System</span>
              </p>
            </div>
            
            {/* Header Actions */}
            <div className="flex gap-3">
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
                onClick={() => navigate("/profile")}
              >
                <User size={20} />
                Profile
              </Button>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
                onClick={() => navigate("/projects/create")}
              >
                <PlusCircle size={22} />
                New Project
              </Button>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadStats}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Stats Grid with Enhanced Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <StatCard 
              icon={Building2} 
              title="Active Projects" 
              value={stats.projects} 
              buttonText="View All Projects" 
              color="blue" 
              onClick={() => navigate("/projects")} 
            />
            <StatCard 
              icon={Users} 
              title="Team Members" 
              value={stats.employees} 
              buttonText="Manage Team" 
              color="emerald" 
              onClick={() => navigate("/employees")} 
            />
            <StatCard 
              icon={Wrench} 
              title="Equipment Fleet" 
              value={stats.equipments} 
              buttonText="View Equipment" 
              color="amber" 
              onClick={() => navigate("/equipment")} 
            />
          </div>

          {/* Quick Access Grid */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Quick Access
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <QuickAccessButton 
                title="Tasks"
                icon="📋"
                onClick={() => navigate("/tasks")}
                color="blue"
              />
              <QuickAccessButton 
                title="Inventory"
                icon="📦"
                onClick={() => navigate("/inventory")}
                color="purple"
              />
              <QuickAccessButton 
                title="Finance"
                icon="💰"
                onClick={() => navigate("/finance")}
                color="green"
              />
              <QuickAccessButton 
                title="Sites"
                icon="🏗️"
                onClick={() => navigate("/sites")}
                color="orange"
              />
              <QuickAccessButton 
                title="Reports"
                icon="📊"
                onClick={() => navigate("/reports")}
                color="indigo"
              />
              <QuickAccessButton 
                title="Attendance"
                icon="📅"
                onClick={() => navigate("/attendance")}
                color="teal"
              />
              <QuickAccessButton 
                title="Procurement"
                icon="🛒"
                onClick={() => navigate("/purchase-request")}
                color="pink"
              />
              <QuickAccessButton 
                title="Safety"
                icon="🛡️"
                onClick={() => navigate("/safety-record")}
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const StatCard = ({ icon: Icon, title, value, buttonText, color = "blue", onClick }) => {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bg: "from-blue-50 via-blue-100 to-indigo-100",
      text: "text-blue-700",
      border: "border-blue-300",
      shadow: "shadow-blue-200"
    },
    emerald: {
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      bg: "from-emerald-50 via-green-100 to-teal-100",
      text: "text-emerald-700",
      border: "border-emerald-300",
      shadow: "shadow-emerald-200"
    },
    amber: {
      gradient: "from-amber-500 via-orange-600 to-red-600",
      bg: "from-amber-50 via-orange-100 to-red-100",
      text: "text-amber-700",
      border: "border-amber-300",
      shadow: "shadow-amber-200"
    }
  };

  const scheme = colorSchemes[color];
  
  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 ${scheme.border} hover:scale-105 transform ${scheme.shadow}`}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="text-white" size={32} />
      </div>
      <h2 className="text-sm font-bold text-gray-600 text-center mb-3 uppercase tracking-wide">{title}</h2>
      <p className={`text-5xl font-black text-center mb-6 ${scheme.text}`}>{value}</p>
      <Button 
        className={`w-full bg-white hover:bg-gradient-to-r ${scheme.gradient} hover:text-white ${scheme.text} hover:border-transparent border-2 ${scheme.border} font-bold py-3 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1`}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const QuickAccessButton = ({ title, icon, onClick, color }) => {
  const colorSchemes = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    indigo: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
    teal: "from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700",
    pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${colorSchemes[color]} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-sm font-bold">{title}</div>
    </button>
  );
};
