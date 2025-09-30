import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const UsageLogForm = ({ log, onClose }) => {
  const [formData, setFormData] = useState({
    equipment_name: "",
    user_name: "",
    date: "",
    purpose: "",
  });

  useEffect(() => {
    if (log) {
      setFormData({
        equipment_name: log.equipment_name || "",
        user_name: log.user_name || "",
        date: log.date || "",
        purpose: log.purpose || "",
      });
    }
  }, [log]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (log) {
        await API.put(`usage-logs/${log.id}/`, formData);
      } else {
        await API.post("usage-logs/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-4">
        {log ? "Edit Usage Log" : "Add Usage Log"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block font-medium">Equipment Name</label>
          <input
            type="text"
            name="equipment_name"
            value={formData.equipment_name}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">User Name</label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Purpose</label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {log ? "Update" : "Create"}
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

export default UsageLogForm;
