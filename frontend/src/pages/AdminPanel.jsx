import { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [pendingIpDocs, setPendingIpDocs] = useState([]);
  const [complaints, setComplaints] = useState([]);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/admin/pending-users");
      setPendingUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingContributions = async () => {
    try {
      const res = await api.get("/admin/pending-contributions");
      setPendingContributions(res.data.contributions || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPendingIpDocs = async () => {
    try {
      const res = await api.get("/admin/pending-ipdocs");
      setPendingIpDocs(res.data.docs || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
    fetchPendingContributions();
    fetchPendingIpDocs();
    fetchComplaints();
  }, []);

  const handleUserApproval = async (id, action) => {
    try {
      await api.post(`/admin/${action}/${id}`);
      fetchPendingUsers();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleContributionApproval = async (id, action) => {
    try {
      await api.post(`/admin/${action}-contribution/${id}`);
      fetchPendingContributions();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const handleIpApproval = async (id, action) => {
    try {
      await api.post(`/admin/${action}-ip/${id}`);
      fetchPendingIpDocs();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  return (
    <div className="container">
      <h1>📊 Admin Panel</h1>

      <section>
        <h2>Pending Users ({pendingUsers.length})</h2>
        {pendingUsers.length === 0 && <p>No pending users.</p>}
        {pendingUsers.map(u => (
          <div key={u._id} className="card" style={{ marginBottom: 16 }}>
            <div><strong>{u.fullName}</strong> ({u.role})</div>
            <div>Email: {u.email}</div>
            <div>
              Selfie: {u.selfie ? <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${u.selfie}`} target="_blank" rel="noreferrer">View</a> : "No"}
              <span style={{ margin: "0 10px" }}>|</span>
              ID: {u.idDocument ? <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${u.idDocument}`} target="_blank" rel="noreferrer">View PDF</a> : "No"}
            </div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => handleUserApproval(u._id, "approve")} style={{ marginRight: 8 }}>Approve</button>
              <button className="btn btn-secondary" onClick={() => handleUserApproval(u._id, "reject")}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      <hr style={{ borderColor: 'var(--border)', margin: '32px 0' }} />

      <section>
        <h2>Pending Contributions ({pendingContributions.length})</h2>
        {pendingContributions.length === 0 && <p>No pending contributions.</p>}
        {pendingContributions.map(c => (
          <div key={c._id} className="card" style={{ marginBottom: 16 }}>
            <div><strong>{c.investor?.fullName || c.investor}</strong> → {c.campaign?.title}</div>
            <div>Amount: ${c.amount}</div>
            <div>Payment Proof: {c.proofFile ? <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${c.proofFile}`} target="_blank" rel="noreferrer">View</a> : "No proof"}</div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => handleContributionApproval(c._id, "approve")} style={{ marginRight: 8 }}>Approve</button>
              <button className="btn btn-secondary" onClick={() => handleContributionApproval(c._id, "reject")}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      <hr style={{ borderColor: 'var(--border)', margin: '32px 0' }} />

      <section>
        <h2>Pending IP Docs ({pendingIpDocs.length})</h2>
        {pendingIpDocs.length === 0 && <p>No pending IP docs.</p>}
        {pendingIpDocs.map(doc => (
          <div key={doc._id} className="card" style={{ marginBottom: 16 }}>
            <div><strong>{doc.startup?.fullName}</strong> — {doc.startup?.email}</div>
            <div>File: {doc.file ? <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${doc.file}`} target="_blank" rel="noreferrer">View</a> : "No file"}</div>
            <div style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={() => handleIpApproval(doc._id, "approve")} style={{ marginRight: 8 }}>Approve</button>
              <button className="btn btn-secondary" onClick={() => handleIpApproval(doc._id, "reject")}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      <hr style={{ borderColor: 'var(--border)', margin: '32px 0' }} />

      <section>
        <h2>📢 User Complaints ({complaints.length})</h2>
        {complaints.length === 0 && <p>No complaints found.</p>}
        {complaints.map(complaint => (
          <div key={complaint._id} className="card" style={{ marginBottom: 16, borderColor: '#ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>From: {complaint.user?.fullName || "Unknown"} ({complaint.user?.email})</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(complaint.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ marginTop: 8, fontWeight: 500 }}>Target: {complaint.target || "General"}</div>
            <div style={{ marginTop: 8, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 4 }}>
              "{complaint.message}"
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
