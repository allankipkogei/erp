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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-lg text-gray-700 font-medium">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
            <p className="text-gray-600">Manage your construction projects</p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            onClick={() => navigate("/projects/create")}
          >
            <PlusCircle size={20} />
            Add New Project
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
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

        {/* Empty State OR Projects Grid */}
        {projects.length === 0 && !error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Briefcase className="mx-auto text-gray-400 mb-6" size={80} />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first construction project
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow-lg"
              onClick={() => navigate("/projects/create")}
            >
              <PlusCircle size={20} className="mr-2" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
  
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };
  
  return (
    <div 
      className="bg-white p-6 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{project.name || 'Untitled Project'}</h3>
        <Briefcase className="text-blue-500" size={24} />
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2 min-h-[48px]">
        {project.description || 'No description available'}
      </p>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[project.status] || statusColors.pending}`}>
          {project.status || 'pending'}
        </span>
        <span className="text-sm text-gray-500 font-medium">
          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No date'}
        </span>
      </div>
    </div>
  );
};
