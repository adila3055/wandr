import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";
import { addVoteItem, toggleVote } from "../api/api";
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






export function VotingPanel({ tripId }) {
  const { activeTrip, addVoteItem: addToStore, updateVoteItem, user } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);
  const voteItems = activeTrip?.voteItems || [];
 
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await addVoteItem(tripId, form);
      addToStore(data);
      setForm({ title: "", description: "", price: "" });
      setShowAdd(false);
    } catch { alert("Failed"); }
    finally { setLoading(false); }
  };
 
  const handleVote = async (itemId) => {
    const { data } = await toggleVote(tripId, itemId);
    updateVoteItem(itemId, { votes: data.votes });
  };
 
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>🗳️ Group Voting</h2>
        <button onClick={() => setShowAdd(true)} style={addBtnStyle}>+ Add Option</button>
      </div>
 
      {voteItems.length === 0 ? (
        <EmptyState icon="🗳️" title="Nothing to vote on yet" sub="Add options for the group to vote on — hotels, restaurants, activities!" />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {voteItems.map((item) => {
            const hasVoted = item.votes?.includes(user?._id);
            return (
              <div key={item._id} style={{
                background: "var(--white)", border: `2px solid ${hasVoted ? "var(--green)" : "var(--border)"}`,
                borderRadius: 14, padding: "20px", cursor: "pointer",
                transition: "border-color 0.2s",
              }}>
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{item.title}</h3>
                {item.description && <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{item.description}</p>}
                {item.price && <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)", marginBottom: 12 }}>{item.price}</p>}
                <button onClick={() => handleVote(item._id)} style={{
                  width: "100%", padding: "9px",
                  background: hasVoted ? "var(--green)" : "var(--cream)",
                  color: hasVoted ? "var(--white)" : "var(--text-muted)",
                  border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}>
                  {hasVoted ? "✅ Voted" : "👍 Vote"} ({item.votes?.length || 0})
                </button>
              </div>
            );
          })}
        </div>
      )}
 
      {showAdd && (
        <Modal title="Add Vote Option" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormInput label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Airbnb Villa with Pool" required />
            <FormInput label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Sleeps 6, ocean view..." />
            <FormInput label="Price" value={form.price} onChange={v => setForm({ ...form, price: v })} placeholder="₹8,000/night" />
            <button type="submit" disabled={loading} style={submitBtnStyle}>{loading ? "Adding…" : "Add Option"}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
 
export default VotingPanel;