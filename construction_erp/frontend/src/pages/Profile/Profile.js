import React, { useEffect, useState, useCallback } from "react";
import { Button } from "../../components/ui/button";
import { User, Mail, Shield, Edit2, Save, X, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: ""
  });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}/accounts/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        role: response.data.role || ""
      });
    } catch (err) {
      console.error("Profile error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `${API_URL}/accounts/user/`,
        {
          first_name: formData.first_name,
          last_name: formData.last_name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      role: user.role || ""
    });
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-lg text-gray-700 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          {!editing && (
            <Button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg"
              onClick={() => setEditing(true)}
            >
              <Edit2 size={20} />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={24} />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={24} />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <User className="text-white" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.first_name || user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : "No Name Set"}
            </h2>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Mail size={16} />
              {user?.email}
            </p>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    editing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="Enter your first name"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!editing}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition-all ${
                    editing
                      ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                  }`}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Email (Read Only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Role (Read Only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formData.role}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed capitalize"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Role is assigned by administrators</p>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Status
              </label>
              <div className="flex gap-4">
                <div className={`px-4 py-2 rounded-lg ${user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user?.is_active ? '✓ Active' : '✗ Inactive'}
                </div>
                {user?.is_staff && (
                  <div className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800">
                    ✓ Staff Member
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="mr-2 animate-spin" size={20} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={20} />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={saving}
                  variant="outline"
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  <X className="mr-2" size={20} />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
