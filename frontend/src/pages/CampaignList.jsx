import { useEffect, useState } from "react";
import api from "../services/api";

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    api.get("/campaigns").then(r => setCampaigns(r.data.campaigns || [])).catch(console.error);
  }, []);

  return (
    <div className="container">
      <h2>All Campaigns</h2>
      {campaigns.length === 0 && <p>No campaigns yet.</p>}
      {campaigns.map(c => (
        <div key={c._id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 10 }}>
          <div style={{ fontWeight: 600 }}>{c.title} {c.category && <small>({c.category})</small>}</div>
          <div style={{ marginTop: 6 }}>{c.description}</div>
          <div style={{ marginTop: 6 }}>Goal: ${c.goalAmount} — Raised: ${c.raisedAmount}</div>
          <div style={{ marginTop: 6 }}>
            <progress value={c.raisedAmount || 0} max={c.goalAmount || 1} style={{ width: "100%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
