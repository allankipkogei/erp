import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import DepartmentForm from "./DepartmentForm";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await API.get("departments/"); // backend endpoint
      setDepartments(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      const prev = [...departments];
      setDepartments(departments.filter((d) => d.id !== id));
      try {
        await API.delete(`departments/${id}/`);
      } catch (err) {
        console.error(err);
        setDepartments(prev); // rollback if delete fails
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Departments</h1>

      <button
        onClick={() => { setEditingDepartment(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Department
      </button>

      {showForm && (
        <DepartmentForm
          department={editingDepartment}
          onClose={() => { setShowForm(false); fetchDepartments(); }}
        />
      )}

      {loading && <p>Loading departments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {departments.length === 0 && !loading && (
        <p className="text-gray-500">No departments found. Add one above.</p>
      )}

      <ul className="space-y-2">
        {departments.map((department) => (
          <li
            key={department.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>{department.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(department)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(department.id)}
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

export default Departments;
