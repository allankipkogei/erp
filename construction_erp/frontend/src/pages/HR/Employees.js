import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import EmployeeForm from "./EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get("employees/");
      setEmployees(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const prevEmployees = [...employees];
      setEmployees(employees.filter((emp) => emp.id !== id));
      try {
        await API.delete(`employees/${id}/`);
      } catch (err) {
        console.error(err);
        setEmployees(prevEmployees); // rollback on failure
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Employees</h1>
      <button
        onClick={() => { setEditingEmployee(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Employee
      </button>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => { setShowForm(false); fetchEmployees(); }}
        />
      )}

      {loading && <p>Loading employees...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {employees.length === 0 && !loading && (
        <p className="text-gray-500">No employees found. Add one above.</p>
      )}

      <ul className="space-y-2">
        {employees.map((employee) => (
          <li
            key={employee.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>{employee.name} - {employee.position}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(employee)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(employee.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employees;
