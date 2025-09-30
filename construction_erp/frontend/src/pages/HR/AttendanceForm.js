import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const AttendanceForm = ({ record, onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    date: "",
    status: "Present",
    check_in: "",
    check_out: "",
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

    if (record) {
      setFormData({
        employee: record.employee || "",
        date: record.date || "",
        status: record.status || "Present",
        check_in: record.check_in || "",
        check_out: record.check_out || "",
      });
    }
  }, [record]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (record) {
        await API.put(`attendance/${record.id}/`, formData);
      } else {
        await API.post("attendance/", formData);
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving attendance");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-4">
        {record ? "Edit Attendance" : "Mark Attendance"}
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
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Leave">Leave</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Check-in Time</label>
          <input
            type="time"
            name="check_in"
            value={formData.check_in}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Check-out Time</label>
          <input
            type="time"
            name="check_out"
            value={formData.check_out}
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

export default AttendanceForm;
