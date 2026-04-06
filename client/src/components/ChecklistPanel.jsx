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




import React, { useState } from "react";
import useStore from "../store/useStore";
import { addPackingItem, updatePackingItem, removePackingItem } from "../api/api";
 
export function ChecklistPanel({ tripId }) {
  const { activeTrip, addPackingItem: addToStore, updatePackingItem: updateInStore, removePackingItem: removeFromStore } = useStore();
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);
  const items = activeTrip?.packingList || [];
  const packed = items.filter((i) => i.packed).length;
 
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setLoading(true);
    try {
      const { data } = await addPackingItem(tripId, { name: newItem.trim() });
      addToStore(data);
      setNewItem("");
    } catch { alert("Failed"); }
    finally { setLoading(false); }
  };
 
  const handleToggle = async (item) => {
    await updatePackingItem(tripId, item._id, { packed: !item.packed });
    updateInStore(item._id, { packed: !item.packed });
  };
 
  const handleRemove = async (itemId) => {
    await removePackingItem(tripId, itemId);
    removeFromStore(itemId);
  };
 
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>✅ Packing List</h2>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{packed}/{items.length} packed</span>
      </div>
 
      {/* Progress bar */}
      <div style={{ height: 6, background: "var(--cream-dark)", borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${items.length ? (packed / items.length) * 100 : 0}%`, background: "var(--green)", borderRadius: 3, transition: "width 0.3s" }} />
      </div>
 
      {/* Add form */}
      <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add item (e.g. Sunscreen, Passport…)"
          style={{ ...inputStyle, flex: 1 }} />
        <button type="submit" disabled={loading} style={submitBtnStyle}>Add</button>
      </form>
 
      {items.length === 0 ? (
        <EmptyState icon="🎒" title="Packing list empty" sub="Add items you need to pack!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((item) => (
            <div key={item._id} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "12px 16px",
              display: "flex", alignItems: "center", gap: 12,
              opacity: item.packed ? 0.6 : 1,
            }}>
              <input type="checkbox" checked={item.packed}
                onChange={() => handleToggle(item)}
                style={{ width: 18, height: 18, accentColor: "var(--green)", cursor: "pointer" }} />
              <span style={{
                flex: 1, fontSize: 14, fontWeight: 500,
                textDecoration: item.packed ? "line-through" : "none",
                color: item.packed ? "var(--text-light)" : "var(--text)",
              }}>{item.name}</span>
              <button onClick={() => handleRemove(item._id)} style={deleteBtnStyle}>🗑</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 
export default ChecklistPanel;