// src/components/SafetyRecords.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import SafetyRecordsForm from "./SafetyRecordsForm";

const SafetyRecords = () => {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch safety records from backend
  const fetchRecords = async () => {
    try {
      const res = await API.get("safety-records/");
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch safety records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle edit
  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this safety record?")) {
      try {
        await API.delete(`safety-records/${id}/`);
        fetchRecords();
      } catch (err) {
        console.error("Failed to delete safety record:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Safety Records</h1>
      <button
        onClick={() => {
          setEditingRecord(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Safety Record
      </button>

      {showForm && (
        <SafetyRecordsForm
          existingRecord={editingRecord}
          onSuccess={() => {
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
              <p className="font-semibold">{record.title}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(record.date).toLocaleDateString()} | Type: {record.type} | Status: {record.status}
              </p>
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

      {records.length === 0 && (
        <p className="text-gray-500 mt-4">No safety records found.</p>
      )}
    </div>
  );
};

export default SafetyRecords;
