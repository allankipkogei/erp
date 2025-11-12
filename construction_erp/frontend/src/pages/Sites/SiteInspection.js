import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { ClipboardCheck, PlusCircle, RefreshCw, AlertCircle } from "lucide-react";
import api from "../../services/api";
import Navbar from "../../components/Navigation/Navbar";

export default function SiteInspection() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInspections = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/site-inspections/");
      const data = response.data.results || response.data || [];
      setInspections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading inspections:", err);
      setError(err.message || "Failed to load inspections.");
      setInspections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInspections();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <RefreshCw className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
          </div>
          <p className="mt-6 text-xl text-gray-700 font-semibold">Loading inspections...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Site Inspections
              </h1>
              <p className="text-gray-600 text-lg font-medium">Quality control & compliance checks</p>
            </div>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 font-semibold"
              onClick={() => alert("Create Inspection - Not implemented yet")}
            >
              <PlusCircle size={22} />
              New Inspection
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
                  onClick={loadInspections}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {inspections.length === 0 && !error ? (
            <div className="text-center py-24 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <ClipboardCheck className="text-blue-600" size={48} />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Inspections Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Start conducting site inspections for quality assurance
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspections.map((inspection) => (
                <InspectionCard key={inspection.id} inspection={inspection} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const InspectionCard = ({ inspection }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-400">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <ClipboardCheck className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {inspection.site?.name || 'Site Inspection'}
          </h3>
          <p className="text-sm text-gray-600">
            {inspection.date ? new Date(inspection.date).toLocaleDateString() : 'No date'}
          </p>
        </div>
      </div>
      
      {inspection.inspector && (
        <p className="text-gray-700 text-sm">
          <span className="font-semibold">Inspector:</span> {inspection.inspector}
        </p>
      )}
    </div>
  );
};
