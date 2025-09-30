import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ProjectForm = ({ project, onClose }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (project) setName(project.name);
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (project) {
        // Edit
        await API.put(`projects/${project.id}/`, { name });
      } else {
        // Add
        await API.post("projects/", { name });
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">
          {project ? "Edit Project" : "Add Project"}
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {project ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
