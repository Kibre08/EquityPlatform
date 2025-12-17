import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login({ onLogin }) {
  // Use a single state object for credentials
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      // FIX: Only one API call is needed.
      // We use the credentials state object for the login data.
      const res = await api.post("/auth/login", credentials);

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (onLogin) onLogin();

      if (user.role === "admin") {
        alert("Admin Dashboard is implemented in the 'feat/frontend-admin' branch. Redirecting to Campaigns page for now.");
        navigate("/campaigns");
      } else if (user.role === "startup") {
        alert("Startup Dashboard is implemented in the 'feat/frontend-admin' branch. Redirecting to Campaigns page for now.");
        navigate("/campaigns");
      } else {
        navigate("/investor-dashboard");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2>Login</h2>

      {/* The original code had TWO sets of input fields, one for 'email/password' state 
        and one for 'credentials' state. I am keeping only the fields that use the 
        streamlined 'credentials' state and 'handleChange' handler.
      */}
      <input
        name="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        autoComplete="off"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <div style={{ position: "relative", marginBottom: 8 }}>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          autoComplete="new-password"
          style={{ width: "100%", padding: 8 }}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)"
          }}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>

      <button onClick={handleLogin} style={{ padding: "8px 16px" }}>Login</button>
      <p style={{ marginTop: 10 }}>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}