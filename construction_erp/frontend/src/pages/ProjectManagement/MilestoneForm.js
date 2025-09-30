import React, { useState, useEffect } from "react";
import API from "../../api/axios";

const MilestoneForm = ({ milestone, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title);
      setDescription(milestone.description);
      setProject(milestone.project);
      setDueDate(milestone.due_date);
    }

    const fetchProjects = async () => {
      const res = await API.get("projects/");
      setProjects(res.data);
    };

    fetchProjects();
  }, [milestone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (milestone) {
      await API.put(`milestones/${milestone.id}/`, { title, description, project, due_date: dueDate });
    } else {
      await API.post("milestones/", { title, description, project, due_date: dueDate });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{milestone ? "Edit Milestone" : "Add Milestone"}</h2>
        <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border mb-2 rounded" required />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border mb-2 rounded" required />
        <select value={project} onChange={e=>setProject(e.target.value)} className="w-full p-2 border mb-2 rounded" required>
          <option value="">Select Project</option>
          {projects.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="w-full p-2 border mb-4 rounded" required />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">{milestone ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};

export default MilestoneForm;
