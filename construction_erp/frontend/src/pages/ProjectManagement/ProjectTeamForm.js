import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function ProjectTeamForm({ team, onClose }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    project: "",
    member: "",
    role: "worker",
  });

  useEffect(() => {
    // If editing an existing team member, load initial values
    if (team) {
      setFormData({
        project: team.project,
        member: team.member?.id || "",
        role: team.role,
      });
    }

    // Fetch all projects
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects/");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };

    // Fetch all users (updated endpoint)
    const fetchUsers = async () => {
      try {
        const res = await API.get("/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchProjects();
    fetchUsers();
  }, [team]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (team) {
        await API.put(`/project-team/${team.id}/`, formData);
      } else {
        await API.post("/project-team/", formData);
      }
      alert("✅ Team member saved successfully!");
      onClose();
    } catch (err) {
      console.error("Error saving team:", err.response?.data || err);
      alert("❌ Failed to save team member.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">
          {team ? "Edit Team Member" : "Add Team Member"}
        </h2>

        {/* Project */}
        <label className="block font-medium mb-1">Project</label>
        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Member */}
<label className="block font-medium mb-1">Team Member</label>
<select
  name="member"
  value={formData.member}
  onChange={handleChange}
  className="w-full border p-2 rounded mb-3"
  required
>
  <option value="">Select User</option>
  {users.length > 0 ? (
    users.map((u) => (
      <option key={u.id} value={u.id}>
        {u.first_name || u.last_name
          ? `${u.first_name} ${u.last_name}`.trim()
          : u.email}
      </option>
    ))
  ) : (
    <option disabled>No users found</option>
  )}
</select>


        {/* Role */}
        <label className="block font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        >
          <option value="manager">Manager</option>
          <option value="engineer">Engineer</option>
          <option value="worker">Worker</option>
          <option value="consultant">Consultant</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {team ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}
