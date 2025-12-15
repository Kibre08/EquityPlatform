const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        target: { type: String }, // Optional: name of user/campaign being reported
        message: { type: String, required: true },
        status: { type: String, enum: ["pending", "resolved"], default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
