import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ProjectDocumentForm = ({ document, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [file, setFile] = useState(null);
  const [projects, setProjects] = useState([]);

  // Load projects for selection
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await API.get("projects/");
      setProjects(res.data);
    };

    fetchProjects();

    if (document) {
      setTitle(document.title);
      setDescription(document.description);
      setProject(document.project);
    }
  }, [document]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("project", project);
    if (file) formData.append("file", file);

    try {
      if (document) {
        await API.put(`project-documents/${document.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await API.post("project-documents/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
          {document ? "Edit Document" : "Add Document"}
        </h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border mb-2 rounded"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border mb-2 rounded"
          required
        />
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full p-2 border mb-2 rounded"
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border mb-4 rounded"
        />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
            {document ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectDocumentForm;
