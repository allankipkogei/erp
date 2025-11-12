import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { User, Mail, Briefcase, Shield, ArrowLeft, RefreshCw, AlertCircle, Edit, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: ""
  });
  const navigate = useNavigate();

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/accounts/users/me/");
      setUser(response.data);
      setFormData({
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || ""
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put("/accounts/user/", formData);
      setUser(response.data);
      setEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={32} />
          </div>
          <p className="mt-6 text-xl text-gray-700 font-semibold">Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline"
              className="px-4 py-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 text-lg font-medium">View and manage your account information</p>
            </div>
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
                  onClick={loadUserProfile}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b-2 border-gray-200">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="text-white" size={48} />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  {user?.first_name || user?.last_name 
                    ? `${user.first_name} ${user.last_name}`.trim() 
                    : "User"}
                </h2>
                <p className="text-gray-600 text-lg">{user?.email}</p>
                <div className="mt-2">
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 border-2 border-purple-300' 
                      : 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                  }`}>
                    {user?.role?.toUpperCase()}
                  </span>
                </div>
              </div>
              <Button 
                onClick={() => setEditing(!editing)}
                className={`${
                  editing 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                } text-white px-6 py-3 rounded-xl font-bold`}
              >
                {editing ? (
                  <>
                    <ArrowLeft size={20} className="mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit size={20} className="mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Account Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <User size={18} className="text-indigo-600" />
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                      {user?.first_name || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <User size={18} className="text-indigo-600" />
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                      {user?.last_name || "Not set"}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Mail size={18} className="text-indigo-600" />
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Briefcase size={18} className="text-indigo-600" />
                    Role
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                    {user?.role}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Shield size={18} className="text-indigo-600" />
                    Account Status
                  </label>
                  <div className={`px-4 py-3 border-2 rounded-xl font-bold ${
                    user?.is_active 
                      ? 'bg-green-50 border-green-300 text-green-800' 
                      : 'bg-red-50 border-red-300 text-red-800'
                  }`}>
                    {user?.is_active ? '✅ Active' : '❌ Inactive'}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Shield size={18} className="text-indigo-600" />
                    Staff Status
                  </label>
                  <div className={`px-4 py-3 border-2 rounded-xl font-bold ${
                    user?.is_staff 
                      ? 'bg-purple-50 border-purple-300 text-purple-800' 
                      : 'bg-gray-50 border-gray-300 text-gray-800'
                  }`}>
                    {user?.is_staff ? '⭐ Staff Member' : 'Regular User'}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="pt-6 border-t-2 border-gray-200">
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg"
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
