// routes/ipDocs.js
const express = require("express");
const router = express.Router();
const IPDocument = require("../models/IPDocument");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// startup uploads ip doc
router.post("/", verifyToken, allowRoles("startup"), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "File required" });
    const doc = await IPDocument.create({
      startup: req.user.id,
      file: req.file.filename,
      caption: req.body.caption || "",
      status: "pending",
    });
    res.status(201).json({ msg: "IP doc submitted", doc });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// startup list own ip docs
router.get("/mine", verifyToken, allowRoles("startup"), async (req, res) => {
  try {
    const docs = await IPDocument.find({ startup: req.user.id });
    res.json({ docs });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

module.exports = router;
