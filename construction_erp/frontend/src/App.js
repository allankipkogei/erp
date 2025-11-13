import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Protected Route Components
import { AdminRoute, WorkerRoute, AuthenticatedRoute } from "./components/ProtectedRoute";

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
        {/* Public Routes - No Authentication Required */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin-Only Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Worker-Only Routes */}
        <Route path="/worker" element={<WorkerRoute><WorkerDashboard /></WorkerRoute>} />
        <Route path="/worker-dashboard" element={<WorkerRoute><WorkerDashboard /></WorkerRoute>} />

        {/* Authenticated Routes - Both Admin & Worker Can Access */}
        <Route path="/projects" element={<AuthenticatedRoute><Projects /></AuthenticatedRoute>} />
        <Route path="/projects/create" element={<AdminRoute><ProjectCreate /></AdminRoute>} />
        <Route path="/projects/:id" element={<AuthenticatedRoute><ProjectDetail /></AuthenticatedRoute>} />
        <Route path="/projects/:id/edit" element={<AdminRoute><ProjectEdit /></AdminRoute>} />

        {/* HR Routes - Admin Only */}
        <Route path="/employees" element={<AdminRoute><Employees /></AdminRoute>} />
        <Route path="/employees/create" element={<AdminRoute><EmployeeCreate /></AdminRoute>} />
        <Route path="/employees/:id/edit" element={<AdminRoute><EmployeeEdit /></AdminRoute>} />

        {/* Equipment Routes - Both Can View, Admin Can Create */}
        <Route path="/equipment" element={<AuthenticatedRoute><Equipment /></AuthenticatedRoute>} />
        <Route path="/equipment/create" element={<AdminRoute><EquipmentCreate /></AdminRoute>} />

        {/* Task Routes - Authenticated */}
        <Route path="/tasks" element={<AuthenticatedRoute><Tasks /></AuthenticatedRoute>} />
        <Route path="/tasks/create" element={<AdminRoute><TaskCreate /></AdminRoute>} />

        {/* Site Routes - Authenticated */}
        <Route path="/sites" element={<AuthenticatedRoute><Sites /></AuthenticatedRoute>} />
        <Route path="/sites/create" element={<AdminRoute><SiteCreate /></AdminRoute>} />
        <Route path="/daily-log" element={<AuthenticatedRoute><DailyLog /></AuthenticatedRoute>} />
        <Route path="/daily-log/create" element={<AuthenticatedRoute><DailyLogCreate /></AuthenticatedRoute>} />
        <Route path="/safety-record" element={<AuthenticatedRoute><SafetyRecord /></AuthenticatedRoute>} />
        <Route path="/safety-record/create" element={<AuthenticatedRoute><SafetyRecordCreate /></AuthenticatedRoute>} />
        <Route path="/site-inspection" element={<AuthenticatedRoute><SiteInspection /></AuthenticatedRoute>} />

        {/* Inventory Routes - Admin Only */}
        <Route path="/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />

        {/* Finance Routes - Admin Only */}
        <Route path="/finance" element={<AdminRoute><Finance /></AdminRoute>} />

        {/* Procurement Routes - Admin Only */}
        <Route path="/purchase-request" element={<AdminRoute><PurchaseRequest /></AdminRoute>} />

        {/* Reports Routes - Admin Only */}
        <Route path="/reports" element={<AdminRoute><Reports /></AdminRoute>} />

        {/* Attendance Routes - Authenticated */}
        <Route path="/attendance" element={<AuthenticatedRoute><Attendance /></AuthenticatedRoute>} />

        {/* Profile Route - Authenticated */}
        <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
