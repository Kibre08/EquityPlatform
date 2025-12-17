// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// load .env.local if exists (fallback to .env)
if (fs.existsSync(".env.local")) {
  dotenv.config({ path: ".env.local" });
  console.log("🟢 Using LOCAL .env.local");
} else {
  dotenv.config();
  console.log("🔵 Using .env");
}

const app = express();
app.use(express.json());
app.use(cors());

// ensure uploads folder exists and serve it
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const contributionRoutes = require("./routes/contributionRoutes");
const startupRoutes = require("./routes/startupRoutes");
const ipDocsRoutes = require("./routes/ipDocs");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const investorRoutes = require("./routes/investorRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

// mount
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/ipdocs", ipDocsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/investor", investorRoutes);
app.use("/api/complaints", complaintRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ msg: "Internal Server Error", error: err.message });
});

// simple health
app.get("/health", (req, res) => res.json({ ok: true }));

// connect db and start
const MONGO = process.env.MONGO_URI;
if (!MONGO) {
  console.error("❌ MONGO_URI missing in env");
  process.exit(1);
}

mongoose
  .connect(MONGO)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
