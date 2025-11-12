import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { ClipboardList, Calendar, Wrench, AlertCircle, RefreshCw, CheckCircle, TrendingUp, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function WorkerDashboard() {
  const [stats, setStats] = useState({ 
    assignedTasks: 0, 
    completedTasks: 0, 
    pendingTasks: 0,
    equipment: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch real data from backend
      const [tasksRes, equipmentRes] = await Promise.allSettled([
        api.get("/tasks/"),
        api.get("/equipment/")
      ]);

      const tasks = tasksRes.status === 'fulfilled' ? (tasksRes.value.data.results || tasksRes.value.data || []) : [];
      const equipment = equipmentRes.status === 'fulfilled' ? (equipmentRes.value.data.results || equipmentRes.value.data || []) : [];

      setStats({
        assignedTasks: Array.isArray(tasks) ? tasks.length : 0,
        completedTasks: Array.isArray(tasks) ? tasks.filter(t => t.status === 'completed').length : 0,
        pendingTasks: Array.isArray(tasks) ? tasks.filter(t => t.status === 'pending').length : 0,
        equipment: Array.isArray(equipment) ? equipment.length : 0
      });
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Worker Dashboard
              </h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <TrendingUp size={20} className="text-green-500" />
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <StatCard 
              icon={ClipboardList} 
              title="Assigned Tasks" 
              value={stats.assignedTasks} 
              color="blue"
            />
            <StatCard 
              icon={CheckCircle} 
              title="Completed Tasks" 
              value={stats.completedTasks} 
              color="green"
            />
            <StatCard 
              icon={Calendar} 
              title="Pending Tasks" 
              value={stats.pendingTasks} 
              color="orange"
            />
            <StatCard 
              icon={Wrench} 
              title="Equipment Assigned" 
              value={stats.equipment} 
              color="purple"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <QuickActionButton
                icon={<ClipboardList size={24} />}
                title="View My Tasks"
                color="blue"
                onClick={() => navigate("/tasks")}
              />
              <QuickActionButton
                icon={<Calendar size={24} />}
                title="Mark Attendance"
                color="green"
                onClick={() => navigate("/attendance")}
              />
              <QuickActionButton
                icon={<Wrench size={24} />}
                title="My Equipment"
                color="orange"
                onClick={() => navigate("/equipment")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const StatCard = ({ icon: Icon, title, value, color = "blue" }) => {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
      bg: "from-blue-50 via-blue-100 to-indigo-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    green: {
      gradient: "from-emerald-500 via-green-600 to-teal-600",
      bg: "from-emerald-50 via-green-100 to-teal-100",
      text: "text-emerald-700",
      border: "border-emerald-300"
    },
    orange: {
      gradient: "from-amber-500 via-orange-600 to-red-600",
      bg: "from-amber-50 via-orange-100 to-red-100",
      text: "text-amber-700",
      border: "border-amber-300"
    },
    purple: {
      gradient: "from-purple-500 via-violet-600 to-indigo-600",
      bg: "from-purple-50 via-violet-100 to-indigo-100",
      text: "text-purple-700",
      border: "border-purple-300"
    }
  };
  
  const scheme = colorSchemes[color];
  
  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 ${scheme.border} hover:scale-105 transform`}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="text-white" size={32} />
      </div>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-3 uppercase tracking-wide">{title}</h3>
      <p className={`text-5xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};

const QuickActionButton = ({ icon, title, color, onClick }) => {
  const colorSchemes = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${colorSchemes[color]} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex flex-col items-center justify-center gap-3`}
    >
      {icon}
      <span className="text-base font-bold">{title}</span>
    </button>
  );
};