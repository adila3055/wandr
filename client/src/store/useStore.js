import { create } from "zustand";

const useStore = create((set) => ({
  // ─── AUTH ───────────────────────────────────────────
  user: null,
  token: localStorage.getItem("wandr_token") || null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem("wandr_token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("wandr_token");
    set({ user: null, token: null, trips: [], activeTrip: null });
  },

  // ─── TRIPS ──────────────────────────────────────────
  trips: [],
  activeTrip: null,
  setTrips: (trips) => set({ trips }),
  setActiveTrip: (trip) => set({ activeTrip: trip }),
  addTrip: (trip) => set((s) => ({ trips: [trip, ...s.trips] })),
  removeTrip: (tripId) =>
    set((s) => ({ trips: s.trips.filter((t) => t._id !== tripId) })),
  setMembers: (members) =>
    set((s) => ({
      activeTrip: s.activeTrip ? { ...s.activeTrip, members } : null,
    })),

  // ─── ITINERARY ──────────────────────────────────────
  addItineraryItem: (item) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? { ...s.activeTrip, itinerary: [...s.activeTrip.itinerary, item] }
        : null,
    })),
  removeItineraryItem: (id) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? {
            ...s.activeTrip,
            itinerary: s.activeTrip.itinerary.filter((i) => i._id !== id),
          }
        : null,
    })),

  // ─── PACKING ────────────────────────────────────────
  addPackingItem: (item) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? { ...s.activeTrip, packingList: [...s.activeTrip.packingList, item] }
        : null,
    })),
  updatePackingItem: (id, data) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? {
            ...s.activeTrip,
            packingList: s.activeTrip.packingList.map((i) =>
              i._id === id ? { ...i, ...data } : i
            ),
          }
        : null,
    })),
  removePackingItem: (id) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? {
            ...s.activeTrip,
            packingList: s.activeTrip.packingList.filter((i) => i._id !== id),
          }
        : null,
    })),

  // ─── EXPENSES ───────────────────────────────────────
  addExpense: (exp) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? { ...s.activeTrip, expenses: [...s.activeTrip.expenses, exp] }
        : null,
    })),
  removeExpense: (id) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? {
            ...s.activeTrip,
            expenses: s.activeTrip.expenses.filter((e) => e._id !== id),
          }
        : null,
    })),

  // ─── VOTING ─────────────────────────────────────────
  addVoteItem: (item) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? { ...s.activeTrip, voteItems: [...s.activeTrip.voteItems, item] }
        : null,
    })),
  updateVoteItem: (id, data) =>
    set((s) => ({
      activeTrip: s.activeTrip
        ? {
            ...s.activeTrip,
            voteItems: s.activeTrip.voteItems.map((v) =>
              v._id === id ? { ...v, ...data } : v
            ),
          }
        : null,
    })),

  // ─── CHAT ───────────────────────────────────────────
  chatMessages: [],
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  setChatMessages: (msgs) => set({ chatMessages: msgs }),

  // ─── PRESENCE ───────────────────────────────────────
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // ─── UI STATE ───────────────────────────────────────
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
  activeSidePanel: "chat",
  setActiveSidePanel: (panel) => set({ activeSidePanel: panel }),
}));

export default useStore;