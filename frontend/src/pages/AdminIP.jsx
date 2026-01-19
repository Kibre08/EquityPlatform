import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function AdminIP() {
  const [pendingDocs, setPendingDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingDocs();
  }, []);

  const fetchPendingDocs = async () => {
    try {
      const res = await api.get("/admin/pending-ipdocs");
      setPendingDocs(res.data.docs || []);
    } catch (err) {
      console.error("Error fetching pending IP docs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await api.post(`/admin/${action}-ip/${id}`);
      fetchPendingDocs();
    } catch (err) {
      alert("Action failed: Protocol error");
    }
  };

  if (loading) return <div className="container">Verifying innovative assets...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>IP <span className="text-gradient">Moderation</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Validate and secure intellectual property submissions across the platform.</p>
      </header>

      <div className="dashboard-card">
        <div className="card-header">
          <h3 style={{ margin: 0 }}>Submissions Pending Review</h3>
          <span className="badge badge-warning">{pendingDocs.length} Pending</span>
        </div>

        {pendingDocs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            All intellectual property submissions have been processed.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Origin Startup</th>
                  <th>Innovation Outline</th>
                  <th>Documentation</th>
                  <th style={{ textAlign: 'right' }}>Moderation Protocol</th>
                </tr>
              </thead>
              <tbody>
                {pendingDocs.map((doc) => (
                  <tr key={doc._id}>
                    <td style={{ fontWeight: 600 }}>{doc.startup?.fullName || "Secured Entity"}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.caption || "Industrial innovation record."}</td>
                    <td>
                      <a href={`${BASE_URL}/uploads/${doc.file}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                        View Asset
                      </a>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleAction(doc._id, "approve")} className="btn btn-primary btn-sm">Approve</button>
                        <button onClick={() => handleAction(doc._id, "reject")} className="btn btn-sm" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

