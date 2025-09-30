import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import StockForm from "./StockForm";

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchStocks = async () => {
    try {
      const res = await API.get("stocks/");
      setStocks(res.data);
    } catch (err) {
      console.error("Error fetching stocks:", err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleEdit = (stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this stock record?")) {
      try {
        await API.delete(`stocks/${id}/`);
        fetchStocks();
      } catch (err) {
        console.error("Error deleting stock:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Stocks</h1>

      <button
        onClick={() => {
          setEditingStock(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Stock Record
      </button>

      {showForm && (
        <StockForm
          record={editingStock}
          onClose={() => {
            setShowForm(false);
            fetchStocks();
          }}
        />
      )}

      <ul className="space-y-2">
        {stocks.map((stock) => (
          <li
            key={stock.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{stock.item?.name}</p>
              <p className="text-sm text-gray-600">
                Warehouse: {stock.warehouse?.name || "Unassigned"}
              </p>
              <p className="text-sm text-gray-500">
                Quantity: {stock.quantity} | Reorder Level: {stock.reorder_level}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(stock)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(stock.id)}
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

export default Stocks;
