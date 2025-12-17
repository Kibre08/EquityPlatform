// routes/investorRoutes.js
const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const Contribution = require("../models/Contribution");
const { verifyToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// view campaigns (filter)
router.get("/campaigns", verifyToken, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const campaigns = await Campaign.find(filter).populate("startup", "companyName fullName category");
    res.json({ campaigns });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

// contribute to campaign (investor)
router.post("/contribute", verifyToken, upload.single("proof"), async (req, res) => {
  try {
    if (req.user.role !== "investor") return res.status(403).json({ msg: "Only investors can contribute" });
    const { campaignId, amount } = req.body;
    if (!campaignId || !amount) return res.status(400).json({ msg: "Missing fields" });

    const contribution = await Contribution.create({
      campaign: campaignId,
      investor: req.user.id,
      amount: Number(amount),
      proofFile: req.file ? req.file.filename : undefined,
    });

    res.status(201).json({ msg: "Contribution submitted", contribution });
  } catch (err) {
    res.status(500).json({ msg: "Failed to contribute", error: err.message });
  }
});

module.exports = router;
