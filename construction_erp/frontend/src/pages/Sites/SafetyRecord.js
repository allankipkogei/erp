import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Shield, PlusCircle, RefreshCw, AlertCircle, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function SafetyRecord() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/safety-records/");
      const data = response.data.results || response.data || [];
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading safety records:", err);
      setError(err.message || "Failed to load safety records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading safety records...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Safety Records
              </h1>
              <p className="text-gray-600 text-lg font-medium">Track workplace safety incidents</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/safety-record/create")}
            >
              <PlusCircle size={22} />
              New Record
            </Button>
          </div>

          {error && (
            <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-red-500" size={24} />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadRecords}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {records.length === 0 && !error ? (
            <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                <Shield className="text-red-600" size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Safety Records Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Start tracking safety incidents and maintain workplace safety
              </p>
              <Button 
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
                onClick={() => navigate("/safety-record/create")}
              >
                <PlusCircle size={24} className="mr-2" />
                Create First Record
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {records.map((record) => (
                <SafetyRecordCard key={record.id} record={record} onDelete={loadRecords} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const SafetyRecordCard = ({ record, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete this safety record?`)) {
      try {
        await api.delete(`/safety-records/${record.id}/`);
        alert("✅ Safety record deleted successfully!");
        onDelete();
      } catch (err) {
        alert("❌ Failed to delete safety record");
      }
    }
  };

  const severityColors = {
    low: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  };

  const severity = severityColors[record.severity] || severityColors.medium;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-red-400">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
          <Shield className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {record.site?.name || 'Safety Record'}
          </h3>
          <p className="text-sm text-gray-600">
            {record.date ? new Date(record.date).toLocaleDateString() : 'No date'}
          </p>
        </div>
      </div>

      {record.severity && (
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${severity.bg} ${severity.text} ${severity.border}`}>
            {record.severity?.toUpperCase()}
          </span>
        </div>
      )}
      
      {record.description && (
        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {record.description}
        </p>
      )}

      <div className="pt-4 border-t-2 border-gray-100 flex gap-2">
        <Button onClick={() => navigate(`/safety-record/${record.id}/edit`)} variant="outline" className="flex-1" size="sm">
          <Edit size={16} className="mr-1" />
          Edit
        </Button>
        <Button onClick={handleDelete} variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-50" size="sm">
          <Trash2 size={16} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
};
