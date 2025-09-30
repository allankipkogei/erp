import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import RoleForm from "./RoleForm";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await API.get("roles/");
      setRoles(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      const prev = [...roles];
      setRoles(roles.filter((r) => r.id !== id));
      try {
        await API.delete(`roles/${id}/`);
      } catch (err) {
        console.error(err);
        setRoles(prev); // rollback if delete fails
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Roles</h1>

      <button
        onClick={() => { setEditingRole(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Role
      </button>

      {showForm && (
        <RoleForm
          role={editingRole}
          onClose={() => { setShowForm(false); fetchRoles(); }}
        />
      )}

      {loading && <p>Loading roles...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {roles.length === 0 && !loading && (
        <p className="text-gray-500">No roles found. Add one above.</p>
      )}

      <ul className="space-y-2">
        {roles.map((role) => (
          <li
            key={role.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>{role.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(role)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(role.id)}
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

export default Roles;
