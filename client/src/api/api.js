// client/src/api/api.js

import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: BASE });

// Auto-attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("wandr_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ─────────────────────────────────────────────
export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);
export const getMe = () => api.get("/api/auth/me");

// ─── TRIPS ────────────────────────────────────────────
export const getTrips = () => api.get("/api/trips");
export const createTrip = (data) => api.post("/api/trips", data);
export const getTrip = (id) => api.get(`/api/trips/${id}`);
export const deleteTrip = (id) => api.delete(`/api/trips/${id}`);

// ─── ITINERARY ────────────────────────────────────────
export const addActivity = (tripId, data) =>
  api.post(`/api/trips/${tripId}/itinerary`, data);
export const removeActivity = (tripId, itemId) =>
  api.delete(`/api/trips/${tripId}/itinerary/${itemId}`);

// ─── PACKING ──────────────────────────────────────────
export const addPackingItem = (tripId, data) =>
  api.post(`/api/trips/${tripId}/packing`, data);
export const updatePackingItem = (tripId, itemId, data) =>
  api.put(`/api/trips/${tripId}/packing/${itemId}`, data);
export const removePackingItem = (tripId, itemId) =>
  api.delete(`/api/trips/${tripId}/packing/${itemId}`);

// ─── EXPENSES ─────────────────────────────────────────
export const addExpense = (tripId, data) =>
  api.post(`/api/trips/${tripId}/expenses`, data);
export const removeExpense = (tripId, expId) =>
  api.delete(`/api/trips/${tripId}/expenses/${expId}`);

// ─── VOTING ───────────────────────────────────────────
export const addVoteItem = (tripId, data) =>
  api.post(`/api/trips/${tripId}/votes`, data);
export const toggleVote = (tripId, itemId) =>
  api.put(`/api/trips/${tripId}/votes/${itemId}/toggle`);

// ─── MEMBERS ──────────────────────────────────────────
export const inviteMember = (tripId, email) =>
  api.post(`/api/trips/${tripId}/members/invite`, { email });

export default api;