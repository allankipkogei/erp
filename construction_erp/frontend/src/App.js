import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout & Protection
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/Account/Login";
import Register from "./pages/Account/Register";
import Profile from "./pages/Account/Profile";
import Unauthorized from "./pages/Account/Unauthorized";

// Dashboards
import AdminDashboard from "./pages/Admin/AdminDashboard";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import Dashboard from "./pages/Core/Dashboard";
import Settings from "./pages/Core/Settings";

// Project Management
import Projects from "./pages/ProjectManagement/Projects";
import Tasks from "./pages/ProjectManagement/Tasks";
import Milestones from "./pages/ProjectManagement/Milestones";
import ProjectDocuments from "./pages/ProjectManagement/ProjectDocuments";
import ProjectTeam from "./pages/ProjectManagement/ProjectTeam";

// HR
import Employees from "./pages/HR/Employees";
import Departments from "./pages/HR/Departments";
import Roles from "./pages/HR/Roles";
import Attendance from "./pages/HR/Attendance";
import Payroll from "./pages/HR/Payroll";
import Leave from "./pages/HR/Leave";

// Equipment
import EquipmentList from "./pages/Equipment/EquipmentList";
import Assignments from "./pages/Equipment/Assignments";
import Maintenance from "./pages/Equipment/Maintenance";
import UsageLogs from "./pages/Equipment/UsageLogs";

// Finance
import Expenses from "./pages/Finance/Expenses";
import Income from "./pages/Finance/Income";
import Invoices from "./pages/Finance/Invoices";
import Payments from "./pages/Finance/Payments";
import Budgets from "./pages/Finance/Budgets";

// Inventory
import Warehouses from "./pages/Inventory/Warehouses";
import Items from "./pages/Inventory/Items";
import Stocks from "./pages/Inventory/Stocks";
import StockTransactions from "./pages/Inventory/StockTransactions";

// Procurement
import Suppliers from "./pages/Procurement/Suppliers";
import PurchaseRequests from "./pages/Procurement/PurchaseRequests";
import PurchaseOrders from "./pages/Procurement/PurchaseOrders";

// Reports
import Reports from "./pages/Reports/Reports";

// Site Management
import Sites from "./pages/SiteManagement/Sites";
import DailyLogs from "./pages/SiteManagement/DailyLogs";
import SafetyRecords from "./pages/SiteManagement/SafetyRecords";
import SiteInspections from "./pages/SiteManagement/SiteInspections";

// Fallback Page
const NotFound = () => <h2 className="p-8 text-center text-xl">Page Not Found</h2>;

// ✅ Role-based dashboard selector
function RoleBasedDashboard() {
  const { user } = useAuth();
  const dashboards = {
    admin: <AdminDashboard />,
    worker: <WorkerDashboard />,
  };
  return dashboards[user?.role] || <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              localStorage.getItem("access") ? (
                <Navigate to="/" replace />
              ) : (
                <Login />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected ERP Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<RoleBasedDashboard />} />

                    {/* Core */}
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />

                    {/* Project Management */}
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/milestones" element={<Milestones />} />
                    <Route path="/project-documents" element={<ProjectDocuments />} />
                    <Route path="/project-team" element={<ProjectTeam />} />

                    {/* HR */}
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/leave" element={<Leave />} />

                    {/* Equipment */}
                    <Route path="/equipment-list" element={<EquipmentList />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/usage-logs" element={<UsageLogs />} />

                    {/* Finance */}
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/budgets" element={<Budgets />} />

                    {/* Inventory */}
                    <Route path="/warehouses" element={<Warehouses />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/stocks" element={<Stocks />} />
                    <Route path="/stock-transactions" element={<StockTransactions />} />

                    {/* Procurement */}
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/purchase-requests" element={<PurchaseRequests />} />
                    <Route path="/purchase-orders" element={<PurchaseOrders />} />

                    {/* Reports */}
                    <Route path="/reports" element={<Reports />} />

                    {/* Site Management */}
                    <Route path="/sites" element={<Sites />} />
                    <Route path="/daily-logs" element={<DailyLogs />} />
                    <Route path="/safety-records" element={<SafetyRecords />} />
                    <Route path="/site-inspections" element={<SiteInspections />} />

                    {/* 404 Fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
