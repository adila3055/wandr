// server/server.js — COMPLETE BACKEND (paste everything here)

require("dotenv").config();
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] },
});

app.use(cors());
app.use(express.json());

// ─── MONGODB CONNECTION (Connection first, then listen) ───────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// ─── SCHEMAS & MODELS ──────────────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const ActivitySchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  location: String,
  lat: { type: Number },
  lng: { type: Number },
  category: { type: String, default: "general" },
  notes: String,
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const PackingItemSchema = new mongoose.Schema({
  name: String,
  category: { type: String, default: "general" },
  packed: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  category: String,
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  splitAmong: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, default: Date.now },
});

const VoteItemSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: String,
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const TripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverEmoji: { type: String, default: "🌴" },
  tags: [String],
  status: { type: String, default: "planning" }, // planning, confirmed, completed
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, default: "member" }, // owner, member
    },
  ],
  budget: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  itinerary: [ActivitySchema],
  packingList: [PackingItemSchema],
  expenses: [ExpenseSchema],
  voteItems: [VoteItemSchema],
  chat: [ChatMessageSchema],
  mapCenter: {
    lat: { type: Number, default: 20.0 },
    lng: { type: Number, default: 78.0 },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Trip = mongoose.model("Trip", TripSchema);

// ─── AUTH MIDDLEWARE ────────────────────────────────────────────────

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ─── AUTH ROUTES ───────────────────────────────────────────────────

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ME
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── TRIP ROUTES ───────────────────────────────────────────────────

// GET ALL TRIPS FOR USER
app.get("/api/trips", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ "members.user": req.userId })
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE TRIP
app.post("/api/trips", authMiddleware, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, coverEmoji, tags, budget } =
      req.body;
    const trip = await Trip.create({
      name,
      destination,
      startDate,
      endDate,
      coverEmoji: coverEmoji || "🌴",
      tags: tags || [],
      budget: budget || 0,
      members: [{ user: req.userId, role: "owner" }],
    });
    const populated = await trip.populate("members.user", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET SINGLE TRIP
app.get("/api/trips/:tripId", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate("members.user", "name email")
      .populate("itinerary.addedBy", "name")
      .populate("expenses.paidBy", "name")
      .populate("chat.sender", "name");
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE TRIP
app.delete("/api/trips/:tripId", authMiddleware, async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.tripId);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── ITINERARY ─────────────────────────────────────────────────────

app.post("/api/trips/:tripId/itinerary", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    const activity = { ...req.body, addedBy: req.userId };
    trip.itinerary.push(activity);
    await trip.save();
    const updated = await Trip.findById(req.params.tripId).populate(
      "itinerary.addedBy",
      "name"
    );
    const newItem = updated.itinerary[updated.itinerary.length - 1];
    io.to(req.params.tripId).emit("itinerary:add", newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(
  "/api/trips/:tripId/itinerary/:itemId",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      trip.itinerary = trip.itinerary.filter(
        (i) => i._id.toString() !== req.params.itemId
      );
      await trip.save();
      io.to(req.params.tripId).emit("itinerary:remove", req.params.itemId);
      res.json({ message: "Removed" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── PACKING LIST ──────────────────────────────────────────────────

app.post("/api/trips/:tripId/packing", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    trip.packingList.push(req.body);
    await trip.save();
    const newItem = trip.packingList[trip.packingList.length - 1];
    io.to(req.params.tripId).emit("packing:add", newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(
  "/api/trips/:tripId/packing/:itemId",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      const item = trip.packingList.id(req.params.itemId);
      if (item) {
        item.packed = req.body.packed ?? item.packed;
        item.name = req.body.name ?? item.name;
      }
      await trip.save();
      io.to(req.params.tripId).emit("packing:update", {
        id: req.params.itemId,
        ...req.body,
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

app.delete(
  "/api/trips/:tripId/packing/:itemId",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      trip.packingList = trip.packingList.filter(
        (i) => i._id.toString() !== req.params.itemId
      );
      await trip.save();
      io.to(req.params.tripId).emit("packing:remove", req.params.itemId);
      res.json({ message: "Removed" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── EXPENSES ──────────────────────────────────────────────────────

app.post("/api/trips/:tripId/expenses", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    const expense = {
      ...req.body,
      paidBy: req.userId,
      splitAmong:
        req.body.splitAmong ||
        trip.members.map((m) => m.user),
    };
    trip.expenses.push(expense);
    await trip.save();
    const updated = await Trip.findById(req.params.tripId).populate(
      "expenses.paidBy",
      "name"
    );
    const newExp = updated.expenses[updated.expenses.length - 1];
    io.to(req.params.tripId).emit("expense:add", newExp);
    res.status(201).json(newExp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete(
  "/api/trips/:tripId/expenses/:expId",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      trip.expenses = trip.expenses.filter(
        (e) => e._id.toString() !== req.params.expId
      );
      await trip.save();
      io.to(req.params.tripId).emit("expense:remove", req.params.expId);
      res.json({ message: "Removed" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── VOTING ────────────────────────────────────────────────────────

app.post("/api/trips/:tripId/votes", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    trip.voteItems.push({ ...req.body, addedBy: req.userId, votes: [] });
    await trip.save();
    const newItem = trip.voteItems[trip.voteItems.length - 1];
    io.to(req.params.tripId).emit("vote:add", newItem);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put(
  "/api/trips/:tripId/votes/:itemId/toggle",
  authMiddleware,
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.tripId);
      const item = trip.voteItems.id(req.params.itemId);
      const uid = req.userId.toString();
      const idx = item.votes.findIndex((v) => v.toString() === uid);
      if (idx > -1) item.votes.splice(idx, 1);
      else item.votes.push(req.userId);
      await trip.save();
      io.to(req.params.tripId).emit("vote:update", {
        id: req.params.itemId,
        votes: item.votes,
      });
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── MEMBERS ───────────────────────────────────────────────────────

app.post(
  "/api/trips/:tripId/members/invite",
  authMiddleware,
  async (req, res) => {
    try {
      const { email } = req.body;
      const invitee = await User.findOne({ email });
      if (!invitee) return res.status(404).json({ error: "User not found" });

      const trip = await Trip.findById(req.params.tripId);
      const alreadyMember = trip.members.find(
        (m) => m.user.toString() === invitee._id.toString()
      );
      if (alreadyMember)
        return res.status(400).json({ error: "Already a member" });

      trip.members.push({ user: invitee._id, role: "member" });
      await trip.save();
      const updated = await Trip.findById(req.params.tripId).populate(
        "members.user",
        "name email"
      );
      io.to(req.params.tripId).emit("members:update", updated.members);
      res.json(updated.members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ─── SOCKET.IO ─────────────────────────────────────────────────────

const onlineUsers = {}; // { tripId: { socketId: { userId, name } } }

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // JOIN TRIP ROOM
  socket.on("trip:join", ({ tripId, userId, userName }) => {
    socket.join(tripId);
    if (!onlineUsers[tripId]) onlineUsers[tripId] = {};
    onlineUsers[tripId][socket.id] = { userId, name: userName };
    io.to(tripId).emit("presence:update", Object.values(onlineUsers[tripId]));
    console.log(`👥 ${userName} joined trip ${tripId}`);
  });

  // CHAT MESSAGE
  socket.on("chat:send", async ({ tripId, message, senderId, senderName }) => {
    try {
      const trip = await Trip.findById(tripId);
      trip.chat.push({ sender: senderId, senderName, message });
      await trip.save();
      const saved = trip.chat[trip.chat.length - 1];
      io.to(tripId).emit("chat:message", {
        _id: saved._id,
        sender: senderId,
        senderName,
        message,
        createdAt: saved.createdAt,
      });
    } catch (err) {
      console.error("Chat error:", err);
    }
  });

  
  socket.on("chat:typing", ({ tripId, userName }) => {
    socket.to(tripId).emit("chat:typing", { userName });
  });


  socket.on("disconnect", () => {
    for (const tripId in onlineUsers) {
      if (onlineUsers[tripId][socket.id]) {
        delete onlineUsers[tripId][socket.id];
        io.to(tripId).emit(
          "presence:update",
          Object.values(onlineUsers[tripId])
        );
      }
    }
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// ─── STARTUP MOVED TO MONGO CONNECTION BLOCK ─────────────────────

