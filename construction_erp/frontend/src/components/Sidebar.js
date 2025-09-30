// src/components/Sidebar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="sidebar bg-gray-900 text-white h-screen w-64 p-4">
      <h2 className="text-lg font-bold mb-6">ERP System</h2>
      <nav>
        <ul className="space-y-1">

          {/* Dashboard */}
          <li>
            <Link to="/" className="block py-2 px-3 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>

          {/* Settings */}
          <li>
            <Link to="/settings" className="block py-2 px-3 hover:bg-gray-700 rounded">
              Settings
            </Link>
          </li>

          {/* Project Management */}
          <li>
            <button
              onClick={() => toggleMenu("project")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>Project Management</span>
              {openMenu === "project" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "project" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/projects" className="block py-1 hover:underline">Projects</Link></li>
                <li><Link to="/tasks" className="block py-1 hover:underline">Tasks</Link></li>
                <li><Link to="/milestones" className="block py-1 hover:underline">Milestones</Link></li>
                <li><Link to="/project-documents" className="block py-1 hover:underline">Documents</Link></li>
                <li><Link to="/project-team" className="block py-1 hover:underline">Team</Link></li>
              </ul>
            )}
          </li>

          {/* HR */}
          <li>
            <button
              onClick={() => toggleMenu("hr")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>HR</span>
              {openMenu === "hr" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "hr" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/employees">Employees</Link></li>
                <li><Link to="/departments">Departments</Link></li>
                <li><Link to="/roles">Roles</Link></li>
                <li><Link to="/attendance">Attendance</Link></li>
                <li><Link to="/payroll">Payroll</Link></li>
                <li><Link to="/leave">Leave</Link></li>
              </ul>
            )}
          </li>

          {/* Equipment */}
          <li>
            <button
              onClick={() => toggleMenu("equipment")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>Equipment</span>
              {openMenu === "equipment" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "equipment" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/equipment-list">Equipment List</Link></li>
                <li><Link to="/assignments">Assignments</Link></li>
                <li><Link to="/maintenance">Maintenance</Link></li>
                <li><Link to="/usage-logs">Usage Logs</Link></li>
              </ul>
            )}
          </li>

          {/* Finance */}
          <li>
            <button
              onClick={() => toggleMenu("finance")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>Finance</span>
              {openMenu === "finance" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "finance" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/expenses">Expenses</Link></li>
                <li><Link to="/income">Income</Link></li>
                <li><Link to="/invoices">Invoices</Link></li>
                <li><Link to="/payments">Payments</Link></li>
                <li><Link to="/budgets">Budgets</Link></li>
              </ul>
            )}
          </li>

          {/* Inventory */}
          <li>
            <button
              onClick={() => toggleMenu("inventory")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>Inventory</span>
              {openMenu === "inventory" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "inventory" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/warehouses">Warehouses</Link></li>
                <li><Link to="/items">Items</Link></li>
                <li><Link to="/stocks">Stocks</Link></li>
                <li><Link to="/stock-transactions">Transactions</Link></li>
              </ul>
            )}
          </li>

          {/* Procurement */}
          <li>
            <button
              onClick={() => toggleMenu("procurement")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>Procurement</span>
              {openMenu === "procurement" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "procurement" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/suppliers">Suppliers</Link></li>
                <li><Link to="/purchase-requests">Purchase Requests</Link></li>
                <li><Link to="/purchase-orders">Purchase Orders</Link></li>
              </ul>
            )}
          </li>

          {/* Reports */}
          <li>
            <Link to="/reports" className="block py-2 px-3 hover:bg-gray-700 rounded">
              Reports
            </Link>
          </li>

          {/* Site Management */}
          <li>
            <button
              onClick={() => toggleMenu("site")}
              className="flex justify-between items-center w-full py-2 px-3 hover:bg-gray-700 rounded"
            >
              <span>Site Management</span>
              {openMenu === "site" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "site" && (
              <ul className="ml-4 mt-1 space-y-1">
                <li><Link to="/sites">Sites</Link></li>
                <li><Link to="/daily-logs">Daily Logs</Link></li>
                <li><Link to="/safety-records">Safety Records</Link></li>
                <li><Link to="/site-inspections">Inspections</Link></li>
              </ul>
            )}
          </li>

          {/* Logout */}
          <li>
            <Link to="/logout" className="block py-2 px-3 hover:bg-red-600 rounded">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
