import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import ProjectTeamForm from "./ProjectTeamForm";

const ProjectTeam = () => {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all team members
  const fetchMembers = async () => {
    try {
      const res = await API.get("project-team/");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Edit a member
  const handleEdit = (member) => {
    setEditing(member);
    setShowForm(true);
  };

  // Delete a member
  const handleDelete = async (id) => {
    if (window.confirm("Remove this team member?")) {
      await API.delete(`project-team/${id}/`);
      fetchMembers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Project Team</h1>

      <button
        onClick={() => { setEditing(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Team Member
      </button>

      {showForm && (
        <ProjectTeamForm
          member={editing}
          onClose={() => { setShowForm(false); fetchMembers(); }}
        />
      )}

      <ul className="space-y-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-gray-600 text-sm">Role: {member.role}</p>
              <p className="text-gray-500 text-xs">Project: {member.project_name}</p>
              <p className="text-gray-500 text-xs">Email: {member.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(member)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectTeam;
