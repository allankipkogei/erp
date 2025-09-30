import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const BudgetForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    category: "",
    allocated: "",
    spent: "",
    period: "",
  });

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (record) {
        await API.put(`budgets/${record.id}/`, formData);
      } else {
        await API.post("budgets/", formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving budget:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {record ? "Edit Budget" : "Add Budget"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Allocated (Ksh)</label>
            <input
              type="number"
              name="allocated"
              value={formData.allocated}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Spent (Ksh)</label>
            <input
              type="number"
              name="spent"
              value={formData.spent}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Period</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Jan 2025, Q1 2025"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              {record ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetForm;
