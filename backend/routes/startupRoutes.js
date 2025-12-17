// routes/startupRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Contribution = require("../models/Contribution");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// update startup profile (including category/companyDescription etc.)
router.put(
  "/profile",
  verifyToken,
  allowRoles("startup"),
  upload.single("legalDoc"), // optional legal doc field
  async (req, res) => {
    try {
      const updates = {};
      const allowed = ["companyName", "companyDescription", "category", "website", "address"];
      allowed.forEach((k) => {
        if (req.body[k]) updates[k] = req.body[k];
      });

      if (req.file) updates.legalDoc = req.file.filename;

      const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
      res.json({ msg: "Profile updated", user: updated });
    } catch (err) {
      res.status(500).json({ msg: "Failed to update startup", error: err.message });
    }
  }
);

// get my profile
router.get("/me", verifyToken, allowRoles("startup", "investor", "admin"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// get all startups (public or investor only?)
// For now allowing investors and admins
router.get("/", verifyToken, allowRoles("investor", "admin"), async (req, res) => {
  try {
    const startups = await User.find({ role: "startup" }).select("-password");
    res.json({ startups });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch startups", error: err.message });
  }
});

// get contributions for my campaigns
router.get("/contributions", verifyToken, allowRoles("startup"), async (req, res) => {
  try {
    const campaigns = await Campaign.find({ startup: req.user.id });
    const campaignIds = campaigns.map(c => c._id);
    const contributions = await Contribution.find({ campaign: { $in: campaignIds }, isApproved: true })
      .populate("investor", "fullName email")
      .populate("campaign", "title");
    res.json({ contributions });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// startup uploads final agreement
router.post("/upload-agreement/:id", verifyToken, allowRoles("startup"), upload.single("agreement"), async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id).populate("campaign");
    if (!contribution) return res.status(404).json({ msg: "Not found" });

    // Verify this campaign belongs to the startup
    if (String(contribution.campaign.startup) !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    contribution.finalAgreement = req.file.filename;
    contribution.status = "agreement_sent";
    await contribution.save();

    res.json({ msg: "Agreement uploaded", contribution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

module.exports = router;
