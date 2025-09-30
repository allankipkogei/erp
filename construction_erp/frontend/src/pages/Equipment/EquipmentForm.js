import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const EquipmentForm = ({ equipment, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    status: "Available",
    assigned_to: "",
  });

  // If editing, pre-fill form
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || "",
        category: equipment.category || "",
        status: equipment.status || "Available",
        assigned_to: equipment.assigned_to || "",
      });
    }
  }, [equipment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (equipment) {
        // Update
        await API.put(`equipment/${equipment.id}/`, formData);
      } else {
        // Create
        await API.post("equipment/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving equipment");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {equipment ? "Edit Equipment" : "Add Equipment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
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

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Retired">Retired</option>
          </select>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block mb-1 font-medium">Assigned To</label>
          <input
            type="text"
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            placeholder="Employee Name or ID"
            className="w-full border px-3 py-2 rounded"
          />
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

export default EquipmentForm;
