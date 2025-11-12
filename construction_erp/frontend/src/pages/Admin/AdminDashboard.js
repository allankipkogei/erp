import React, { useEffect, useState } from "react";
import { fetchDashboardStats } from "../../services/dashboard";
import { Button } from "../../components/ui/button";
import { PlusCircle, Users, Building2, Wrench, AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-lg text-gray-700 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" />
              Welcome back! Here's your overview
            </p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={() => navigate("/projects/create")}
          >
            <PlusCircle size={20} />
            Add New Project
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            icon={Building2} 
            title="Total Projects" 
            value={stats.projects} 
            buttonText="View Projects" 
            color="blue" 
            onClick={() => navigate("/projects")} 
          />
          <StatCard 
            icon={Users} 
            title="Employees" 
            value={stats.employees} 
            buttonText="Manage Employees" 
            color="green" 
            onClick={() => navigate("/employees")} 
          />
          <StatCard 
            icon={Wrench} 
            title="Equipment" 
            value={stats.equipments} 
            buttonText="Manage Equipment" 
            color="orange" 
            onClick={() => navigate("/equipment")} 
          />
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, buttonText, color = "blue", onClick }) => {
  const colorClasses = {
    blue: "text-blue-600 border-blue-200",
    green: "text-green-600 border-green-200",
    orange: "text-orange-600 border-orange-200"
  };
  const bgClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100",
    green: "bg-gradient-to-br from-green-50 to-green-100",
    orange: "bg-gradient-to-br from-orange-50 to-orange-100"
  };
  
  return (
    <div className={`${bgClasses[color]} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${colorClasses[color]} hover:-translate-y-1`}>
      <Icon className={`mx-auto mb-4 ${colorClasses[color]}`} size={48} />
      <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">{title}</h2>
      <p className={`text-4xl font-bold text-center mb-4 ${colorClasses[color]}`}>{value}</p>
      <Button 
        className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 shadow-md transition-all duration-300"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};
