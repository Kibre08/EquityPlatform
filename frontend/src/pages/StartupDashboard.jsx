import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import ComplaintForm from "../components/ComplaintForm";

export default function StartupDashboard() {
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState({ title: "", description: "", goalAmount: "", agreement: null });
  const [profile, setProfile] = useState({ companyName: "", category: "", companyDescription: "" });
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...u }));
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
      form.append("description", newCampaign.description);
      form.append("goalAmount", newCampaign.goalAmount);
      form.append("category", profile.category);
      if (newCampaign.agreement) form.append("agreement", newCampaign.agreement);

      await api.post("/campaigns", form);
      alert("Campaign launched successfully!");
      setNewCampaign({ title: "", description: "", goalAmount: "", agreement: null });
      await fetchCampaigns(user?._id);
    } catch (err) {
      alert("Failed to launch campaign");
    }
  };

  if (loading) return <div className="container">Loading workspace...</div>;

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Startup <span className="text-gradient">Hub</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your mission, campaigns, and investor relations.</p>
        </div>
      </header>



      <div className="stat-grid">
        <div className="stat-box">
          <span className="stat-label">Total Campaigns</span>
          <span className="stat-value">{campaigns.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Active Contributions</span>
          <span className="stat-value">{contributions.length}</span>
        </div>
        <div className="stat-box" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span className="stat-label">Verification Status</span>
          <span className="stat-value" style={{ fontSize: '1.25rem', color: user?.isNovel ? 'var(--success)' : 'var(--accent)' }}>
            {user?.isNovel ? 'NOVEL VERIFIED' : 'PENDING'}
          </span>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <h3 style={{ margin: 0 }}>Company Profile</h3>
            <button onClick={updateProfile} className="btn btn-secondary btn-sm">Update Profile</button>
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

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Executive Summary / Pitch</label>
            <textarea
              value={profile.companyDescription}
              onChange={(e) => setProfile({ ...profile, companyDescription: e.target.value })}
              rows={6}
              placeholder="Our mission is to..."
            />
          </div>
        </div>

        <div className="dashboard-card" style={{ background: 'rgba(99, 102, 241, 0.03)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Launch New Round</h3>
          <form onSubmit={launchCampaign}>
            <div className="form-group">
              <label>Campaign Title</label>
              <input placeholder="Seed Round 2024" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Funding Goal ($)</label>
              <input type="number" placeholder="Enter amount" value={newCampaign.goalAmount} onChange={(e) => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Investment Agreement (PDF)</label>
              <div className="glass" style={{ padding: '0.75rem', borderRadius: '0.75rem', border: '1px dashed var(--border-light)' }}>
                <input type="file" accept="application/pdf" onChange={(e) => setNewCampaign({ ...newCampaign, agreement: e.target.files[0] })} style={{ border: 'none', padding: 0, marginBottom: 0 }} />
              </div>
            </div>

            <div className="form-group">
              <label>Brief Pitch</label>
              <textarea placeholder="The objective of this round is..." value={newCampaign.description} onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })} rows={3} required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Launch Funding Round</button>
          </form>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>Active Funding Rounds</h3>
            <Link to="/campaigns" className="btn btn-secondary btn-sm">Explore Marketplace</Link>
          </div>

          {campaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No active campaigns found. Launch your first round above!
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Campaign Title</th>
                    <th>Goal</th>
                    <th>Progress</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 600 }}>{c.title}</td>
                      <td>${c.goalAmount}</td>
                      <td style={{ width: '30%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min((c.raisedAmount / c.goalAmount) * 100, 100)}%`, height: '100%', background: 'var(--primary)' }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{Math.round((c.raisedAmount / c.goalAmount) * 100)}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header">
            <h3 style={{ margin: 0 }}>Recent Contributions</h3>
            <Link to="/startup/contributions" className="btn btn-secondary btn-sm">Manage All</Link>
          </div>

          {contributions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No investor contributions found yet.
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Investor</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.slice(0, 5).map(c => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 600 }}>{c.investor?.fullName}</td>
                      <td>{c.campaign?.title}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>${c.amount}</td>
                      <td>
                        <span className={`badge ${c.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                          {String(c.status).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '2rem', background: 'rgba(255, 255, 255, 0.02)' }}>
        <div className="card-header">
          <div>
            <h3 style={{ margin: 0 }}>Engagement & Support</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manage investor contributions and portal feedback.</p>
          </div>
          <Link to="/startup/contributions" className="btn btn-primary">Manage Contributions</Link>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '2rem 0' }} />
        <ComplaintForm />
      </div>
    </div >
  );
}

