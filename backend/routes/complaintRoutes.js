const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// submit complaint
router.post("/", verifyToken, async (req, res) => {
    try {
        const { target, message } = req.body;
        if (!message) return res.status(400).json({ msg: "Message required" });

        const complaint = await Complaint.create({
            user: req.user.id,
            target,
            message,
        });

        res.status(201).json({ msg: "Complaint submitted", complaint });
    } catch (err) {
        res.status(500).json({ msg: "Failed", error: err.message });
    }
});

// get all complaints (admin)
router.get("/", verifyToken, allowRoles("admin"), async (req, res) => {
    try {
        const complaints = await Complaint.find().populate("user", "fullName email role").sort({ createdAt: -1 });
        res.json({ complaints });
    } catch (err) {
        res.status(500).json({ msg: "Failed", error: err.message });
    }
});

module.exports = router;
