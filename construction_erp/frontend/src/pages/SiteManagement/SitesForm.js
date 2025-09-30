// src/components/SitesForm.js
import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const SitesForm = ({ existingSite = null, onSuccess, onClose }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [manager, setManager] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingSite) {
      setName(existingSite.name || "");
      setLocation(existingSite.location || "");
      setManager(existingSite.manager_name || "");
    }
  }, [existingSite]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      location,
      manager_name: manager,
    };

    try {
      if (existingSite) {
        // Update existing site
        await API.put(`sites/${existingSite.id}/`, payload);
      } else {
        // Create new site
        await API.post("sites/", payload);
      }
      onSuccess(); // Refresh parent list
    } catch (err) {
      console.error("Failed to submit site:", err);
      setError("Failed to submit site. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingSite ? "Edit Site" : "New Site"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Site Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Manager Name</label>
            <input
              type="text"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
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
              {loading ? "Saving..." : existingSite ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SitesForm;
