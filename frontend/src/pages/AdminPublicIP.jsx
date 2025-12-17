// src/pages/AdminPublicIP.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminPublicIP() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    try {
      const res = await api.get("/admin/public-ip");
      setDocs(res.data.docs || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("caption", caption || "");
      await api.post("/admin/public-ip", fd, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Uploaded");
      setFile(null);
      setCaption("");
      fetchDocs();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="container">
      <h2>Admin — Public IP Resources</h2>
      <p>Upload files/pictures that will be visible to startups in their IP area.</p>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 8 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={handleUpload}>Upload public resource</button>
      </div>

      <hr />
      <h3>Existing public resources</h3>
      {docs.length === 0 ? <p>No resources yet.</p> : docs.map(d => (
        <div key={d._id} style={{ border: "1px solid #ddd", padding: 8, marginBottom: 8 }}>
          <div>{d.caption}</div>
          <div><a href={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/uploads/${d.file}`} target="_blank" rel="noreferrer">View</a></div>
        </div>
      ))}
    </div>
  );
}
