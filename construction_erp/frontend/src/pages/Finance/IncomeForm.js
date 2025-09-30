import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const IncomeForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (record) {
      setFormData({
        source: record.source || "",
        amount: record.amount || "",
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
        await API.put(`income/${record.id}/`, formData);
      } else {
        await API.post("income/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-4">
        {record ? "Edit Income Record" : "Add Income Record"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium">Source</label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
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

export default IncomeForm;
