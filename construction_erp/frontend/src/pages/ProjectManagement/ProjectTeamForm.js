import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ProjectTeamForm = ({ member, onClose }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Load projects for dropdown
    const fetchProjects = async () => {
      const res = await API.get("projects/");
      setProjects(res.data);
    };
    fetchProjects();

    // Prefill form if editing
    if (member) {
      setName(member.name);
      setRole(member.role);
      setEmail(member.email);
      setProject(member.project);
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, role, email, project };

    try {
      if (member) {
        await API.put(`project-team/${member.id}/`, payload);
      } else {
        await API.post("project-team/", payload);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {member ? "Edit Team Member" : "Add Team Member"}
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-2 border mb-2 rounded"
          required
        />

        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          className="w-full p-2 border mb-2 rounded"
          required
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border mb-2 rounded"
          required
        />

        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
            {member ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectTeamForm;
