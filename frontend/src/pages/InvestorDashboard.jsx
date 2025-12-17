// src/pages/InvestorDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function InvestorDashboard() {
  const [viewMode, setViewMode] = useState("startups"); // "startups" or "campaigns"
  const [campaigns, setCampaigns] = useState([]);
  const [startups, setStartups] = useState([]);
  const [category, setCategory] = useState("");
  const [contributeId, setContributeId] = useState(null);
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState(null);
  const [investorIdFile, setInvestorIdFile] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [resC, resS] = await Promise.all([
        api.get("/campaigns"),
        api.get("/startup/") // Fetch all startups
      ]);
      setCampaigns(resC.data.campaigns || []);
      setStartups(resS.data.startups || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const contribute = async (id) => {
    try {
      const form = new FormData();
      form.append("campaignId", id);
      form.append("amount", amount);
      if (proof) form.append("proof", proof);
      if (investorIdFile) form.append("investorId", investorIdFile);
      await api.post("/contributions", form, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Contribution submitted. The startup will review and send the final agreement.");
      setContributeId(null);
      setAmount("");
      setProof(null);
      setInvestorIdFile(null);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.msg || err.message;
      alert("Contribution failed: " + errorMsg);
      console.error(err);
    }
  };

  // robust category getter
  const categoryOf = (item) => (item.category || item.startup?.category || "").toString();

  const filteredCampaigns = category ? campaigns.filter(c => categoryOf(c) === category) : campaigns;
  const filteredStartups = category ? startups.filter(s => (s.category || "") === category) : startups;

  const messageStartup = (startup) => {
    navigate("/messages", { state: { user: startup } });
  };

  return (
    <div className="container">
      <h1>💰 Investor Dashboard</h1>
      <div style={{ marginBottom: 20 }}>
        <Link to="/investor/agreements" style={{ display: "inline-block", padding: "8px 16px", backgroundColor: "#2563eb", color: "white", borderRadius: "4px", textDecoration: "none" }}>
          View My Agreements
        </Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setViewMode("startups")}
          style={{ marginRight: 10, fontWeight: viewMode === "startups" ? "bold" : "normal" }}
        >
          Startups
        </button>
        <button
          onClick={() => setViewMode("campaigns")}
          style={{ fontWeight: viewMode === "campaigns" ? "bold" : "normal" }}
        >
          Campaigns
        </button>
      </div>

      <label>Filter by Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ marginLeft: 8 }}>
        <option value="">All</option>
        <option>FinTech</option>
        <option>HealthTech</option>
        <option>AgriTech</option>
        <option>Other</option>
      </select>

      <div style={{ marginTop: 20 }}>
        {viewMode === "startups" ? (
          <div>
            <h2>Startups</h2>
            {filteredStartups.length === 0 && <p>No startups found.</p>}
            {filteredStartups.map(s => (
              <div key={s._id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 15, borderRadius: 8 }}>
                <h3>
                  {s.companyName || s.fullName}
                  {s.isNovel && <span title="Novel Startup" style={{ marginLeft: 5 }}>🔵</span>}
                </h3>
                <p><strong>Category:</strong> {s.category}</p>
                <p><strong>Description/Pitch:</strong> {s.companyDescription || "No description provided."}</p>

                <div style={{ marginTop: 10 }}>
                  <button onClick={() => messageStartup(s)}>💬 Message</button>
                  {/* Could add a "View Campaigns" button here that switches mode and filters by this startup? */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h2>Campaigns</h2>
            {filteredCampaigns.length === 0 && <p>No campaigns found.</p>}
            {filteredCampaigns.map((c) => (
              <div key={c._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 12 }}>
                <h3>{c.title}</h3>
                <p>
                  <b>Startup:</b> {c.startup?.companyName || c.startup?.fullName || "Unknown"}
                  {c.startup?.isNovel && <span title="Novel Startup" style={{ marginLeft: 5 }}>🔵</span>}
                </p>
                <p>{c.description}</p>
                <p>Raised: ${c.raisedAmount || 0} / ${c.goalAmount}</p>
                {c.agreementFile && (
                  <p>
                    <strong>Agreement: </strong>
                    <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${c.agreementFile}`} target="_blank" rel="noreferrer">View PDF</a>
                  </p>
                )}
                <progress value={c.raisedAmount || 0} max={c.goalAmount || 1} style={{ width: "100%" }} />

                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  {contributeId !== c._id ? (
                    <button onClick={() => setContributeId(c._id)}>Contribute</button>
                  ) : (
                    <div>
                      <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ marginRight: 8 }} />
                      <div style={{ margin: "5px 0" }}>
                        <label>Payment Proof (Bank Receipt): </label>
                        <input type="file" onChange={(e) => setProof(e.target.files[0])} />
                      </div>
                      <div style={{ margin: "5px 0" }}>
                        <label>Your ID Document: </label>
                        <input type="file" accept="application/pdf,image/*" onChange={(e) => setInvestorIdFile(e.target.files[0])} />
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <button onClick={() => contribute(c._id)}>Submit</button>
                        <button onClick={() => setContributeId(null)} style={{ marginLeft: 8 }}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <button title="Message startup" onClick={() => messageStartup(c.startup)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                    💬 Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
