// models/IPDocument.js
const mongoose = require("mongoose");

const ipSchema = new mongoose.Schema(
  {
    startup: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: String,
    caption: String,
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("IPDocument", ipSchema);
