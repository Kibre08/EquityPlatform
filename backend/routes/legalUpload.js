const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const { verifyToken } = require("../middlewares/auth"); // ✅ FIXED IMPORT

// Multer storage for legal docs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
    }
  },
});

// ✅ Route: Startup uploads legal document
router.post(
  "/upload-legal",
  verifyToken, // ✅ FIXED
  upload.single("legalDoc"),
  async (req, res) => {
    try {
      if (req.user.role !== "startup") {
        return res.status(403).json({ msg: "Only startups can upload legal documents" });
      }

      if (!req.file) {
        return res.status(400).json({ msg: "No file uploaded" });
      }

      await User.findByIdAndUpdate(req.user.id, { legalDoc: req.file.path });

      res.json({ msg: "Legal document uploaded successfully", file: req.file.path });
    } catch (err) {
      res.status(500).json({ msg: "Failed to upload legal document", error: err.message });
    }
  }
);

module.exports = router;
