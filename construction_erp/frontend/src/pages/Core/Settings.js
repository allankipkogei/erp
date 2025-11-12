// src/pages/Core/Settings.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { accessToken } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Load current user info
  useEffect(() => {
    if (accessToken) {
      axios
        .get("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setFormData({
            username: res.data.username,
            email: res.data.email,
            password: "",
          });
        })
        .catch((err) => {
          console.error("Error loading user:", err.response?.data || err.message);
        });
    }
  }, [accessToken]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.put(
        "http://127.0.0.1:8000/api/users/me/",
        { username: formData.username, email: formData.email, password: formData.password },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessage("Settings updated successfully ✅");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setMessage("Failed to update settings ❌");
    }
  };

  return (
    <div className="settings-page p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      {message && <p className="mb-4 text-sm">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">New Password (optional)</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
