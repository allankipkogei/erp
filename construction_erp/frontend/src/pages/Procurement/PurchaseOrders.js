// src/components/PurchaseOrders.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import PurchaseOrdersForm from "./PurchaseOrdersForm";

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all purchase orders
  const fetchOrders = async () => {
    try {
      const res = await API.get("purchase-orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch purchase orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle edit
  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await API.delete(`purchase-orders/${id}/`);
        fetchOrders();
      } catch (err) {
        console.error("Failed to delete order:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Purchase Orders</h1>
      <button
        onClick={() => {
          setEditingOrder(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Order
      </button>

      {showForm && (
        <PurchaseOrdersForm
          existingOrder={editingOrder}
          onSuccess={() => {
            setShowForm(false);
            fetchOrders();
          }}
        />
      )}

      <ul className="space-y-2">
        {orders.map((order) => (
          <li
            key={order.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-gray-600">
                Supplier: {order.supplier_name} | Total: {order.total_amount} | Status: {order.status}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(order)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(order.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {orders.length === 0 && (
        <p className="text-gray-500 mt-4">No purchase orders found.</p>
      )}
    </div>
  );
};

export default PurchaseOrders;
