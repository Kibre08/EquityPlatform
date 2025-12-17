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
  const [uploadingId, setUploadingId] = useState(null); // ID of contribution being responded to
  const [agreementFile, setAgreementFile] = useState(null);

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
      // update local storage (useful for navbar / other views)
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const merged = { ...stored, ...u };
      localStorage.setItem("user", JSON.stringify(merged));
      // fetch campaigns for this startup
      fetchCampaigns(u._id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCampaigns = async (uid) => {
    try {
      const res = await api.get("/campaigns");
      const all = res.data.campaigns || [];
      const myCampaigns = all.filter(c => String(c.startup?._id || c.startup) === String(uid));
      setCampaigns(myCampaigns);

      // Fetch contributions for these campaigns
      // Ideally we need a route for this, but for now let's assume we can get them or add a route.
      // I'll add a route to get contributions for a startup's campaigns.
      // For now, I'll skip fetching contributions here and add the route in the next step.
      fetchStartupContributions();
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

  const handleUploadAgreement = async (contributionId) => {
    try {
      const form = new FormData();
      form.append("agreement", agreementFile);
      await api.post(`/startup/upload-agreement/${contributionId}`, form, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Agreement sent to investor");
      setUploadingId(null);
      setAgreementFile(null);
      fetchStartupContributions();
    } catch (err) {
      alert("Failed to upload");
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
      await api.put("/startup/profile", form, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Profile updated");
      // refresh profile and localStorage so other users see it
      await fetchProfile();
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  const launchCampaign = async () => {
    try {
      const form = new FormData();
      form.append("title", newCampaign.title);
      form.append("description", newCampaign.description);
      form.append("goalAmount", newCampaign.goalAmount);
      form.append("category", profile.category);
      if (newCampaign.agreement) {
        form.append("agreement", newCampaign.agreement);
      }

      await api.post("/campaigns", form, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Campaign launched");
      setNewCampaign({ title: "", description: "", goalAmount: "", agreement: null });
      await fetchCampaigns(user?._id);
    } catch (err) {
      console.error(err);
      alert("Failed to launch campaign");
    }
  };

  return (
    <div className="container">
      <h1>
        🚀 Startup Dashboard
        {user?.isNovel && <span title="Novel Startup" style={{ marginLeft: 10, fontSize: "0.8em" }}>🔵 Verified Novel</span>}
      </h1>

      <h3>Your Profile</h3>
      <input placeholder="Company Name" value={profile.companyName} onChange={(e) => setProfile({ ...profile, companyName: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
      <select value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 8 }}>
        <option value="">Select Category</option>
        <option>FinTech</option>
        <option>HealthTech</option>
        <option>AgriTech</option>
        <option>Other</option>
      </select>
      <textarea placeholder="Company Description" value={profile.companyDescription} onChange={(e) => setProfile({ ...profile, companyDescription: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 8 }} rows={4} />
      <button onClick={updateProfile}>Save Profile</button>

      <hr />

      <h3>Launch Campaign</h3>
      <input placeholder="Title" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
      <textarea placeholder="Description" value={newCampaign.description} onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 8 }} rows={3} />
      <input type="number" placeholder="Goal Amount" value={newCampaign.goalAmount} onChange={(e) => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
      <div style={{ marginBottom: 8 }}>
        <label>Agreement Deal (PDF): </label>
        <input type="file" accept="application/pdf" onChange={(e) => setNewCampaign({ ...newCampaign, agreement: e.target.files[0] })} />
      </div>
      <button onClick={launchCampaign}>Launch</button>

      <h3 style={{ marginTop: 20 }}>Your Campaigns</h3>
      {campaigns.length === 0 ? <p>No campaigns yet.</p> : campaigns.map(c => (
        <div key={c._id} style={{ border: "1px solid #ccc", padding: 10, marginTop: 10 }}>
          <h4>{c.title}</h4>
          <p>{c.description}</p>
          <p>Raised: ${c.raisedAmount || 0} / ${c.goalAmount}</p>
        </div>
      ))}

      <h3 style={{ marginTop: 20 }}>Manage Contributions</h3>
      <p>View and manage investor contributions to your campaigns.</p>
      <Link to="/startup/contributions" className="btn btn-primary" style={{ display: "inline-block", marginTop: 10 }}>
        Go to Manage Contributions
      </Link>
      <ComplaintForm />
    </div>
  );
}
