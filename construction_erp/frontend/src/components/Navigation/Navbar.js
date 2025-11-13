import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, 
  Menu, 
  X, 
  Home, 
  Users, 
  Wrench, 
  ClipboardList, 
  Package, 
  DollarSign, 
  BarChart, 
  MapPin,
  Calendar,
  User,
  LogOut
} from "lucide-react";
import { Button } from "../ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState("worker");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get user role from localStorage or API
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setUserRole(user.role || "worker");
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const adminMenuItems = [
    { path: "/admin", icon: Home, label: "Dashboard" },
    { path: "/projects", icon: Building2, label: "Projects" },
    { path: "/employees", icon: Users, label: "Employees" },
    { path: "/equipment", icon: Wrench, label: "Equipment" },
    { path: "/tasks", icon: ClipboardList, label: "Tasks" },
    { path: "/inventory", icon: Package, label: "Inventory" },
    { path: "/finance", icon: DollarSign, label: "Finance" },
    { path: "/sites", icon: MapPin, label: "Sites" },
    { path: "/reports", icon: BarChart, label: "Reports" },
  ];

  const workerMenuItems = [
    { path: "/worker", icon: Home, label: "Dashboard" },
    { path: "/tasks", icon: ClipboardList, label: "My Tasks" },
    { path: "/equipment", icon: Wrench, label: "Equipment" },
    { path: "/attendance", icon: Calendar, label: "Attendance" },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : workerMenuItems;

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(userRole === "admin" ? "/admin" : "/worker")}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-black text-xl">Construction ERP</h1>
              <p className="text-blue-100 text-xs font-medium">
                {userRole === "admin" ? "Admin Portal" : "Worker Portal"}
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isActive={isActive(item.path)}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              onClick={() => navigate("/profile")}
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <User size={18} />
              Profile
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-blue-700 border-t border-blue-500">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <MobileNavItem
                key={item.path}
                path={item.path}
                icon={item.icon}
                label={item.label}
                isActive={isActive(item.path)}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              />
            ))}
            <div className="pt-4 border-t border-blue-500 space-y-2">
              <Button
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-4 py-3 rounded-xl flex items-center gap-2 justify-center"
              >
                <User size={20} />
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl flex items-center gap-2 justify-center"
              >
                <LogOut size={20} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

const NavItem = ({ path, icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
        isActive
          ? "bg-white text-blue-600 shadow-lg"
          : "text-white hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </button>
  );
};

const MobileNavItem = ({ path, icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
        isActive
          ? "bg-white text-blue-600 shadow-lg"
          : "text-white hover:bg-white/10"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
};
