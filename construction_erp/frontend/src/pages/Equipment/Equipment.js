import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { PlusCircle, Wrench, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await api.get("/equipment/");
        const data = response.data.results || response.data || [];
        setEquipment(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };
    loadEquipment();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <RefreshCw className="animate-spin text-amber-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Equipment</h1>
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl" onClick={() => navigate("/equipment/create")}>
            <PlusCircle className="mr-2" /> Add Equipment
          </Button>
        </div>
        {equipment.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-2xl">
            <Wrench className="mx-auto text-amber-400 mb-6" size={80} />
            <h3 className="text-3xl font-bold mb-3">No Equipment Yet</h3>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-10 py-4 rounded-xl" onClick={() => navigate("/equipment/create")}>
              Add First Equipment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold">{item.name}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
