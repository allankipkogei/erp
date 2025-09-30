import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import IncomeForm from "./IncomeForm";

const Income = () => {
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [editingIncome, setEditingIncome] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchIncome = async () => {
    try {
      const res = await API.get("income/");
      setIncomeRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const handleEdit = (record) => {
    setEditingIncome(record);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income record?")) {
      try {
        await API.delete(`income/${id}/`);
        fetchIncome();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Income</h1>
      <button
        onClick={() => {
          setEditingIncome(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Income
      </button>

      {showForm && (
        <IncomeForm
          record={editingIncome}
          onClose={() => {
            setShowForm(false);
            fetchIncome();
          }}
        />
      )}

      <ul className="space-y-2">
        {incomeRecords.map((rec) => (
          <li
            key={rec.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">{rec.source}</span> — Ksh{" "}
              {rec.amount} on {rec.date}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(rec)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(rec.id)}
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

export default Income;
