// client/src/pages/TripWorkspace.jsx
// UPDATED VERSION — properly uses Topbar, Sidebar, TabBar, NotificationsPanel

import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import useStore from "../store/useStore";
import { getTrip } from "../api/api";
import useSocket from "../hooks/useSocket";

// Layout components
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import TabBar from "../components/TabBar";

// Panel components
import OverviewPanel       from "../components/OverviewPanel";
import ItineraryPanel      from "../components/ItineraryPanel";
import ChecklistPanel      from "../components/ChecklistPanel";
import MapPanel            from "../components/MapPanel";
import VotingPanel         from "../components/VotingPanel";
import ExpensesPanel       from "../components/ExpensesPanel";
import ChatBox             from "../components/ChatBox";
import MembersPanel        from "../components/MembersPanel";
import NotificationsPanel  from "../components/NotificationsPanel";

const SIDE_TABS = [
  { id: "chat",    icon: "💬", label: "Chat" },
  { id: "members", icon: "👥", label: "Members" },
  { id: "alerts",  icon: "🔔", label: "Alerts" },
];

export default function TripWorkspace() {
  const { tripId } = useParams();
  const history = useHistory();

  const {
    activeTrip, setActiveTrip,
    activeTab,
    activeSidePanel, setActiveSidePanel,
    chatMessages, setChatMessages,
  } = useStore();

  const [loading, setLoading] = useState(true);

  // Connect socket — handles ALL real-time events for this trip
  const socket = useSocket(tripId);

  useEffect(() => {
    getTrip(tripId)
      .then((r) => {
        setActiveTrip(r.data);
        setChatMessages(r.data.chat || []);
      })
      .catch(() => history.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [tripId]);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "var(--cream)", gap: 16,
      }}>
        <div style={{ fontSize: 56 }}>🌍</div>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--text-muted)" }}>
          Loading your trip…
        </p>
      </div>
    );
  }

  if (!activeTrip) return null;

  const daysLeft = Math.ceil((new Date(activeTrip.startDate) - new Date()) / 86400000);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "100vh", overflow: "hidden",
      background: "var(--cream)",
    }}>
      {/* ── TOP BAR ─────────────────────────── */}
      <Topbar trip={activeTrip} />

      {/* ── BODY (sidebar + center + right panel) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT SIDEBAR ──────────────────── */}
        <Sidebar />

        {/* ── CENTER ────────────────────────── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Tab bar */}
          <TabBar />

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
            {activeTab === "overview"  && <OverviewPanel trip={activeTrip} daysLeft={daysLeft} />}
            {activeTab === "itinerary" && <ItineraryPanel tripId={tripId} />}
            {activeTab === "packing"   && <ChecklistPanel tripId={tripId} />}
            {activeTab === "map"       && <MapPanel trip={activeTrip} />}
            {activeTab === "voting"    && <VotingPanel tripId={tripId} />}
            {activeTab === "expenses"  && <ExpensesPanel tripId={tripId} />}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ─────────────────── */}
        <div style={{
          width: 300,
          background: "var(--white)",
          borderLeft: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}>
          {/* Side tab switcher */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            {SIDE_TABS.map((t) => {
              const isActive = activeSidePanel === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveSidePanel(t.id)}
                  style={{
                    flex: 1, padding: "11px 4px",
                    border: "none", background: "none",
                    borderBottom: isActive ? "2.5px solid var(--green)" : "2.5px solid transparent",
                    color: isActive ? "var(--green)" : "var(--text-muted)",
                    fontWeight: isActive ? 700 : 400,
                    fontSize: 12, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}
                >
                  {t.icon} {t.label}
                </button>
              );
            })}
          </div>

          {/* Side panel content */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {activeSidePanel === "chat"    && <ChatBox tripId={tripId} socket={socket} />}
            {activeSidePanel === "members" && <MembersPanel tripId={tripId} />}
            {activeSidePanel === "alerts"  && <NotificationsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}