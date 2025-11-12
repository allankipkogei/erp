import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, ClipboardList, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function TaskCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    setErrorMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.title?.trim()) errs.title = "Task title is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/tasks/", formData);
      navigate("/tasks");
    } catch (err) {
      console.error("Create task error:", err);
      if (err && err.data) {
        const data = err.data;
        if (typeof data === "object") {
          const newFieldErrors = {};
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key]) && data[key].length) {
              newFieldErrors[key] = data[key].join(" ");
            } else if (typeof data[key] === "string") {
              if (key === "detail") {
                setErrorMessage(data[key]);
              } else {
                newFieldErrors[key] = data[key];
              }
            }
          });
          if (Object.keys(newFieldErrors).length) setFieldErrors(newFieldErrors);
          else if (!errorMessage) setErrorMessage("Failed to create task");
        } else {
          setErrorMessage(String(data) || "Failed to create task");
        }
      } else {
        setErrorMessage(err.message || "Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel task creation?")) {
      navigate("/tasks");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <ClipboardList className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create New Task
            </h1>
            <p className="text-gray-600">Add a new task to the project</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.title ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {fieldErrors.title && <p className="text-sm text-red-600 mt-2">{fieldErrors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              rows="4"
            />
            {fieldErrors.description && <p className="text-sm text-red-600 mt-2">{fieldErrors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold"
            >
              {loading ? <><RefreshCw className="mr-2 animate-spin" size={18} />Creating...</> : <><Save className="mr-2" size={20} />Create Task</>}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-100 font-bold"
              onClick={handleCancel}
            >
              <X className="mr-2" size={20} />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
