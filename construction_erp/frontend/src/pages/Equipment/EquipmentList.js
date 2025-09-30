import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import EquipmentForm from "./EquipmentForm";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchEquipment = async () => {
    try {
      const res = await API.get("equipment/");
      setEquipment(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleEdit = (item) => {
    setEditingEquipment(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await API.delete(`equipment/${id}/`);
        fetchEquipment();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Equipment</h1>
      <button
        onClick={() => {
          setEditingEquipment(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Equipment
      </button>

      {showForm && (
        <EquipmentForm
          equipment={editingEquipment}
          onClose={() => {
            setShowForm(false);
            fetchEquipment();
          }}
        />
      )}

      <ul className="space-y-2">
        {equipment.map((item) => (
          <li
            key={item.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>
              {item.name} — {item.category} ({item.status})
            </span>
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

export default EquipmentList;
