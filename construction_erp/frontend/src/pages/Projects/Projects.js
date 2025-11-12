import React, { useEffect, useState } from "react";
import { fetchProjects } from "../../services/api";
import { Button } from "../../components/ui/button";
import { PlusCircle, RefreshCw, AlertCircle, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProjects();
      
      // CRITICAL FIX: Always ensure projects is an array
      if (response && response.results && Array.isArray(response.results)) {
        setProjects(response.results);
      } else if (Array.isArray(response)) {
        setProjects(response);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err.message || "Failed to load projects.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Projects
            </h1>
            <p className="text-gray-600 text-lg font-medium">Manage your construction projects</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
            onClick={() => navigate("/projects/create")}
          >
            <PlusCircle size={22} />
            New Project
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500" size={24} />
                <div>
                  <p className="text-red-800 font-semibold">Error Loading Projects</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadProjects}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {projects.length === 0 && !error ? (
          <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <Briefcase className="text-blue-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Projects Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Start building success by creating your first construction project
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate("/projects/create")}
            >
              <PlusCircle size={24} className="mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  
  const statusConfig = {
    active: {
      bg: 'bg-gradient-to-r from-emerald-100 to-green-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
      icon: '🚧'
    },
    completed: {
      bg: 'bg-gradient-to-r from-blue-100 to-indigo-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
      icon: '✅'
    },
    pending: {
      bg: 'bg-gradient-to-r from-yellow-100 to-amber-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      icon: '⏳'
    },
    cancelled: {
      bg: 'bg-gradient-to-r from-red-100 to-pink-100',
      text: 'text-red-800',
      border: 'border-red-300',
      icon: '❌'
    }
  };

  const status = statusConfig[project.status] || statusConfig.pending;
  
  return (
    <div 
      className="group bg-gradient-to-br from-white to-gray-50 p-7 rounded-3xl shadow-xl hover:shadow-3xl transition-all duration-500 cursor-pointer border-2 border-gray-200 hover:border-blue-400 transform hover:-translate-y-2"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-2xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {project.name || 'Untitled Project'}
        </h3>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <Briefcase className="text-white" size={24} />
        </div>
      </div>
      
      <p className="text-gray-600 mb-6 line-clamp-2 min-h-[48px] text-base">
        {project.description || 'No description available'}
      </p>
      
      <div className="flex justify-between items-center pt-5 border-t-2 border-gray-200">
        <span className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${status.bg} ${status.text} ${status.border} flex items-center gap-2`}>
          <span>{status.icon}</span>
          {project.status || 'pending'}
        </span>
        <span className="text-sm text-gray-600 font-semibold bg-gray-100 px-3 py-2 rounded-lg">
          📅 {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No date'}
        </span>
      </div>
    </div>
  );
};
