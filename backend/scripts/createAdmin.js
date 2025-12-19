// scripts/createAdmin.js
// Run: node scripts/createAdmin.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

// Load environment
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config({ path: path.join(__dirname, "..", ".env") });
}

const User = require("../models/User");

// ============ CHANGE THESE VALUES ============
const ADMIN_EMAIL = "admin@equityplatform.com";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_NAME = "Platform Admin";
// =============================================

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log("⚠️  Admin with this email already exists!");
            console.log(`   Email: ${existing.email}`);
            console.log(`   Role: ${existing.role}`);
            process.exit(0);
        }

        // Create admin
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const admin = await User.create({
            fullName: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
            isVerified: true,
        });

        console.log("✅ Admin created successfully!");
        console.log("================================");
        console.log(`   Email: ${ADMIN_EMAIL}`);
        console.log(`   Password: ${ADMIN_PASSWORD}`);
        console.log(`   Name: ${ADMIN_NAME}`);
        console.log("================================");
        console.log("You can now login with these credentials.");

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

createAdmin();
