import React, { useEffect, useState } from "react";
import { fetchProjects } from "../../services/projectService";
import ProjectForm from "./ProjectForm";
import API from "../../api/axios";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all projects
  const loadProjects = async () => {
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API.delete(`projects/${id}/`);
        loadProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <button
        onClick={() => {
          setEditingProject(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Project
      </button>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={() => {
            setShowForm(false);
            loadProjects();
          }}
        />
      )}

      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>{project.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(project)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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

export default Projects;
