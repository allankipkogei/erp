import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Calendar, PlusCircle, RefreshCw, AlertCircle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function DailyLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/daily-logs/");
      const data = response.data.results || response.data || [];
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading daily logs:", err);
      setError(err.message || "Failed to load daily logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading daily logs...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
                Daily Logs
              </h1>
              <p className="text-gray-600 text-lg font-medium">Track daily site activities</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/daily-log/create")}
            >
              <PlusCircle size={22} />
              New Log
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
                  onClick={loadLogs}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {logs.length === 0 && !error ? (
            <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <FileText className="text-orange-600" size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Daily Logs Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Start tracking site activities by creating your first daily log
              </p>
              <Button 
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
                onClick={() => navigate("/daily-log/create")}
              >
                <PlusCircle size={24} className="mr-2" />
                Create First Log
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {logs.map((log) => (
                <DailyLogCard key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const DailyLogCard = ({ log }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-400">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
          <Calendar className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {log.site?.name || 'Site Log'}
          </h3>
          <p className="text-sm text-gray-600">
            {log.date ? new Date(log.date).toLocaleDateString() : 'No date'}
          </p>
        </div>
      </div>
      
      {log.notes && (
        <p className="text-gray-700 text-sm line-clamp-3">
          {log.notes}
        </p>
      )}
    </div>
  );
};
