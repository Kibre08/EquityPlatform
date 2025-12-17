// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Contribution = require("../models/Contribution");
const IPDocument = require("../models/IPDocument");
const Campaign = require("../models/Campaign");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// list all users
router.get("/users", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// delete user
router.delete("/users/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// pending KYC
router.get("/pending-users", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const users = await User.find({ isVerified: false, kycRejected: false }).select("-password");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

router.post("/approve/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const u = await User.findByIdAndUpdate(req.params.id, { isVerified: true, kycRejected: false }, { new: true }).select("-password");
    if (!u) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User approved", user: u });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

router.post("/reject/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const u = await User.findByIdAndUpdate(req.params.id, { isVerified: false, kycRejected: true }, { new: true }).select("-password");
    if (!u) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User rejected", user: u });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// pending contributions
router.get("/pending-contributions", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const contributions = await Contribution.find({ isApproved: false, isRejected: false })
      .populate("campaign")
      .populate("investor", "fullName email selfie idDocument");
    res.json({ contributions });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// approve contribution -> increment campaign raisedAmount
router.post("/approve-contribution/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) return res.status(404).json({ msg: "Contribution not found" });
    if (contribution.isApproved) return res.status(400).json({ msg: "Already approved" });

    contribution.isApproved = true;
    contribution.verifiedAt = new Date();
    await contribution.save();

    await Campaign.findByIdAndUpdate(contribution.campaign, { $inc: { raisedAmount: contribution.amount } });

    res.json({ msg: "Contribution approved", contribution });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

router.post("/reject-contribution/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndUpdate(req.params.id, { isRejected: true }, { new: true });
    if (!contribution) return res.status(404).json({ msg: "Contribution not found" });
    res.json({ msg: "Contribution rejected", contribution });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// IP docs
router.get("/pending-ipdocs", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const docs = await IPDocument.find({ status: "pending" }).populate("startup", "fullName email");
    res.json({ docs });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

router.post("/approve-ip/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const doc = await IPDocument.findByIdAndUpdate(req.params.id, { status: "approved", reviewedBy: req.user.id, reviewedAt: new Date() }, { new: true });
    if (!doc) return res.status(404).json({ msg: "Not found" });

    // Auto-verify as Novel
    await User.findByIdAndUpdate(doc.startup, { isNovel: true });

    res.json({ msg: "IP doc approved", doc });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

router.post("/reject-ip/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const doc = await IPDocument.findByIdAndUpdate(req.params.id, { status: "rejected", reviewedBy: req.user.id, reviewedAt: new Date() }, { new: true });
    if (!doc) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "IP doc rejected", doc });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// delete campaign
router.delete("/campaigns/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const c = await Campaign.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// delete contribution
router.delete("/contributions/:id", verifyToken, allowRoles("admin"), async (req, res) => {
  try {
    const c = await Contribution.findByIdAndDelete(req.params.id);
    if (!c) return res.status(404).json({ msg: "Not found" });
    res.json({ msg: "Contribution deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

module.exports = router;
