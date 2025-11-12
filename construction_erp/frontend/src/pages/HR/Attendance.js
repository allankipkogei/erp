import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Calendar, PlusCircle, RefreshCw, AlertCircle, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/attendance/");
      const attendanceData = response.data.results || response.data || [];
      setRecords(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (err) {
      console.error("Error loading attendance:", err);
      setError(err.message || "Failed to load attendance records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const markAttendance = async (attendanceStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      
      // Use the custom endpoint
      const endpoint = attendanceStatus === 'present' 
        ? '/attendance/mark_present/' 
        : '/attendance/mark_absent/';

      await api.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      loadAttendance();
      
      // Show success message
      const successMsg = attendanceStatus === 'present' 
        ? '✅ Attendance marked as Present!' 
        : '❌ Attendance marked as Absent!';
      alert(successMsg);
      
    } catch (err) {
      console.error("Mark attendance error:", err);
      const errorMsg = err.response?.data?.detail 
        || err.response?.data?.error 
        || "Failed to mark attendance. Please try again.";
      alert(`⚠️ ${errorMsg}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Attendance Tracker
            </h1>
            <p className="text-gray-600 text-lg font-medium">Track employee attendance</p>
          </div>
          <div className="flex gap-3">
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => markAttendance('present')}
            >
              <CheckCircle size={22} />
              Mark Present
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => markAttendance('absent')}
            >
              <X size={22} />
              Mark Absent
            </Button>
          </div>
        </div>

        {/* Error Alert */}
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
                onClick={loadAttendance}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Records"
            value={records.length}
            color="blue"
          />
          <StatCard 
            title="Present"
            value={records.filter(r => r.status === 'present').length}
            color="green"
          />
          <StatCard 
            title="Absent"
            value={records.filter(r => r.status === 'absent').length}
            color="red"
          />
        </div>

        {/* Attendance Records */}
        {records.length === 0 && !error ? (
          <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
              <Calendar className="text-green-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Attendance Records</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Start tracking by marking your attendance
            </p>
            <Button 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
              onClick={() => markAttendance('present')}
            >
              <CheckCircle size={24} className="mr-2" />
              Mark Present
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Date</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Check In</th>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Check Out</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">
                        {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          record.status === 'present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {record.check_in ? new Date(record.check_in).toLocaleTimeString() : '-'}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {record.check_out ? new Date(record.check_out).toLocaleTimeString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ title, value, color }) => {
  const colorSchemes = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      bg: "from-blue-50 to-blue-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    green: {
      gradient: "from-green-500 to-emerald-600",
      bg: "from-green-50 to-emerald-100",
      text: "text-green-700",
      border: "border-green-300"
    },
    red: {
      gradient: "from-red-500 to-pink-600",
      bg: "from-red-50 to-pink-100",
      text: "text-red-700",
      border: "border-red-300"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${scheme.border}`}>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-4xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};
