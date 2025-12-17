// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const { verifyToken } = require("../middleware/authMiddleware");

// send a message
router.post("/", verifyToken, async (req, res) => {
  try {
    const { to, content } = req.body;
    if (!to || !content) return res.status(400).json({ msg: "Missing fields" });

    const msg = new Message({ sender: req.user.id, receiver: to, content });
    await msg.save();
    res.status(201).json({ msg: "Message sent", message: msg });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send message", error: err.message });
  }
});

// conversation
router.get("/conversation/:userId", verifyToken, async (req, res) => {
  try {
    const other = req.params.userId;
    const mine = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: mine, receiver: other },
        { sender: other, receiver: mine },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "fullName")
      .populate("receiver", "fullName");

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get conversation", error: err.message });
  }
});

// inbox
router.get("/inbox", verifyToken, async (req, res) => {
  try {
    const uid = req.user.id;
    const messages = await Message.find({ $or: [{ sender: uid }, { receiver: uid }] })
      .sort({ createdAt: -1 })
      .populate("sender", "fullName")
      .populate("receiver", "fullName");
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch inbox", error: err.message });
  }
});

module.exports = router;
