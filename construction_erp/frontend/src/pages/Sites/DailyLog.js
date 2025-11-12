import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DailyLog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: "",
    workersPresent: "",
    weather: "",
    activities: ""
  });

  const handleCancel = () => {
    const hasChanges = Object.values(formData).some(value => value !== "");
    if (hasChanges) {
      if (window.confirm("Cancel daily log entry? All progress will be lost.")) {
        navigate("/sites");
      }
    } else {
      navigate("/sites");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="text-green-600" size={40} />
          <h1 className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Daily Log Entry
          </h1>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Workers Present</label>
            <input
              type="number"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              value={formData.workersPresent}
              onChange={(e) => setFormData({...formData, workersPresent: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Activities</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              rows="4"
              value={formData.activities}
              onChange={(e) => setFormData({...formData, activities: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl"
            >
              <Save className="mr-2" size={20} />
              Save Log
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
