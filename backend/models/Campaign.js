// models/Campaign.js
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String },
    goalAmount: { type: Number, default: 0 },
    raisedAmount: { type: Number, default: 0 },
    startup: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String },
    agreementFile: { type: String },
    status: { type: String, enum: ["active", "closed"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
