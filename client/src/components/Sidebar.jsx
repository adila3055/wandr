// client/src/components/Sidebar.jsx
// Left sidebar — shows "My Trips" list + "Current Trip" navigation links

import React from "react";
import { useHistory } from "react-router-dom";
import useStore from "../store/useStore";

const NAV_ITEMS = [
  { id: "overview",   icon: "🏠", label: "Overview" },
  { id: "itinerary",  icon: "📅", label: "Itinerary" },
  { id: "packing",    icon: "✅", label: "Packing List" },
  { id: "map",        icon: "📍", label: "Live Map" },
  { id: "voting",     icon: "🗳️", label: "Voting" },
  { id: "expenses",   icon: "💰", label: "Expenses" },
];

export default function Sidebar() {
  const history = useHistory();
  const { trips, activeTrip, activeTab, setActiveTab, user, logout } = useStore();

  const formatDateRange = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts = { month: "short", day: "numeric" };
    return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", { ...opts, year: "numeric" })}`;
  };

  return (
    <div style={{
      width: 220,
      background: "var(--white)",
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflowY: "auto",
    }}>
      {/* ── MY TRIPS section ──────────────────── */}
      <div style={{ padding: "18px 14px 10px" }}>
        <p style={sectionLabel}>My Trips</p>

        {/* Active trip (highlighted) */}
        {activeTrip && (
          <div style={{
            background: "var(--green-soft)",
            border: "1px solid var(--green-light)",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 6,
            cursor: "default",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
              <span>{activeTrip.coverEmoji}</span> {activeTrip.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              {formatDateRange(activeTrip.startDate, activeTrip.endDate)}
            </div>
          </div>
        )}

        {/* Other trips */}
        {trips
          .filter((t) => t._id !== activeTrip?._id)
          .slice(0, 3)
          .map((trip) => (
            <button
              key={trip._id}
              onClick={() => history.push(`/trip/${trip._id}`)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                width: "100%", background: "none", border: "none",
                borderRadius: 8, padding: "8px 10px", cursor: "pointer",
                textAlign: "left", marginBottom: 2,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--cream)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "none"}
            >
              <span style={{ fontSize: 16, marginTop: 1 }}>{trip.coverEmoji}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{trip.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-light)" }}>
                  {formatDateRange(trip.startDate, trip.endDate)}
                </div>
              </div>
            </button>
          ))}

        {/* Add new trip */}
        <button
          onClick={() => history.push("/dashboard")}
          style={{
            width: "100%", background: "none",
            border: "1px dashed var(--border)", borderRadius: 8,
            padding: "7px 10px", fontSize: 12, color: "var(--text-muted)",
            cursor: "pointer", marginTop: 4, textAlign: "center",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "var(--cream)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          + Add new trip
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

      {/* ── CURRENT TRIP NAV ──────────────────── */}
      <div style={{ padding: "6px 14px", flex: 1 }}>
        <p style={sectionLabel}>Current Trip</p>

        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          // Badge for packing (show incomplete count)
          const packingBadge = item.id === "packing" && activeTrip
            ? activeTrip.packingList?.filter((i) => !i.packed).length
            : 0;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "8px 12px", borderRadius: 8, border: "none",
                background: isActive ? "var(--green-soft)" : "none",
                color: isActive ? "var(--green)" : "var(--text-muted)",
                fontWeight: isActive ? 700 : 400,
                fontSize: 13, cursor: "pointer", textAlign: "left",
                marginBottom: 2, transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--cream)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "none"; }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </span>
              {packingBadge > 0 && (
                <span style={{
                  background: "var(--red)", color: "var(--white)",
                  borderRadius: 999, padding: "1px 7px", fontSize: 10, fontWeight: 700,
                }}>
                  {packingBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── User footer ───────────────────────── */}
      <div style={{
        padding: "12px 14px",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: "var(--green)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--white)", fontWeight: 700, fontSize: 12, flexShrink: 0,
        }}>
          {user?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={logout}
          title="Sign out"
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: "var(--text-light)", padding: 2,
          }}
        >
          ↩
        </button>
      </div>
    </div>
  );
}

const sectionLabel = {
  fontSize: 10, fontWeight: 800, color: "var(--text-light)",
  letterSpacing: 1.2, textTransform: "uppercase",
  marginBottom: 10, display: "block",
};