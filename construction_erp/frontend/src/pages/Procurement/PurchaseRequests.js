// src/components/PurchaseRequests.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import PurchaseRequestsForm from "./PurchaseRequestsForm";

const PurchaseRequests = () => {
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all purchase requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("purchase-requests/");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Handle edit
  const handleEdit = (request) => {
    setEditingRequest(request);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      try {
        await API.delete(`purchase-requests/${id}/`);
        fetchRequests();
      } catch (err) {
        console.error("Failed to delete request:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Requests</h1>
      <button
        onClick={() => {
          setEditingRequest(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Request
      </button>

      {showForm && (
        <PurchaseRequestsForm
          existingRequest={editingRequest}
          onSuccess={() => {
            setShowForm(false);
            fetchRequests();
          }}
        />
      )}

      <ul className="space-y-2">
        {requests.map((request) => (
          <li
            key={request.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{request.item_name}</p>
              <p className="text-sm text-gray-600">
                Quantity: {request.quantity} | Status: {request.status}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(request)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(request.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {requests.length === 0 && (
        <p className="text-gray-500 mt-4">No purchase requests found.</p>
      )}
    </div>
  );
};

export default PurchaseRequests;
