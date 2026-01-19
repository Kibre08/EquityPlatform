import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

export default function StartupIP() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [ipDocs, setIpDocs] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMine = async () => {
    try {
      const res = await api.get("/ipdocs/mine");
      setIpDocs(res.data.docs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchMine(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("caption", caption || "");
      const res = await api.post("/ipdocs", form);
      setMessage(res.data.msg || "Uploaded successfully");
      fetchMine();
      setTitle("");
      setCaption("");
      setFile(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Intellectual Property <span className="text-gradient">Vault</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Secure your innovations and manage your IP documentation.</p>
      </div>

      <div className="alert-glass warning">
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Important Legal Requirement</strong>
          Before uploading, ensure you have reviewed the <a href="/ip-awareness" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>IP Awareness Guidelines</a> to protect your rights.
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1.5rem' }}>New Submission</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Document Title (Optional)</label>
              <input placeholder="e.g. System Architecture v1" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Brief Description</label>
              <textarea placeholder="Outline the core innovation..." value={caption} onChange={(e) => setCaption(e.target.value)} rows={4} />
            </div>

            <div className="form-group">
              <label>IP Documentation (PDF/DOCX/Images)</label>
              <div className="glass" style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px dashed var(--border-light)' }}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 0, padding: 0, border: 'none' }} />
              </div>
            </div>

            {message && <p className="badge badge-success" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}>{message}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? "Securing File..." : "Secure & Upload IP"}
            </button>
          </form>
        </div>

        <div className="dashboard-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Vault Records</h3>
          {ipDocs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No IP documents secured yet. Use the form to your left.
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Record</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ipDocs.map(doc => (
                    <tr key={doc._id}>
                      <td style={{ fontWeight: 600 }}>File Attachment</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{doc.caption || "No description"}</td>
                      <td>
                        <span className={`badge ${doc.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>
                          {doc.status || 'Pending Review'}
                        </span>
                      </td>
                      <td>
                        <a href={`${BASE_URL}/uploads/${doc.file}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          View
                        </a>
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

