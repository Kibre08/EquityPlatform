// src/pages/Messaging.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

export default function Messaging() {
  const [users, setUsers] = useState([]); // list of users to chat with
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();

  useEffect(() => {
    // If we got a user from navigation state, use it as selectedUser
    if (location.state && location.state.user) {
      setSelectedUser(location.state.user);
    }

    // Try to get contacts: first try admin users endpoint (if token allows), otherwise derive from inbox.
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
        }).catch(err => console.error(err));
      });
  }, [location.state, me._id]);

  useEffect(() => {
    if (!selectedUser) return;
    api.get(`/messages/conversation/${selectedUser._id}`)
      .then(res => setMessages(res.data.messages || []))
      .catch(err => console.error(err));
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const res = await api.post("/messages", { to: selectedUser._id, content: newMessage });
      // server returns { msg, message }
      setMessages(prev => [...prev, res.data.message]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send");
    }
  };

  return (
    <div style={{ display: "flex", height: "85vh" }}>
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: 12, overflowY: "auto" }}>
        <h3>Contacts</h3>
        {users.map(u => (
          <div key={u._id} onClick={() => setSelectedUser(u)} style={{ padding: 8, cursor: "pointer", background: selectedUser?._id === u._id ? "#e8f0fe" : "transparent", borderRadius: 6, marginBottom: 6 }}>
            <strong>{u.fullName}</strong><br/>
            <small>{u.role}</small>
          </div>
        ))}
        {users.length === 0 && <p>No contacts available.</p>}
      </div>

      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.fullName || selectedUser.companyName || "Contact"}</h3>
            <div style={{ flex: 1, border: "1px solid #ccc", padding: 10, overflowY: "auto", borderRadius: 8, marginBottom: 10 }}>
              {messages.map(m => (
                <div key={m._id} style={{ margin: "6px 0", textAlign: m.sender?._id === me._id ? "right" : "left" }}>
                  <div style={{ display: "inline-block", padding: "8px 12px", borderRadius: 16, backgroundColor: m.sender?._id === me._id ? "#0d6efd" : "#eee", color: m.sender?._id === me._id ? "white" : "black", maxWidth: "70%", wordWrap: "break-word" }}>
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
              <button onClick={sendMessage} style={{ padding: "10px 20px", backgroundColor: "#0d6efd", color: "white", border: "none", borderRadius: 8 }}>Send</button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", marginTop: "20%" }}>
            <h3>Select a contact to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
}
