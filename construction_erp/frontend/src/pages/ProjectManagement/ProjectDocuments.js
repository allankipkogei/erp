import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import ProjectDocumentForm from "./ProjectDocumentForm";

const ProjectDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all documents
  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents/"); // ✅ Fixed path
      setDocuments(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ✅ Handle edit
  const handleEdit = (doc) => {
    setEditing(doc);
    setShowForm(true);
  };

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this document?")) {
      try {
        await API.delete(`/documents/${id}/`); // ✅ Fixed path
        fetchDocuments();
      } catch (err) {
        console.error("Error deleting document:", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Project Documents</h1>

      <button
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Document
      </button>

      {showForm && (
        <ProjectDocumentForm
          document={editing}
          onClose={() => {
            setShowForm(false);
            fetchDocuments();
          }}
        />
      )}

      <ul className="space-y-2">
        {documents.length === 0 ? (
          <p className="text-gray-500">No documents found.</p>
        ) : (
          documents.map((doc) => (
            <li
              key={doc.id}
              className="p-4 bg-gray-100 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{doc.name}</p>
                <p className="text-gray-500 text-sm">
                  Project: {doc.project_name || doc.project}
                </p>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  View File
                </a>
              </div>

              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(doc)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProjectDocuments;
