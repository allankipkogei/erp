// src/components/PurchaseOrdersForm.js
import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const PurchaseOrdersForm = ({ existingOrder = null, onSuccess, onClose }) => {
  const [supplier, setSupplier] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (existingOrder) {
      setSupplier(existingOrder.supplier_name || "");
      setTotalAmount(existingOrder.total_amount || 0);
      setStatus(existingOrder.status || "Pending");
    }
  }, [existingOrder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      supplier_name: supplier,
      total_amount: totalAmount,
      status,
    };

    try {
      if (existingOrder) {
        // Update existing order
        await API.put(`purchase-orders/${existingOrder.id}/`, payload);
      } else {
        // Create new order
        await API.post("purchase-orders/", payload);
      }
      onSuccess(); // Refresh parent list
    } catch (err) {
      console.error("Failed to submit purchase order:", err);
      setError("Failed to submit purchase order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {existingOrder ? "Edit Purchase Order" : "New Purchase Order"}
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Supplier Name</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Total Amount</label>
            <input
              type="number"
              value={totalAmount}
              min="0"
              step="0.01"
              onChange={(e) => setTotalAmount(e.target.value)}
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
              {loading ? "Saving..." : existingOrder ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseOrdersForm;
