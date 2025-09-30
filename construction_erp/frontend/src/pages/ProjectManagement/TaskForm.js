import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const TaskForm = ({ task, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setProject(task.project);
    }

    const fetchProjects = async () => {
      try {
        const res = await API.get("projects/");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await API.put(`tasks/${task.id}/`, { title, description, project });
      } else {
        await API.post("tasks/", { title, description, project });
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
        <h2 className="text-2xl font-bold mb-4">{task ? "Edit Task" : "Add Task"}</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          className="w-full p-2 border border-gray-300 rounded mb-2"
          required
        />
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
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
