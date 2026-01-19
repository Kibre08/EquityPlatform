import { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function ManageContent() {
    const [campaigns, setCampaigns] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [resC, resCon] = await Promise.all([
                api.get("/campaigns"),
                api.get("/admin/pending-contributions")
            ]);
            setCampaigns(resC.data.campaigns || []);
            setContributions(resCon.data.contributions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteCampaign = async (id) => {
        if (!window.confirm("Are you sure? This will remove all associated data for this campaign.")) return;
        try {
            await api.delete(`/admin/campaigns/${id}`);
            setCampaigns(campaigns.filter(c => c._id !== id));
        } catch (err) {
            alert("Failed to delete campaign");
        }
    };

    const handleContributionApproval = async (id, action) => {
        try {
            await api.post(`/admin/${action}-contribution/${id}`);
            fetchData();
        } catch (err) {
            alert("Ledger update failure.");
        }
    };

    const deleteContribution = async (id) => {
        if (!window.confirm("Delete this contribution record?")) return;
        try {
            await api.delete(`/admin/contributions/${id}`);
            setContributions(contributions.filter(c => c._id !== id));
        } catch (err) {
            alert("Failed to delete contribution");
        }
    };

    if (loading) return <div className="container">Synchronizing ledger...</div>;

    return (
        <div className="container">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>🗂 Content <span className="text-gradient">Manager</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Moderate platform assets, funding rounds, and investment records.</p>
            </header>

            <div className="dashboard-grid">
                <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3 style={{ margin: 0 }}>Active Campaigns</h3>
                        <span className="badge badge-secondary">{campaigns.length} Total</span>
                    </div>

                    {campaigns.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No active campaigns available.</div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Campaign Title</th>
                                        <th>Startup Origin</th>
                                        <th>Legal Agreement</th>
                                        <th style={{ textAlign: 'right' }}>Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map(c => (
                                        <tr key={c._id}>
                                            <td style={{ fontWeight: 600 }}>{c.title}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{c.startup?.companyName || c.startup?.fullName}</td>
                                            <td>
                                                {c.agreementFile ? (
                                                    <a href={`${BASE_URL}/uploads/${c.agreementFile}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
                                                        View PDF
                                                    </a>
                                                ) : <span className="badge">No File</span>}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button onClick={() => deleteCampaign(c._id)} className="btn btn-sm" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                                    Terminate
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
                    <div className="card-header">
                        <h3 style={{ margin: 0 }}>Pending Contributions Review</h3>
                        <span className="badge badge-warning">{contributions.length} Awaiting Review</span>
                    </div>

                    {contributions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No contributions pending review.</div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Investor</th>
                                        <th>Target Campaign</th>
                                        <th>Volume</th>
                                        <th>Verification Assets</th>
                                        <th style={{ textAlign: 'right' }}>Management</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contributions.map(c => (
                                        <tr key={c._id}>
                                            <td style={{ fontWeight: 600 }}>{c.investor?.fullName}</td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{c.campaign?.title}</td>
                                            <td>${c.amount}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {c.proofFile && <a href={`${BASE_URL}/uploads/${c.proofFile}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>Receipt</a>}
                                                    {c.signedAgreement && <a href={`${BASE_URL}/uploads/${c.signedAgreement}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>Contract</a>}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                    <button onClick={() => handleContributionApproval(c._id, "approve")} className="btn btn-primary btn-sm">Approve</button>
                                                    <button onClick={() => handleContributionApproval(c._id, "reject")} className="btn btn-secondary btn-sm">Reject</button>
                                                    <button onClick={() => deleteContribution(c._id)} className="btn btn-sm" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                                        Void
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

