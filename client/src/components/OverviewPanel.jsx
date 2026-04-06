// client/src/components/OverviewPanel.jsx
// The first tab shown when opening a trip — hero banner, stats, quick actions

import React from "react";
import useStore from "../store/useStore";

export default function OverviewPanel({ trip, daysLeft }) {
  const { setActiveTab, setActiveSidePanel } = useStore();

  // Computed stats
  const packedCount  = (trip.packingList || []).filter((i) => i.packed).length;
  const totalPacked  = (trip.packingList || []).length;
  const packedPct    = totalPacked ? Math.round((packedCount / totalPacked) * 100) : 0;
  const totalSpent   = (trip.expenses || []).reduce((s, e) => s + e.amount, 0);
  const budgetLakhs  = ((trip.budget || 200000) / 100000).toFixed(0);
  const spentLakhs   = (totalSpent / 100000).toFixed(1);
  const activityCount = (trip.itinerary || []).length;
  const uniqueDays   = new Set((trip.itinerary || []).map((i) => i.date).filter(Boolean)).size || 10;

  const stats = [
    {
      label: "DAYS REMAINING",
      value: daysLeft > 0 ? daysLeft : 0,
      sub: "till departure",
      color: daysLeft < 7 ? "var(--red)" : "var(--green)",
    },
    {
      label: "PACKED ITEMS",
      value: `${packedCount}/${totalPacked}`,
      sub: `${packedPct}% complete`,
      color: "var(--text)",
      bar: { value: packedPct, color: packedPct === 100 ? "var(--green)" : "var(--orange)" },
    },
    {
      label: "BUDGET USED",
      value: `₹${spentLakhs}L`,
      sub: `of ₹${budgetLakhs}L total`,
      color: "var(--green)",
    },
    {
      label: "ACTIVITIES",
      value: activityCount,
      sub: `across ${uniqueDays} days`,
      color: "var(--text)",
    },
  ];

  const quickActions = [
    { icon: "📅", label: "Add activity",   onClick: () => setActiveTab("itinerary") },
    { icon: "✅", label: "Check packing",  onClick: () => setActiveTab("packing") },
    { icon: "🗳️", label: "Vote on stays",  onClick: () => setActiveTab("voting") },
    { icon: "👥", label: "Invite friends", onClick: () => setActiveSidePanel("members") },
    { icon: "✨", label: "AI suggest",     onClick: () => alert("AI suggestions coming soon! 🚀") },
  ];

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div style={{ maxWidth: 900 }}>

      {/* ── Hero Banner ─────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 50%, #c7f9cc 100%)",
        borderRadius: 20,
        padding: "52px 36px 40px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
        border: "1px solid var(--green-light)",
      }}>
        {/* Decorative circle */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 180, height: 180, borderRadius: "50%",
          background: "rgba(255,255,255,0.25)",
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: "rgba(255,255,255,0.2)",
        }} />

        {/* Status pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.75)",
          borderRadius: 999, padding: "5px 16px",
          fontSize: 12, fontWeight: 600, color: "var(--green)",
          marginBottom: 16,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
          Planning in progress
        </div>

        {/* Emoji */}
        <div style={{ fontSize: 68, marginBottom: 10, lineHeight: 1 }}>
          {trip.coverEmoji || "🌴"}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: 32, fontWeight: 700,
          color: "var(--text)", marginBottom: 12,
        }}>
          {trip.name}
        </h1>

        {/* Meta row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 20,
          fontSize: 13, color: "var(--text-muted)", flexWrap: "wrap",
        }}>
          <span>📅 {formatDate(trip.startDate)} – {formatDate(trip.endDate)}</span>
          <span>👥 {(trip.members || []).length} members</span>
          <span>📍 {trip.destination}</span>
        </div>

        {/* Tags */}
        {(trip.tags || []).length > 0 && (
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 8, marginTop: 16, flexWrap: "wrap",
          }}>
            {trip.tags.map((tag) => (
              <span key={tag} style={{
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.9)",
                borderRadius: 999, padding: "4px 14px",
                fontSize: 12, color: "var(--text-muted)",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Stats Grid ──────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "22px 18px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: 10, fontWeight: 800,
              color: "var(--text-light)", letterSpacing: 1.2,
              textTransform: "uppercase", marginBottom: 10,
            }}>
              {s.label}
            </div>
            <div style={{
              fontFamily: "var(--font-serif)",
              fontSize: 34, fontWeight: 700,
              color: s.color, marginBottom: 6, lineHeight: 1,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {s.sub}
            </div>
            {/* Mini progress bar for packing */}
            {s.bar && (
              <div style={{
                height: 4, background: "var(--cream-dark)",
                borderRadius: 2, marginTop: 10, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${s.bar.value}%`,
                  background: s.bar.color, borderRadius: 2,
                  transition: "width 0.4s",
                }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Quick Actions ───────────────────── */}
      <div>
        <p style={{
          fontSize: 11, fontWeight: 800, color: "var(--text-light)",
          letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12,
        }}>
          Quick Actions
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "11px 20px",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                color: "var(--text)", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--green-soft)";
                e.currentTarget.style.borderColor = "var(--green-light)";
                e.currentTarget.style.color = "var(--green)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--white)";
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text)";
              }}
            >
              <span style={{ fontSize: 16 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}