import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import ProjectTeamForm from "./ProjectTeamForm";

export default function ProjectTeamList() {
  const [teams, setTeams] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTeams = async () => {
    try {
      // 🔹 FIXED endpoint (singular)
      const res = await API.get("/project-team/");
      setTeams(res.data);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this team member?")) {
      // 🔹 FIXED endpoint (singular)
      await API.delete(`/project-team/${id}/`);
      fetchTeams();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Project Team</h1>

      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Team Member
      </button>

      {showForm && (
        <ProjectTeamForm
          team={editing}
          onClose={() => {
            setShowForm(false);
            fetchTeams();
          }}
        />
      )}

      <ul className="space-y-3">
        {teams.map((t) => (
          <li
            key={t.id}
            className="bg-gray-100 p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {t.member?.username || "Unnamed User"}
              </p>
              <p className="text-gray-600 text-sm">Role: {t.role}</p>
              <p className="text-gray-500 text-xs">
                Project: {t.project_name || t.project}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditing(t);
                  setShowForm(true);
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
