import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { Building2, Calendar, FileText, Save, X, RefreshCw, AlertCircle } from "lucide-react";

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "pending",
    start_date: "",
    end_date: "",
    budget: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // general
  const [fieldErrors, setFieldErrors] = useState({}); // field-specific

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    setFieldErrors(prev => ({...prev, [e.target.name]: null}));
    setErrorMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.name || !formData.name.trim()) errs.name = "Project name is required";
    // add other client validations if needed
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
      // use centralized api instance (adds Authorization automatically)
      const res = await api.post("/projects/", formData);
      // on success navigate to project detail
      const created = res.data;
      navigate(`/projects/${created.id}`);
    } catch (err) {
      // err is normalized by interceptor: { message, status, data }
      console.error("Create project error:", err);
      if (err && err.data) {
        // If server sent field errors (DRF style), show them
        // DRF returns dict of field -> [errors] or "detail"
        const data = err.data;
        if (typeof data === "object") {
          const newFieldErrors = {};
          // map common patterns
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key]) && data[key].length) {
              newFieldErrors[key] = data[key].join(" ");
            } else if (typeof data[key] === "string") {
              // some backends send { detail: "..." }
              if (key === "detail") {
                setErrorMessage(data[key]);
              } else {
                newFieldErrors[key] = data[key];
              }
            }
          });
          if (Object.keys(newFieldErrors).length) setFieldErrors(newFieldErrors);
          else if (!errorMessage) setErrorMessage("Failed to create project");
        } else {
          setErrorMessage(String(data) || "Failed to create project");
        }
      } else {
        setErrorMessage(err.message || "Network error. Check backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Building2 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New Project
            </h1>
            <p className="text-gray-600">Start a new construction project</p>
          </div>
        </div>

        {/* General error */}
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
            <label className="block text-sm font-bold text-gray-700 mb-2">Project Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Project name"
              required
            />
            {fieldErrors.name && <p className="text-sm text-red-600 mt-2">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Brief description"
            />
            {fieldErrors.description && <p className="text-sm text-red-600 mt-2">{fieldErrors.description}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-xl">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {fieldErrors.status && <p className="text-sm text-red-600 mt-2">{fieldErrors.status}</p>}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Budget</label>
            <input name="budget" value={formData.budget} onChange={handleChange} type="number" step="0.01" className="w-full px-4 py-3 border-2 rounded-xl" />
            {fieldErrors.budget && <p className="text-sm text-red-600 mt-2">{fieldErrors.budget}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <input name="start_date" value={formData.start_date} onChange={handleChange} type="date" className="w-full px-4 py-3 border-2 rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input name="end_date" value={formData.end_date} onChange={handleChange} type="date" className="w-full px-4 py-3 border-2 rounded-xl" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3 border-2 rounded-xl" />
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold" disabled={loading}>
              {loading ? <><RefreshCw className="mr-2 animate-spin" size={18} />Creating...</> : <><Save className="mr-2" size={18} />Create Project</>}
            </Button>
            <Button type="button" variant="outline" className="flex-1 border-2 rounded-xl py-3" onClick={() => navigate("/projects")}>
              <X className="mr-2" size={18} />Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
