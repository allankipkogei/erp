// src/components/SafetyRecordsForm.js
import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const SafetyRecordsForm = ({ existingRecord = null, onSuccess, onClose }) => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Incident");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Open");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingRecord) {
      setTitle(existingRecord.title || "");
      setType(existingRecord.type || "Incident");
      setDate(existingRecord.date ? existingRecord.date.slice(0, 10) : "");
      setStatus(existingRecord.status || "Open");
      setNotes(existingRecord.notes || "");
    }
  }, [existingRecord]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      title,
      type,
      date,
      status,
      notes,
    };

    try {
      if (existingRecord) {
        // Update existing record
        await API.put(`safety-records/${existingRecord.id}/`, payload);
      } else {
        // Create new record
        await API.post("safety-records/", payload);
      }
      onSuccess(); // Refresh parent list
    } catch (err) {
      console.error("Failed to submit safety record:", err);
      setError("Failed to submit safety record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingRecord ? "Edit Safety Record" : "New Safety Record"}
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
              <option value="Incident">Incident</option>
              <option value="Near Miss">Near Miss</option>
              <option value="Inspection">Inspection</option>
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

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              className="w-full border px-3 py-2 rounded"
            ></textarea>
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
              {loading ? "Saving..." : existingRecord ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SafetyRecordsForm;
