import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/users");
        setStats({ total: res.data.users?.length || 0 });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>System <span className="text-gradient">Intelligence</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Administrator. Monitoring platform health and user trajectory.</p>
      </header>

      {stats ? (
        <div>
          <div className="stat-grid" style={{ marginBottom: '3rem' }}>
            <div className="stat-box">
              <span className="stat-label">System Population</span>
              <div className="stat-value">{stats.total}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Verified platform entities</p>
            </div>
            <div className="stat-box">
              <span className="stat-label">Platform Status</span>
              <div className="stat-value" style={{ color: 'var(--success)' }}>Optimal</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Core services operational</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Command Center</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Execute administrative protocols and moderate platform ecosystem.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => navigate("/admin-panel")}>Approval Queue</button>
              <button className="btn btn-secondary" onClick={() => navigate("/admin/users")}>Identity Registry</button>
              <button className="btn btn-secondary" onClick={() => navigate("/admin/content")}>Content Moderation</button>
              <button className="btn btn-secondary" onClick={() => navigate("/admin/ip")}>IP IPV Protocol</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '5rem' }}>
          <p className="text-muted">Synchronizing system telemetry...</p>
        </div>
      )}
    </div>
  );
}

