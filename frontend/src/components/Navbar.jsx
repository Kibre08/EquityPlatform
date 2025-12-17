import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 30px",
        backgroundColor: "#0d6efd",
        color: "white",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>💡 Startup Investment and IP Platform</h2>
        <div style={{ fontSize: 12 }}>{user?.fullName}</div>
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/campaigns" style={{ color: "white" }}>Campaigns</Link>

        {user?.role === "admin" && (
          <>
            <Link to="/admin-dashboard" style={{ color: "white" }}>Dashboard</Link>
            <Link to="/admin-panel" style={{ color: "white" }}>Admin Panel</Link>
            <Link to="/admin/ip" style={{ color: "white" }}>IP Review</Link>
          </>
        )}

        {user?.role === "startup" && (
          <>
            <Link to="/startup-dashboard" style={{ color: "white" }}>Dashboard</Link>
            <Link to="/startup/ip" style={{ color: "white" }}>My IP</Link>
            <Link to="/messages" style={{ color: "white" }}>Messages</Link>
          </>
        )}

        {user?.role === "investor" && (
          <>
            <Link to="/investor-dashboard" style={{ color: "white" }}>Dashboard</Link>
            <Link to="/messages" style={{ color: "white" }}>Messages</Link>
          </>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#0d6efd",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
