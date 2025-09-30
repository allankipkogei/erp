import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ItemForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    warehouse: "",
  });
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await API.get("warehouses/");
        setWarehouses(res.data);
      } catch (err) {
        console.error("Error fetching warehouses:", err);
      }
    };
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (record) {
        await API.put(`items/${record.id}/`, formData);
      } else {
        await API.post("items/", formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {record ? "Edit Item" : "Add Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

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
            <label className="block text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Warehouse</label>
            <select
              name="warehouse"
              value={formData.warehouse}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((wh) => (
                <option key={wh.id} value={wh.id}>
                  {wh.name} ({wh.location})
                </option>
              ))}
            </select>
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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {record ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
