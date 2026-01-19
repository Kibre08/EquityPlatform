import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function StartupContributions() {
    const [contributions, setContributions] = useState([]);
    const [uploadingId, setUploadingId] = useState(null);
    const [agreementFile, setAgreementFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStartupContributions();
    }, []);

    const fetchStartupContributions = async () => {
        try {
            const res = await api.get("/startup/contributions");
            setContributions(res.data.contributions || []);
        } catch (err) {
            console.error("Error fetching startup contributions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUploadAgreement = async (contributionId) => {
        if (!agreementFile) return alert("Please select a file.");
        try {
            const form = new FormData();
            form.append("agreement", agreementFile);
            await api.post(`/startup/upload-agreement/${contributionId}`, form);
            alert("Digital agreement dispatched to investor.");
            setUploadingId(null);
            setAgreementFile(null);
            fetchStartupContributions();
        } catch (err) {
            alert("Dispatch failed. Please check the file format.");
        }
    };

    if (loading) return <div className="container">Retrieving contribution ledger...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Capital <span className="text-gradient">Inflow</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Review investor interest and finalize equity agreements.</p>
            </header>

            <div className="dashboard-card">
                <div className="card-header">
                    <h3 style={{ margin: 0 }}>Contribution Records</h3>
                    <span className="badge badge-secondary">{contributions.length} Records</span>
                </div>

                {contributions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No contributions identified for your campaigns yet.
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Investor Detail</th>
                                    <th>Target Campaign</th>
                                    <th>Inflow Amount</th>
                                    <th>Assets</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Workflow</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contributions.map(c => (
                                    <tr key={c._id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{c.investor?.fullName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.investor?.email}</div>
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{c.campaign?.title}</td>
                                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${c.amount}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {c.proofFile && <a href={`${BASE_URL}/uploads/${c.proofFile}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>Proof</a>}
                                                {c.investorIdFile && <a href={`${BASE_URL}/uploads/${c.investorIdFile}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>ID Card</a>}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${c.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            {c.status === "pending" && (
                                                uploadingId === c._id ? (
                                                    <div className="glass" style={{ padding: '0.75rem', borderRadius: '0.5rem', display: 'inline-block', textAlign: 'left' }}>
                                                        <input type="file" accept="application/pdf" onChange={(e) => setAgreementFile(e.target.files[0])} style={{ marginBottom: '0.5rem', fontSize: '0.8rem', padding: 0 }} />
                                                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                            <button onClick={() => handleUploadAgreement(c._id)} className="btn btn-primary btn-sm">Dispatch</button>
                                                            <button onClick={() => setUploadingId(null)} className="btn btn-secondary btn-sm">✖</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setUploadingId(c._id)} className="btn btn-primary btn-sm">Finalize Equity</button>
                                                )
                                            )}
                                            {c.finalAgreement && (
                                                <a href={`${BASE_URL}/uploads/${c.finalAgreement}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                                                    View Agreement
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

