// src/components/ReportsForm.js
import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ReportsForm = ({ existingReport = null, onSuccess, onClose }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Financial");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingReport) {
      setTitle(existingReport.title || "");
      setType(existingReport.type || "Financial");
      setDate(existingReport.date ? existingReport.date.slice(0, 10) : "");
    }
  }, [existingReport]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      type,
      date,
    };

    try {
      if (existingReport) {
        // Update report
        await API.put(`reports/${existingReport.id}/`, payload);
      } else {
        // Create new report
        await API.post("reports/", payload);
      }
      onSuccess(); // Refresh list in parent
    } catch (err) {
      console.error("Failed to submit report:", err);
      setError("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingReport ? "Edit Report" : "New Report"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Financial">Financial</option>
              <option value="Operational">Operational</option>
              <option value="Compliance">Compliance</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : existingReport ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportsForm;
