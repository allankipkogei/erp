import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";

const API_URL = "http://localhost:8000/api";

export default function InventoryCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    material_type: "",
    quantity: 0,
    unit: "pcs",
    warehouse: "",
    status: "available"
  });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/");
      const data = response.data.results || response.data || [];
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading warehouses:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name) {
      setError("Material name is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`${API_URL}/materials/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/inventory");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create material");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel material creation?")) {
      navigate("/inventory");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Package className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Add New Material
            </h1>
            <p className="text-gray-600">Register construction material</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Material Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cement, Steel Bars, Bricks"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Material Type</label>
              <select
                name="material_type"
                value={formData.material_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
              >
                <option value="">Select type</option>
                <option value="raw">Raw Material</option>
                <option value="finished">Finished Product</option>
                <option value="consumable">Consumable</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Warehouse *</label>
              <select
                name="warehouse"
                value={formData.warehouse}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
                required
              >
                <option value="">Select warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="ton">Tons</option>
                <option value="m">Meters</option>
                <option value="m2">Square Meters</option>
                <option value="m3">Cubic Meters</option>
                <option value="liter">Liters</option>
                <option value="bags">Bags</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold"
            >
              <Save className="mr-2" size={20} />
              {loading ? "Saving..." : "Add Material"}
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
