import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, Calendar, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function DailyLogCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sitesLoading, setSitesLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    site: "",
    date: new Date().toISOString().split('T')[0],
    notes: ""
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const response = await api.get("/sites/");
      const data = response.data.results || response.data || [];
      setSites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading sites:", err);
      setSites([]);
    } finally {
      setSitesLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!formData.site) {
      setErrorMessage("Please select a site");
      setLoading(false);
      return;
    }

    try {
      await api.post("/daily-logs/", formData);
      alert("✅ Daily log created successfully!");
      navigate("/daily-log");
    } catch (err) {
      console.error("Create daily log error:", err);
      setErrorMessage(err.data?.detail || "Failed to create daily log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => navigate("/daily-log")} variant="outline">
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <Calendar className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Create Daily Log
              </h1>
              <p className="text-gray-600">Record daily site activities</p>
            </div>
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
            <label className="block text-sm font-bold text-gray-700 mb-2">Site *</label>
            <select
              name="site"
              value={formData.site}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              required
              disabled={sitesLoading}
            >
              <option value="">Select a site</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter daily activities, observations, incidents..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              rows="6"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 rounded-xl font-bold">
              {loading ? <><RefreshCw className="mr-2 animate-spin" size={18} />Creating...</> : <><Save className="mr-2" size={20} />Create Log</>}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/daily-log")}>
              <X className="mr-2" size={20} />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
