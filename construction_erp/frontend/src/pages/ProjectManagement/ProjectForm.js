import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const ProjectForm = ({ project, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "0.00",
    status: "planned"
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        budget: project.budget || "0.00",
        status: project.status || "planned"
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare the data for API
      const apiData = {
        ...formData,
        // Ensure empty strings become null for optional fields
        client: null, // Add if your API expects this field
        end_date: formData.end_date || null,
        budget: formData.budget || "0.00"
      };

      if (project) {
        await API.put(`projects/${project.id}/`, apiData);
      } else {
        await API.post(`projects/`, apiData);
      }

      onClose();
    } catch (err) {
      console.error("Error saving project:", err);
      // Display error to user
      if (err.response?.data) {
        alert("Error: " + JSON.stringify(err.response.data));
      }
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
        
        {/* Project Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Project Name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        
        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="3"
          required
        />
        
        {/* Start Date */}
        <label className="block mb-2 font-medium">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        
        {/* End Date */}
        <label className="block mb-2 font-medium">End Date (Optional)</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        
        {/* Budget */}
        <label className="block mb-2 font-medium">Budget</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        
        {/* Status */}
        <label className="block mb-2 font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="planned">Planned</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="on_hold">On Hold</option>
        </select>

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