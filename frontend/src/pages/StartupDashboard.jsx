import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { BASE_URL } from "../services/api";
import ComplaintForm from "../components/ComplaintForm";

export default function StartupDashboard() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("Overview"); // Overview, Profile, Campaigns, Contributions
  const [loading, setLoading] = useState(true);

  // Data States
  const [campaigns, setCampaigns] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [profile, setProfile] = useState({ companyName: "", category: "", companyDescription: "" });

  // Form States
  const [activeTab, setActiveTab] = useState('Basics');
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    shortDescription: "",
    description: "",
    goalAmount: "",
    minInvestment: "",
    deadline: "",
    detailedDescription: "",
    risks: "",
    agreement: null,
    images: []
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/startup/me");
      const u = res.data.user;
      setUser(u);
      setProfile({
        companyName: u.companyName || "",
        category: u.category || "",
        companyDescription: u.companyDescription || "",
      });
      fetchCampaigns(u._id);
      fetchStartupContributions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async (uid) => {
    try {
      const res = await api.get("/campaigns");
      const all = res.data.campaigns || [];
      setCampaigns(all.filter(c => String(c.startup?._id || c.startup) === String(uid)));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStartupContributions = async () => {
    try {
      const res = await api.get("/startup/contributions");
      setContributions(res.data.contributions || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {
    try {
      const form = new FormData();
      form.append("companyName", profile.companyName);
      form.append("category", profile.category);
      form.append("companyDescription", profile.companyDescription);
      await api.put("/startup/profile", form);
      alert("Profile updated successfully!");
      await fetchProfile();
    } catch (err) {
      alert("Update failed");
    }
  };

  const launchCampaign = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", newCampaign.title);
      form.append("shortDescription", newCampaign.shortDescription);
      form.append("description", newCampaign.description || newCampaign.shortDescription);
      form.append("detailedDescription", newCampaign.detailedDescription);
      form.append("risks", newCampaign.risks);
      form.append("goalAmount", newCampaign.goalAmount);
      form.append("minInvestment", newCampaign.minInvestment);
      form.append("deadline", newCampaign.deadline);
      form.append("category", profile.category);

      if (newCampaign.agreement) form.append("agreement", newCampaign.agreement);
      if (newCampaign.images && newCampaign.images.length > 0) {
        for (let i = 0; i < newCampaign.images.length; i++) {
          form.append("images", newCampaign.images[i]);
        }
      }

      await api.post("/campaigns", form);
      alert("Campaign launched successfully!");
      setNewCampaign({
        title: "", shortDescription: "", description: "", detailedDescription: "", risks: "", goalAmount: "", minInvestment: "", deadline: "", agreement: null, images: []
      });
      setActiveTab('Basics');
      await fetchCampaigns(user?._id);
      setActiveSection("Campaigns");
    } catch (err) {
      console.error(err);
      alert("Failed to launch campaign");
    }
  };

  if (loading) return <div className="container">Loading workspace...</div>;

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
          <h2 style={{ fontSize: '1.25rem' }}>Startup<span className="text-gradient">Hub</span></h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Welcome, {user?.fullName}</p>
        </div>
        <SidebarItem name="Overview" icon="📊" />
        <SidebarItem name="My Profile" icon="🏢" />
        <SidebarItem name="Campaigns" icon="🚀" />
        <SidebarItem name="Contributions" icon="💰" />
        <div style={{ padding: '1.5rem' }}>
          <hr style={{ margin: '1rem 0', borderColor: 'var(--border-light)' }} />
          <ComplaintForm />
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {activeSection === "Overview" && (
          <div className="fade-in">
            <h1 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h1>
            <div className="stat-grid">
              <div className="stat-box">
                <span className="stat-label">Total Campaigns</span>
                <span className="stat-value">{campaigns.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Contributions</span>
                <span className="stat-value">{contributions.length}</span>
              </div>
              <div className="stat-box" style={{ borderLeft: '4px solid var(--primary)' }}>
                <span className="stat-label">Status</span>
                <span className="stat-value" style={{ fontSize: '1.25rem', color: user?.isNovel ? 'var(--success)' : 'var(--accent)' }}>
                  {user?.isNovel ? 'VERIFIED' : 'PENDING'}
                </span>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                <h3>Recent Activity</h3>
                {contributions.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No recent activity.</p>
                ) : (
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {contributions.slice(0, 3).map(c => (
                      <li key={c._id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
                        <span style={{ fontWeight: 600 }}>{c.investor?.fullName}</span> contributed <span style={{ color: 'var(--success)' }}>${c.amount}</span> to {c.campaign?.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "My Profile" && (
          <div className="fade-in dashboard-card">
            <div className="card-header">
              <h2 style={{ margin: 0 }}>Company Profile</h2>
              <button onClick={updateProfile} className="btn btn-primary btn-sm">Save Changes</button>
            </div>

            <div className="form-group">
              <label>Legal Company Name</label>
              <input value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Industry Category</label>
              <select value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })}>
                <option value="">Select Category</option>
                <option>FinTech</option>
                <option>HealthTech</option>
                <option>AgriTech</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Executive Summary / Pitch</label>
              <textarea
                value={profile.companyDescription}
                onChange={(e) => setProfile({ ...profile, companyDescription: e.target.value })}
                rows={6}
                placeholder="Describe your company..."
              />
            </div>
          </div>
        )}

        {activeSection === "Campaigns" && (
          <div className="fade-in">
            {/* Launch New Campaign Form */}
            <div className="dashboard-card" style={{ marginBottom: '2rem', background: 'rgba(99, 102, 241, 0.03)' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Launch New Round</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)' }}>
                {['Basics', 'Financials', 'Details', 'Media'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                      color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <form onSubmit={launchCampaign}>
                {activeTab === 'Basics' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Campaign Title</label>
                      <input placeholder="Seed Round 2024" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input value={profile.category} disabled style={{ opacity: 0.7 }} />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Short Description (Tagline)</label>
                      <input placeholder="Revolutionizing the industry with..." value={newCampaign.shortDescription || ""} onChange={(e) => setNewCampaign({ ...newCampaign, shortDescription: e.target.value })} required />
                    </div>
                  </div>
                )}

                {activeTab === 'Financials' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Funding Goal ($)</label>
                      <input type="number" placeholder="500000" value={newCampaign.goalAmount} onChange={(e) => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Minimum Investment ($)</label>
                      <input type="number" placeholder="1000" value={newCampaign.minInvestment || 0} onChange={(e) => setNewCampaign({ ...newCampaign, minInvestment: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label>Campaign Deadline</label>
                      <input type="date" value={newCampaign.deadline || ""} onChange={(e) => setNewCampaign({ ...newCampaign, deadline: e.target.value })} required />
                    </div>
                  </div>
                )}

                {activeTab === 'Details' && (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Detailed Pitch</label>
                      <textarea placeholder="Describe your business model..." value={newCampaign.detailedDescription || ""} onChange={(e) => setNewCampaign({ ...newCampaign, detailedDescription: e.target.value })} rows={6} required />
                    </div>
                    <div className="form-group">
                      <label>Risks & Challenges</label>
                      <textarea placeholder="Potential risks..." value={newCampaign.risks || ""} onChange={(e) => setNewCampaign({ ...newCampaign, risks: e.target.value })} rows={3} required />
                    </div>
                  </div>
                )}

                {activeTab === 'Media' && (
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label>Investment Agreement (PDF)</label>
                      <input type="file" accept="application/pdf" onChange={(e) => setNewCampaign({ ...newCampaign, agreement: e.target.files[0] })} />
                    </div>
                    <div className="form-group">
                      <label>Campaign Images (Max 5)</label>
                      <input type="file" accept="image/*" multiple onChange={(e) => setNewCampaign({ ...newCampaign, images: e.target.files })} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Launch Funding Round</button>
                  </div>
                )}

                {activeTab !== 'Media' && (
                  <button type="button" className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => {
                    const tabs = ['Basics', 'Financials', 'Details', 'Media'];
                    const next = tabs[tabs.indexOf(activeTab) + 1];
                    setActiveTab(next);
                  }}>Next Step &rarr;</button>
                )}
              </form>
            </div>

            {/* Existing Campaigns List */}
            <div className="dashboard-card">
              <h3>Active Campaigns</h3>
              {campaigns.length === 0 ? <p className="text-muted">No campaigns yet.</p> : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Goal</th>
                        <th>Raised</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(c => (
                        <tr key={c._id}>
                          <td>{c.title}</td>
                          <td>${c.goalAmount}</td>
                          <td>${c.raisedAmount}</td>
                          <td><span className="badge badge-success">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "Contributions" && (
          <div className="fade-in dashboard-card">
            <div className="card-header">
              <h2 style={{ margin: 0 }}>Investor Contributions</h2>
            </div>
            {contributions.length === 0 ? (
              <p className="text-muted">No contributions received yet.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Investor</th>
                      <th>Campaign</th>
                      <th>Amount</th>
                      <th>Proof</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map(c => (
                      <tr key={c._id}>
                        <td>{c.investor?.fullName}</td>
                        <td>{c.campaign?.title}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${c.amount}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {c.proofFile && <a href={`${BASE_URL}/uploads/${c.proofFile}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>View Proof</a>}
                            {(c.investorIdFile || c.investor?.idDocument) && (
                              <a
                                href={`${BASE_URL}/uploads/${c.investorIdFile || (c.investor && c.investor.idDocument)}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: 'var(--accent)', fontSize: '0.85rem' }}
                              >
                                View ID
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${c.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <Link to="/startup/contributions" className="btn btn-sm btn-secondary">Manage</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
}

