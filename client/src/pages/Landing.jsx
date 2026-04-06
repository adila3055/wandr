// client/src/pages/Landing.jsx

import React from "react";
import { useHistory } from "react-router-dom";

export default function Landing() {
  const history = useHistory();

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cream)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      textAlign: "center",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
        <div style={{
          width: 42, height: 42, background: "var(--green)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 20 }}>🌍</span>
        </div>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 700, color: "var(--green)" }}>
          Wandr
        </span>
      </div>

      {/* Hero */}
      <h1 style={{
        fontFamily: "var(--font-serif)",
        fontSize: "clamp(36px, 6vw, 64px)",
        fontWeight: 700,
        color: "var(--text)",
        maxWidth: 700,
        lineHeight: 1.2,
        marginBottom: 20,
      }}>
        Plan trips together,<br />
        <span style={{ color: "var(--green)" }}>in real time.</span>
      </h1>

      <p style={{
        fontSize: 18,
        color: "var(--text-muted)",
        maxWidth: 500,
        lineHeight: 1.7,
        marginBottom: 40,
      }}>
        Wandr brings your crew together — chat, vote on stays, split expenses,
        and build your itinerary all in one place.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => history.push("/auth?mode=register")}
          style={{
            background: "var(--green)",
            color: "var(--white)",
            border: "none",
            borderRadius: "var(--radius)",
            padding: "14px 32px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Get started free →
        </button>
        <button
          onClick={() => history.push("/auth?mode=login")}
          style={{
            background: "var(--white)",
            color: "var(--text)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "14px 32px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </div>

      {/* Feature chips */}
      <div style={{ display: "flex", gap: 12, marginTop: 64, flexWrap: "wrap", justifyContent: "center" }}>
        {["🗺️ Live Map", "💬 Group Chat", "🗳️ Voting", "💰 Expenses", "✅ Packing List"].map((f) => (
          <div key={f} style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "8px 18px",
            fontSize: 14,
            color: "var(--text-muted)",
          }}>{f}</div>
        ))}
      </div>
    </div>
  );
}