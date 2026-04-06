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







import React, { useState, useEffect, useRef } from "react";
import useStore from "../store/useStore";
 
export function ChatBox({ tripId, socket }) {
  const { user, chatMessages, addChatMessage } = useStore();
  const [msg, setMsg] = useState("");
  const bottomRef = useRef(null);
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);
 
  const sendMsg = (e) => {
    e.preventDefault();
    if (!msg.trim() || !socket) return;
    socket.emit("chat:send", {
      tripId, message: msg.trim(),
      senderId: user._id, senderName: user.name,
    });
    setMsg("");
  };
 
  const getColor = (name) => {
    const colors = ["#2d6a4f", "#52b788", "#e76f51", "#457b9d", "#7b2d8b"];
    return colors[name?.charCodeAt(0) % colors.length] || "#2d6a4f";
  };
 
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
        Group chat · {useStore.getState().activeTrip?.name}
      </div>
 
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {chatMessages.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-light)", fontSize: 13, marginTop: 40 }}>
            Be the first to say hi! 👋
          </p>
        )}
        {chatMessages.map((m, i) => {
          const isMe = m.sender === user?._id || m.sender?._id === user?._id;
          return (
            <div key={m._id || i} style={{ display: "flex", gap: 8, flexDirection: isMe ? "row-reverse" : "row", alignItems: "flex-start" }}>
              {!isMe && (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: getColor(m.senderName),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--white)", fontWeight: 700, fontSize: 11,
                }}>
                  {m.senderName?.[0]?.toUpperCase()}
                </div>
              )}
              <div style={{ maxWidth: "75%" }}>
                {!isMe && <div style={{ fontSize: 11, color: "var(--text-light)", marginBottom: 3 }}>{m.senderName}</div>}
                <div style={{
                  background: isMe ? "var(--green)" : "var(--white)",
                  color: isMe ? "var(--white)" : "var(--text)",
                  border: isMe ? "none" : "1px solid var(--border)",
                  borderRadius: isMe ? "12px 4px 12px 12px" : "4px 12px 12px 12px",
                  padding: "9px 13px", fontSize: 13, lineHeight: 1.5,
                }}>
                  {m.message}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-light)", marginTop: 3, textAlign: isMe ? "right" : "left" }}>
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
 
      {/* Input */}
      <form onSubmit={sendMsg} style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
        <input
          value={msg} onChange={(e) => setMsg(e.target.value)}
          placeholder="Message the group..."
          style={{ ...inputStyle, flex: 1, fontSize: 13 }}
        />
        <button type="submit" style={{
          background: "var(--green)", color: "var(--white)", border: "none",
          borderRadius: 8, width: 36, height: 36, fontSize: 16, cursor: "pointer",
        }}>↑</button>
      </form>
    </div>
  );
}
 
export default ChatBox;