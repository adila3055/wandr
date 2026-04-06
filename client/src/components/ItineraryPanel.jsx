import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";
import { addActivity, removeActivity } from "../api/api";

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










const CATEGORIES = ["🏖 Beach", "🍜 Food", "🏛 Culture", "🌿 Nature", "🎭 Entertainment", "🛍 Shopping", "🚗 Transport"];

export function ItineraryPanel({ tripId }) {
  const { activeTrip, removeItineraryItem } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", lat: "", lng: "", category: "general", notes: "" });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addActivity(tripId, { ...form, lat: form.lat ? Number(form.lat) : undefined, lng: form.lng ? Number(form.lng) : undefined });
      setForm({ title: "", date: "", time: "", location: "", lat: "", lng: "", category: "general", notes: "" });
      setShowAdd(false);
    } catch (err) {
      alert("Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    await removeActivity(tripId, itemId);
    removeItineraryItem(itemId);
  };

  const grouped = (activeTrip?.itinerary || []).reduce((acc, item) => {
    const key = item.date || "No date";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>📅 Itinerary</h2>
        <button onClick={() => setShowAdd(true)} style={addBtnStyle}>+ Add Activity</button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <EmptyState icon="📅" title="No activities yet" sub="Add your first activity to start planning!" />
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-muted)", marginBottom: 12 }}>
              {date}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((item) => (
                <div key={item._id}>
                  {item.title}
                  <button onClick={() => handleRemove(item._id)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {showAdd && (
        <Modal title="Add Activity" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormInput label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="E.g. Visit Museum" required />
            <div style={{ display: "flex", gap: 10 }}>
              <FormInput label="Date" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
              <FormInput label="Time" type="time" value={form.time} onChange={v => setForm({ ...form, time: v })} />
            </div>
            <FormInput label="Location" value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="Address or Place Name" />
            <div style={{ display: "flex", gap: 10 }}>
              <FormInput label="Latitude" type="number" value={form.lat} onChange={v => setForm({ ...form, lat: v })} placeholder="e.g. 48.8584" />
              <FormInput label="Longitude" type="number" value={form.lng} onChange={v => setForm({ ...form, lng: v })} placeholder="e.g. 2.2945" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, width: "100%" }}>
                {CATEGORIES.map((c) => <option key={c} value={c.split(" ")[1]}>{c}</option>)}
              </select>
            </div>
            <FormInput label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Extra details..." />
            <button type="submit" disabled={loading} style={submitBtnStyle}>{loading ? "Adding…" : "Add Activity"}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default ItineraryPanel;