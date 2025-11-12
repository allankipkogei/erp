import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function WarehouseCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: 0,
    current_stock: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name) {
      setError("Warehouse name is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${API_URL}/warehouses/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/inventory");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create warehouse");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel warehouse creation?")) {
      navigate("/inventory");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Warehouse className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Warehouse
            </h1>
            <p className="text-gray-600">Register a new storage facility</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Warehouse Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Warehouse, Site A Storage"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Address or location description"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum storage capacity</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Stock</label>
              <input
                type="number"
                name="current_stock"
                value={formData.current_stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Current inventory level</p>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold"
            >
              <Save className="mr-2" size={20} />
              {loading ? "Saving..." : "Add Warehouse"}
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
