import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function DocumentForm() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project: "",
    name: "",
    file: null,
  });

  // Fetch available projects
  useEffect(() => {
    API.get("/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("project", formData.project);
    data.append("name", formData.name);
    if (formData.file) data.append("file", formData.file);

    try {
      const res = await API.post("/documents/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Document uploaded successfully!");
      console.log("Uploaded Document:", res.data);

      // reset form
      setFormData({ project: "", name: "", file: null });
    } catch (error) {
      console.error("Upload error:", error.response?.data || error);
      alert("❌ Upload failed. Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Upload Project Document</h2>

      {/* Project selection */}
      <div>
        <label className="block mb-1 font-medium">Project</label>
        <select
          name="project"
          value={formData.project}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        >
          <option value="">-- Select Project --</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Document name */}
      <div>
        <label className="block mb-1 font-medium">Document Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter document name"
          required
        />
      </div>

      {/* File upload */}
      <div>
        <label className="block mb-1 font-medium">File</label>
        <input
          type="file"
          name="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Upload Document
      </button>
    </form>
  );
}
