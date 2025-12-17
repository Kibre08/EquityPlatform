// routes/profileRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

// PATCH /api/profile/edit
router.patch("/edit", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = ["fullName", "companyName", "companyDescription", "category", "website", "address"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field]) updates[field] = req.body[field];
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update profile", error: err.message });
  }
});

module.exports = router;
