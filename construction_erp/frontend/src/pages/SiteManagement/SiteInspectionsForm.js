// src/components/SiteInspectionsForm.js
import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const SiteInspectionsForm = ({ existingInspection = null, onSuccess, onClose }) => {
  const [siteName, setSiteName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingInspection) {
      setSiteName(existingInspection.site_name || "");
      setInspectorName(existingInspection.inspector_name || "");
      setDate(existingInspection.date ? existingInspection.date.slice(0, 10) : "");
      setStatus(existingInspection.status || "Pending");
      setNotes(existingInspection.notes || "");
    }
  }, [existingInspection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      site_name: siteName,
      inspector_name: inspectorName,
      date,
      status,
      notes,
    };

    try {
      if (existingInspection) {
        // Update existing inspection
        await API.put(`site-inspections/${existingInspection.id}/`, payload);
      } else {
        // Create new inspection
        await API.post("site-inspections/", payload);
      }
      onSuccess(); // Refresh parent list
    } catch (err) {
      console.error("Failed to submit site inspection:", err);
      setError("Failed to submit site inspection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingInspection ? "Edit Site Inspection" : "New Site Inspection"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Site Name</label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Inspector Name</label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
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
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Requires Action">Requires Action</option>
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
              {loading ? "Saving..." : existingInspection ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteInspectionsForm;
