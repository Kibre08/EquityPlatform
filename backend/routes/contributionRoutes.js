// routes/contributionRoutes.js
const express = require("express");
const router = express.Router();
const Contribution = require("../models/Contribution");
const Campaign = require("../models/Campaign");
const upload = require("../middleware/upload");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

// investor contributes with proof file
// investor contributes with proof file and ID
router.post("/", verifyToken, allowRoles("investor"), (req, res, next) => {
  upload.fields([{ name: "proof", maxCount: 1 }, { name: "investorId", maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.error("Upload Middleware Error:", err);
      return res.status(400).json({ msg: "File upload failed", error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("--- Contribution Request Start ---");
    console.log("User ID:", req.user ? req.user.id : "No User");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    const { campaignId, amount } = req.body;
    if (!campaignId || !amount) {
      console.error("Missing fields: campaignId or amount");
    }

    // Safe file access
    const files = req.files || {};
    const proofFile = files["proof"] ? files["proof"][0].filename : undefined;
    const investorIdFile = files["investorId"] ? files["investorId"][0].filename : undefined;

    console.log("Processed Files - Proof:", proofFile, "ID:", investorIdFile);

    const contributionData = {
      campaign: campaignId,
      investor: req.user.id,
      amount: Number(amount),
      proofFile,
      investorIdFile,
      status: "pending"
    };
    console.log("Creating Contribution with data:", contributionData);

    const contribution = await Contribution.create(contributionData);

    console.log("Contribution Created:", contribution._id);
    res.status(201).json({ msg: "Contribution submitted", contribution });
  } catch (err) {
    console.error("CRITICAL CONTRIBUTE ERROR:", err);
    res.status(500).json({ msg: "Failed to contribute", error: err.message, stack: err.stack });
  }
});

// get contributions by investor
router.get("/my", verifyToken, async (req, res) => {
  try {
    const contributions = await Contribution.find({ investor: req.user.id }).populate("campaign");
    res.json({ contributions });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// get contributions for startup's campaigns
router.get("/startup/contributions", verifyToken, allowRoles("startup"), async (req, res) => {
  try {
    console.log("Fetching startup contributions for user:", req.user.id);
    // 1. Find all campaigns by this startup
    const campaigns = await Campaign.find({ startup: req.user.id });
    console.log(`Found ${campaigns.length} campaigns for startup ${req.user.id}`);
    const campaignIds = campaigns.map(c => c._id);

    // 2. Find contributions for these campaigns
    const contributions = await Contribution.find({ campaign: { $in: campaignIds } })
      .populate("investor", "fullName email")
      .populate("campaign", "title");

    console.log(`Found ${contributions.length} contributions`);

    res.json({ contributions });
  } catch (err) {
    console.error("Error fetching startup contributions:", err);
    res.status(500).json({ msg: "Failed to fetch contributions", error: err.message });
  }
});

// startup uploads final agreement - MOVED TO startupRoutes.js

module.exports = router;
