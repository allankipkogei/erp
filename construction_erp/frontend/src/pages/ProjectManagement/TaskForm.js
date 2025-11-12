import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const TaskForm = ({ task, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    // Prefill form when editing a task
    if (task) {
      setName(task.name);
      setDescription(task.description || "");
      setProject(task.project);
      setStartDate(task.start_date || "");
      setDueDate(task.due_date || "");
    }

    // Fetch available projects
    const fetchProjects = async () => {
      try {
        const res = await API.get("projects/");
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      project: Number(project),
      start_date: startDate,
      due_date: dueDate,
    };

    try {
      if (task) {
        await API.put(`tasks/${task.id}/`, payload);
      } else {
        await API.post("tasks/", payload);
      }
      onClose();
    } catch (err) {
      console.error("Error saving task:", err.response?.data || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          {task ? "Edit Task" : "Add Task"}
        </h2>

        {/* Task Name */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Task Name"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />

        {/* Project Selection */}
        <select
          value={project}
          onChange={(e) => setProject(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Dates */}
        <label className="block text-sm text-gray-600 mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />

        <label className="block text-sm text-gray-600 mb-1">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
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
            {task ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
