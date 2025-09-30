import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const PaymentForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    invoice: "",
    amount: "",
    payment_date: "",
    method: "Cash",
    reference: "",
  });
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
    fetchInvoices();
  }, [record]);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("invoices/");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (record) {
        await API.put(`payments/${record.id}/`, formData);
      } else {
        await API.post("payments/", formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving payment:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {record ? "Edit Payment" : "Add Payment"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Invoice</label>
            <select
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Invoice</option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoice_number} — {inv.client}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium">Amount (Ksh)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Payment Date</label>
            <input
              type="date"
              name="payment_date"
              value={formData.payment_date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Payment Method</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Mpesa">Mpesa</option>
              <option value="Cheque">Cheque</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Reference (Txn ID / Receipt)</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {record ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
