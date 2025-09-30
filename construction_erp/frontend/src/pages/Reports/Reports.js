// src/components/Reports.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import ReportsForm from "./ReportsForm";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch reports from backend
  const fetchReports = async () => {
    try {
      const res = await API.get("reports/");
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Handle edit
  const handleEdit = (report) => {
    setEditingReport(report);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await API.delete(`reports/${id}/`);
        fetchReports();
      } catch (err) {
        console.error("Failed to delete report:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <button
        onClick={() => {
          setEditingReport(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Report
      </button>

      {showForm && (
        <ReportsForm
          existingReport={editingReport}
          onSuccess={() => {
            setShowForm(false);
            fetchReports();
          }}
        />
      )}

      <ul className="space-y-2">
        {reports.map((report) => (
          <li
            key={report.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{report.title}</p>
              <p className="text-sm text-gray-600">
                Date: {new Date(report.date).toLocaleDateString()} | Type: {report.type}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(report)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(report.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {reports.length === 0 && (
        <p className="text-gray-500 mt-4">No reports found.</p>
      )}
    </div>
  );
};

export default Reports;
