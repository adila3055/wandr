// client/src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useStore from "../store/useStore";
import { getTrips, createTrip, deleteTrip } from "../api/api";

const EMOJIS = ["🌴", "🗺️", "🏔️", "🏖️", "🏯", "🎡", "🚂", "🌸", "🌊", "🦁"];
const TAGS = ["Beach", "Adventure", "Wellness", "Food Tour", "Culture", "Trek", "City"];

export default function Dashboard() {
  const history = useHistory();
  const { user, logout, trips, setTrips, addTrip, removeTrip } = useStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "", destination: "", startDate: "", endDate: "",
    coverEmoji: "🌴", tags: [], budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    getTrips()
      .then((r) => setTrips(r.data))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await createTrip(form);
      addTrip(data);
      setShowCreate(false);
      setForm({ name: "", destination: "", startDate: "", endDate: "", coverEmoji: "🌴", tags: [], budget: "" });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, tripId) => {
    e.stopPropagation();
    if (!confirm("Delete this trip?")) return;
    await deleteTrip(tripId);
    removeTrip(tripId);
  };

  const toggleTag = (tag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const daysUntil = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)" }}>
      {/* Top Bar */}
      <div style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🌍</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, color: "var(--green)" }}>
            Wandr
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            Hi, {user?.name} 👋
          </span>
          <button
            onClick={logout}
            style={{
              background: "none", border: "1px solid var(--border)",
              borderRadius: 8, padding: "6px 14px", fontSize: 13,
              color: "var(--text-muted)", cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 700 }}>My Trips</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              {trips.length} trip{trips.length !== 1 ? "s" : ""} planned
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: "var(--green)", color: "var(--white)",
              border: "none", borderRadius: "var(--radius)",
              padding: "11px 22px", fontSize: 15, fontWeight: 600,
            }}
          >
            + New Trip
          </button>
        </div>

        {fetching ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 60 }}>Loading trips…</p>
        ) : trips.length === 0 ? (
          <div style={{
            background: "var(--white)", border: "2px dashed var(--border)",
            borderRadius: 20, padding: 80, textAlign: "center",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 8 }}>No trips yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Create your first trip to get started!</p>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                background: "var(--green)", color: "var(--white)",
                border: "none", borderRadius: "var(--radius)",
                padding: "11px 24px", fontSize: 15, fontWeight: 600,
              }}
            >
              + Create Trip
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {trips.map((trip) => {
              const days = daysUntil(trip.startDate);
              return (
                <div
                  key={trip._id}
                  onClick={() => history.push(`/trip/${trip._id}`)}
                  style={{
                    background: "var(--white)", border: "1px solid var(--border)",
                    borderRadius: 16, overflow: "hidden", cursor: "pointer",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    boxShadow: "var(--shadow)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "var(--shadow)";
                  }}
                >
                  {/* Cover */}
                  <div style={{
                    height: 100, background: "var(--green-soft)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 52,
                  }}>
                    {trip.coverEmoji}
                  </div>

                  <div style={{ padding: "18px 20px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700 }}>
                        {trip.name}
                      </h3>
                      <button
                        onClick={(e) => handleDelete(e, trip._id)}
                        style={{
                          background: "none", border: "none",
                          color: "var(--text-light)", cursor: "pointer", fontSize: 16,
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>
                      📍 {trip.destination}
                    </p>
                    <p style={{ color: "var(--text-light)", fontSize: 12, marginTop: 4 }}>
                      {new Date(trip.startDate).toLocaleDateString()} →{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>

                    {/* Tags */}
                    {trip.tags?.length > 0 && (
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
                        {trip.tags.map((tag) => (
                          <span key={tag} style={{
                            background: "var(--green-soft)", color: "var(--green)",
                            borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 600,
                          }}>{tag}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)",
                    }}>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        👥 {trip.members?.length || 1} member{trip.members?.length !== 1 ? "s" : ""}
                      </div>
                      <div style={{
                        fontSize: 12, fontWeight: 600,
                        color: days < 0 ? "var(--text-light)" : days < 7 ? "var(--red)" : "var(--green)",
                      }}>
                        {days < 0 ? "Past trip" : days === 0 ? "Today!" : `${days} days to go`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE TRIP MODAL */}
      {showCreate && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20,
        }}>
          <div style={{
            background: "var(--white)", borderRadius: 20, padding: "40px",
            width: "100%", maxWidth: 500, boxShadow: "var(--shadow-lg)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 700 }}>
                New Trip
              </h2>
              <button
                onClick={() => setShowCreate(false)}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--text-muted)" }}
              >×</button>
            </div>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Emoji picker */}
              <div>
                <label style={labelStyle}>Cover Emoji</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {EMOJIS.map((em) => (
                    <button key={em} type="button" onClick={() => setForm({ ...form, coverEmoji: em })}
                      style={{
                        fontSize: 22, background: form.coverEmoji === em ? "var(--green-soft)" : "var(--cream)",
                        border: form.coverEmoji === em ? "2px solid var(--green)" : "2px solid transparent",
                        borderRadius: 8, width: 42, height: 42, cursor: "pointer",
                      }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Trip Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Bali Crew Trip" required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Destination</label>
                <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Bali, Indonesia" required style={inputStyle} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    required style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Budget (₹)</label>
                <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  placeholder="200000" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Tags</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                  {TAGS.map((tag) => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      style={{
                        padding: "5px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                        background: form.tags.includes(tag) ? "var(--green)" : "var(--cream)",
                        color: form.tags.includes(tag) ? "var(--white)" : "var(--text-muted)",
                        border: "1px solid var(--border)",
                      }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{
                  marginTop: 8, background: loading ? "#aaa" : "var(--green)",
                  color: "var(--white)", border: "none", borderRadius: "var(--radius)",
                  padding: "13px", fontSize: 15, fontWeight: 600,
                }}>
                {loading ? "Creating…" : "Create Trip 🌍"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6,
};
const inputStyle = {
  width: "100%", background: "var(--cream)", border: "1.5px solid var(--border)",
  borderRadius: "var(--radius-sm)", padding: "10px 14px", fontSize: 15, outline: "none",
};