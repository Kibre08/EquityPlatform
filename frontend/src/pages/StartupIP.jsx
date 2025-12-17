import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function StartupIP() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [ipDocs, setIpDocs] = useState([]);
  const [message, setMessage] = useState("");

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

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("caption", caption || "");
      const res = await api.post("/ipdocs", form, { headers: { "Content-Type": "multipart/form-data" } });
      setMessage(res.data.msg || "Uploaded");
      fetchMine();
      setTitle("");
      setCaption("");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container">
      <h2>Upload IP Document</h2>

      <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#f0f8ff", borderRadius: 8, borderLeft: "5px solid #007bff" }}>
        <p style={{ margin: 0 }}>
          <strong>Important:</strong> Before uploading, please review our <a href="/ip-awareness" style={{ color: "#007bff", fontWeight: "bold" }}>IP Awareness Guidelines</a> to ensure your intellectual property is properly protected.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <textarea placeholder="Caption/Description" value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 8 }} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} style={{ marginBottom: 8 }} />
        <div>
          <button type="submit">Upload IP File</button>
        </div>
      </form>

      {message && <div style={{ color: "green", marginTop: 10 }}>{message}</div>}

      <hr />
      <h3>My IP Submissions</h3>
      {ipDocs.length === 0 ? <p>No IP documents uploaded yet.</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr><th>File</th><th>Caption</th><th>Status</th></tr></thead>
          <tbody>
            {ipDocs.map(doc => (
              <tr key={doc._id} style={{ borderTop: "1px solid #ddd" }}>
                <td><a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${doc.file}`} target="_blank" rel="noreferrer">View</a></td>
                <td>{doc.caption}</td>
                <td>{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
