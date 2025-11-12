import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReportCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reportType: "",
    title: "",
    dateRange: "",
    description: ""
  });

  const handleCancel = () => {
    if (window.confirm("Discard report? All data will be lost.")) {
      navigate("/reports");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <FileText className="text-violet-600" size={40} />
          <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Generate Report
          </h1>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Report Type</label>
            <select
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
              value={formData.reportType}
              onChange={(e) => setFormData({...formData, reportType: e.target.value})}
            >
              <option value="">Select type</option>
              <option value="financial">Financial Report</option>
              <option value="project">Project Progress</option>
              <option value="safety">Safety Report</option>
              <option value="inventory">Inventory Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 rounded-xl"
            >
              <Save className="mr-2" size={20} />
              Generate Report
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
