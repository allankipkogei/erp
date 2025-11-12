import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PurchaseOrder() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orderNumber: "",
    supplier: "",
    totalAmount: "",
    deliveryDate: ""
  });

  const handleCancel = () => {
    if (window.confirm("Discard purchase order? All changes will be lost.")) {
      navigate("/procurement");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <ShoppingCart className="text-indigo-600" size={40} />
          <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Purchase Order
          </h1>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Order Number</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              value={formData.orderNumber}
              onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Supplier</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              value={formData.supplier}
              onChange={(e) => setFormData({...formData, supplier: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-xl"
            >
              <Save className="mr-2" size={20} />
              Create Order
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-red-300 text-red-700 py-3 rounded-xl hover:bg-red-50"
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
