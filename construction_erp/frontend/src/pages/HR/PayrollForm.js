import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const PayrollForm = ({ payroll, onClose }) => {
  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    basic_salary: "",
    allowances: "",
    deductions: "",
  });

  useEffect(() => {
    if (payroll) {
      setFormData({
        employee: payroll.employee || "",
        month: payroll.month || "",
        basic_salary: payroll.basic_salary || "",
        allowances: payroll.allowances || "",
        deductions: payroll.deductions || "",
      });
    }
  }, [payroll]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (payroll) {
        await API.put(`payrolls/${payroll.id}/`, formData);
      } else {
        await API.post("payrolls/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving payroll");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {payroll ? "Edit Payroll" : "Add Payroll"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">Employee</label>
          <input
            type="text"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Month</label>
          <input
            type="month"
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Basic Salary</label>
          <input
            type="number"
            name="basic_salary"
            value={formData.basic_salary}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Allowances</label>
          <input
            type="number"
            name="allowances"
            value={formData.allowances}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deductions</label>
          <input
            type="number"
            name="deductions"
            value={formData.deductions}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayrollForm;
