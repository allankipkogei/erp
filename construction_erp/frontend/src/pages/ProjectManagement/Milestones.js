import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import MilestoneForm from "./MilestoneForm";

const Milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchMilestones = async () => {
    try {
      const res = await API.get("milestones/");
      setMilestones(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleEdit = (m) => { setEditing(m); setShowForm(true); };
  const handleDelete = async (id) => {
    if (window.confirm("Delete milestone?")) {
      await API.delete(`milestones/${id}/`);
      fetchMilestones();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Milestones</h1>
      <button
        onClick={() => { setEditing(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Milestone
      </button>

      {showForm && <MilestoneForm milestone={editing} onClose={() => { setShowForm(false); fetchMilestones(); }} />}

      <ul className="space-y-2">
        {milestones.map(m => (
          <li key={m.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{m.title}</p>
              <p className="text-gray-600 text-sm">{m.description}</p>
              <p className="text-gray-500 text-xs">Project: {m.project_name}</p>
              <p className="text-gray-500 text-xs">Due: {m.due_date}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(m)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(m.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Milestones;
