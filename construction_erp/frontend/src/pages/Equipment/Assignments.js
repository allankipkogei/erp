import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import AssignmentForm from "./AssignmentForm";

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await API.get("assignments/");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        await API.delete(`assignments/${id}/`);
        fetchAssignments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Assignments</h1>
      <button
        onClick={() => {
          setEditingAssignment(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700"
      >
        Add Assignment
      </button>

      {showForm && (
        <AssignmentForm
          assignment={editingAssignment}
          onClose={() => {
            setShowForm(false);
            fetchAssignments();
          }}
        />
      )}

      <ul className="space-y-2">
        {assignments.map((assignment) => (
          <li
            key={assignment.id}
            className="p-4 bg-gray-100 rounded flex justify-between items-center"
          >
            <span>
              {assignment.equipment_name} → {assignment.employee_name}  
              ({assignment.start_date} - {assignment.end_date || "Ongoing"})
            </span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(assignment)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(assignment.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Assignments;
