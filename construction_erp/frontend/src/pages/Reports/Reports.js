// src/pages/Reports/Reports.js
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { BarChart, PlusCircle, RefreshCw, AlertCircle, FileText, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/reports/");
      const reportsData = response.data.results || response.data || [];
      setReports(Array.isArray(reportsData) ? reportsData : []);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err.message || "Failed to load reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-violet-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 text-lg font-medium">Generate & view analytics</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
            onClick={() => navigate("/reports/create")}
          >
            <PlusCircle size={22} />
            Generate Report
          </Button>
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
                onClick={loadReports}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Quick Reports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickReportCard
            title="Financial Report"
            description="Revenue, expenses & profit analysis"
            icon={<BarChart size={32} />}
            color="green"
            onClick={() => navigate("/reports/create?type=financial")}
          />
          <QuickReportCard
            title="Project Progress"
            description="Current status of all projects"
            icon={<FileText size={32} />}
            color="blue"
            onClick={() => navigate("/reports/create?type=project")}
          />
          <QuickReportCard
            title="Safety Report"
            description="Incidents & safety records"
            icon={<AlertCircle size={32} />}
            color="red"
            onClick={() => navigate("/reports/create?type=safety")}
          />
        </div>

        {/* Reports List */}
        {reports.length === 0 && !error ? (
          <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
              <BarChart className="text-violet-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Reports Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Generate your first report to track business performance
            </p>
            <Button 
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
              onClick={() => navigate("/reports/create")}
            >
              <PlusCircle size={24} className="mr-2" />
              Generate First Report
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Reports</h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <ReportItem key={report.id} report={report} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const QuickReportCard = ({ title, description, icon, color, onClick }) => {
  const colors = {
    green: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    blue: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
    red: "from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
  };

  return (
    <div 
      className={`bg-gradient-to-r ${colors[color]} text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
      onClick={onClick}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  );
};

const ReportItem = ({ report }) => {
  return (
    <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-violet-400 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{report.title || report.report_type || 'Report'}</h3>
          <p className="text-sm text-gray-600">
            {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'Date not available'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Eye size={16} />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download
        </Button>
      </div>
    </div>
  );
};
