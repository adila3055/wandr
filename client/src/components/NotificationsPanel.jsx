// client/src/components/NotificationsPanel.jsx
// The "Alerts" tab in the right sidebar — shows activity feed / notifications

import React, { useState } from "react";
import useStore from "../store/useStore";

// Generate notifications dynamically from trip data
function buildNotifications(trip, user) {
  if (!trip) return [];
  const notes = [];

  // Packing alerts
  const unpacked = (trip.packingList || []).filter((i) => !i.packed).length;
  if (unpacked > 0) {
    notes.push({
      id: "pack-1",
      type: "warning",
      icon: "🎒",
      title: "Packing incomplete",
      body: `${unpacked} item${unpacked > 1 ? "s" : ""} still to pack before departure.`,
      time: "Just now",
      action: "packing",
    });
  }

  // Budget alerts
  const spent = (trip.expenses || []).reduce((s, e) => s + e.amount, 0);
  if (trip.budget && spent > trip.budget * 0.8) {
    notes.push({
      id: "budget-1",
      type: "alert",
      icon: "💰",
      title: "Budget warning",
      body: `You've used ${Math.round((spent / trip.budget) * 100)}% of your budget.`,
      time: "1h ago",
      action: "expenses",
    });
  }

  // Voting pending
  const voteItems = trip.voteItems || [];
  if (voteItems.length > 0) {
    const myVotes = voteItems.filter(v => v.votes?.includes(user?._id)).length;
    const pending = voteItems.length - myVotes;
    if (pending > 0) {
      notes.push({
        id: "vote-1",
        type: "info",
        icon: "🗳️",
        title: "Votes pending",
        body: `${pending} vote option${pending > 1 ? "s" : ""} waiting for your input.`,
        time: "2h ago",
        action: "voting",
      });
    }
  }

  // New members
  if ((trip.members || []).length > 1) {
    notes.push({
      id: "members-1",
      type: "success",
      icon: "👥",
      title: "Trip crew ready",
      body: `${trip.members.length} members have joined ${trip.name}.`,
      time: "Yesterday",
      action: null,
    });
  }

  // Days countdown
  const daysLeft = Math.ceil((new Date(trip.startDate) - new Date()) / 86400000);
  if (daysLeft > 0 && daysLeft <= 30) {
    notes.push({
      id: "days-1",
      type: "success",
      icon: "✈️",
      title: `${daysLeft} days to go!`,
      body: `Your trip to ${trip.destination} is coming up soon.`,
      time: "Today",
      action: null,
    });
  }

  // Fallback: no notifications
  if (notes.length === 0) {
    notes.push({
      id: "empty",
      type: "info",
      icon: "🎉",
      title: "All caught up!",
      body: "No alerts right now. Happy planning!",
      time: "Now",
      action: null,
    });
  }

  return notes;
}

const TYPE_COLORS = {
  warning: { bg: "#fff8e6", border: "#f4a261", dot: "#f4a261" },
  alert:   { bg: "#fff0f0", border: "#e63946", dot: "#e63946" },
  info:    { bg: "#eff6ff", border: "#457b9d", dot: "#457b9d" },
  success: { bg: "var(--green-soft)", border: "var(--green-light)", dot: "var(--green)" },
};

export default function NotificationsPanel() {
  const { activeTrip, user, setActiveTab } = useStore();
  const [dismissed, setDismissed] = useState([]);

  const notifications = buildNotifications(activeTrip, user).filter(
    (n) => !dismissed.includes(n.id)
  );

  const dismiss = (id) => setDismissed((d) => [...d, id]);

  const handleAction = (note) => {
    if (note.action) setActiveTab(note.action);
    dismiss(note.id);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 10px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
          🔔 Alerts
        </span>
        {notifications.length > 0 && (
          <button
            onClick={() => setDismissed(notifications.map((n) => n.id))}
            style={{ fontSize: 11, color: "var(--text-light)", background: "none", border: "none", cursor: "pointer" }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Notification list */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 16px" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No alerts — all good!</p>
          </div>
        ) : (
          notifications.map((note) => {
            const colors = TYPE_COLORS[note.type] || TYPE_COLORS.info;
            return (
              <div
                key={note.id}
                style={{
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: "12px 14px",
                  position: "relative",
                  animation: "fadeIn 0.2s ease",
                }}
              >
                {/* Dismiss X */}
                <button
                  onClick={() => dismiss(note.id)}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "none", border: "none",
                    fontSize: 14, cursor: "pointer", color: "var(--text-light)",
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>

                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>{note.icon}</span>
                  <div style={{ flex: 1, paddingRight: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>
                      {note.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {note.body}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontSize: 10, color: "var(--text-light)" }}>{note.time}</span>
                      {note.action && (
                        <button
                          onClick={() => handleAction(note)}
                          style={{
                            fontSize: 11, fontWeight: 700, color: "var(--green)",
                            background: "none", border: "none", cursor: "pointer",
                          }}
                        >
                          View →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}