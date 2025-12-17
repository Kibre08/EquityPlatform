// createSuperAdmin.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const fs = require("fs");

// ✅ Load environment variables
if (fs.existsSync(".env.local")) {
dotenv.config({ path: ".env.local" });
console.log("🟢 Loaded .env.local (local MongoDB)");
} else {
dotenv.config(); // default to .env
console.log("🔵 Loaded .env (Atlas or default)");
}

// ✅ Connect to MongoDB
mongoose
.connect(process.env.MONGO_URI)
.then(async () => {
console.log("✅ Connected to MongoDB");

   const existingAdmin = await User.findOne({ email: "superadmin@example.com" });
if (existingAdmin) {
  console.log("⚠️ Super admin already exists. No new user created.");
  return process.exit();
}

const hashedPassword = await bcrypt.hash("admin123", 10);

const admin = new User({
  fullName: "Super Admin",
  email: "superadmin@example.com",
  password: hashedPassword,
  role: "admin",
  isVerified: true
});

await admin.save();
console.log("✅ Super admin created successfully.");
process.exit();

})
.catch((err) => {
console.error("❌ Error creating super admin:", err.message);
process.exit(1);
});