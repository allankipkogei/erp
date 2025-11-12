import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { ClipboardList, PlusCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await api.get("/tasks/");
        const data = response.data.results || response.data || [];
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <RefreshCw className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Tasks</h1>
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl" onClick={() => navigate("/tasks/create")}>
            <PlusCircle className="mr-2" /> Create Task
          </Button>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-2xl">
            <ClipboardList className="mx-auto text-indigo-400 mb-6" size={80} />
            <h3 className="text-3xl font-bold mb-3">No Tasks Yet</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold">{task.title || 'Task'}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
