import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import WarehouseForm from "./WarehouseForm";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchWarehouses = async () => {
    try {
      const res = await API.get("warehouses/");
      setWarehouses(res.data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this warehouse?")) {
      try {
        await API.delete(`warehouses/${id}/`);
        fetchWarehouses();
      } catch (err) {
        console.error("Error deleting warehouse:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Warehouses</h1>

      <button
        onClick={() => {
          setEditingWarehouse(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Warehouse
      </button>

      {showForm && (
        <WarehouseForm
          record={editingWarehouse}
          onClose={() => {
            setShowForm(false);
            fetchWarehouses();
          }}
        />
      )}

      <ul className="space-y-2">
        {warehouses.map((warehouse) => (
          <li
            key={warehouse.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{warehouse.name}</p>
              <p className="text-sm text-gray-600">{warehouse.location}</p>
              <p className="text-sm text-gray-500">
                Capacity: {warehouse.capacity}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(warehouse)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(warehouse.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Warehouses;
