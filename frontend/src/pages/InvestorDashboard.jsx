// src/pages/InvestorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { BASE_URL } from "../services/api";

export default function InvestorDashboard() {
  const [activeSection, setActiveSection] = useState("Marketplace"); // Marketplace, Portfolio, Agreements
  const [campaigns, setCampaigns] = useState([]);
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Marketplace Filters & State
  const [viewMode, setViewMode] = useState("campaigns"); // "campaigns" or "startups"
  const [category, setCategory] = useState("");

  // Contribution State
  const [contributeId, setContributeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [investorIdFile, setInvestorIdFile] = useState(null);

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

  const SidebarItem = ({ name, icon }) => (
    <button
      onClick={() => setActiveSection(name)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '1rem',
        background: activeSection === name ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        border: 'none',
        borderLeft: activeSection === name ? '3px solid var(--primary)' : '3px solid transparent',
        color: activeSection === name ? 'var(--primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: activeSection === name ? 600 : 400,
        transition: 'all 0.2s'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      {name}
    </button>
  );

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
      {/* Sidebar Navigation */}
      <div className="glass" style={{ height: 'fit-content', borderRadius: '1rem', overflow: 'hidden', padding: '1rem 0' }}>
        <div style={{ padding: '0 1.5rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Investor<span className="text-gradient">Portal</span></h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Portfolio Management</p>
        </div>
        <SidebarItem name="Marketplace" icon="🌍" />
        <SidebarItem name="My Portfolio" icon="💼" />
        <SidebarItem name="Agreements" icon="📂" />
      </div>

      {/* Main Content */}
      <div>
        {activeSection === "Marketplace" && (
          <div className="fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ marginBottom: '0.5rem' }}>Investment <span className="text-gradient">Marketplace</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Discover high-growth startups.</p>
              </div>
              <div className="glass" style={{ padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setViewMode("campaigns")} className={`btn btn-sm ${viewMode === 'campaigns' ? 'btn-primary' : 'btn-secondary'}`}>Campaigns</button>
                <button onClick={() => setViewMode("startups")} className={`btn btn-sm ${viewMode === 'startups' ? 'btn-primary' : 'btn-secondary'}`}>Startups</button>
              </div>
            </header>

            <div style={{ marginBottom: '2rem' }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ maxWidth: '200px' }}>
                <option value="">All Industries</option>
                <option>FinTech</option>
                <option>HealthTech</option>
                <option>AgriTech</option>
                <option>Other</option>
              </select>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr' }}>
              {viewMode === "startups" ? (
                filteredStartups.map(s => (
                  <div key={s._id} className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-secondary">{s.category || 'Venture'}</span>
                        {s.isNovel && <span className="badge badge-success">Novel Verified</span>}
                      </div>
                      <h3>{s.companyName || s.fullName}</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>{s.companyDescription || "Stealth Mode"}</p>
                    </div>
                    <button onClick={() => navigate("/messages", { state: { user: s } })} className="btn btn-secondary btn-sm">💬 Message</button>
                  </div>
                ))
              ) : (
                filteredCampaigns.map((c) => (
                  <div key={c._id} className="dashboard-card" style={{ border: contributeId === c._id ? '1px solid var(--primary)' : '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <span className="badge badge-secondary">{categoryOf(c)}</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>by <strong>{c.startup?.companyName || c.startup?.fullName}</strong></span>
                      </div>
                      <span className="badge badge-success">Active Round</span>
                    </div>

                    <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>{c.title}</h2>

                    {/* Campaign Images Carousel/Grid */}
                    {c.images && c.images.length > 0 && (
                      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        {c.images.map((img, idx) => (
                          <img key={idx} src={`${BASE_URL}/uploads/${img}`} alt={`Campaign ${idx}`} style={{ height: '150px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                        ))}
                      </div>
                    )}

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                      <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Pitch</h4>
                      <p style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{c.detailedDescription || c.description}</p>

                      {c.risks && (
                        <div style={{ borderLeft: '3px solid var(--danger)', paddingLeft: '1rem' }}>
                          <h4 style={{ marginBottom: '0.25rem', color: 'var(--danger)' }}>Risks</h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{c.risks}</p>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="stat-box" style={{ padding: '1rem' }}>
                        <span className="stat-label">Goal</span>
                        <span className="stat-value" style={{ fontSize: '1.25rem' }}>${c.goalAmount}</span>
                      </div>
                      <div className="stat-box" style={{ padding: '1rem' }}>
                        <span className="stat-label">Raised</span>
                        <span className="stat-value" style={{ fontSize: '1.25rem', color: 'var(--success)' }}>${c.raisedAmount}</span>
                      </div>
                      <div className="stat-box" style={{ padding: '1rem' }}>
                        <span className="stat-label">Min. Ticket</span>
                        <span className="stat-value" style={{ fontSize: '1.25rem' }}>${c.minInvestment || 0}</span>
                      </div>
                    </div>

                    {c.agreementFile && (
                      <a href={`${BASE_URL}/uploads/${c.agreementFile}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: 'fit-content', marginBottom: '1.5rem' }}>
                        📄 View Prospectus / Agreement
                      </a>
                    )}

                    <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border-light)' }} />

                    {contributeId !== c._id ? (
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setContributeId(c._id)} className="btn btn-primary" style={{ flex: 1 }}>Invest Now</button>
                        <button onClick={() => navigate("/messages", { state: { user: c.startup } })} className="btn btn-secondary">Message Founder</button>
                      </div>
                    ) : (
                      <div className="fade-in" style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--primary-glow)' }}>
                        <h3 style={{ marginTop: 0 }}>Confirm Investment</h3>
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
                          <button onClick={() => contribute(c._id)} className="btn btn-primary" style={{ flex: 1 }}>Submit Investment</button>
                          <button onClick={() => setContributeId(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        </div>
                      </div>
                    )}

                  </div>
                ))
              )}

              {filteredCampaigns.length === 0 && viewMode === 'campaigns' && <p>No active campaigns match criteria.</p>}
            </div>
          </div>
        )}

        {activeSection === "My Portfolio" && (
          <div className="fade-in dashboard-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>Your Portfolio</h2>
            <p className="text-muted">You have not made any investments yet. Visit the Marketplace to start.</p>
            <button onClick={() => setActiveSection("Marketplace")} className="btn btn-primary mt-8">Browse Startups</button>
          </div>
        )}

        {activeSection === "Agreements" && (
          <div className="fade-in">
            <h1>Legal Documents</h1>
            <div className="dashboard-card">
              <p>Access your signed investment agreements here.</p>
              <Link to="/investor/agreements" className="btn btn-secondary">View All Files</Link>
            </div>
          </div>
        )}
      </div>
    </div >
  );
}

