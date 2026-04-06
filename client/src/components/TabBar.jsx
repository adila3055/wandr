// client/src/components/TabBar.jsx
// Horizontal tab bar shown below the Topbar — Overview, Itinerary, Packing, etc.

import React from "react";
import useStore from "../store/useStore";

const TABS = [
  { id: "overview",  icon: "🏠", label: "Overview" },
  { id: "itinerary", icon: "📅", label: "Itinerary" },
  { id: "packing",   icon: "✅", label: "Packing" },
  { id: "map",       icon: "📍", label: "Live Map" },
  { id: "voting",    icon: "🗳️", label: "Voting" },
  { id: "expenses",  icon: "💰", label: "Expenses" },
];

export default function TabBar() {
  const { activeTab, setActiveTab, activeTrip } = useStore();

  return (
    <div style={{
      background: "var(--white)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "flex-end",
      padding: "0 20px",
      gap: 2,
      flexShrink: 0,
      overflowX: "auto",
    }}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        // Badge: unpacked packing items
        const badge =
          tab.id === "packing" && activeTrip
            ? activeTrip.packingList?.filter((i) => !i.packed).length
            : 0;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "12px 16px",
              border: "none",
              background: "none",
              borderBottom: isActive
                ? "2.5px solid var(--green)"
                : "2.5px solid transparent",
              color: isActive ? "var(--green)" : "var(--text-muted)",
              fontWeight: isActive ? 700 : 400,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "color 0.15s",
              position: "relative",
            }}
            onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <span style={{ fontSize: 14 }}>{tab.icon}</span>
            {tab.label}

            {/* Badge for packing */}
            {badge > 0 && (
              <span style={{
                background: "var(--red)",
                color: "var(--white)",
                borderRadius: 999,
                padding: "1px 6px",
                fontSize: 10,
                fontWeight: 700,
                marginLeft: 2,
              }}>
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}