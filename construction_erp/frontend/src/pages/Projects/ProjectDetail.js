import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Briefcase, Calendar, DollarSign, MapPin, Users, FileText, RefreshCw, AlertCircle, Edit } from "lucide-react";
import api from "../../services/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/projects/${id}/`);
      setProject(response.data);
    } catch (err) {
      console.error("Error loading project:", err);
      setError(err.message || "Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={64} />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The project you're looking for doesn't exist."}</p>
            <Button
              onClick={() => navigate("/projects")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  };

  const status = statusConfig[project.status] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate("/projects")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Button>
          <Button
            onClick={() => navigate(`/projects/${id}/edit`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            <Edit size={20} className="mr-2" />
            Edit Project
          </Button>
        </div>

        {/* Project Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Briefcase className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 mb-2">
                  {project.name || 'Untitled Project'}
                </h1>
                <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${status.bg} ${status.text} ${status.border}`}>
                  {project.status || 'pending'}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-8">
            {project.description || 'No description available'}
          </p>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailItem
              icon={Calendar}
              label="Start Date"
              value={project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
            />
            <DetailItem
              icon={Calendar}
              label="End Date"
              value={project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
            />
            <DetailItem
              icon={DollarSign}
              label="Budget"
              value={project.budget ? `$${parseFloat(project.budget).toLocaleString()}` : 'Not set'}
            />
            <DetailItem
              icon={MapPin}
              label="Location"
              value={project.location || 'Not specified'}
            />
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={Users}
            title="Team Members"
            content="View and manage project team"
            color="emerald"
          />
          <InfoCard
            icon={FileText}
            title="Documents"
            content="Project files and documentation"
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
      <Icon className="text-white" size={20} />
    </div>
    <div>
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const InfoCard = ({ icon: Icon, title, content, color }) => {
  const colors = {
    emerald: "from-emerald-500 to-teal-600",
    purple: "from-purple-500 to-indigo-600"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};
