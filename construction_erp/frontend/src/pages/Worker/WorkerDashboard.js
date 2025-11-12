import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { ClipboardList, Calendar, Wrench, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      // TODO: Replace with actual API call
      // const data = await fetchWorkerStats();
      // For now, use mock data
      setStats({
        assignedTasks: 12,
        completedTasks: 8,
        pendingTasks: 4,
        equipment: 3
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard data. Please try again.");
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Worker Dashboard</h1>
            <p className="text-gray-600">Track your tasks and assignments</p>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg"
              onClick={() => navigate("/tasks")}
            >
              <ClipboardList className="mr-2" size={20} />
              View My Tasks
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg"
              onClick={() => navigate("/attendance")}
            >
              <Calendar className="mr-2" size={20} />
              Mark Attendance
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-lg"
              onClick={() => navigate("/equipment")}
            >
              <Wrench className="mr-2" size={20} />
              My Equipment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, color = "blue" }) => {
  const colorClasses = {
    blue: "text-blue-600 border-blue-200",
    green: "text-green-600 border-green-200",
    orange: "text-orange-600 border-orange-200",
    purple: "text-purple-600 border-purple-200"
  };
  const bgClasses = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100",
    green: "bg-gradient-to-br from-green-50 to-green-100",
    orange: "bg-gradient-to-br from-orange-50 to-orange-100",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100"
  };
  
  return (
    <div className={`${bgClasses[color]} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${colorClasses[color]}`}>
      <Icon className={`mx-auto mb-3 ${colorClasses[color]}`} size={40} />
      <h3 className="text-sm font-semibold text-gray-700 text-center mb-2">{title}</h3>
      <p className={`text-3xl font-bold text-center ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};