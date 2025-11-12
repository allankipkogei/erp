import React, { useState, useEffect } from "react";
import API from "../../api/axios";

export default function MilestoneForm() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project: "",
    name: "",
    target_date: "",
    achieved: false,
  });

  // Fetch all projects
  useEffect(() => {
    API.get("/projects/")
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/milestones/", formData);
      alert("✅ Milestone created successfully!");
      console.log("Milestone created:", res.data);

      // reset form
      setFormData({ project: "", name: "", target_date: "", achieved: false });
    } catch (error) {
      console.error("Error creating milestone:", error.response?.data || error);
      alert("❌ Failed to create milestone. Check console for details.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-semibold">Create Milestone</h2>

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

      <div>
        <label className="block mb-1 font-medium">Milestone Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Enter milestone name"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Target Date</label>
        <input
          type="date"
          name="target_date"
          value={formData.target_date}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="achieved"
          checked={formData.achieved}
          onChange={handleChange}
        />
        <label>Achieved</label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Create Milestone
      </button>
    </form>
  );
}
