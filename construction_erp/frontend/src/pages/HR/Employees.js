import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function EmployeeForm({ employee, onClose }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    salary: "",
    hire_date: "",
    is_active: true,
  });

  useEffect(() => {
    // Load form data if editing an existing employee
    if (employee) {
      setFormData({
        name: employee.name || "",
        role: employee.role || "",
        department: employee.department || "",
        salary: employee.salary || "",
        hire_date: employee.hire_date || "",
        is_active: employee.is_active ?? true,
      });
    }

    // Fetch departments if your model has a FK
    const fetchDepartments = async () => {
      try {
        const res = await API.get("/departments/"); // change if you have a different endpoint
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };

    fetchDepartments();
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
      alert("✅ Employee saved successfully!");
      onClose();
    } catch (err) {
      console.error("Error saving employee:", err.response?.data || err);
      alert("❌ Failed to save employee. Check required fields.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <label className="block mb-2">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <label className="block mb-2">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <label className="block mb-2">Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <label className="block mb-2">Hire Date</label>
        <input
          type="date"
          name="hire_date"
          value={formData.hire_date}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mb-3"
        />

        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Active Employee</label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {employee ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
