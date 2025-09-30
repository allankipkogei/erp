import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const LeaveForm = ({ leave, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    leave_type: "Annual",
    start_date: "",
    end_date: "",
    reason: "",
    status: "Pending",
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await API.get("employees/");
        setEmployees(res.data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();

    if (leave) {
      setFormData({
        employee: leave.employee || "",
        leave_type: leave.leave_type || "Annual",
        start_date: leave.start_date || "",
        end_date: leave.end_date || "",
        reason: leave.reason || "",
        status: leave.status || "Pending",
      });
    }
  }, [leave]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (leave) {
        await API.put(`leaves/${leave.id}/`, formData);
      } else {
        await API.post("leaves/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving leave request");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {leave ? "Edit Leave Request" : "Request Leave"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Employee</label>
          <select
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Leave Type</label>
          <select
            name="leave_type"
            value={formData.leave_type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Annual">Annual</option>
            <option value="Sick">Sick</option>
            <option value="Maternity">Maternity</option>
            <option value="Paternity">Paternity</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Reason</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className="w-full border px-3 py-2 rounded"
            placeholder="Reason for leave"
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
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

export default LeaveForm;
