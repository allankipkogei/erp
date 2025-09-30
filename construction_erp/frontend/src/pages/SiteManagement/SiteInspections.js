// src/components/SiteInspections.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import SiteInspectionsForm from "./SiteInspectionsForm";

const SiteInspections = () => {
  const [inspections, setInspections] = useState([]);
  const [editingInspection, setEditingInspection] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all site inspections
  const fetchInspections = async () => {
    try {
      const res = await API.get("site-inspections/");
      setInspections(res.data);
    } catch (err) {
      console.error("Failed to fetch site inspections:", err);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  // Handle edit
  const handleEdit = (inspection) => {
    setEditingInspection(inspection);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inspection?")) {
      try {
        await API.delete(`site-inspections/${id}/`);
        fetchInspections();
      } catch (err) {
        console.error("Failed to delete inspection:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Site Inspections</h1>
      <button
        onClick={() => {
          setEditingInspection(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Inspection
      </button>

      {showForm && (
        <SiteInspectionsForm
          existingInspection={editingInspection}
          onSuccess={() => {
            setShowForm(false);
            fetchInspections();
          }}
        />
      )}

      <ul className="space-y-2">
        {inspections.map((inspection) => (
          <li
            key={inspection.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{inspection.site_name}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(inspection.date).toLocaleDateString()} | Inspector: {inspection.inspector_name} | Status: {inspection.status}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(inspection)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(inspection.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {inspections.length === 0 && (
        <p className="text-gray-500 mt-4">No site inspections found.</p>
      )}
    </div>
  );
};

export default SiteInspections;
