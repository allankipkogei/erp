import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const StockTransactionForm = ({ transaction, onClose }) => {
  const [formData, setFormData] = useState({
    item: "",
    type: "IN", // could be "IN" or "OUT"
    quantity: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get("items/");
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();

    if (transaction) {
      setFormData({
        item: transaction.item || "",
        type: transaction.type || "IN",
        quantity: transaction.quantity || "",
        date: transaction.date
          ? new Date(transaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (transaction) {
        await API.put(`stock-transactions/${transaction.id}/`, formData);
      } else {
        await API.post("stock-transactions/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 mb-4">
      <h2 className="text-xl font-bold mb-4">
        {transaction ? "Edit Transaction" : "Add Transaction"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Item</label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="">Select Item</option>
            {items.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
            required
          >
            <option value="IN">IN (Stock In)</option>
            <option value="OUT">OUT (Stock Out)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full"
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
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {transaction ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockTransactionForm;
