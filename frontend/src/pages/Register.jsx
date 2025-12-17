import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
    category: "",
    companyName: "",
    companyDescription: "",
  });
  const [selfie, setSelfie] = useState(null);
  const [idDocument, setIdDocument] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("role", form.role);
      if (form.role === "startup") {
        formData.append("category", form.category);
        formData.append("companyName", form.companyName);
        formData.append("companyDescription", form.companyDescription);
      }
      if (form.role !== "admin") {
        if (!selfie || !idDocument) return alert("Selfie and ID required");
        formData.append("selfie", selfie);
        formData.append("idDocument", idDocument);
      }

      await api.post("/auth/register", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Registration successful — KYC pending (if applicable). Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 600 }}>
        <h2 className="auth-title">Register</h2>
        <input placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="">Select Role</option>
          <option value="startup">Startup</option>
          <option value="investor">Investor</option>
        </select>

        {form.role === "startup" && (
          <>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select Category</option>
              <option value="FinTech">FinTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="AgriTech">AgriTech</option>
              <option value="Other">Other</option>
            </select>

            <input placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            <textarea placeholder="Company Description" value={form.companyDescription} onChange={(e) => setForm({ ...form, companyDescription: e.target.value })} />
          </>
        )}

        {form.role !== "admin" && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ marginBottom: "0.5rem", color: "var(--text-secondary)" }}>Upload selfie (jpg/png) and ID (jpg/png/pdf):</p>
            <input type="file" onChange={(e) => setSelfie(e.target.files[0])} style={{ marginBottom: 8 }} />
            <input type="file" onChange={(e) => setIdDocument(e.target.files[0])} />
          </div>
        )}

        <button onClick={handleRegister} style={{ width: "100%" }}>Register</button>

        <div className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}
