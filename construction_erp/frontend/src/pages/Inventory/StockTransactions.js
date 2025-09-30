import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import StockTransactionForm from "./StockTransactionForm";

const StockTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("stock-transactions/");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await API.delete(`stock-transactions/${id}/`);
        fetchTransactions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Transactions</h1>
      <button
        onClick={() => {
          setEditingTransaction(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Transaction
      </button>

      {showForm && (
        <StockTransactionForm
          transaction={editingTransaction}
          onClose={() => {
            setShowForm(false);
            fetchTransactions();
          }}
        />
      )}

      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {transaction.item?.name} ({transaction.type})
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {transaction.quantity} | Date:{" "}
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(transaction)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(transaction.id)}
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

export default StockTransactions;
