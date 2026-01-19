import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function InvestorAgreements() {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContributions();
    }, []);

    const fetchContributions = async () => {
        try {
            const res = await api.get("/contributions/my");
            setContributions(res.data.contributions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Synchronizing your portfolio...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Portfolio <span className="text-gradient">Agreements</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your equity positions and access finalized legal documentation.</p>
            </header>

            {contributions.length === 0 ? (
                <div className="dashboard-card" style={{ textAlign: 'center', padding: '5rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>You haven't initiated any contributions yet.</p>
                    <a href="/campaigns" className="btn btn-primary btn-sm" style={{ marginTop: '1.5rem' }}>Explore Marketplace</a>
                </div>
            ) : (
                <div className="dashboard-grid">
                    {contributions.map(c => (
                        <div key={c._id} className="dashboard-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-header" style={{ marginBottom: '1rem' }}>
                                <span className="badge badge-secondary">{c.campaign?.category || 'Venture'}</span>
                                <span className={`badge ${c.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                    {c.status}
                                </span>
                            </div>

                            <div style={{ flex: 1 }}>
                                <h3 style={{ marginBottom: '0.25rem' }}>{c.campaign?.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                                    Position Value: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>${c.amount}</span>
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                                {c.finalAgreement ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.9rem' }}>
                                            <span>✅</span> Agreement Executed
                                        </div>
                                        <a href={`${BASE_URL}/uploads/${c.finalAgreement}`} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ width: '100%', textAlign: 'center' }}>
                                            Download Legal PDF
                                        </a>
                                    </div>
                                ) : (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                                        Agreement pending startup execution.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

