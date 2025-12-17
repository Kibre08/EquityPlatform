import { useState } from "react";
import api from "../services/api";

export default function ComplaintForm() {
    const [target, setTarget] = useState("");
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);

    const submit = async () => {
        try {
            await api.post("/complaints", { target, message });
            alert("Complaint submitted. Admin will review.");
            setTarget("");
            setMessage("");
            setOpen(false);
        } catch (err) {
            alert("Failed to submit");
        }
    };

    if (!open) return <button onClick={() => setOpen(true)} style={{ background: "#ff4444", color: "white", border: "none", padding: "8px 16px", borderRadius: 4, cursor: "pointer", marginTop: 20 }}>🚩 Report Issue / Complaint</button>;

    return (
        <div style={{ border: "1px solid #ff4444", padding: 15, borderRadius: 8, marginTop: 20, background: "#fff0f0" }}>
            <h4>Submit Complaint</h4>
            <input placeholder="Who/What is this about? (Optional)" value={target} onChange={(e) => setTarget(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
            <textarea placeholder="Describe the issue..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} rows={3} />
            <button onClick={submit} style={{ marginRight: 10 }}>Submit</button>
            <button onClick={() => setOpen(false)}>Cancel</button>
        </div>
    );
}
