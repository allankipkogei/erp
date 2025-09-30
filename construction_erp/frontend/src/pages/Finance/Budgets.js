import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import BudgetForm from "./BudgetForm";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await API.get("budgets/");
      setBudgets(res.data);
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await API.delete(`budgets/${id}/`);
        fetchBudgets();
      } catch (err) {
        console.error("Error deleting budget:", err);
      }
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Budgets</h2>
        <button
          onClick={() => {
            setSelectedBudget(null);
            setShowForm(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Budget
        </button>
      </div>

      {showForm && (
        <BudgetForm
          record={selectedBudget}
          onClose={() => {
            setShowForm(false);
            fetchBudgets();
          }}
        />
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Allocated</th>
            <th className="px-4 py-2 border">Spent</th>
            <th className="px-4 py-2 border">Remaining</th>
            <th className="px-4 py-2 border">Period</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <tr key={budget.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{budget.category}</td>
                <td className="px-4 py-2 border">Ksh {budget.allocated}</td>
                <td className="px-4 py-2 border">Ksh {budget.spent}</td>
                <td className="px-4 py-2 border">
                  Ksh {budget.allocated - budget.spent}
                </td>
                <td className="px-4 py-2 border">{budget.period}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBudget(budget);
                      setShowForm(true);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-2 border text-center">
                No budgets set.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Budgets;
