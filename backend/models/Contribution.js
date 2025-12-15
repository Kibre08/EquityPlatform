// models/Contribution.js
const mongoose = require("mongoose");

const contributionSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", required: true },
    investor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    referenceNumber: {
      type: String,
      unique: true,
      default: () => `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    },
    proofFile: { type: String }, // Payment proof
    investorIdFile: { type: String }, // Investor ID for this deal
    finalAgreement: { type: String }, // Uploaded by startup
    status: { type: String, enum: ["pending", "agreement_sent", "approved", "rejected"], default: "pending" },
    isApproved: { type: Boolean, default: false }, // Admin final approval
    isRejected: { type: Boolean, default: false },
    verifiedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contribution", contributionSchema);
