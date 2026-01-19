import { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/campaigns")
      .then(r => setCampaigns(r.data.campaigns || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container">Curating marketplace...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Active <span className="text-gradient">Campaigns</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Explore disruptive innovations and strategic funding opportunities.</p>
      </header>

      {campaigns.length === 0 ? (
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '5rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>No campaigns are currently active. Check back soon!</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {campaigns.map(c => (
            <div key={c._id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-secondary">{c.category || 'Venture'}</span>
                <span className="badge badge-success">Live</span>
              </div>

              <h3 style={{ marginBottom: '0.5rem' }}>{c.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                by <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.startup?.companyName || c.startup?.fullName || 'Accelerated Startup'}</span>
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1, lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {c.description}
              </p>

              {c.agreementFile && (
                <a
                  href={`${BASE_URL}/uploads/${c.agreementFile}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.5rem',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1.25rem' }}>📄</span>
                  View Investment Agreement / Pitch Deck
                </a>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="stat-label">Progress</span>
                  <span className="stat-label" style={{ color: 'var(--text-primary)' }}>${c.raisedAmount || 0} / ${c.goalAmount}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((c.raisedAmount || 0) / (c.goalAmount || 1)) * 100, 100)}%`, height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>

            </div>
          ))}
        </div>

      )}
    </div>
  );
}

