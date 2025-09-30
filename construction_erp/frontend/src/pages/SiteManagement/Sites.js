// src/components/Sites.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import SitesForm from "./SitesForm";

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [editingSite, setEditingSite] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all sites
  const fetchSites = async () => {
    try {
      const res = await API.get("sites/");
      setSites(res.data);
    } catch (err) {
      console.error("Failed to fetch sites:", err);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // Handle edit
  const handleEdit = (site) => {
    setEditingSite(site);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      try {
        await API.delete(`sites/${id}/`);
        fetchSites();
      } catch (err) {
        console.error("Failed to delete site:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Construction Sites</h1>
      <button
        onClick={() => {
          setEditingSite(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Site
      </button>

      {showForm && (
        <SitesForm
          existingSite={editingSite}
          onSuccess={() => {
            setShowForm(false);
            fetchSites();
          }}
        />
      )}

      <ul className="space-y-2">
        {sites.map((site) => (
          <li
            key={site.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{site.name}</p>
              <p className="text-sm text-gray-600">
                Location: {site.location} | Manager: {site.manager_name || "N/A"}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(site)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(site.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {sites.length === 0 && (
        <p className="text-gray-500 mt-4">No construction sites found.</p>
      )}
    </div>
  );
};

export default Sites;
