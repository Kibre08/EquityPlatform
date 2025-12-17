// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");

// register
router.post(
  "/register",
  upload.fields([{ name: "selfie", maxCount: 1 }, { name: "idDocument", maxCount: 1 }]),
  async (req, res) => {
    try {
      // console.log("Register Body:", req.body);
      // console.log("Register Files:", req.files);

      const { fullName, email, password, role, category, companyName, companyDescription } = req.body;
      if (!fullName || !email || !password || !role) return res.status(400).json({ msg: "Missing fields" });
      if (!["startup", "investor", "admin"].includes(role)) return res.status(400).json({ msg: "Invalid role" });

      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ msg: "Email already registered" });

      let selfieFile = null;
      let idFile = null;

      // Admin doesn't need KYC files
      if (role !== "admin") {
        // Check if files exist
        if (!req.files || !req.files.selfie || !req.files.selfie[0] || !req.files.idDocument || !req.files.idDocument[0]) {
          // For debugging, let's allow registration without files if it's failing here, 
          // OR return a very specific error.
          // The user said "Request failed with status code 500", which usually implies an unhandled exception.
          // If req.files is undefined, accessing req.files.selfie throws.
          // But 'upload.fields' should handle that.

          // Let's be strict but safe:
          return res.status(400).json({ msg: "Selfie and ID document are required for KYC verification." });
        }
        selfieFile = req.files.selfie[0].filename;
        idFile = req.files.idDocument[0].filename;
      }

      const hashed = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        fullName,
        email,
        password: hashed,
        role,
        category: role === "startup" ? category : undefined,
        companyName: role === "startup" ? companyName : undefined,
        companyDescription: role === "startup" ? companyDescription : undefined,
        selfie: selfieFile,
        idDocument: idFile,
        isVerified: role === "admin" ? true : false,
      });

      res.status(201).json({
        msg: "Registration successful. KYC pending if applicable.",
        user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email, role: newUser.role, isVerified: newUser.isVerified },
      });
    } catch (err) {
      console.error("Register error:", err);
      // Return the actual error message to help debugging
      res.status(500).json({ msg: "Registration failed", error: err.message });
    }
  }
);

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Missing email/password" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const u = user.toObject();
    delete u.password;
    let statusMsg = "Login successful";
    if (!u.isVerified && !u.kycRejected) statusMsg = "Login successful, KYC pending";
    if (u.kycRejected) statusMsg = "Login successful, KYC rejected";

    res.json({ msg: statusMsg, token, user: u });
  } catch (err) {
    console.error("Login err:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});

module.exports = router;
