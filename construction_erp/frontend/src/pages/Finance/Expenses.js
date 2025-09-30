import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import ExpenseForm from "./ExpenseForm";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("expenses/");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await API.delete(`expenses/${id}/`);
        fetchExpenses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Expenses</h1>
      <button
        onClick={() => {
          setEditingExpense(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Expense
      </button>

      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={() => {
            setShowForm(false);
            fetchExpenses();
          }}
        />
      )}

      <ul className="space-y-2">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <span className="font-semibold">{expense.title}</span> — Ksh{" "}
              {expense.amount} on {expense.date}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(expense)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(expense.id)}
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

export default Expenses;
