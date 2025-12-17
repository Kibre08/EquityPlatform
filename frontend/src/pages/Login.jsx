import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login({ onLogin }) {
  // Use a single state object for credentials
  const [credentials, setCredentials] = useState({ email: "", password: "" });
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

      if (user.role === "admin") navigate("/admin-dashboard");
      else if (user.role === "startup") navigate("/startup-dashboard");
      else navigate("/investor-dashboard");
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
        style={{ width: "100%", padding: 8, marginBottom: 8 }} 
      />
      <input 
        name="password" 
        type="password" 
        placeholder="Password" 
        value={credentials.password} 
        onChange={handleChange} 
        style={{ width: "100%", padding: 8, marginBottom: 8 }} 
      />
      
      <button onClick={handleLogin} style={{ padding: "8px 16px" }}>Login</button>
      <p style={{ marginTop: 10 }}>
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}