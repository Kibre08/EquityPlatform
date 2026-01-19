// src/pages/InvestorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { BASE_URL } from "../services/api";

export default function InvestorDashboard() {
  const [viewMode, setViewMode] = useState("startups"); // "startups" or "campaigns"
  const [campaigns, setCampaigns] = useState([]);
  const [startups, setStartups] = useState([]);
  const [category, setCategory] = useState("");
  const [contributeId, setContributeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [investorIdFile, setInvestorIdFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [resC, resS] = await Promise.all([
        api.get("/campaigns"),
        api.get("/startup/")
      ]);
      setCampaigns(resC.data.campaigns || []);
      setStartups(resS.data.startups || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const contribute = async (id) => {
    try {
      if (!amount || !proof || !investorIdFile) return alert("Please fill all contribution fields.");

      const form = new FormData();
      form.append("campaignId", id);
      form.append("amount", amount);
      form.append("proof", proof);
      form.append("investorId", investorIdFile);

      await api.post("/contributions", form);
      alert("Contribution submitted! The startup will review and reach out.");
      setContributeId(null);
      setAmount("");
      setProof(null);
      setInvestorIdFile(null);
      fetchData();
    } catch (err) {
      alert("Contribution failed: " + (err.response?.data?.error || err.message));
    }
  };

  const categoryOf = (item) => (item.category || item.startup?.category || "").toString();
  const filteredCampaigns = category ? campaigns.filter(c => categoryOf(c) === category) : campaigns;
  const filteredStartups = category ? startups.filter(s => (s.category || "") === category) : startups;

  if (loading) return <div className="container">Analyzing opportunities...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Investment <span className="text-gradient">Marketplace</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Discover high-growth startups and manage your diversified portfolio.</p>
        </div>
        <Link to="/investor/agreements" className="btn btn-primary" style={{ gap: '0.5rem' }}>
          📂 My Portfolio Agreements
        </Link>
      </header>

      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Active Campaigns</span>
          <span className="stat-value">{campaigns.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Verified Startups</span>
          <span className="stat-value">{startups.filter(s => s.isNovel).length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Market Sectors</span>
          <span className="stat-value">4+</span>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
        <div className="card-header" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setViewMode("startups")}
              className={`btn btn-sm ${viewMode === 'startups' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minWidth: '100px' }}
            >
              Startups
            </button>
            <button
              onClick={() => setViewMode("campaigns")}
              className={`btn btn-sm ${viewMode === 'campaigns' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minWidth: '100px' }}
            >
              Campaigns
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="stat-label" style={{ marginBottom: 0 }}>Sector Filter:</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'auto', marginBottom: 0 }}>
              <option value="">All Industries</option>
              <option>FinTech</option>
              <option>HealthTech</option>
              <option>AgriTech</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {viewMode === "startups" ? (
          filteredStartups.map(s => (
            <div key={s._id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-secondary">{s.category || 'Venture'}</span>
                {s.isNovel && <span className="badge badge-success">Novel Verified</span>}
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{s.companyName || s.fullName}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1, lineHeight: '1.6' }}>
                {s.companyDescription || "A stealth-mode startup focusing on high-growth potential within its sector."}
              </p>
              <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                <button onClick={() => navigate("/messages", { state: { user: s } })} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  💬 Message
                </button>
              </div>
            </div>

          ))
        ) : (
          filteredCampaigns.map((c) => (

            <div key={c._id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', border: contributeId === c._id ? '1px solid var(--primary)' : '1px solid var(--border-light)' }}>
              <div className="card-header" style={{ marginBottom: '1rem' }}>
                <span className="badge badge-secondary">{categoryOf(c)}</span>
                <span className="stat-label" style={{ marginBottom: 0 }}>Active Round</span>
              </div>

              <h3 style={{ marginBottom: '0.5rem' }}>{c.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                by <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.startup?.companyName || c.startup?.fullName}</span>
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem' }}>{c.description}</p>

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

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="stat-label">Progress</span>
                  <span className="stat-label" style={{ color: 'var(--text-primary)' }}>${c.raisedAmount || 0} / ${c.goalAmount}</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(((c.raisedAmount || 0) / (c.goalAmount || 1)) * 100, 100)}%`, height: '100%', background: 'var(--primary)' }} />
                </div>
              </div>

              {contributeId !== c._id ? (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setContributeId(c._id)} className="btn btn-primary btn-sm" style={{ flex: 2 }}>Invest Now</button>
                  <button onClick={() => navigate("/messages", { state: { user: c.startup } })} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>💬</button>
                </div>
              ) : (
                <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-glow)' }}>
                  <div className="form-group">
                    <label>Amount ($)</label>
                    <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Bank Receipt (Proof)</label>
                    <input type="file" onChange={(e) => setProof(e.target.files[0])} style={{ padding: 0, border: 'none' }} />
                  </div>
                  <div className="form-group">
                    <label>Your ID (Proof)</label>
                    <input type="file" accept="application/pdf,image/*" onChange={(e) => setInvestorIdFile(e.target.files[0])} style={{ padding: 0, border: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => contribute(c._id)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>Submit</button>
                    <button onClick={() => setContributeId(null)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {
        filteredCampaigns.length === 0 && filteredStartups.length === 0 && (
          <div className="dashboard-card" style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No opportunities match your current filter.</p>
            <button onClick={() => setCategory("")} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>Clear Filters</button>
          </div>
        )
      }
    </div >
  );
}

