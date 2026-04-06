// client/src/pages/Auth.jsx

import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { login, register } from "../api/api";
import useStore from "../store/useStore";

export default function Auth() {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [mode, setMode] = useState(params.get("mode") === "register" ? "register" : "login");

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, setToken } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? login : register;
      const { data } = await fn(form);
      setToken(data.token);
      setUser(data.user);
      history.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--cream)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "var(--white)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "var(--shadow-lg)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: "var(--green)",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 12px",
          }}>
            <span style={{ fontSize: 22 }}>🌍</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 700 }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: 4, fontSize: 14 }}>
            {mode === "login" ? "Sign in to your Wandr account" : "Start planning your next trip"}
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fff0f0", border: "1px solid #fcc", borderRadius: 8,
            padding: "10px 14px", color: "var(--red)", fontSize: 14, marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {mode === "register" && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 8,
              background: loading ? "#aaa" : "var(--green)",
              color: "var(--white)",
              border: "none",
              borderRadius: "var(--radius)",
              padding: "13px",
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-muted)" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{ color: "var(--green)", fontWeight: 600, cursor: "pointer" }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  background: "var(--cream)",
  border: "1.5px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "11px 14px",
  fontSize: 15,
  outline: "none",
  color: "var(--text)",
};