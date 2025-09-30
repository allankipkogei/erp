import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const DepartmentForm = ({ department, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        description: department.description || "",
      });
    }
  }, [department]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (department) {
        await API.put(`departments/${department.id}/`, formData);
      } else {
        await API.post("departments/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving department");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {department ? "Edit Department" : "Add Department"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Department Name</label>
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
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
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

export default DepartmentForm;
