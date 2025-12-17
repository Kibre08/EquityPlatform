import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/admin/users");
        setStats({ total: res.data.users?.length || 0 });
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div className="container">
      <h1>👑 Admin Dashboard</h1>
      {stats ? (
        <div>
          <p>Total Users: {stats.total}</p>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => navigate("/admin-panel")} style={{ marginRight: 10 }}>Open Admin Panel</button>
            <button onClick={() => navigate("/admin/users")} style={{ marginRight: 10 }}>Manage Users</button>
            <button onClick={() => navigate("/admin/content")}>Manage Content</button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
