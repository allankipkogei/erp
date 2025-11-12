import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Calendar, RefreshCw, AlertCircle, CheckCircle, XCircle, Clock, User } from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function Attendance() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMarkModal, setShowMarkModal] = useState(false);

  const loadAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/attendance/");
      const data = response.data.results || response.data || [];
      setAttendanceRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading attendance:", err);
      setError(err.message || "Failed to load attendance.");
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-teal-600" size={32} />
          </div>
          <p className="mt-6 text-xl text-gray-700 font-semibold">Loading attendance...</p>
        </div>
      </>
    );
  }

  const todayRecord = attendanceRecords.find(r => r.date === new Date().toISOString().split('T')[0]);
  const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Attendance Tracking
              </h1>
              <p className="text-gray-600 text-lg font-medium">Monitor team attendance & work hours</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => setShowMarkModal(true)}
            >
              <User size={22} />
              Mark Attendance
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
                  onClick={loadAttendance}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AttendanceStatCard title="Total Days" value={attendanceRecords.length} color="blue" icon={<Calendar size={32} />} />
            <AttendanceStatCard title="Present" value={presentCount} color="green" icon={<CheckCircle size={32} />} />
            <AttendanceStatCard title="Absent" value={absentCount} color="red" icon={<XCircle size={32} />} />
          </div>

          {/* Today's Status */}
          {todayRecord && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Clock size={28} className="text-teal-600" />
                Today's Attendance
              </h2>
              <div className="flex items-center gap-4">
                <div className={`px-6 py-3 rounded-xl font-bold text-lg ${
                  todayRecord.status === 'present' 
                    ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                    : 'bg-red-100 text-red-800 border-2 border-red-300'
                }`}>
                  {todayRecord.status === 'present' ? '✅ Marked Present' : '❌ Marked Absent'}
                </div>
                <p className="text-gray-600">
                  Check-in: {todayRecord.check_in ? new Date(todayRecord.check_in).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Attendance Records */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Attendance History</h2>
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
                <p className="text-gray-500 text-lg">No attendance records yet</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
                  onClick={() => setShowMarkModal(true)}
                >
                  Mark Your First Attendance
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {attendanceRecords.map((record) => (
                  <AttendanceCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <MarkAttendanceModal 
          onClose={() => setShowMarkModal(false)}
          onSuccess={() => {
            setShowMarkModal(false);
            loadAttendance();
          }}
        />
      )}
    </>
  );
}

const MarkAttendanceModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/attendance/", {
        ...formData,
        check_in: new Date().toISOString()
      });
      alert("✅ Attendance marked successfully!");
      onSuccess();
    } catch (err) {
      console.error("Mark attendance error:", err);
      alert("❌ Failed to mark attendance. You may have already marked attendance for today.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          Mark Attendance
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              required
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half-day">Half Day</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              rows="3"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 rounded-xl font-bold">
              {loading ? "Marking..." : "Mark Attendance"}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AttendanceStatCard = ({ title, value, color, icon }) => {
  const colorSchemes = {
    blue: { gradient: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-100", text: "text-blue-700" },
    green: { gradient: "from-green-500 to-emerald-600", bg: "from-green-50 to-emerald-100", text: "text-green-700" },
    red: { gradient: "from-red-500 to-pink-600", bg: "from-red-50 to-pink-100", text: "text-red-700" }
  };
  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300`}>
      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-4xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};

const AttendanceCard = ({ record }) => {
  const statusConfig = {
    present: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: <CheckCircle size={20} /> },
    absent: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: <XCircle size={20} /> },
    late: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: <Clock size={20} /> },
    'half-day': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: <Clock size={20} /> }
  };
  const config = statusConfig[record.status] || statusConfig.present;

  return (
    <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-teal-400 transition-colors">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-gray-900">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p className="text-sm text-gray-600">Check-in: {record.check_in ? new Date(record.check_in).toLocaleTimeString() : 'N/A'}</p>
          {record.notes && <p className="text-sm text-gray-500 mt-1">Note: {record.notes}</p>}
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bg} ${config.text} ${config.border}`}>
          {config.icon}
          <span className="font-bold text-sm">{record.status?.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};