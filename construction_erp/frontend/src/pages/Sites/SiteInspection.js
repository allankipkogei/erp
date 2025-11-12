import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, ClipboardCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SiteInspection() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    inspectionDate: "",
    inspector: "",
    status: "",
    findings: ""
  });

  const handleCancel = () => {
    if (window.confirm("Abandon inspection? Your findings will not be recorded.")) {
      navigate("/sites");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <ClipboardCheck className="text-cyan-600" size={40} />
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Site Inspection Report
          </h1>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Inspection Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
              value={formData.inspectionDate}
              onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="">Select status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Findings</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none"
              rows="5"
              value={formData.findings}
              onChange={(e) => setFormData({...formData, findings: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-xl"
            >
              <Save className="mr-2" size={20} />
              Submit Report
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
