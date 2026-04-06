import React from "react";

// ─── EMPTY STATE ─────────────────────────────
export function EmptyState({ icon = "📭", title = "No Data", sub = "" }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: "#6b6558" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 14 }}>{sub}</p>
    </div>
  );
}

// ─── MODAL ──────────────────────────────────
export function Modal({ children, onClose }) {
  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <button style={closeBtn} onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ─── FORM INPUT ─────────────────────────────
export function FormInput({ label, onChange, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input 
        {...props} 
        onChange={(e) => onChange && onChange(e.target.value)} 
        style={inputStyle} 
      />
    </div>
  );
}

// ─── STYLES ─────────────────────────────────

export const inputStyle = {
  padding: "10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  width: "100%",
  outline: "none",
};

export const labelStyle = {
  fontSize: "13px",
  marginBottom: "4px",
  display: "block",
  color: "#6b6558",
};

export const addBtnStyle = {
  padding: "10px 14px",
  background: "#2d6a4f",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
};

export const submitBtnStyle = {
  ...addBtnStyle,
  width: "100%",
};

export const deleteBtnStyle = {
  padding: "6px 10px",
  background: "#e63946",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

// ─── INTERNAL STYLES ─────────────────────────

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  minWidth: "300px",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: 10,
  right: 10,
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
};