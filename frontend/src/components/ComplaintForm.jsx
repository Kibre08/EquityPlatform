import { useState } from "react";
import api from "../services/api";

export default function ComplaintForm() {
    const [target, setTarget] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const submit = async () => {
        if (!message.trim()) return alert("Please specify the issue.");
        try {
            await api.post("/complaints", { target, message });
            alert("Protocol report filed. Admin will review the dispatch.");
            setTarget("");
            setMessage("");
            setOpen(false);
        } catch (err) {
            alert("Terminal error: Failed to dispatch report.");
        }
    };

    if (!open) return (
        <button
            onClick={() => setOpen(true)}
            className="btn btn-secondary"
            style={{
                marginTop: '1.5rem',
                borderColor: 'rgba(244, 63, 94, 0.3)',
                color: 'var(--danger)',
                background: 'rgba(244, 63, 94, 0.05)'
            }}
        >
            🚩 Report Platform Incident
        </button>
    );

    return (
        <div className="dashboard-card" style={{ marginTop: '1.5rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <div className="card-header">
                <h4 style={{ margin: 0, color: 'var(--danger)' }}>Issue Mitigation Protocol</h4>
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="stat-label">Subject of Report</label>
                <input
                    placeholder="Identify the entity or feature..."
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="stat-label">Incident Description</label>
                <textarea
                    placeholder="Provide a detailed outline of the discrepancy..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={submit} className="btn btn-primary btn-sm">Dispatch Report</button>
                <button onClick={() => setOpen(false)} className="btn btn-secondary btn-sm">Abort</button>
            </div>
        </div>
    );
}

