import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminIP() {
  const [pendingDocs, setPendingDocs] = useState([]);

  useEffect(() => {
    fetchPendingDocs();
  }, []);

  const fetchPendingDocs = async () => {
    try {
      const res = await api.get("/admin/pending-ipdocs");
      setPendingDocs(res.data.docs || []);
    } catch (err) {
      console.error("Error fetching pending IP docs:", err);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`/admin/${action}-ip/${id}`);
      fetchPendingDocs();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  return (
    <div className="container">
      <h2>Admin - IP Document Review</h2>
      {pendingDocs.length === 0 ? (
        <p>No pending IP documents.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Startup</th>
              <th>Caption</th>
              <th>File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingDocs.map((doc) => (
              <tr key={doc._id} style={{ borderTop: "1px solid #ddd" }}>
                <td>{doc.startup?.fullName || "Unknown"}</td>
                <td>{doc.caption}</td>
                <td>
                  <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${doc.file}`} target="_blank" rel="noopener noreferrer">View File</a>
                </td>
                <td>
                  <button onClick={() => handleAction(doc._id, "approve")} style={{ marginRight: 8 }}>Approve</button>
                  <button onClick={() => handleAction(doc._id, "reject")}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
