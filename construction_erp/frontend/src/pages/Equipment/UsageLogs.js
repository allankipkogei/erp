import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import UsageLogForm from "./UsageLogForm";

const UsageLogs = () => {
  const [logs, setLogs] = useState([]);
  const [editingLog, setEditingLog] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await API.get("usage-logs/");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleEdit = (log) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this usage log?")) {
      try {
        await API.delete(`usage-logs/${id}/`);
        fetchLogs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Usage Logs</h1>
      <button
        onClick={() => {
          setEditingLog(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Usage Log
      </button>

      {showForm && (
        <UsageLogForm
          log={editingLog}
          onClose={() => {
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
              <span className="font-semibold">{log.equipment_name}</span> — used by{" "}
              {log.user_name} on {log.date}
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
    </div>
  );
};

export default UsageLogs;
