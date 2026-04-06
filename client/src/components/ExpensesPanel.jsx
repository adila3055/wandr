import React, { useState, useEffect } from "react";
import useStore from "../store/useStore";
import { addExpense, removeExpense } from "../api/api";

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






const CATEGORIES = ["🏨 Stay", "✈️ Flight", "🍜 Food", "🚗 Transport", "🎭 Activities", "🛍 Shopping", "🏥 Medical", "🌐 Other"];
 
export function ExpensesPanel({ tripId }) {
  const { activeTrip, addExpense: addToStore, removeExpense: removeFromStore } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", amount: "", category: "Other" });
  const [loading, setLoading] = useState(false);
  const expenses = activeTrip?.expenses || [];
  const total = expenses.reduce((s, e) => s + e.amount, 0);
 
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await addExpense(tripId, { ...form, amount: parseFloat(form.amount) });
      addToStore(data);
      setForm({ title: "", amount: "", category: "Other" });
      setShowAdd(false);
    } catch { alert("Failed"); }
    finally { setLoading(false); }
  };
 
  const handleRemove = async (expId) => {
    await removeExpense(tripId, expId);
    removeFromStore(expId);
  };
 
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700 }}>💰 Expenses</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
            Total: <strong style={{ color: "var(--green)" }}>₹{total.toLocaleString("en-IN")}</strong>
            {activeTrip?.budget ? ` of ₹${activeTrip.budget.toLocaleString("en-IN")}` : ""}
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} style={addBtnStyle}>+ Add Expense</button>
      </div>
 
      {/* Budget bar */}
      {activeTrip?.budget > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 8, background: "var(--cream-dark)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min((total / activeTrip.budget) * 100, 100)}%`,
              background: total > activeTrip.budget ? "var(--red)" : "var(--green)",
              borderRadius: 4, transition: "width 0.3s",
            }} />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-light)", marginTop: 4 }}>
            {Math.round((total / activeTrip.budget) * 100)}% of budget used
          </p>
        </div>
      )}
 
      {expenses.length === 0 ? (
        <EmptyState icon="💰" title="No expenses yet" sub="Track your trip spending!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {expenses.map((exp) => (
            <div key={exp._id} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ fontSize: 24 }}>{CATEGORIES.find(c => c.toLowerCase().includes(exp.category?.toLowerCase()))?.split(" ")[0] || "💸"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{exp.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  Paid by {exp.paidBy?.name || "you"} · {exp.category}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 700, color: "var(--green)" }}>
                ₹{exp.amount.toLocaleString("en-IN")}
              </div>
              <button onClick={() => handleRemove(exp._id)} style={deleteBtnStyle}>🗑</button>
            </div>
          ))}
        </div>
      )}
 
      {showAdd && (
        <Modal title="Add Expense" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FormInput label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} placeholder="Hotel booking" required />
            <FormInput label="Amount (₹)" type="number" value={form.amount} onChange={v => setForm({ ...form, amount: v })} placeholder="5000" required />
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inputStyle, width: "100%" }}>
                {CATEGORIES.map((c) => <option key={c} value={c.split(" ")[1]}>{c}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} style={submitBtnStyle}>{loading ? "Adding…" : "Add Expense"}</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
 
export default ExpensesPanel;