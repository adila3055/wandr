// client/src/components/Topbar.jsx
// The top navigation bar shown inside TripWorkspace

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useStore from "../store/useStore";
import { inviteMember } from "../api/api";
import Modal from "./Modal";

export default function Topbar({ trip }) {
  const history = useHistory();
  const { onlineUsers, setActiveSidePanel } = useStore();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMsg, setInviteMsg] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  // Weather forecast mock (replace with real API if desired)
  const forecast = [
    { day: "Today", temp: "31°C", icon: "🌤" },
    { day: "Thu",   temp: "29°C", icon: "⛅" },
    { day: "Fri",   temp: "27°C", icon: "🌦" },
    { day: "Sat",   temp: "30°C", icon: "🌤" },
    { day: "Sun",   temp: "28°C", icon: "⛅" },
    { day: "Mon",   temp: "32°C", icon: "☀️" },
  ];

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMsg("");
    try {
      await inviteMember(trip._id, inviteEmail);
      setInviteMsg("✅ Invite sent successfully!");
      setInviteEmail("");
    } catch (err) {
      setInviteMsg("❌ " + (err.response?.data?.error || "User not found"));
    } finally {
      setInviteLoading(false);
    }
  };

  const avatarColors = ["#2d6a4f", "#52b788", "#e76f51", "#457b9d"];

  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 };
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: 8, fontSize: 14 };
  const btnStyle = { width: "100%", padding: "12px", background: "var(--green)", color: "var(--white)", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 14 };

  return (
    <>
      <div style={{
        height: 56,
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
        gap: 12,
        zIndex: 100,
      }}>
        {/* LEFT: Logo + Trip Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Logo */}
          <button
            onClick={() => history.push("/dashboard")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <div style={{
              width: 32, height: 32, background: "var(--green)", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
            }}>
              🌍
            </div>
            <span style={{
              fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700,
              color: "var(--green)", letterSpacing: "-0.3px",
            }}>
              Wandr
            </span>
          </button>

          {/* Trip pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "var(--cream)", border: "1px solid var(--border)",
            borderRadius: 20, padding: "5px 14px", cursor: "pointer",
          }}>
            <span style={{ fontSize: 14 }}>{trip?.coverEmoji || "🌴"}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
              {trip?.name || "Trip"}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>▾</span>
          </div>

          {/* Online count */}
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 12, color: "var(--text-muted)",
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 2px rgba(34,197,94,0.25)",
            }} />
            {onlineUsers.length || 1} online
          </div>

          {/* Weather forecast strip */}
          <div style={{ display: "flex", gap: 4 }}>
            {forecast.slice(0, 4).map((w, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 4,
                background: i === 0 ? "var(--green-soft)" : "var(--cream)",
                border: `1px solid ${i === 0 ? "var(--green-light)" : "var(--border)"}`,
                borderRadius: 20, padding: "3px 10px",
                fontSize: 11, color: i === 0 ? "var(--green)" : "var(--text-muted)",
                fontWeight: i === 0 ? 600 : 400,
              }}>
                <span>{w.icon}</span>
                <span>{w.day} · {w.temp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Members + Invite + New Trip */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Member avatars */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {(trip?.members || []).slice(0, 4).map((m, i) => {
              const isOnline = onlineUsers.some(u => u.userId === m.user?._id);
              return (
                <div
                  key={m.user?._id || i}
                  title={m.user?.name}
                  style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: avatarColors[i % avatarColors.length],
                    border: `2px solid ${isOnline ? "#22c55e" : "var(--white)"}`,
                    marginLeft: i > 0 ? -8 : 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--white)", fontWeight: 700, fontSize: 11,
                    cursor: "default", zIndex: 4 - i,
                    position: "relative",
                  }}
                >
                  {m.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
              );
            })}
          </div>

          {/* Invite button */}
          <button
            onClick={() => setShowInvite(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 14px",
              fontSize: 12, fontWeight: 600, cursor: "pointer", color: "var(--text)",
            }}
          >
            🔗 Invite
          </button>

          {/* New Trip */}
          <button
            onClick={() => history.push("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "var(--green)", color: "var(--white)",
              border: "none", borderRadius: 8, padding: "7px 16px",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            + New Trip
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => setActiveSidePanel("alerts")}
            style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "var(--cream)", border: "1px solid var(--border)",
              fontSize: 15, cursor: "pointer", position: "relative",
            }}
          >
            🔔
            <span style={{
              position: "absolute", top: 2, right: 2,
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--red)", border: "1.5px solid var(--white)",
            }} />
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <Modal title="Invite a Friend 🔗" onClose={() => { setShowInvite(false); setInviteMsg(""); }} width={420}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>
            Enter their email — they need a Wandr account to join.
          </p>
          <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                required
                style={inputStyle}
              />
            </div>
            <button type="submit" disabled={inviteLoading} style={btnStyle}>
              {inviteLoading ? "Sending…" : "Send Invite 🚀"}
            </button>
            {inviteMsg && (
              <p style={{ fontSize: 13, color: inviteMsg.startsWith("✅") ? "var(--green)" : "var(--red)", textAlign: "center" }}>
                {inviteMsg}
              </p>
            )}
          </form>
        </Modal>
      )}
    </>
  );
}
