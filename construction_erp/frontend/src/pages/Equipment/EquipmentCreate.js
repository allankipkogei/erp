import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { X, Save, Wrench, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function EquipmentCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    equipment_type: "",
    status: "available",
    condition: "good",
    purchase_date: "",
    serial_number: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFieldErrors(prev => ({ ...prev, [e.target.name]: null }));
    setErrorMessage("");
  };

  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = "Equipment name is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/equipment/", formData);
      navigate("/equipment");
    } catch (err) {
      console.error("Create equipment error:", err);
      if (err && err.data) {
        const data = err.data;
        if (typeof data === "object") {
          const newFieldErrors = {};
          Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key]) && data[key].length) {
              newFieldErrors[key] = data[key].join(" ");
            } else if (typeof data[key] === "string") {
              if (key === "detail") {
                setErrorMessage(data[key]);
              } else {
                newFieldErrors[key] = data[key];
              }
            }
          });
          if (Object.keys(newFieldErrors).length) setFieldErrors(newFieldErrors);
          else if (!errorMessage) setErrorMessage("Failed to create equipment");
        } else {
          setErrorMessage(String(data) || "Failed to create equipment");
        }
      } else {
        setErrorMessage(err.message || "Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Cancel equipment creation?")) {
      navigate("/equipment");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Wrench className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Add New Equipment
            </h1>
            <p className="text-gray-600">Register construction equipment</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500" size={20} />
              <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Excavator, Crane"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {fieldErrors.name && <p className="text-sm text-red-600 mt-2">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Equipment Type</label>
            <input
              type="text"
              name="equipment_type"
              value={formData.equipment_type}
              onChange={handleChange}
              placeholder="Heavy Machinery, Tools, etc."
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${fieldErrors.equipment_type ? 'border-red-500' : 'border-gray-300'}`}
            />
            {fieldErrors.equipment_type && <p className="text-sm text-red-600 mt-2">{fieldErrors.equipment_type}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              >
                <option value="available">Available</option>
                <option value="in-use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="Equipment serial number"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl font-bold"
            >
              {loading ? <><RefreshCw className="mr-2 animate-spin" size={18} />Saving...</> : <><Save className="mr-2" size={20} />Add Equipment</>}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl hover:bg-gray-100 font-bold"
              onClick={handleCancel}
            >
              <X className="mr-2" size={20} />
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
