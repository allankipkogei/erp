import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SafetyRecord() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    incidentType: "",
    severity: "",
    description: "",
    actionTaken: ""
  });

  const handleCancel = () => {
    if (window.confirm("Cancel safety record? This incident report will not be saved.")) {
      navigate("/sites");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <Shield className="text-red-600" size={40} />
          <h1 className="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Safety Incident Record
          </h1>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Incident Type</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              value={formData.incidentType}
              onChange={(e) => setFormData({...formData, incidentType: e.target.value})}
            >
              <option value="">Select type</option>
              <option value="minor">Minor Injury</option>
              <option value="major">Major Injury</option>
              <option value="near-miss">Near Miss</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl"
            >
              <Save className="mr-2" size={20} />
              Save Record
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-100"
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
