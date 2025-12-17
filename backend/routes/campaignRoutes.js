// routes/campaignRoutes.js
const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

// create campaign (startup)
router.post("/", verifyToken, allowRoles("startup"), upload.single("agreement"), async (req, res) => {
  try {
    const { title, shortDescription, description, goalAmount, category } = req.body;
    if (!title) return res.status(400).json({ msg: "Title required" });

    const newCampaign = new Campaign({
      title,
      shortDescription,
      description,
      goalAmount: goalAmount || 0,
      startup: req.user.id,
      category,
      agreementFile: req.file ? req.file.filename : undefined,
    });

    await newCampaign.save();
    res.status(201).json({ msg: "Campaign created", campaign: newCampaign });
  } catch (err) {
    console.error("Create campaign:", err);
    res.status(500).json({ msg: "Failed to create campaign", error: err.message });
  }
});

// list all campaigns (optionally filter by category)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const campaigns = await Campaign.find(filter).populate("startup", "fullName companyName category");
    res.json({ campaigns });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch campaigns", error: err.message });
  }
});

// get single campaign
router.get("/:id", async (req, res) => {
  try {
    const camp = await Campaign.findById(req.params.id).populate("startup", "fullName companyName");
    if (!camp) return res.status(404).json({ msg: "Not found" });
    res.json({ campaign: camp });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});

module.exports = router;
