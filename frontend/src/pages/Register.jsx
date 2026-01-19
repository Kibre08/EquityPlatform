import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { BASE_URL } from "../services/api";

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith("@gmail.com")) {
      return alert("Only @gmail.com email addresses are allowed.");
    }
    if (form.role !== "admin" && (!selfie || !idDocument)) {
      return alert("Selfie and ID document are required for verification.");
    }

    setLoading(true);
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
        formData.append("selfie", selfie);
        formData.append("idDocument", idDocument);
      }

      await api.post("/auth/register", formData);
      alert("Registration successful — KYC pending. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed: " + (err.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Join the Platform</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create your account to start your investment journey</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <input
                placeholder="John Doe"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Account Type</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required>
                <option value="">Select Role</option>
                <option value="startup">Startup</option>
                <option value="investor">Investor</option>
              </select>
            </div>
          </div>

          {form.role === "startup" && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
              <div className="form-group">
                <label>Industry Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select Category</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="AgriTech">AgriTech</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input placeholder="Acme Inc." value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Company Pitch</label>
                <textarea
                  placeholder="Tell us about your startup..."
                  value={form.companyDescription}
                  onChange={(e) => setForm({ ...form, companyDescription: e.target.value })}
                  rows={3}
                  required
                />
              </div>
            </div>
          )}

          {form.role && form.role !== "admin" && (
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid var(--border-light)' }}>
              <p style={{ marginBottom: "1rem", fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Identity Verification (KYC)</p>
              <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>Selfie (JPG/PNG)</label>
                  <input type="file" onChange={(e) => setSelfie(e.target.files[0])} required />
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Upload selfie holding your ID for clarification</p>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '0.75rem' }}>ID Doc (PDF/JPG)</label>
                  <input type="file" onChange={(e) => setIdDocument(e.target.files[0])} required />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

