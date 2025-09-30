import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import MaintenanceForm from "./MaintenanceForm";

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await API.get("maintenance/");
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await API.delete(`maintenance/${id}/`);
        fetchRecords();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Maintenance Records</h1>
      <button
        onClick={() => {
          setEditingRecord(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Record
      </button>

      {showForm && (
        <MaintenanceForm
          record={editingRecord}
          onClose={() => {
            setShowForm(false);
            fetchRecords();
          }}
        />
      )}

      <ul className="space-y-2">
        {records.map((record) => (
          <li
            key={record.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">{record.equipment_name}</span> -{" "}
              {record.status} ({record.date})
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(record)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(record.id)}
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

export default Maintenance;
