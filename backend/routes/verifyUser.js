// routes/verifyUser.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken, allowRoles } = require("../middlewares/auth");

// ✅ Admin approves user KYC manually
router.put("/users/:id/verify", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    if (!updated) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User verified successfully", user: updated });
  } catch (err) {
    console.error("KYC verify error:", err);
    res.status(500).json({ msg: "Failed to verify user" });
  }
});

module.exports = router;
