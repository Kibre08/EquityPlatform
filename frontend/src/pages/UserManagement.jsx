import { useEffect, useState } from "react";
import api from "../services/api";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data.users || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            alert("User deleted");
        } catch (err) {
            console.error(err);
            alert("Failed to delete user");
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container">
            <h1>👥 User Management</h1>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
                <thead>
                    <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
                        <th style={{ padding: 10, border: "1px solid #ddd" }}>Name</th>
                        <th style={{ padding: 10, border: "1px solid #ddd" }}>Email</th>
                        <th style={{ padding: 10, border: "1px solid #ddd" }}>Role</th>
                        <th style={{ padding: 10, border: "1px solid #ddd" }}>Files</th>
                        <th style={{ padding: 10, border: "1px solid #ddd" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u._id}>
                            <td style={{ padding: 10, border: "1px solid #ddd" }}>{u.fullName || u.companyName}</td>
                            <td style={{ padding: 10, border: "1px solid #ddd" }}>{u.email}</td>
                            <td style={{ padding: 10, border: "1px solid #ddd" }}>{u.role}</td>
                            <td style={{ padding: 10, border: "1px solid #ddd" }}>
                                {u.selfie && (
                                    <div>
                                        <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${u.selfie}`} target="_blank" rel="noreferrer">Selfie</a>
                                    </div>
                                )}
                                {u.idDocument && (
                                    <div>
                                        <a href={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${u.idDocument}`} target="_blank" rel="noreferrer">ID Doc</a>
                                    </div>
                                )}
                                {!u.selfie && !u.idDocument && "No files"}
                            </td>
                            <td style={{ padding: 10, border: "1px solid #ddd" }}>
                                <button onClick={() => handleDelete(u._id)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
