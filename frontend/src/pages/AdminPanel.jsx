import { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingContributions, setPendingContributions] = useState([]);
  const [pendingIpDocs, setPendingIpDocs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [users, contributions, ip, complaintsRes] = await Promise.all([
        api.get("/admin/pending-users"),
        api.get("/admin/pending-contributions"),
        api.get("/admin/pending-ipdocs"),
        api.get("/complaints")
      ]);
      setPendingUsers(users.data.users || []);
      setPendingContributions(contributions.data.contributions || []);
      setPendingIpDocs(ip.data.docs || []);
      setComplaints(complaintsRes.data.complaints || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserApproval = async (id, action) => {
    try {
      await api.post(`/admin/${action}/${id}`);
      fetchData();
    } catch (err) {
      alert("Verification protocol failure.");
    }
  };

  const handleContributionApproval = async (id, action) => {
    try {
      await api.post(`/admin/${action}-contribution/${id}`);
      fetchData();
    } catch (err) {
      alert("Ledger update failure.");
    }
  };

  const handleIpApproval = async (id, action) => {
    try {
      await api.post(`/admin/${action}-ip/${id}`);
      fetchData();
    } catch (err) {
      alert("IP validation failure.");
    }
  };

  if (loading) return <div className="container">Accessing approval buffers...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Management <span className="text-gradient">Console</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Centralized moderation of users, capital, and intellectual assets.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

        {/* Pending Users */}
        <section>
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Account Verification</h2>
            <span className="badge badge-warning">{pendingUsers.length} Pending</span>
          </div>
          {pendingUsers.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No identities require verification.</div>
          ) : (
            <div className="dashboard-grid">
              {pendingUsers.map(u => (
                <div key={u._id} className="dashboard-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="badge badge-secondary">{u.role}</span>
                  </div>
                  <h4 style={{ margin: '0 0 0.25rem 0' }}>{u.fullName}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{u.email}</p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {u.selfie && <a href={`${BASE_URL}/uploads/${u.selfie}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem' }}>Selfie</a>}
                    {u.idDocument && <a href={`${BASE_URL}/uploads/${u.idDocument}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem' }}>ID PDF</a>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleUserApproval(u._id, "approve")}>Approve</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleUserApproval(u._id, "reject")}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending Contributions */}
        <section>
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Capital Moderation</h2>
            <span className="badge badge-warning">{pendingContributions.length} Pending</span>
          </div>
          {pendingContributions.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No capital inflows pending review.</div>
          ) : (
            <div className="dashboard-grid">
              {pendingContributions.map(c => (
                <div key={c._id} className="dashboard-card">
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>${c.amount}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <strong>{c.investor?.fullName || 'Investor'}</strong> → {c.campaign?.title}
                  </p>

                  <div style={{ marginBottom: '1.5rem' }}>
                    {c.proofFile && <a href={`${BASE_URL}/uploads/${c.proofFile}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.6rem' }}>View Proof</a>}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleContributionApproval(c._id, "approve")}>Approve</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleContributionApproval(c._id, "reject")}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* User Complaints */}
        <section>
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Dispatch Reports</h2>
            <span className="badge badge-secondary" style={{ background: 'rgba(244, 63, 94, 0.2)', color: 'var(--danger)' }}>{complaints.length} Incidents</span>
          </div>
          {complaints.length === 0 ? (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No system incidents reported.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {complaints.map(complaint => (
                <div key={complaint._id} className="dashboard-card" style={{ borderLeft: '3px solid var(--danger)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Relay: {complaint.user?.fullName || "Unidentified"}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(complaint.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Target: <span style={{ color: 'var(--danger)' }}>{complaint.target || "System Core"}</span></div>
                  <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', fontSize: '0.9rem', lineHeight: '1.6', border: '1px solid var(--border-light)' }}>
                    {complaint.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

