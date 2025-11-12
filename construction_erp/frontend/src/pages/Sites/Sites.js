import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { MapPin, PlusCircle, RefreshCw, AlertCircle, Building, Users, Calendar, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/sites/");
      const sitesData = response.data.results || response.data || [];
      setSites(Array.isArray(sitesData) ? sitesData : []);
    } catch (err) {
      console.error("Error loading sites:", err);
      setError(err.message || "Failed to load sites.");
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
          <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600" size={32} />
        </div>
        <p className="mt-6 text-xl text-gray-700 font-semibold">Loading sites...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Construction Sites
            </h1>
            <p className="text-gray-600 text-lg font-medium">Manage construction sites & operations</p>
          </div>
          <div className="flex gap-3">
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/sites/create")}
            >
              <PlusCircle size={22} />
              Add Site
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/daily-log")}
            >
              <Calendar size={22} />
              Daily Log
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => navigate("/safety-record")}
            >
              <Shield size={22} />
              Safety Record
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
                onClick={loadSites}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Building}
            title="Total Sites"
            value={sites.length}
            color="red"
          />
          <StatCard 
            icon={MapPin}
            title="Active Sites"
            value={sites.filter(s => s.status === 'active').length}
            color="green"
          />
          <StatCard 
            icon={Users}
            title="Workers On-Site"
            value={sites.reduce((sum, s) => sum + (s.workers_count || 0), 0)}
            color="blue"
          />
          <StatCard 
            icon={Shield}
            title="Safety Score"
            value="98%"
            color="orange"
          />
        </div>

        {/* Sites Grid */}
        {sites.length === 0 && !error ? (
          <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
              <MapPin className="text-red-600" size={48} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Sites Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Start by adding your first construction site
            </p>
            <Button 
              className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl shadow-xl font-semibold text-lg"
              onClick={() => navigate("/sites/create")}
            >
              <PlusCircle size={24} className="mr-2" />
              Add First Site
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorSchemes = {
    red: {
      gradient: "from-red-500 to-pink-600",
      bg: "from-red-50 to-pink-100",
      text: "text-red-700",
      border: "border-red-300"
    },
    green: {
      gradient: "from-green-500 to-emerald-600",
      bg: "from-green-50 to-emerald-100",
      text: "text-green-700",
      border: "border-green-300"
    },
    blue: {
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-100",
      text: "text-blue-700",
      border: "border-blue-300"
    },
    orange: {
      gradient: "from-orange-500 to-amber-600",
      bg: "from-orange-50 to-amber-100",
      text: "text-orange-700",
      border: "border-orange-300"
    }
  };

  const scheme = colorSchemes[color];

  return (
    <div className={`bg-gradient-to-br ${scheme.bg} p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${scheme.border}`}>
      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl bg-gradient-to-br ${scheme.gradient} flex items-center justify-center`}>
        <Icon className="text-white" size={28} />
      </div>
      <h3 className="text-sm font-bold text-gray-600 text-center mb-2 uppercase">{title}</h3>
      <p className={`text-4xl font-black text-center ${scheme.text}`}>{value}</p>
    </div>
  );
};

const SiteCard = ({ site, navigate }) => {
  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: '🏗️' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: '✅' },
    planning: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: '📋' },
    'on-hold': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: '⏸️' }
  };

  const status = statusConfig[site.status] || statusConfig.planning;

  return (
    <div 
      className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-red-400 cursor-pointer"
      onClick={() => navigate(`/sites/${site.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
          {site.name || 'Unnamed Site'}
        </h3>
        <MapPin className="text-red-600" size={24} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span className="text-sm">{site.location || 'No location'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={16} />
          <span className="text-sm">{site.workers_count || 0} Workers</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.text} ${status.border} flex items-center gap-1`}>
          <span>{status.icon}</span>
          {site.status || 'planning'}
        </span>
      </div>
    </div>
  );
};
