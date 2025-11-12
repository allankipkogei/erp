import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Package, PlusCircle, RefreshCw, AlertCircle, Edit, Trash2, Warehouse } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function Inventory() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/materials/");
      const data = response.data.results || response.data || [];
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading materials:", err);
      setError(err.message || "Failed to load inventory.");
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this material?")) {
      try {
        await api.delete(`/materials/${id}/`);
        alert("✅ Material deleted successfully!");
        loadMaterials();
      } catch (err) {
        alert("❌ Failed to delete material");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-600" size={32} />
          </div>
          <p className="mt-6 text-xl text-gray-700 font-semibold">Loading inventory...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Inventory Management
              </h1>
              <p className="text-gray-600 text-lg font-medium">Manage construction materials & supplies</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/inventory/create")}
            >
              <PlusCircle size={22} />
              Add Material
            </Button>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadMaterials}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {materials.length === 0 && !error ? (
            <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                <Package className="text-cyan-600" size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Materials Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Start tracking inventory by adding materials
              </p>
              <Button 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
                onClick={() => navigate("/inventory/create")}
              >
                <PlusCircle size={24} className="mr-2" />
                Add First Material
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((material) => (
                <MaterialCard key={material.id} material={material} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const MaterialCard = ({ material, onDelete }) => {
  const navigate = useNavigate();

  const statusColors = {
    available: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    unavailable: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    damaged: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' }
  };

  const status = statusColors[material.status] || statusColors.available;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-cyan-400">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <Package className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{material.name || 'Material'}</h3>
          <p className="text-sm text-gray-600">{material.material_type || 'Type N/A'}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-gray-700"><span className="font-semibold">Quantity:</span> {material.quantity} {material.unit || 'pcs'}</p>
        {material.warehouse?.name && (
          <p className="text-gray-700 flex items-center gap-2">
            <Warehouse size={16} className="text-cyan-600" />
            {material.warehouse.name}
          </p>
        )}
      </div>

      <div className="mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}>
          {material.status?.toUpperCase() || 'AVAILABLE'}
        </span>
      </div>

      <div className="pt-4 border-t-2 border-gray-100 flex gap-2">
        <Button onClick={() => navigate(`/inventory/${material.id}/edit`)} variant="outline" className="flex-1" size="sm">
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button onClick={() => onDelete(material.id)} variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" size="sm">
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};
