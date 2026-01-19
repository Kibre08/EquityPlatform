import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

export default function Messaging() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.user) {
      setSelectedUser(location.state.user);
    }

    api.get("/admin/users")
      .then(res => {
        const list = (res.data.users || []).filter(u => u._id !== me._id);
        setUsers(list);
      })
      .catch(() => {
        api.get("/messages/inbox").then(r => {
          const msgs = r.data.messages || [];
          const partners = {};
          msgs.forEach(m => {
            const other = (m.sender && m.sender._id !== me._id) ? m.sender : (m.receiver && m.receiver._id !== me._id ? m.receiver : null);
            if (other) partners[other._id] = other;
          });
          setUsers(Object.values(partners));
        });
      })
      .finally(() => setLoading(false));
  }, [location.state, me._id]);

  useEffect(() => {
    if (!selectedUser) return;
    api.get(`/messages/conversation/${selectedUser._id}`)
      .then(res => setMessages(res.data.messages || []))
      .catch(console.error);
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await api.post("/messages", { to: selectedUser._id, content: newMessage });
      setMessages(prev => [...prev, res.data.message]);
      setNewMessage("");
    } catch (err) {
      alert("Failed to transmit message.");
    }
  };

  if (loading) return <div className="container">Establishing secure connection...</div>;

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', paddingTop: '1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Secure <span className="text-gradient">Messaging</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Direct communication line for platform stakeholders.</p>
      </header>

      <div className="dashboard-card" style={{ flex: 1, display: 'flex', padding: 0, overflow: 'hidden', minHeight: '600px', border: '1px solid var(--border-light)' }}>
        {/* Contacts Sidebar */}
        <div style={{ width: '25%', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
          <div className="table-container" style={{ flex: 1, overflowY: 'auto', border: 'none', background: 'transparent', margin: 0, borderRadius: 0 }}>
            {users.map(u => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                style={{
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: selectedUser?._id === u._id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  borderBottom: '1px solid rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ fontWeight: 600, color: selectedUser?._id === u._id ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '1rem' }}>{u.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: '0.25rem' }}>{u.role}</div>
              </div>
            ))}
            {users.length === 0 && <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No contacts available.</p>}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' }}>
          {selectedUser ? (
            <>
              <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedUser.fullName}</h3>
                </div>
                <span className="badge badge-secondary">{selectedUser.role}</span>
              </div>

              <div className="table-container" style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: 'none', background: 'transparent' }}>
                {messages.map(m => (
                  <div key={m._id} style={{ alignSelf: m.sender?._id === me._id ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                    <div style={{
                      padding: '1rem 1.25rem',
                      borderRadius: m.sender?._id === me._id ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                      background: m.sender?._id === me._id ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.08)',
                      color: 'white',
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      boxShadow: m.sender?._id === me._id ? '0 10px 20px -5px rgba(99, 102, 241, 0.4)' : 'none',
                    }}>
                      {m.content}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: m.sender?._id === me._id ? 'right' : 'left', padding: '0 0.5rem' }}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '1rem' }}>
                    Send a message to start the conversation.
                  </div>
                )}
              </div>

              <div style={{ padding: '2rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  style={{ flex: 1, padding: '1.125rem 1.5rem', fontSize: '1rem', borderRadius: '1rem' }}
                />
                <button onClick={sendMessage} className="btn btn-primary" style={{ padding: '0 2rem' }}>Send</button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.1 }}>✉️</div>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Your Inbox</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '1.1rem' }}>Select a contact from the left to start a secure conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

