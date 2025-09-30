import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const AssignmentForm = ({ assignment, onClose }) => {
  const [formData, setFormData] = useState({
    equipment: "",
    employee: "",
    start_date: "",
    end_date: "",
  });

  // If editing, preload existing data
  useEffect(() => {
    if (assignment) {
      setFormData({
        equipment: assignment.equipment || "",
        employee: assignment.employee || "",
        start_date: assignment.start_date || "",
        end_date: assignment.end_date || "",
      });
    }
  }, [assignment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (assignment) {
        await API.put(`assignments/${assignment.id}/`, formData);
      } else {
        await API.post("assignments/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving assignment");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {assignment ? "Edit Assignment" : "Add Assignment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Equipment */}
        <div>
          <label className="block mb-1 font-medium">Equipment</label>
          <input
            type="text"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            placeholder="Equipment ID or Name"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Employee */}
        <div>
          <label className="block mb-1 font-medium">Employee</label>
          <input
            type="text"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            placeholder="Employee ID or Name"
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
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

export default AssignmentForm;
