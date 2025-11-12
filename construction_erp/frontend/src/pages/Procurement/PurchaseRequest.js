import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { ShoppingCart, PlusCircle, RefreshCw, AlertCircle, Edit, Trash2, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function PurchaseRequest() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  const loadPurchaseOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/purchase-orders/");
      const data = response.data.results || response.data || [];
      setPurchaseOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading purchase orders:", err);
      setError(err.message || "Failed to load purchase orders.");
      setPurchaseOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading purchase requests...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Purchase Requests
              </h1>
              <p className="text-gray-600 text-lg font-medium">Manage procurement & orders</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => setShowCreateModal(true)}
            >
              <PlusCircle size={22} />
              New Request
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
                  onClick={loadPurchaseOrders}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {purchaseOrders.length === 0 && !error ? (
            <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                <ShoppingCart className="text-purple-600" size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Purchase Requests Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Start creating purchase requests for materials and supplies
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusCircle size={24} className="mr-2" />
                Create First Request
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchaseOrders.map((order) => (
                <PurchaseOrderCard key={order.id} order={order} onDelete={loadPurchaseOrders} />
              ))}
            </div>
          )}
        </div>

        {showCreateModal && (
          <CreatePurchaseRequestModal 
            onClose={() => setShowCreateModal(false)} 
            onSuccess={() => {
              setShowCreateModal(false);
              loadPurchaseOrders();
            }}
          />
        )}
      </div>
    </>
  );
}

const CreatePurchaseRequestModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 1,
    unit_price: 0,
    status: "pending"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/purchase-orders/", {
        ...formData,
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      alert("✅ Purchase request created successfully!");
      onSuccess();
    } catch (err) {
      console.error("Create purchase request error:", err);
      alert("❌ Failed to create purchase request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Create Purchase Request
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Construction Materials Order"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Unit Price ($)</label>
              <input
                type="number"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the items needed..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              rows="4"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold">
              {loading ? "Creating..." : "Create Request"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PurchaseOrderCard = ({ order, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm("Delete this purchase request?")) {
      try {
        await api.delete(`/purchase-orders/${order.id}/`);
        alert("✅ Purchase request deleted successfully!");
        onDelete();
      } catch (err) {
        alert("❌ Failed to delete purchase request");
      }
    }
  };

  const statusColors = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  };

  const status = statusColors[order.status] || statusColors.pending;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-purple-400">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <Package className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {order.title || order.supplier?.name || 'Purchase Order'}
          </h3>
          <p className="text-sm text-gray-600">
            {order.order_date ? new Date(order.order_date).toLocaleDateString() : 'No date'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}>
          {order.status?.toUpperCase()}
        </span>
      </div>

      {order.description && (
        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
          {order.description}
        </p>
      )}

      <div className="pt-4 border-t-2 border-gray-100 flex gap-2">
        <Button variant="outline" className="flex-1" size="sm">
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button onClick={handleDelete} variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" size="sm">
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};
