// routes/ipRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const IPDocument = require("../models/IPDocument");
const auth = require("../middlewares/authMiddleware");

// 🔧 file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🧩 Upload new IP document (by Startup)
router.post("/upload-ip", auth, upload.single("ipFile"), async (req, res) => {
  try {
    const { startupId, title, description } = req.body;
    if (!req.file) return res.status(400).json({ msg: "IP document file required" });

    const ipDoc = new IPDocument({
      startup: startupId,
      title,
      description,
      file: req.file.filename,
      status: "pending",
    });

    await ipDoc.save();
    res.status(201).json({ msg: "IP Document uploaded successfully", ipDoc });
  } catch (err) {
    console.error("❌ Error uploading IP document:", err);
    res.status(500).json({ msg: "Failed to upload IP document" });
  }
});

// 📥 Get all IP documents uploaded by startup
router.get("/my-ip/:startupId", auth, async (req, res) => {
  try {
    const docs = await IPDocument.find({ startup: req.params.startupId });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch IP documents" });
  }
});

module.exports = router;
