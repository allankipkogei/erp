import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Dashboard Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";

// Profile
import Profile from "./pages/Profile/Profile";

// Project Management
import Projects from "./pages/Projects/Projects";
import ProjectCreate from "./pages/Projects/ProjectCreate";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import ProjectEdit from "./pages/Projects/ProjectEdit";

// HR Pages
import Employees from "./pages/HR/Employees";
import EmployeeCreate from "./pages/HR/EmployeeCreate";
import Attendance from "./pages/HR/Attendance";

// Equipment
import Equipment from "./pages/Equipment/Equipment";
import EquipmentCreate from "./pages/Equipment/EquipmentCreate";

// Tasks
import Tasks from "./pages/Tasks/Tasks";
import TaskCreate from "./pages/Tasks/TaskCreate";

// Inventory
import Inventory from "./pages/Inventory/Inventory";
import InventoryCreate from "./pages/Inventory/InventoryCreate";
import WarehouseCreate from "./pages/Inventory/WarehouseCreate";

// Finance
import Finance from "./pages/Finance/Finance";
import InvoiceCreate from "./pages/Finance/InvoiceCreate";
import ExpenseCreate from "./pages/Finance/ExpenseCreate";

// Sites
import Sites from "./pages/Sites/Sites";
import SiteCreate from "./pages/Sites/SiteCreate";
import DailyLog from "./pages/Sites/DailyLog";
import SafetyRecord from "./pages/Sites/SafetyRecord";
import SiteInspection from "./pages/Sites/SiteInspection";

// Reports
import Reports from "./pages/Reports/Reports";
import ReportCreate from "./pages/Reports/ReportCreate";

// Procurement
import PurchaseRequest from "./pages/Procurement/PurchaseRequest";
import PurchaseOrder from "./pages/Procurement/PurchaseOrder";

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        
        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />
        
        {/* Project Routes */}
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/create" element={<ProjectCreate />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<ProjectEdit />} />
        
        {/* HR Routes */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/create" element={<EmployeeCreate />} />
        <Route path="/attendance" element={<Attendance />} />
        
        {/* Equipment Routes */}
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/create" element={<EquipmentCreate />} />
        
        {/* Task Routes */}
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/create" element={<TaskCreate />} />
        
        {/* Inventory Routes */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/inventory/create" element={<InventoryCreate />} />
        <Route path="/warehouses/create" element={<WarehouseCreate />} />
        
        {/* Finance Routes */}
        <Route path="/finance" element={<Finance />} />
        <Route path="/finance/invoice/create" element={<InvoiceCreate />} />
        <Route path="/finance/expense/create" element={<ExpenseCreate />} />
        
        {/* Site Management Routes */}
        <Route path="/sites" element={<Sites />} />
        <Route path="/sites/create" element={<SiteCreate />} />
        <Route path="/sites/:id" element={<NotFound />} />
        <Route path="/daily-log" element={<DailyLog />} />
        <Route path="/safety-record" element={<SafetyRecord />} />
        <Route path="/site-inspection" element={<SiteInspection />} />
        
        {/* Reports Routes */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/create" element={<ReportCreate />} />
        
        {/* Procurement Routes */}
        <Route path="/purchase-request" element={<PurchaseRequest />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        
        {/* 404 Not Found - MUST BE LAST */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
