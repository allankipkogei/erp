import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import ItemForm from "./ItemForm";

const Items = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    try {
      const res = await API.get("items/");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await API.delete(`items/${id}/`);
        fetchItems();
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Items</h1>

      <button
        onClick={() => {
          setEditingItem(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Item
      </button>

      {showForm && (
        <ItemForm
          record={editingItem}
          onClose={() => {
            setShowForm(false);
            fetchItems();
          }}
        />
      )}

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">
                Category: {item.category} | Qty: {item.quantity}
              </p>
              <p className="text-sm text-gray-500">
                Warehouse: {item.warehouse?.name || "Unassigned"}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
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

export default Items;
