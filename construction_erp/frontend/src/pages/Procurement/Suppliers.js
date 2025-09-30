import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import SupplierForm from "./SupplierForm";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("suppliers/");
      setSuppliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      try {
        await API.delete(`suppliers/${id}/`);
        fetchSuppliers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <button
        onClick={() => {
          setEditingSupplier(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Supplier
      </button>

      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onClose={() => {
            setShowForm(false);
            fetchSuppliers();
          }}
        />
      )}

      <ul className="space-y-2">
        {suppliers.map((supplier) => (
          <li
            key={supplier.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{supplier.name}</p>
              <p className="text-sm text-gray-600">{supplier.contact_person} | {supplier.phone}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(supplier)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(supplier.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suppliers;
