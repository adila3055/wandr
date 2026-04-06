import React, { useState } from "react";
import useStore from "../store/useStore";
import { inviteMember } from "../api/api";

import {
  EmptyState,
  Modal,
  FormInput,
  inputStyle,
  labelStyle,
  addBtnStyle,
  submitBtnStyle,
  deleteBtnStyle
} from "../utils/componentUtils.jsx";






export function MembersPanel({ tripId }) {
  const { activeTrip, onlineUsers } = useStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const members = activeTrip?.members || [];
 
  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await inviteMember(tripId, email);
      setMsg("✅ Invited successfully!");
      setEmail("");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Failed"));
    } finally {
      setLoading(false);
    }
  };
 
  const isOnline = (userId) => onlineUsers.some((u) => u.userId === userId);
  const getColor = (i) => ["#2d6a4f", "#52b788", "#e76f51", "#457b9d"][i % 4];
 
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>👥 Members</h3>
 
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {members.map((m, i) => (
          <div key={m.user?._id || i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%", background: getColor(i),
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--white)", fontWeight: 700, fontSize: 14,
              }}>
                {m.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              {isOnline(m.user?._id) && (
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 10, height: 10, background: "#22c55e",
                  borderRadius: "50%", border: "2px solid var(--white)",
                }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.user?.name || "Unknown"}</div>
              <div style={{ fontSize: 11, color: "var(--text-light)" }}>{m.role} · {m.user?.email}</div>
            </div>
            {isOnline(m.user?._id) && (
              <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>ONLINE</span>
            )}
          </div>
        ))}
      </div>
 
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-muted)" }}>Invite by email</p>
        <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)}
            type="email" placeholder="friend@example.com" style={inputStyle} required />
          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? "Inviting…" : "Send Invite"}
          </button>
        </form>
        {msg && <p style={{ fontSize: 12, marginTop: 8, color: msg.startsWith("✅") ? "var(--green)" : "var(--red)" }}>{msg}</p>}
      </div>
    </div>
  );
}
 
export default MembersPanel;