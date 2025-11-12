import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { PlusCircle, Users, RefreshCw, AlertCircle, Mail, Phone, Briefcase, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/employees/");
      const data = response.data.results || response.data || [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading employees:", err);
      setError(err.message || "Failed to load employees.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Employees
            </h1>
            <p className="text-gray-600 text-lg font-medium">Manage your team members</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
            onClick={() => navigate("/employees/create")}
          >
            <PlusCircle size={22} />
            Add Employee
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadEmployees}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Employees"
            value={employees.length}
            color="blue"
          />
          <StatCard 
            title="Active"
            value={employees.filter(e => e.is_active !== false).length}
            color="green"
          />
          <StatCard 
            title="Departments"
            value={new Set(employees.map(e => e.department).filter(Boolean)).size}
            color="purple"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Employees Grid */}
        {filteredEmployees.length === 0 && !error ? (
          <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <Users className="text-emerald-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              {searchTerm ? "No Employees Found" : "No Employees Yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {searchTerm 
                ? "Try adjusting your search criteria" 
                : "Start by adding your first team member"}
            </p>
            {!searchTerm && (
              <Button 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
                onClick={() => navigate("/employees/create")}
              >
                <PlusCircle size={24} className="mr-2" />
                Add First Employee
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }) => {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    green: {
      gradient: "from-green-500 to-emerald-600",
      bg: "from-green-50 to-emerald-100",
      text: "text-green-700",
      border: "border-green-300"
    },
    purple: {
      gradient: "from-purple-500 to-indigo-600",
      bg: "from-purple-50 to-indigo-100",
      text: "text-purple-700",
      border: "border-purple-300"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${scheme.border}`}>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-4xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};

const EmployeeCard = ({ employee }) => {
  const getInitials = () => {
    const first = employee.first_name?.[0] || employee.email?.[0] || 'E';
    const last = employee.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  const getFullName = () => {
    if (employee.first_name || employee.last_name) {
      return `${employee.first_name || ''} ${employee.last_name || ''}`.trim();
    }
    return employee.email || 'Employee';
  };

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-emerald-400">
      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-bold">{getInitials()}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {getFullName()}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            {employee.position || 'No Position'}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 pt-4 border-t-2 border-gray-100">
        {employee.email && (
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={16} className="text-emerald-600" />
            <span className="text-sm truncate">{employee.email}</span>
          </div>
        )}
        
        {employee.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} className="text-emerald-600" />
            <span className="text-sm">{employee.phone}</span>
          </div>
        )}

        {employee.department && (
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase size={16} className="text-emerald-600" />
            <span className="text-sm">{employee.department}</span>
          </div>
        )}

        {employee.hire_date && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-emerald-600" />
            <span className="text-sm">
              Joined: {new Date(employee.hire_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-4 pt-4 border-t-2 border-gray-100">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
          employee.is_active !== false
            ? 'bg-green-100 text-green-800 border border-green-300'
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {employee.is_active !== false ? '✅ Active' : '❌ Inactive'}
        </span>
      </div>
    </div>
  );
};
