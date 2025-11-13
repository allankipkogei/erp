import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Edit, Calendar, DollarSign, MapPin, Users, FileText, Upload, Trash2, UserPlus, X, Save, RefreshCw } from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    loadProjectDetails();
    loadTeamMembers();
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProjectDetails = async () => {
    try {
      const response = await api.get(`/projects/${id}/`);
      setProject(response.data);
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await api.get(`/project-team/?project=${id}`);
      setTeamMembers(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error loading team members:", err);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await api.get(`/documents/?project=${id}`);
      setDocuments(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error loading documents:", err);
    }
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (window.confirm("Remove this team member?")) {
      try {
        await api.delete(`/project-team/${memberId}/`);
        alert("✅ Team member removed!");
        loadTeamMembers();
      } catch (err) {
        alert("❌ Failed to remove team member");
      }
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (window.confirm("Delete this document?")) {
      try {
        await api.delete(`/documents/${docId}/`);
        alert("✅ Document deleted successfully!");
        loadDocuments();
      } catch (err) {
        alert("❌ Failed to delete document");
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <RefreshCw className="animate-spin text-blue-600" size={48} />
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h2>
            <Button onClick={() => navigate("/projects")}>
              <ArrowLeft size={20} className="mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </>
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate("/projects")} variant="outline">
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              <Edit size={20} className="mr-2" />
              Edit Project
            </Button>
          </div>

          {/* Project Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InfoCard
              icon={<Calendar size={24} />}
              label="Start Date"
              value={project.start_date ? new Date(project.start_date).toLocaleDateString() : "Not set"}
              color="blue"
            />
            <InfoCard
              icon={<Calendar size={24} />}
              label="End Date"
              value={project.end_date ? new Date(project.end_date).toLocaleDateString() : "Not set"}
              color="blue"
            />
            <InfoCard
              icon={<DollarSign size={24} />}
              label="Budget"
              value={project.budget ? `$${parseFloat(project.budget).toLocaleString()}` : "$1,000"}
              color="green"
            />
            <InfoCard
              icon={<MapPin size={24} />}
              label="Location"
              value={project.location || "Not specified"}
              color="purple"
            />
          </div>

          {/* Team Members and Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Team Members Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                </div>
                <Button
                  onClick={() => setShowTeamModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                  size="sm"
                >
                  <UserPlus size={18} className="mr-1" />
                  Add
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">View and manage project team</p>

              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No team members yet</p>
                  <Button onClick={() => setShowTeamModal(true)} className="mt-4" size="sm">
                    Add First Member
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      onDelete={handleDeleteTeamMember}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <FileText className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
                </div>
                <Button
                  onClick={() => setShowDocumentModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  size="sm"
                >
                  <Upload size={18} className="mr-1" />
                  Upload
                </Button>
              </div>
              
              <p className="text-gray-600 mb-6">Project files and documentation</p>

              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No documents yet</p>
                  <Button onClick={() => setShowDocumentModal(true)} className="mt-4" size="sm">
                    Upload First Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onDelete={handleDeleteDocument}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showTeamModal && (
        <AddTeamMemberModal
          projectId={id}
          onClose={() => setShowTeamModal(false)}
          onSuccess={() => {
            setShowTeamModal(false);
            loadTeamMembers();
          }}
        />
      )}

      {/* Add Document Modal */}
      {showDocumentModal && (
        <AddDocumentModal
          projectId={id}
          onClose={() => setShowDocumentModal(false)}
          onSuccess={() => {
            setShowDocumentModal(false);
            loadDocuments();
          }}
        />
      )}
    </>
  );
}

const InfoCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-emerald-600",
    purple: "from-purple-500 to-indigo-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center mb-4`}>
        <div className="text-white">{icon}</div>
      </div>
      <p className="text-sm font-bold text-gray-600 uppercase">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  );
};

const TeamMemberCard = ({ member, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-emerald-400 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
          <Users className="text-white" size={20} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{member.employee?.first_name || member.user?.first_name || "Team Member"} {member.employee?.last_name || member.user?.last_name || ""}</p>
          <p className="text-sm text-gray-600">{member.role || "Member"}</p>
        </div>
      </div>
      <Button
        onClick={() => onDelete(member.id)}
        variant="outline"
        size="sm"
        className="border-red-300 text-red-700 hover:bg-red-50"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

const DocumentCard = ({ document, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
          <FileText className="text-white" size={20} />
        </div>
        <div>
          <p className="font-bold text-gray-900">{document.title || document.file_name || "Document"}</p>
          <p className="text-sm text-gray-600">
            {document.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : "No date"}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        {document.file_url && (
          <Button
            onClick={() => window.open(document.file_url, '_blank')}
            variant="outline"
            size="sm"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            View
          </Button>
        )}
        <Button
          onClick={() => onDelete(document.id)}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

const AddTeamMemberModal = ({ projectId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    role: "Developer"
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data.results || response.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/project-team/", {
        project: projectId,
        user: formData.user,
        role: formData.role
      });
      alert("✅ Team member added!");
      onSuccess();
    } catch (err) {
      console.error("Error adding team member:", err);
      alert("❌ Failed to add team member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Add Team Member
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">User *</label>
            <select
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500"
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Role *</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Project Manager, Developer"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              {loading ? "Adding..." : <><Save className="mr-2" size={20} />Add Member</>}
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

const AddDocumentModal = ({ projectId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file_url: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/documents/", {
        project: projectId,
        ...formData
      });
      alert("✅ Document added!");
      onSuccess();
    } catch (err) {
      console.error("Error adding document:", err);
      alert("❌ Failed to add document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Add Document
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Document title"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">File URL</label>
            <input
              type="url"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Document description..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              rows="3"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              {loading ? "Adding..." : <><Save className="mr-2" size={20} />Add Document</>}
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
