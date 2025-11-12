import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Dashboard Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";

// Project Management
import Projects from "./pages/Projects/Projects";
import ProjectCreate from "./pages/Projects/ProjectCreate";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import ProjectEdit from "./pages/Projects/ProjectEdit";

// HR Management
import Employees from "./pages/HR/Employees";
import EmployeeCreate from "./pages/HR/EmployeeCreate";
import EmployeeEdit from "./pages/HR/EmployeeEdit";

// Equipment Management
import Equipment from "./pages/Equipment/Equipment";
import EquipmentCreate from "./pages/Equipment/EquipmentCreate";

// Tasks
import Tasks from "./pages/Tasks/Tasks";
import TaskCreate from "./pages/Tasks/TaskCreate";

// Sites
import Sites from "./pages/Sites/Sites";
import SiteCreate from "./pages/Sites/SiteCreate";
import DailyLog from "./pages/Sites/DailyLog";
import DailyLogCreate from "./pages/Sites/DailyLogCreate";
import SafetyRecord from "./pages/Sites/SafetyRecord";
import SafetyRecordCreate from "./pages/Sites/SafetyRecordCreate";
import SiteInspection from "./pages/Sites/SiteInspection";

// Inventory
import Inventory from "./pages/Inventory/Inventory";

// Finance
import Finance from "./pages/Finance/Finance";

// Procurement
import PurchaseRequest from "./pages/Procurement/PurchaseRequest";

// Reports
import Reports from "./pages/Reports/Reports";

// Attendance
import Attendance from "./pages/Attendance/Attendance";

// Profile
import Profile from "./pages/Profile/Profile";

// 404 Page - Create a simple one
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
        Go Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes - ADD THESE ALIASES */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />

        {/* Project Routes */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/create" element={<ProjectCreate />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<ProjectEdit />} />

        {/* HR Routes */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<EmployeeCreate />} />
        <Route path="/employees/:id/edit" element={<EmployeeEdit />} />

        {/* Equipment Routes */}
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/create" element={<EquipmentCreate />} />

        {/* Task Routes */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/create" element={<TaskCreate />} />

        {/* Site Routes */}
        <Route path="/sites" element={<Sites />} />
        <Route path="/sites/create" element={<SiteCreate />} />
        <Route path="/daily-log" element={<DailyLog />} />
        <Route path="/daily-log/create" element={<DailyLogCreate />} />
        <Route path="/safety-record" element={<SafetyRecord />} />
        <Route path="/safety-record/create" element={<SafetyRecordCreate />} />
        <Route path="/site-inspection" element={<SiteInspection />} />

        {/* Inventory Route */}
        <Route path="/inventory" element={<Inventory />} />

        {/* Finance Route */}
        <Route path="/finance" element={<Finance />} />

        {/* Procurement Route */}
        <Route path="/purchase-request" element={<PurchaseRequest />} />

        {/* Reports Route */}
        <Route path="/reports" element={<Reports />} />

        {/* Attendance Route */}
        <Route path="/attendance" element={<Attendance />} />

        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
