import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const EmployeeForm = ({ employee, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        email: employee.email || "",
        position: employee.position || "",
        department: employee.department || "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        // Update employee
        await API.put(`employees/${employee.id}/`, formData);
      } else {
        // Add new employee
        await API.post("employees/", formData);
      }
      onClose(); // close form + refresh parent list
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving employee");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {employee ? "Edit Employee" : "Add Employee"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

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
