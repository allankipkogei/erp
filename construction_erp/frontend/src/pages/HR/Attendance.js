import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import AttendanceForm from "./AttendanceForm";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await API.get("attendance/");
      setRecords(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance records");
    } finally {
      setLoading(false);
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
      const prev = [...records];
      setRecords(records.filter((r) => r.id !== id));
      try {
        await API.delete(`attendance/${id}/`);
      } catch (err) {
        console.error(err);
        setRecords(prev); // rollback if delete fails
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Attendance</h1>

      <button
        onClick={() => { setEditingRecord(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Mark Attendance
      </button>

      {showForm && (
        <AttendanceForm
          record={editingRecord}
          onClose={() => { setShowForm(false); fetchRecords(); }}
        />
      )}

      {loading && <p>Loading attendance...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {records.length === 0 && !loading && (
        <p className="text-gray-500">No records found. Add one above.</p>
      )}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Check-in</th>
            <th className="p-2 border">Check-out</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="text-center">
              <td className="p-2 border">{r.employee_name}</td>
              <td className="p-2 border">{r.date}</td>
              <td className="p-2 border">{r.status}</td>
              <td className="p-2 border">{r.check_in || "-"}</td>
              <td className="p-2 border">{r.check_out || "-"}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(r)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
