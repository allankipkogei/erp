import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import TaskForm from "./TaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`tasks/${id}/`);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tasks</h1>
      <button
        onClick={() => { setEditingTask(null); setShowForm(true); }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Task
      </button>

      {showForm && (
        <TaskForm task={editingTask} onClose={() => { setShowForm(false); fetchTasks(); }} />
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 bg-gray-100 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{task.title}</p>
              <p className="text-gray-600 text-sm">{task.description}</p>
              <p className="text-gray-500 text-xs">Project: {task.project_name}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(task)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
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

export default Tasks;
