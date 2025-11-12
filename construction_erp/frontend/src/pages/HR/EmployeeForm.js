import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const EmployeeForm = ({ employee, onClose }) => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    user: "",
    department: "",
    role: "",
    hire_date: "",
    salary: "",
    is_active: true,
  });

  // Load dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, deptRes, roleRes] = await Promise.all([
          API.get("/users/"),          // 👈 must exist in backend
          API.get("/departments/"),
          API.get("/roles/"),
        ]);
        setUsers(usersRes.data);
        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    };
    fetchData();
  }, []);

  // Pre-fill if editing
  useEffect(() => {
    if (employee) {
      setFormData({
        user: employee.user || "",
        department: employee.department || "",
        role: employee.role || "",
        hire_date: employee.hire_date || "",
        salary: employee.salary || "",
        is_active: employee.is_active ?? true,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await API.put(`/employees/${employee.id}/`, formData);
      } else {
        await API.post("/employees/", formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving employee:", err.response?.data || err);
      alert("Failed to save employee. Check console for details.");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {employee ? "Edit Employee" : "Add Employee"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User */}
        <div>
          <label className="block mb-1 font-medium">User</label>
          <select
            name="user"
            value={formData.user}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.email}
              </option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div>
          <label className="block mb-1 font-medium">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1 font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Hire Date */}
        <div>
          <label className="block mb-1 font-medium">Hire Date</label>
          <input
            type="date"
            name="hire_date"
            value={formData.hire_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block mb-1 font-medium">Salary (Ksh)</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Active */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Active</label>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
