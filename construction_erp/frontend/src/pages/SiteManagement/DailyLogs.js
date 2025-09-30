// src/components/DailyLogs.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import DailyLogsForm from "./DailyLogsForm";

const DailyLogs = () => {
  const [logs, setLogs] = useState([]);
  const [editingLog, setEditingLog] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch daily logs from backend
  const fetchLogs = async () => {
    try {
      const res = await API.get("daily-logs/");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch daily logs:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Handle edit
  const handleEdit = (log) => {
    setEditingLog(log);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this daily log?")) {
      try {
        await API.delete(`daily-logs/${id}/`);
        fetchLogs();
      } catch (err) {
        console.error("Failed to delete daily log:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Daily Logs</h1>
      <button
        onClick={() => {
          setEditingLog(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Log
      </button>

      {showForm && (
        <DailyLogsForm
          existingLog={editingLog}
          onSuccess={() => {
            setShowForm(false);
            fetchLogs();
          }}
        />
      )}

      <ul className="space-y-2">
        {logs.map((log) => (
          <li
            key={log.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{log.site_name}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(log.date).toLocaleDateString()} | Notes: {log.notes}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(log)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(log.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {logs.length === 0 && (
        <p className="text-gray-500 mt-4">No daily logs found.</p>
      )}
    </div>
  );
};

export default DailyLogs;
