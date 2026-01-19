import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass">
      <div className="nav-brand">
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
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

