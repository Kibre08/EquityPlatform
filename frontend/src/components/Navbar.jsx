import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass">
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
          &larr;
        </button>
        <Link to="/" className="logo">
          EquityPlatform
        </Link>
        {user && <span className="user-badge">{user.fullName}</span>}
      </div>

      <div className="nav-links">
        <Link to="/campaigns" className={isActive("/campaigns") ? "active" : ""}>
          Campaigns
        </Link>

        {user?.role === "admin" && (
          <>
            <Link to="/admin-dashboard" className={isActive("/admin-dashboard") ? "active" : ""}>
              Dashboard
            </Link>
            <Link to="/admin-panel" className={isActive("/admin-panel") ? "active" : ""}>
              Admin Panel
            </Link>
            <Link to="/admin/ip" className={isActive("/admin/ip") ? "active" : ""}>
              IP Review
            </Link>
          </>
        )}

        {user?.role === "startup" && (
          <>
            <Link to="/startup-dashboard" className={isActive("/startup-dashboard") ? "active" : ""}>
              Dashboard
            </Link>
            <Link to="/startup/ip" className={isActive("/startup/ip") ? "active" : ""}>
              My IP
            </Link>
            <Link to="/messages" className={isActive("/messages") ? "active" : ""}>
              Messages
            </Link>
          </>
        )}

        {user?.role === "investor" && (
          <>
            <Link to="/investor-dashboard" className={isActive("/investor-dashboard") ? "active" : ""}>
              Dashboard
            </Link>
            <Link to="/messages" className={isActive("/messages") ? "active" : ""}>
              Messages
            </Link>
          </>
        )}



        {user ? (
          <>
            <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={toggleTheme} className="btn btn-secondary btn-sm">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

