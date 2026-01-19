import { useEffect, useState } from "react";
import api, { BASE_URL } from "../services/api";

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

    if (loading) return <div className="container">Loading users...</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: 0 }}>👥 User Management</h1>
                <div className="user-badge">Admin Access</div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Documents</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>{u.fullName || u.companyName}</td>
                                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                                <td>
                                    <span className="user-badge" style={{ color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-secondary)' }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {u.selfie && (
                                            <a href={`${BASE_URL}/uploads/${u.selfie}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>Selfie</a>
                                        )}
                                        {u.idDocument && (
                                            <a href={`${BASE_URL}/uploads/${u.idDocument}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem' }}>ID Doc</a>
                                        )}
                                        {!u.selfie && !u.idDocument && <span style={{ color: 'var(--text-muted)' }}>None</span>}
                                    </div>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(u._id)} className="btn btn-sm" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

