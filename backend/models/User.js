// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["startup", "investor", "admin"], required: true },
    category: { type: String }, // startup category
    companyName: { type: String },
    companyDescription: { type: String },
    website: { type: String },
    address: { type: String },

    selfie: String,
    idDocument: String,
    legalDoc: String,

    isVerified: { type: Boolean, default: false },
    kycRejected: { type: Boolean, default: false },
    isNovel: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
