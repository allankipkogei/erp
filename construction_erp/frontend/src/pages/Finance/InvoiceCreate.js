import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    invoice_number: "",
    client: "",
    amount: 0,
    due_date: "",
    status: "pending",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    setErrorMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.invoice_number?.trim()) errs.invoice_number = "Invoice number is required";
    if (!formData.client?.trim()) errs.client = "Client name is required";
    if (!formData.amount || formData.amount <= 0) errs.amount = "Amount must be greater than 0";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await api.post("/invoices/", formData);
      alert("✅ Invoice created successfully!");
      navigate("/finance");
    } catch (err) {
      console.error("Create invoice error:", err);
      
      // Check for auth errors
      if (err.status === 401) {
        setErrorMessage("Your session has expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      if (err && err.data) {
        const data = err.data;
        if (typeof data === "object") {
          const newFieldErrors = {};
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key]) && data[key].length) {
              newFieldErrors[key] = data[key].join(" ");
            } else if (typeof data[key] === "string") {
              if (key === "detail") {
                setErrorMessage(data[key]);
              } else {
                newFieldErrors[key] = data[key];
              }
            }
          });
          if (Object.keys(newFieldErrors).length) setFieldErrors(newFieldErrors);
          else if (!errorMessage) setErrorMessage("Failed to create invoice. Please check all fields.");
        } else {
          setErrorMessage(String(data) || "Failed to create invoice");
        }
      } else {
        setErrorMessage(err.message || "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel invoice creation?")) {
      navigate("/finance");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <FileText className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create New Invoice
            </h1>
            <p className="text-gray-600">Generate client invoice</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Invoice Number *</label>
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                placeholder="INV-001"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.invoice_number ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {fieldErrors.invoice_number && <p className="text-sm text-red-600 mt-2">{fieldErrors.invoice_number}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Client Name *</label>
              <input
                type="text"
                name="client"
                value={formData.client}
                onChange={handleChange}
                placeholder="Client name"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.client ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {fieldErrors.client && <p className="text-sm text-red-600 mt-2">{fieldErrors.client}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Amount ($) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.amount ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {fieldErrors.amount && <p className="text-sm text-red-600 mt-2">{fieldErrors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Invoice description"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              rows="4"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold"
            >
              {loading ? <><RefreshCw className="mr-2 animate-spin" size={18} />Creating...</> : <><Save className="mr-2" size={20} />Create Invoice</>}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-100 font-bold"
              onClick={handleCancel}
            >
              <X className="mr-2" size={20} />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
