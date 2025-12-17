import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function StartupContributions() {
    const [contributions, setContributions] = useState([]);
    const [uploadingId, setUploadingId] = useState(null);
    const [agreementFile, setAgreementFile] = useState(null);

    useEffect(() => {
        fetchStartupContributions();
    }, []);

    const fetchStartupContributions = async () => {
        try {
            console.log("Fetching startup contributions...");
            const res = await api.get("/startup/contributions");
            console.log("Startup contributions response:", res.data);
            setContributions(res.data.contributions || []);
        } catch (err) {
            console.error("Error fetching startup contributions:", err);
            if (err.response) {
                console.error("Response status:", err.response.status);
                console.error("Response data:", err.response.data);
            }
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

    return (
        <div className="container">
            <h1>Manage Contributions</h1>
            <p>View contributions to your campaigns and upload final agreements.</p>

            {contributions.length === 0 && <p>No contributions yet.</p>}

            {contributions.map(c => (
                <div key={c._id} style={{ border: "1px solid #ccc", padding: 15, marginTop: 15, borderRadius: 8, backgroundColor: "#1e293b" }}>
                    <p><strong>Investor:</strong> {c.investor?.fullName} ({c.investor?.email})</p>
                    <p><strong>Campaign:</strong> {c.campaign?.title}</p>
                    <p><strong>Amount:</strong> ${c.amount}</p>
                    <p><strong>Reference:</strong> {c.referenceNumber || "N/A"}</p>
                    <p>
                        {c.proofFile && <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${c.proofFile}`} target="_blank" rel="noreferrer" style={{ marginRight: 10, color: "#60a5fa" }}>View Payment Proof</a>}
                        {c.investorIdFile && <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${c.investorIdFile}`} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>View Investor ID</a>}
                    </p>
                    <p><strong>Status:</strong> <span style={{ textTransform: "capitalize" }}>{c.status}</span></p>

                    {c.status === "pending" && (
                        <div style={{ marginTop: 10, padding: 10, backgroundColor: "#334155", borderRadius: 4 }}>
                            {uploadingId === c._id ? (
                                <div>
                                    <label style={{ display: "block", marginBottom: 5 }}>Upload Final Agreement (PDF): </label>
                                    <input type="file" accept="application/pdf" onChange={(e) => setAgreementFile(e.target.files[0])} style={{ marginBottom: 10 }} />
                                    <div>
                                        <button onClick={() => handleUploadAgreement(c._id)} className="btn btn-primary" style={{ marginRight: 10 }}>Send Agreement</button>
                                        <button onClick={() => setUploadingId(null)} className="btn btn-secondary">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setUploadingId(c._id)} className="btn btn-primary">Upload Agreement</button>
                            )}
                        </div>
                    )}

                    {c.finalAgreement && (
                        <p style={{ marginTop: 10 }}>
                            ✅ Agreement Sent: <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${c.finalAgreement}`} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>View Agreement</a>
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}
