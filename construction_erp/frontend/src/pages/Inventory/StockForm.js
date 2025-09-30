import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const StockForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    item: "",
    warehouse: "",
    quantity: "",
    reorder_level: "",
  });

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, warehousesRes] = await Promise.all([
          API.get("items/"),
          API.get("warehouses/"),
        ]);
        setItems(itemsRes.data);
        setWarehouses(warehousesRes.data);
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    };
    fetchData();
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
        await API.put(`stocks/${record.id}/`, formData);
      } else {
        await API.post("stocks/", formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving stock:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {record ? "Edit Stock Record" : "Add Stock Record"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Item</label>
            <select
              name="item"
              value={formData.item}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Item</option>
              {items.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name} ({it.category})
                </option>
              ))}
            </select>
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
            <label className="block text-gray-700">Reorder Level</label>
            <input
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g., 10"
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

export default StockForm;
