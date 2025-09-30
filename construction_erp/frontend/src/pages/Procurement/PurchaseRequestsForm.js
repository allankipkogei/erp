// src/components/PurchaseRequestsForm.js
import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const PurchaseRequestsForm = ({ existingRequest = null, onSuccess, onClose }) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingRequest) {
      setItemName(existingRequest.item_name);
      setQuantity(existingRequest.quantity);
      setStatus(existingRequest.status);
    }
  }, [existingRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      item_name: itemName,
      quantity,
      status,
    };

    try {
      if (existingRequest) {
        // Update request
        await API.put(`purchase-requests/${existingRequest.id}/`, payload);
      } else {
        // Create new request
        await API.post("purchase-requests/", payload);
      }
      onSuccess(); // Refresh list in parent
    } catch (err) {
      console.error("Failed to submit purchase request:", err);
      setError("Failed to submit purchase request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingRequest ? "Edit Purchase Request" : "New Purchase Request"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
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
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
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
              {loading ? "Saving..." : existingRequest ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequestsForm;
