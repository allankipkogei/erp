import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Package, PlusCircle, RefreshCw, AlertCircle, Warehouse, TrendingUp, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Inventory() {
  const [materials, setMaterials] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const [materialsRes, warehousesRes] = await Promise.allSettled([
        api.get("/materials/"),
        api.get("/warehouses/")
      ]);

      const materialsData = materialsRes.status === 'fulfilled' 
        ? (materialsRes.value.data.results || materialsRes.value.data || [])
        : [];
      
      const warehousesData = warehousesRes.status === 'fulfilled'
        ? (warehousesRes.value.data.results || warehousesRes.value.data || [])
        : [];

      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      setWarehouses(Array.isArray(warehousesData) ? warehousesData : []);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setError(err.message || "Failed to load inventory.");
      setMaterials([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredMaterials = materials.filter(material =>
    material.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.material_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalMaterials = materials.length;
  const totalQuantity = materials.reduce((sum, m) => sum + (m.quantity || 0), 0);
  const availableMaterials = materials.filter(m => m.status === 'available').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600 text-lg font-medium">Manage warehouse & materials</p>
          </div>
          <div className="flex gap-3">
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/inventory/create")}
            >
              <PlusCircle size={22} />
              Add Material
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/warehouses/create")}
            >
              <Warehouse size={22} />
              Add Warehouse
            </Button>
          </div>
        </div>

        {/* Error Alert */}
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
                onClick={loadInventory}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={Package}
            title="Total Materials"
            value={totalMaterials}
            color="cyan"
          />
          <StatCard 
            icon={TrendingUp}
            title="Total Quantity"
            value={totalQuantity}
            color="blue"
          />
          <StatCard 
            icon={Warehouse}
            title="Warehouses"
            value={warehouses.length}
            color="indigo"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
            />
          </div>
        </div>

        {/* Materials Grid */}
        {filteredMaterials.length === 0 && !error ? (
          <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
              <Package className="text-cyan-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Materials Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {searchTerm ? "No materials match your search" : "Start by adding materials to your inventory"}
            </p>
            {!searchTerm && (
              <Button 
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
                onClick={() => navigate("/inventory/create")}
              >
                <PlusCircle size={24} className="mr-2" />
                Add First Material
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} warehouses={warehouses} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorSchemes = {
    cyan: {
      gradient: "from-cyan-500 to-cyan-600",
      bg: "from-cyan-50 to-cyan-100",
      text: "text-cyan-700",
      border: "border-cyan-300"
    },
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    indigo: {
      gradient: "from-indigo-500 to-indigo-600",
      bg: "from-indigo-50 to-indigo-100",
      text: "text-indigo-700",
      border: "border-indigo-300"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${scheme.border}`}>
      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-4xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};

const MaterialCard = ({ material, warehouses }) => {
  const statusConfig = {
    available: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: '✅' },
    unavailable: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: '❌' },
    damaged: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: '⚠️' }
  };

  const status = statusConfig[material.status] || statusConfig.available;
  const warehouse = warehouses.find(w => w.id === material.warehouse);

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-cyan-400">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
          {material.name || 'Unnamed Material'}
        </h3>
        <Package className="text-cyan-600" size={24} />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Type:</span>
          <span className="text-gray-900 font-semibold">{material.material_type || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Quantity:</span>
          <span className="text-gray-900 font-bold text-lg">{material.quantity || 0} {material.unit || 'pcs'}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Warehouse:</span>
          <span className="text-gray-900 font-semibold">{warehouse?.name || 'N/A'}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-100">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.text} ${status.border} flex items-center gap-1`}>
            <span>{status.icon}</span>
            {material.status || 'available'}
          </span>
        </div>
      </div>
    </div>
  );
};
