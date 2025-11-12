import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function SiteCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    status: "planning",
    start_date: "",
    end_date: "",
    project_manager: "",
    workers_count: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    setErrorMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = "Site name is required";
    if (!formData.location?.trim()) errs.location = "Location is required";
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
      await api.post("/sites/", formData);
      alert("✅ Site created successfully!");
      navigate("/sites");
    } catch (err) {
      console.error("Create site error:", err);
      
      // Check for auth errors
      if (err.status === 401) {
        setErrorMessage("Your session has expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
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
          else if (!errorMessage) setErrorMessage("Failed to create site. Please check all fields.");
        } else {
          setErrorMessage(String(data) || "Failed to create site");
        }
      } else {
        setErrorMessage(err.message || "Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel site creation?")) {
      navigate("/sites");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <MapPin className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Add New Site
            </h1>
            <p className="text-gray-600">Register a new construction site</p>
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
            <label className="block text-sm font-bold text-gray-700 mb-2">Site Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Downtown Office Building"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {fieldErrors.name && <p className="text-sm text-red-600 mt-2">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Full address"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.location ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {fieldErrors.location && <p className="text-sm text-red-600 mt-2">{fieldErrors.location}</p>}
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
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Workers Count</label>
              <input
                type="number"
                name="workers_count"
                value={formData.workers_count}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Project Manager</label>
            <input
              type="text"
              name="project_manager"
              value={formData.project_manager}
              onChange={handleChange}
              placeholder="Manager name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold"
            >
              {loading ? <><RefreshCw className="mr-2 animate-spin" size={18} />Creating...</> : <><Save className="mr-2" size={20} />Add Site</>}
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
