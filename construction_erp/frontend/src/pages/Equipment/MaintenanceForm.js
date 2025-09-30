import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const MaintenanceForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    equipment_name: "",
    status: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        equipment_name: record.equipment_name || "",
        status: record.status || "",
        date: record.date || "",
        notes: record.notes || "",
      });
    }
  }, [record]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (record) {
        await API.put(`maintenance/${record.id}/`, formData);
      } else {
        await API.post("maintenance/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-4">
        {record ? "Edit Maintenance Record" : "Add Maintenance Record"}
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
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
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
          <label className="block font-medium">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {record ? "Update" : "Create"}
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

export default MaintenanceForm;
