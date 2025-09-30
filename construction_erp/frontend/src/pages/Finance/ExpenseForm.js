import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ExpenseForm = ({ expense, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || "",
        amount: expense.amount || "",
        category: expense.category || "",
        date: expense.date || "",
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expense) {
        await API.put(`expenses/${expense.id}/`, formData);
      } else {
        await API.post("expenses/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded mb-4">
      <h2 className="text-xl font-bold mb-4">
        {expense ? "Edit Expense" : "Add Expense"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Select Category</option>
            <option value="Labor">Labor</option>
            <option value="Materials">Materials</option>
            <option value="Equipment">Equipment</option>
            <option value="Transport">Transport</option>
            <option value="Miscellaneous">Miscellaneous</option>
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
            {expense ? "Update" : "Create"}
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

export default ExpenseForm;
