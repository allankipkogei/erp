import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, accessToken } = useAuth(); 
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    materials: 0,
    invoices: 0,
  });
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };

        const [projectsRes, tasksRes, materialsRes, invoicesRes] =
          await Promise.all([
            axios.get("http://127.0.0.1:8000/api/projects/", { headers }),
            axios.get("http://127.0.0.1:8000/api/tasks/", { headers }),
            axios.get("http://127.0.0.1:8000/api/materials/", { headers }),
            axios.get("http://127.0.0.1:8000/api/invoices/", { headers }),
          ]);

        setStats({
          projects: projectsRes.data.length,
          tasks: tasksRes.data.length,
          materials: materialsRes.data.length,
          invoices: invoicesRes.data.length,
        });

        // Optionally fetch activity logs
        const activityRes = await axios.get(
          "http://127.0.0.1:8000/api/activity/",
          { headers }
        );
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Error fetching dashboard stats", err);
      }
    };

    fetchStats();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-md mb-8">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.username || "User"} 👷
        </h1>
        <p className="text-sm opacity-90">
          Here’s what’s happening in your Construction ERP today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Projects" value={stats.projects} link="/projects" color="blue" />
        <StatCard title="Tasks" value={stats.tasks} link="/tasks" color="green" />
        <StatCard title="Materials" value={stats.materials} link="/inventory" color="yellow" />
        <StatCard title="Invoices" value={stats.invoices} link="/finance" color="red" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          {activity.length > 0 ? (
            activity.map((item, i) => <li key={i}>{item.message}</li>)
          ) : (
            <li>No recent activity</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Reusable card component
const StatCard = ({ title, value, link, color }) => {
  const colorMap = {
    blue: "text-blue-600 hover:underline text-blue-500",
    green: "text-green-600 hover:underline text-green-500",
    yellow: "text-yellow-600 hover:underline text-yellow-500",
    red: "text-red-600 hover:underline text-red-500",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className={`text-2xl font-bold ${colorMap[color].split(" ")[0]}`}>
        {value}
      </p>
      <Link to={link} className={`text-sm ${colorMap[color]}`}>
        {title === "Projects" ? "View all" : title === "Tasks" ? "Manage tasks" : title}
      </Link>
    </div>
  );
};

export default Dashboard;
