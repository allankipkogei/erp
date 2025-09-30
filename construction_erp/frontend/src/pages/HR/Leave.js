import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import LeaveForm from "./LeaveForm";

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [editingLeave, setEditingLeave] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get("leaves/");
      setLeaves(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this leave request?")) {
      const prev = [...leaves];
      setLeaves(leaves.filter((l) => l.id !== id));
      try {
        await API.delete(`leaves/${id}/`);
      } catch (err) {
        console.error(err);
        setLeaves(prev); // rollback if delete fails
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Leave Management</h1>

      <button
        onClick={() => { setEditingLeave(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Request Leave
      </button>

      {showForm && (
        <LeaveForm
          leave={editingLeave}
          onClose={() => { setShowForm(false); fetchLeaves(); }}
        />
      )}

      {loading && <p>Loading leaves...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {leaves.length === 0 && !loading && (
        <p className="text-gray-500">No leave requests found.</p>
      )}

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Employee</th>
            <th className="p-2 border">Leave Type</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">End Date</th>
            <th className="p-2 border">Reason</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id} className="text-center">
              <td className="p-2 border">{l.employee_name}</td>
              <td className="p-2 border">{l.leave_type}</td>
              <td className="p-2 border">{l.start_date}</td>
              <td className="p-2 border">{l.end_date}</td>
              <td className="p-2 border">{l.reason}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    l.status === "Approved"
                      ? "bg-green-500"
                      : l.status === "Rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {l.status}
                </span>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(l)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(l.id)}
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

export default Leave;
