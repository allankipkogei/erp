import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import PayrollForm from "./PayrollForm";

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      const res = await API.get("payrolls/"); // backend endpoint
      setPayrolls(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch payroll records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleEdit = (payroll) => {
    setEditingPayroll(payroll);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this payroll record?")) {
      const prev = [...payrolls];
      setPayrolls(payrolls.filter((p) => p.id !== id));
      try {
        await API.delete(`payrolls/${id}/`);
      } catch (err) {
        console.error(err);
        setPayrolls(prev); // rollback if API fails
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Payroll</h1>

      <button
        onClick={() => { setEditingPayroll(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Payroll Record
      </button>

      {showForm && (
        <PayrollForm
          payroll={editingPayroll}
          onClose={() => { setShowForm(false); fetchPayrolls(); }}
        />
      )}

      {loading && <p>Loading payroll records...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {payrolls.length === 0 && !loading && (
        <p className="text-gray-500">No payroll records found. Add one above.</p>
      )}

      <ul className="space-y-2">
        {payrolls.map((record) => (
          <li
            key={record.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>
              {record.employee_name} – {record.month} – ${record.net_salary}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(record)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(record.id)}
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

export default Payroll;
