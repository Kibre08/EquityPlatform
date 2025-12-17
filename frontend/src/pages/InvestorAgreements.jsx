import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function InvestorAgreements() {
    const [contributions, setContributions] = useState([]);

    useEffect(() => {
        fetchContributions();
    }, []);

    const fetchContributions = async () => {
        try {
            const res = await api.get("/contributions/my");
            setContributions(res.data.contributions || []);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <h1>My Agreements & Contributions</h1>
            <p>Track your contributions and download equity agreements.</p>

            {contributions.length === 0 && <p>No contributions yet.</p>}

            {contributions.map(c => (
                <div key={c._id} style={{ border: "1px solid #ccc", padding: 15, marginTop: 15, borderRadius: 8, backgroundColor: "#1e293b" }}>
                    <p><strong>Campaign:</strong> {c.campaign?.title}</p>
                    <p><strong>Amount:</strong> ${c.amount}</p>
                    <p><strong>Status:</strong> <span style={{ textTransform: "capitalize" }}>{c.status}</span></p>

                    {c.finalAgreement ? (
                        <p style={{ marginTop: 10 }}>
                            ✅ <strong>Agreement Ready:</strong> <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${c.finalAgreement}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ marginLeft: 10 }}>Download Agreement</a>
                        </p>
                    ) : (
                        <p style={{ color: "#94a3b8" }}>Agreement pending from startup.</p>
                    )}
                </div>
            ))}
        </div>
    );
}
